const value = jest.requireActual('../config')

value.redisCacheEnabled = false

value.setConfigOptions = function (newValues) {
  Object.keys(newValues).forEach(function (key) {
    value[key] = newValues[key]
  })
}

module.exports = value
