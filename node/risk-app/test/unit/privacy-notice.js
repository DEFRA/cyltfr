const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const { payloadMatchTest } = require('../utils')

lab.experiment('Privacy notice test', () => {
  let server

  lab.before(async () => {
    server = await createServer()
    await server.initialize()
  })

  lab.after(async () => {
    await server.stop()
  })

  lab.test('Assert Privacy page', async () => {
    const options = {
      method: 'GET',
      url: '/privacy-notice',
      headers: {

      }
    }
    const response = await server.inject(options)
    const { payload } = response
    Code.expect(response.statusCode).to.equal(200)
    await payloadMatchTest(payload, /<h1 class="govuk-heading-l">Privacy notice<\/h1>/g)
    await payloadMatchTest(payload, /<h1 class="govuk-heading-m">Who we are<\/h1>/g)
    await payloadMatchTest(payload, /<h2 class="govuk-heading-m">What personal data we collect<\/h2>/g)
    await payloadMatchTest(payload, /<h3 class="govuk-heading-s">Cookies<\/h3>/g)
    await payloadMatchTest(payload, /<h3 class="govuk-heading-s">Friendly Captcha<\/h3>/g)
  })
})
