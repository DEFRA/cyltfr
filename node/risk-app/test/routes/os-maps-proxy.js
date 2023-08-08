const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const utils = require('../../server/util')
const { mock } = require('../mock')
// const { payloadMatchTest } = require('../utils')

lab.experiment('/os-maps-proxy test', () => {
  let server

  lab.before(async () => {
    server = await createServer()
    await server.initialize()
  })

  lab.after(async () => {
    await server.stop()
  })

  lab.test('/os-maps-proxy standard call', async () => {
    const options = {
      method: 'GET',
      url: '/os-maps-proxy?layer=Road_27700&style=default&tilematrixset=EPSG%3A27700&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A27700%3A8&TileCol=636&TileRow=1374',
      headers: {

      }
    }
    const proxyResponse = () => {
      return 'Response'
    }

    const fetchstub = mock.replace(utils, 'get', proxyResponse)

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    fetchstub.revert()
  })

  lab.test('/os-maps-proxy error call', async () => {
    const options = {
      method: 'GET',
      url: '/os-maps-proxy?layer=Road_27700&style=default&tilematrixset=EPSG%3A27700&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A27700%3A8&TileCol=636&TileRow=1374',
      headers: {

      }
    }
    const oldNotify = server.methods.notify
    let notifyCalled = false
    const newNotify = () => { notifyCalled = true }
    server.methods.notify = newNotify
    const proxyResponse = () => {
      const fakeResponse = { FakeResponse: true }
      throw new Error('Error during call', fakeResponse)
    }
    const fetchstub = mock.replace(utils, 'get', proxyResponse)

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    Code.expect(notifyCalled).to.equal(true)
    server.methods.notify = oldNotify
    fetchstub.revert()
  })

  lab.test('/os-maps-proxy error call no notify', async () => {
    const options = {
      method: 'GET',
      url: '/os-maps-proxy?layer=Road_27700&style=default&tilematrixset=EPSG%3A27700&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A27700%3A8&TileCol=636&TileRow=1374',
      headers: {

      }
    }
    const oldNotify = server.methods.notify
    server.methods.notify = null
    const proxyResponse = () => {
      const fakeResponse = { FakeResponse: true }
      throw new Error('Error during call', fakeResponse)
    }
    const fetchstub = mock.replace(utils, 'get', proxyResponse)

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    server.methods.notify = oldNotify
    fetchstub.revert()
  })
})
