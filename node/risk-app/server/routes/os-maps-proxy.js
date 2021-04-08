const Boom = require('@hapi/boom')
const config = require('../config')
const errors = require('../models/errors.json')
const util = require('../util')
const { osMapsUrl, osMapsKey } = config

module.exports = {
  method: 'GET',
  path: '/os-maps-proxy',
  handler: async (request, h) => {
    try {
      const url = `${osMapsUrl}${request.url.search}&key=${osMapsKey}`
      const payload = await util.get(url, {}, true)
      return h.response(payload).type('application/octet-stream')
    } catch (err) {
      return Boom.badRequest(errors.osMapsProxy.message, err)
    }
  },
  options: {
    description: 'Get OS maps proxy'
  }
}
