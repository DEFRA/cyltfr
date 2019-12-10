const joi = require('@hapi/joi')
const Model = require('../models/comment-create')
const { shortId } = require('../helpers')

module.exports = [{
  method: 'GET',
  path: '/comment/create',
  handler: async (request, h) => {
    return h.view('comment-create', new Model())
  }
}, {
  method: 'POST',
  path: '/comment/create',
  handler: async (request, h) => {
    const provider = request.provider
    const payload = request.payload
    const id = shortId()
    const keyname = `${id}.json`
    const now = new Date()

    // Update manifest
    await provider.addComment({
      description: payload.name,
      featureCount: payload.features.length,
      createdAt: now,
      createdBy: request.auth.credentials.profile.email,
      updatedAt: now,
      updatedBy: request.auth.credentials.profile.email,
      keyname: keyname,
      id: id
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
      // payload: joi.object().required(),
      payload: joi.object().keys({
        name: joi.string().required(),
        features: joi.array().required()
        // items(joi.object().keys({
        //   info: joi.string().required(),
        //   start: joi.date().required(), // .min('now')
        //   end: joi.date().min(joi.ref('start')).required()
        // }))
      }).unknown(),
      failAction: async (request, h, err) => {
        const data = request.payload
        return h.view('comment-create', new Model(data, err)).takeover()
      }
    },
    app: {
      useErrorPages: false
    }
  }
}]
