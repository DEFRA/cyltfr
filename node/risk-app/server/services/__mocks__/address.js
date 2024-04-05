const addressService = jest.createMockFromModule('../address')
const findById = require('./find-by-id')
const findByPostcode = require('./find')

/**
 * Override the real functions with mock implementations
 */
addressService.findById.mockImplementation((id) => {
  const result = findById[id]
  return result
    ? Promise.resolve(result)
    : Promise.reject(new Error(`findById mock not found for id [${id}]`))
})

addressService.find.mockImplementation((postcode) => {
  const result = findByPostcode[postcode.toUpperCase().replace(' ', '')]
  return result
    ? Promise.resolve(result)
    : Promise.reject(new Error(`findByPostcode mock not found for postcode [${postcode}]`))
})

module.exports = addressService
