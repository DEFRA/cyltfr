
const config = require('./config')
const { redisCacheEnabled, redisCacheHost, redisCachePort } = config

module.exports = redisCacheEnabled
  ? {
    name: 'redis_cache',
    provider: {
      constructor: require('@hapi/catbox-redis'),
      options: {
        host: redisCacheHost,
        port: redisCachePort
      }
    }
  }
  : undefined
