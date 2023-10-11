const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const sinon = require("sinon")
const addressService = require('../../server/services/address')

lab.experiment('postcode page', () => {
  let server, addressStub

  lab.before(async () => {
    server = await createServer()
    await server.initialize()    
  })

  lab.afterEach(() => {
    sinon.restore()
  })

  lab.after(async () => {
    console.log('Stopping server')
    await server.stop()
  })

  lab.test.only('should return a view with error message when findAddressResponse is falsy', async () => {
    const addressServiceMock = sinon.stub(addressService, 'find')
    addressServiceMock.returns(false)
    const options = {
      method: 'POST',
      url: '/postcode',
      payload: {
        postcode: 'wf10 4qk'
      }
    }
    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.result).to.include('This postcode does not appear to exist')
  })
})
