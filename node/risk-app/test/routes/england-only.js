const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const floodService = require('../../server/services/flood')
const addressService = require('../../server/services/address')
const { createAddressStub, createWarningStub, mockOptions, mockSearchOptions } = require('../mock')

lab.experiment('england-only router', () => {
  let server, cookie, addressStub, warningStub

  lab.before(async () => {
    server = await createServer()
    await server.initialize()
    const initial = mockOptions()

    const homepageresponse = await server.inject(initial)
    Code.expect(homepageresponse.statusCode).to.equal(200)
    cookie = homepageresponse.headers['set-cookie'][0].split(';')[0]
  })

  lab.after(async () => {
    await server.stop()
  })

  lab.beforeEach(() => {
    addressStub = createAddressStub(addressService, [
      {
        uprn: '100100679479',
        postcode: 'NP18 3EZ',
        address: '3, NORTHFIELD CLOSE, CAERLEON, NEWPORT, NP18 3EZ',
        x: 333008,
        y: 191705
      }
    ])
    warningStub = createWarningStub(floodService)
  })

  lab.afterEach(() => {
    warningStub.revert()
    addressStub.revert()
  })

  lab.test('requesting the england-only page without searching should redirect', async () => {
    const options = {
      method: 'GET',
      url: '/england-only',
      headers: {
        cookie
      }
    }
    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
    Code.expect(response.headers.location).to.equal('/postcode')
  })

  lab.test('should get the /england-only page if not an address in England', async () => {
    const { getOptions } = mockSearchOptions('NP18 3EZ', cookie)
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    const postOptions = {
      method: 'POST',
      url: `/search?postcode=${encodeURIComponent('NP18 3EZ')}`,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        cookie
      },
      payload: 'address=0'
    }
    const postResponse = await server.inject(postOptions)
    Code.expect(postResponse.statusCode).to.equal(302)
  })

  lab.test('requesting the england-only page after a search should display', async () => {
    const options = {
      method: 'GET',
      url: '/england-only',
      headers: {
        cookie
      }
    }
    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('requesting the england-only page with an NI postcode should display', async () => {
    const initial = mockOptions()

    // reset the cookie so we haven't done any searches
    const homepageresponse = await server.inject(initial)
    Code.expect(homepageresponse.statusCode).to.equal(200)
    cookie = homepageresponse.headers['set-cookie'][0].split(';')[0]

    const options = {
      method: 'GET',
      url: '/england-only?postcode=BT8%204AA',
      headers: {
        cookie
      }
    }
    const response = await server.inject(options, cookie)
    Code.expect(response.statusCode).to.equal(200)
  })
})
