const joi = require('joi')
const boom = require('@hapi/boom')
const config = require('../config')
const CommentView = require('../models/comment-view')
const CommentEdit = require('../models/comment-edit')
const capabilities = require('../models/capabilities')

module.exports = [
  {
    method: 'GET',
    path: '/comment/view/{id}',
    handler: async (request, h) => {
      const { params } = request
      const { id } = params
      const provider = request.provider
      const comments = await provider.load()
      const comment = comments.find(c => c.id === id)
      const key = `${config.holdingCommentsPrefix}/${comment.keyname}`
      const geometryFile = await provider.getFile(key)
      const geometry = JSON.parse(geometryFile.Body)      

      return h.view('comment-view', new CommentView(comment, geometry, request.auth, capabilities))
    },
    options: {
      validate: {
        params: joi.object().keys({
          id: joi.string().required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/comment/edit/{id}',
    handler: async (request, h) => {
      const { params } = request
      const { id } = params
      const provider = request.provider
      const comments = await provider.load()
      const comment = comments.find(c => c.id === id)
      const key = `${config.holdingCommentsPrefix}/${comment.keyname}`
      const geometryFile = await provider.getFile(key)
      const geometry = JSON.parse(geometryFile.Body)
      const features = geometry.features
      const type = comment.type
      let selectedRadio = []

      features.forEach(function (feature) {
        if (type === 'holding') {
          selectedRadio.push(feature.properties.riskOverride)
        } else {
          selectedRadio.push(feature.properties.riskReportType)
        }
      })

      const commentData = {
        comment: comment,
        geometry: geometry,
        capabilities: capabilities,
        features: features,
        id: id,
        type: type,
        selectedRadio: selectedRadio
      }

      const authData = {
        isApprover: request.auth.credentials.isApprover,
        profile: request.auth.credentials.profile
      }    

      const commentEdit = new CommentEdit(commentData, authData)

      return h.view(
        'comment-edit', commentEdit)
    },
    options: {
      validate: {
        params: joi.object().keys({
          id: joi.string().required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/comment/edit/{id}',
    handler: async (request, h) => {
      const { payload, params, auth } = request
      const { id } = params
      const provider = request.provider
      const comments = await provider.load()
      const comment = comments.find(c => c.id === id)
      const key = `${config.holdingCommentsPrefix}/${comment.keyname}`
      const geometryFile = await provider.getFile(key)
      const geometry = JSON.parse(geometryFile.Body)
      const features = geometry.features
      const formattedPayload = geometry

      // Only approvers or comment authors can update
      const allowUpdate = auth.credentials.isApprover ||
        comment.createdBy === auth.credentials.profile.email

      if (!allowUpdate) {
        return boom.badRequest('You cannot update this comment')
      }

      // Update the comment
      Object.assign(comment, {
        description: payload.name,
        boundary: payload.boundary,
        updatedAt: new Date(),
        approvedAt: null,
        approvedBy: null,
        updatedBy: auth.credentials.profile.email
      })

      if (payload.name !== geometry.name) {
        formattedPayload.name = payload.name
      }
      if (payload.boundary !== geometry.boundary) {
        formattedPayload.name = payload.boundary
      }

      features.forEach(function (feature, index) {
        if (payload[`features_${index}_properties_info`] !== features[index].properties.info ) {
          formattedPayload.features[index].properties.info = payload[`features_${index}_properties_info`]
        }
        if (payload[`features_${index}_properties_start`] !== features[index].properties.start ) {
          formattedPayload.features[index].properties.start = payload[`features_${index}_properties_start`]
        }
        if (payload[`features_${index}_properties_end`] !== features[index].properties.end ) {
          formattedPayload.features[index].properties.end = payload[`features_${index}_properties_end`]
        }
        if (payload[`override_${index}-risk`] !== features[index].properties.riskOverride ) {
          formattedPayload.features[index].properties.riskOverride = payload[`override_${index}-risk`]
        }
        if (payload[`features_${index}_properties_report_type`] !== features[index].properties.riskReportType ) {
          formattedPayload.features[index].properties.riskReportType = payload[`features_${index}_properties_report_type`]
        }
      })

      // Upload file to s3
      await provider.uploadObject(`${comment.keyname}`, JSON.stringify(formattedPayload))

      await provider.save(comments)

      return h.redirect('/')
    },
    options: {
      validate: {
        params: joi.object().keys({
          id: joi.string().required()
        }),
        failAction: async (request, h, err) => {
          console.log(err)
          const data = request.payload
          const type = request.params.type
          return h.view('/comment/create')
        }
      },
      app: {
        useErrorPages: false
      }
    }
  },
  {
    method: 'POST',
    path: '/comment/edit/{id}/approve',
    handler: async (request, h) => {
      const { params, auth } = request
      const { id } = params
      const provider = request.provider
      const comments = await provider.load()
      const comment = comments.find(c => c.id === id)

      // Approve
      comment.approvedAt = new Date()
      comment.approvedBy = auth.credentials.profile.email

      await provider.save(comments)

      return h.redirect('/')
    },
    options: {
      auth: {
        mode: 'required',
        scope: '+approve:comments'
      },
      validate: {
        params: joi.object().keys({
          id: joi.string().required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/comment/edit/{id}/undo-approve',
    handler: async (request, h) => {
      const { params } = request
      const { id } = params
      const provider = request.provider
      const comments = await provider.load()
      const comment = comments.find(c => c.id === id)

      // Undo approve
      comment.approvedAt = null
      comment.approvedBy = null

      await provider.save(comments)

      return h.redirect('/')
    },
    options: {
      auth: {
        mode: 'required',
        scope: '+approve:comments'
      },
      validate: {
        params: joi.object().keys({
          id: joi.string().required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/comment/edit/{id}/delete',
    handler: async (request, h) => {
      const { params, auth } = request
      const { id } = params
      const provider = request.provider
      const comments = await provider.load()
      const comment = comments.find(c => c.id === id)

      // Only approvers or comment authors can delete
      const allowDelete = auth.credentials.isApprover ||
      comment.createdBy === auth.credentials.profile.email

      if (!allowDelete) {
        return boom.badRequest('You cannot delete this comment')
      }

      // Delete the comment
      const idx = comments.indexOf(comment)
      comments.splice(idx, 1)

      await provider.deleteFile(comment.keyname)
      await provider.save(comments)

      return h.redirect('/')
    },
    options: {
      validate: {
        params: joi.object().keys({
          id: joi.string().required()
        })
      }
    }
  }
]
