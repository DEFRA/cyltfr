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

const getRequestInfo = (request) => {
  const response = request.response
  const payload = request.payload
  const id = request.info && request.info.id
  const method = request.method.toUpperCase()
  const code = response && response.output && response.output.statusCode
  const path = `${method} ${request.path}${request.url.search || ''} ${code}`
  return { id, path, payload }
}

const log = (event, tags, request) => {
  if (tags.error) {
    const message = stringify(event.error || event.data)

    if (request) {
      const { id, path, payload } = getRequestInfo(request)
      console.error(`Server request error: ${message}`, event.tags.join(', '), id, path, payload)
    } else {
      console.error(`Server error: ${message}`, event.tags.join(', '))
    }
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
    }, (request, event, tags) => log(event, tags, request))

    // Log all request responses in development mode
    if (config.isDev) {
      server.events.on('response', (request) => {
        const { id, path, payload } = getRequestInfo(request)
        console.log(id, path, payload)
      })
    }
  }
}
