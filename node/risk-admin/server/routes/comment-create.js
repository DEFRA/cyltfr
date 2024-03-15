const joi = require('joi')
const Model = require('../models/comment-create')
const { shortId } = require('../helpers')
const capabilities = require('../models/capabilities')

module.exports = [
  {
    method: 'GET',
    path: '/comment/create/{type}',
    handler: async (request, h) => {
      const type = request.params.type
      return h.view('comment-create', new Model(type, capabilities))
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
      console.log('provider: ', provider)
      console.log('type: ', type)
      console.log('id: ', id)
      console.log('keyname: ', keyname)
      console.log('now: ', now)

      try {
        // Update manifest
        await provider.addComment({
          type,
          description: payload.name,
          boundary: payload.boundary,
          featureCount: payload.features.length,
          createdAt: now,
          createdBy: request.auth.credentials.profile.email,
          updatedAt: now,
          updatedBy: request.auth.credentials.profile.email,
          keyname,
          id
        })
        console.log('here now')

        // Upload file to s3
        await provider.uploadObject(keyname, JSON.stringify(payload))
      } catch {
        console.log('failed to upload')
      }

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
          console.log(request)
          console.log(err)
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
