const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const config = require('../config')
const CommentView = require('../models/comment-view')
const CommentEdit = require('../models/comment-edit')

module.exports = [{
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

    return h.view('comment-view', new CommentView(comment, geometry, request.auth))
  },
  options: {
    validate: {
      params: joi.object().keys({
        id: joi.string().required()
      })
    }
  }
}, {
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

    return h.view('comment-edit', new CommentEdit(comment, geometry, request.auth))
  },
  options: {
    validate: {
      params: joi.object().keys({
        id: joi.string().required()
      })
    }
  }
}, {
  method: 'PUT',
  path: '/comment/edit/{id}',
  handler: async (request, h) => {
    const { payload, params, auth } = request
    const { id } = params
    const provider = request.provider
    const comments = await provider.load()
    const comment = comments.find(c => c.id === id)
    const key = `${comment.keyname}`

    // Only approvers or comment authors can update
    const allowUpdate = auth.credentials.isApprover ||
      comment.createdBy === auth.credentials.profile.email

    if (!allowUpdate) {
      return boom.badRequest('You cannot update this comment')
    }

    // Update the comment
    Object.assign(comment, {
      description: payload.name,
      updatedAt: new Date(),
      updatedBy: auth.credentials.profile.email
    })

    // Upload file to s3
    await provider.uploadObject(key, JSON.stringify(payload))

    await provider.save(comments)

    return {
      ok: true
    }
  },
  options: {
    validate: {
      params: joi.object().keys({
        id: joi.string().required()
      })
    },
    app: {
      useErrorPages: false
    }
  }
}, {
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
}, {
  method: 'POST',
  path: '/comment/edit/{id}/undo-approve',
  handler: async (request, h) => {
    const { params } = request
    const { id } = params
    const provider = request.provider
    const comments = await provider.load()
    const comment = comments.find(c => c.id === id)

    // Approve
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
}, {
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
}]
