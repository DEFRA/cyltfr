const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()

class YarMock {
  constructor () {
    this._store = { }
  }

  get (key) {
    return this._store[key]
  }

  set (key, value) {
    this._store[key] = value
  }
}


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
    const yar = new YarMock()
    yar.set('addresses', '')
    yar.set('address', {
      uprn: '100100679479',
      postcode: 'NP18 3EZ',
      address: '3, NORTHFIELD CLOSE, CAERLEON, NEWPORT, NP18 3EZ',
      x: 333008,
      y: 191705
    })
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
