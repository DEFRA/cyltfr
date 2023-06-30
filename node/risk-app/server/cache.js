const CatboxRedis = require('@hapi/catbox-redis')
const config = require('./config')
const { redisCacheEnabled, redisCacheHost, redisCachePort } = config

module.exports = redisCacheEnabled
  ? {
      name: 'redis_cache',
      provider: {
        constructor: CatboxRedis.Engine,
        options: {
          host: redisCacheHost,
          port: redisCachePort
        }
      }
    }
  : undefined
