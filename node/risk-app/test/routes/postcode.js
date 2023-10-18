const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const sinon = require('sinon')

lab.experiment('postcode page', () => {
  let server

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

  lab.test('should return a view with error message when redirected to with an error', async () => {
    const options = {
      method: 'GET',
      url: '/postcode?error=true'
    }
    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.result).to.include('This postcode does not appear to exist')
  })

  lab.test('should redirect to search page when postcode submitted', async () => {
    const options = {
      method: 'POST',
      url: '/postcode',
      payload: {
        postcode: 'WF10 4QK'
      }
    }
    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
    Code.expect(response.headers.location).to.equal('/search?postcode=WF10%204QK#')
  })
})
