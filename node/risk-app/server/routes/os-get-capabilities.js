const Boom = require('boom')
const util = require('../util')
const config = require('../../config')
const errors = require('../models/errors.json')

module.exports = {
  method: 'GET',
  path: '/os-get-capabilities',
  handler: async (request, h) => {
    try {
      const payload = await util.get(config.ordnanceSurvey.urlGetCapabilities, true)
      return h.response(payload).type('text/xml')
    } catch (err) {
      return Boom.badRequest(errors.oSGetCapabilities.message, err)
    }
  }
}
