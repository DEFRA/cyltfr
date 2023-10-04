const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const addressService = require('../../server/services/address')

lab.experiment('Address service', () => {
  lab.test('capitaliseAddress function capitalises the first of each letter other than postcode which remains in capitals', async () => {
    const address = '28, NORTHFIELD CLOSE, NEWPORT, NP18 3EZ'
    Code.expect(addressService.capitaliseAddress(address)).to.equal('28, Northfield, Newport, NP18 3EZ')
  })
})
