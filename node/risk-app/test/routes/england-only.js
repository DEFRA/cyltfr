const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const { createMockYar } = require('../mock')

lab.experiment('england-only router', () => {
  let server

  lab.before(async () => {
    server = await createServer()
    await server.initialize()
  })

  lab.after(async () => {
    await server.stop()
  })

  lab.test('should get the /england-only page if not an address in England', async () => {
    const mockYar = createMockYar()
    console.log('mockYar: ', mockYar)
    mockYar.set('addresses', '')
    mockYar.set('address', {
      uprn: '100100679479',
      postcode: 'NP18 3EZ',
      address: '3, NORTHFIELD CLOSE, CAERLEON, NEWPORT, NP18 3EZ',
      x: 333008,
      y: 191705
    })
    console.log('mockYar: ', mockYar)
    const options = {
      method: 'GET',
      url: '/england-only'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('should redirect to /postcode page iF no address in payload', async () => {
    const options = {
      method: 'GET',
      url: '/england-only'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
  })
})
