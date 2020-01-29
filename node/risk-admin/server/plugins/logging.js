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
    console.error(`Server error: ${message}`, event.tags.join(', '))
  } else {
    const message = stringify(event.data)
    console.log(`Server log: ${message}`, event.tags.join(', '))
  }
}

module.exports = {
  name: 'logging',
  register: (server, options) => {
    // Write `server.log()` calls to the console
    server.events.on({
      name: 'log',
      channels: ['app']
    }, log)

    // Write `request.log()` calls to the console
    server.events.on({
      name: 'request',
      channels: ['error', 'app']
    }, (request, event, tags) => log(event, tags))

    // Log all request responses in development mode
    if (config.isDev) {
      server.events.on('response', (request) => {
        if (request.response && !['file', 'stream'].includes(request.response.variety)) {
          console.log(request.info.id)
          console.log(`${request.method.toUpperCase()} ${request.path}${request.url.search || ''} ${request.response.statusCode}`)
          if (request.payload) {
            console.log(request.payload)
          }
        }
      })
    }
  }
}
