const config = require('../config')
const util = require('../util')
const floodWarningsUrl = config.floodWarningsUrl

async function findWarnings (location) {
  const url = floodWarningsUrl + '/api/warnings?location=' + location

  return util.getJson(url)
}

module.exports = {
  findWarnings
}
