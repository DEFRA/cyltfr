const config = require('../config')

module.exports = {
  plugin: {
    name: 'activity-session',
    register: (server, options) => {
      server.state('activity', {
        ttl: config.sessionTimeout * 60 * 1000,
        isSecure: false,
        encoding: 'base64json',
        clearInvalid: false,
        isSameSite: 'Lax'
      })
      server.ext('onPreResponse', (request, h) => {
        if (request.response.variety === 'view') {
          const { state } = request
          const activity = (state || {}).activity
          const response = request.response
          const context = response.source.context || {}

          Object.assign(context, { activity })

          response.source.context = context
        }

        return h.continue
      })
    }
  }
}
