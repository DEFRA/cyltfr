const joi = require('@hapi/joi')
const Model = require('../models/comment-create')
const { shortId } = require('../helpers')

module.exports = [
  {
    method: 'GET',
    path: '/comment/create/{type}',
    handler: async (request, h) => {
      const type = request.params.type
      return h.view('comment-create', new Model(type))
    },
    options: {
      validate: {
        params: joi.object().keys({
          type: joi.string().valid('holding', 'llfa').required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/comment/create/{type}',
    handler: async (request, h) => {
      const provider = request.provider
      const payload = request.payload
      const type = request.params.type
      const id = shortId()
      const keyname = `${id}.json`
      const now = new Date()

      // Update manifest
      await provider.addComment({
        type,
        description: payload.name,
        featureCount: payload.features.length,
        createdAt: now,
        createdBy: request.auth.credentials.profile.email,
        updatedAt: now,
        updatedBy: request.auth.credentials.profile.email,
        keyname,
        id
      })

      // Upload file to s3
      await provider.uploadObject(keyname, JSON.stringify(payload))

      // Return ok
      return {
        ok: true,
        id
      }
    },
    options: {
      validate: {
        params: joi.object().keys({
          type: joi.string().valid('holding', 'llfa').required()
        }),
        payload: joi.object().keys({
          name: joi.string().required(),
          features: joi.array().required()
        }).unknown(),
        failAction: async (request, h, err) => {
          const data = request.payload
          const type = request.params.type
          return h.view('comment-create', new Model(type, data, err)).takeover()
        }
      },
      app: {
        useErrorPages: false
      }
    }
  }]
