const addressService = require('../address')

describe('/Map page test', () => {
  it('Assert Map page', async () => {
    const address = '28, NORTHFIELD CLOSE, NEWPORT, NP18 3EZ'
    expect(addressService.capitaliseAddress(address)).toEqual('28, Northfield Close, Newport, NP18 3EZ')
  })
})
