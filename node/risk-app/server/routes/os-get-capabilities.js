const Boom = require('@hapi/boom')
const util = require('../util')
const config = require('../config')
const errors = require('../models/errors.json')

module.exports = {
  method: 'GET',
  path: '/os-get-capabilities',
  handler: async (request, h) => {
    try {
      const payload = await util.get(config.osGetCapabilitiesUrl, {}, true)
      return h.response(payload).type('text/xml')
    } catch (err) {
      return Boom.badRequest(errors.osGetCapabilities.message, err)
    }
  },
  options: {
    description: 'Get map capabilities'
  }
}
