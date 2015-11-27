/*
 * TODO: Replace with real risk implementation
 */
function getByCoordinates (x, y, radius, callback) {
  process.nextTick(function () {
    callback(null, {})
  })
}

module.exports = {
  getByCoordinates: getByCoordinates
}
