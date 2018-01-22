const config = require('../../config')
const floodWarningsUrl = config.floodWarningsUrl
// Note wreck won't play with a proxy so need to use request
const request = require('request')

function findWarnings (location) {
  const url = floodWarningsUrl + '/api/warnings?location=' + location

  return new Promise((resolve, reject) => {
    request(url, function (err, response, body) {
      if (err || response.statusCode !== 200) {
        return reject(err || body || new Error('Unknown error'))
      }

      resolve(JSON.parse(body))
    })
  })
}

module.exports = {
  findWarnings: findWarnings
}
