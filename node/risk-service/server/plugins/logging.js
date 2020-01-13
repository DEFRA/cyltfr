const config = require('../config')

const stringify = (data) => {
  try {
    if (!data) {
      return 'Unknown error'
    } else if (data.stack) {
      return JSON.stringify(data, Object.getOwnPropertyNames(data))
    } else if (typeof data === 'object') {
      return JSON.stringify(data)
    } else {
      return data.toString ? data.toString() : ''
    }
  } catch (err) {
    console.error('Failed to stringify', err)
    return data.toString ? data.toString() : ''
  }
}

const log = (event, tags) => {
  if (tags.error) {
    const message = stringify(event.error || event.data)
    console.error(`Server error: ${message || 'unknown'}`, event.tags.join(', '))
  } else {
    const message = stringify(event.data)
    console.log(`Server log: ${message || 'unknown'}`, event.tags.join(', '))
  }
}

module.exports = {
  name: 'logging',
  register: (server, options) => {
    server.events.on('log', log)
    server.events.on('request', (request, event, tags) => log(event, tags))

    if (config.isDev) {
      server.events.on('response', (request) => {
        // `Response sent for request: ${request.info.id}`, request.info.remoteAddress + ': ' +
        console.log(request.method.toUpperCase() + ' ' + request.path + ' ' + request.response.statusCode)
      })
    }
  }
}
