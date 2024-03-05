const addressService = require('../address')

describe('Address service', () => {
  test('capitaliseAddress function capitalises the first of each letter other than postcode which remains in capitals', async () => {
    const address = '28, NORTHFIELD CLOSE, NEWPORT, NP18 3EZ'
    expect(addressService.capitaliseAddress(address)).toEqual('28, Northfield Close, Newport, NP18 3EZ')
  })
})
