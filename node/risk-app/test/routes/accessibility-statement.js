const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const { payloadMatchTest } = require('../utils')

lab.experiment('Accessibility statement test', () => {
  let server

  lab.before(async () => {
    server = await createServer()
    await server.initialize()
  })

  lab.after(async () => {
    await server.stop()
  })

  lab.test('Assert Accessibility statement page', async () => {
    const options = {
      method: 'GET',
      url: '/accessibility-statement',
      headers: {

      }
    }
    const response = await server.inject(options)
    const { payload } = response
    Code.expect(response.statusCode).to.equal(200)
    await payloadMatchTest(payload, /<p class="govuk-body">\n\s\s\s\s\s\s\s\sThe website has the following content which is out of scope of the accessibility regulations:\n\s\s\s\s\s\s<\/p>\n\s\s\s\s\s\s<ul class="govuk-list govuk-list--bullet">\n\s\s\s\s\s\s\s\s<li>maps<\/li>\n\s\s\s\s\s\s\s\s<li>third party content which is out of our control, for example a corporate logo on the map the website uses\n\s\s\s\s\s\s\s\s<\/li>\n\s\s\s\s\s\s\s\s<li>PDF content that was published before 23 September 2018<\/li>\n\s\s\s\s\s\s<\/ul>/g)
  })
})
