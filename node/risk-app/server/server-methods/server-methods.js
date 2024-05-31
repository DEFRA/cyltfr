const { find } = require('../server/services/address')
const { getByCoordinates } = require('../server/services/risk')

const serverMethods = [
  {
    name: 'find',
    method: find,
    options: {
      cache: {
        cache: 'server_cache',
        expiresIn: 100 * 1000,
        generateTimeout: 20000
      }
    }
  },
  {
    name: 'riskService',
    method: getByCoordinates,
    options: {
      cache: {
        cache: 'server_cache',
        expiresIn: 100 * 1000,
        generateTimeout: 20000
      }
    }
  }
]

module.exports = serverMethods
