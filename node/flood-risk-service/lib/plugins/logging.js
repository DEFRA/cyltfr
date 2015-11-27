var plugin = require('good')
var goodFile = require('good-file')
var goodConsole = require('good-console')
var config = require('config').get('plugins.logging')
var logPath = config.path
var logRotation = config.rotate.interval
var options = {
  opsInterval: 1000,
  reporters: [{
    reporter: goodConsole,
    events: {
      log: 'info',
      request: '*',
      response: '*',
      error: '*'
    }
  }, {
    reporter: goodFile,
    events: {
      log: 'info',
      request: '*',
      response: '*'
    },
    config: {
      path: logPath,
      prefix: 'server',
      rotate: logRotation
    }
  }, {
    reporter: goodFile,
    events: {
      log: 'error',
      error: '*'
    },
    config: {
      path: logPath,
      prefix: 'error',
      rotate: logRotation
    }
  }, {
    reporter: goodFile,
    events: {
      ops: '*'
    },
    config: {
      path: logPath,
      prefix: 'ops',
      rotate: logRotation
    }
  }]
}

module.exports = function (server) {
  function registerCallback (err) {
    if (err) {
      server.log('error', err)
      throw err
    }
  }

  server.register({
    register: plugin,
    options: options
  }, registerCallback)
}
