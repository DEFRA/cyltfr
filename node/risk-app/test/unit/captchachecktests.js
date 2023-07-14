const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const proxyquire = require('proxyquire').noPreserveCache()
class YarMock {
  constructor () {
    this.store = { }
  }

  get (key) {
    return this.store[key]
  }

  set (key, value) {
    this.store[key] = value
  }
}
const server = { methods: {} }

lab.experiment('Unit', () => {
  lab.before(async () => {
    console.log('Creating server')
  })

  lab.after(async () => {
    console.log('Stopping server')
  })

  lab.test('Captcha check passes with captcha turned off', async () => {
    const configoptions = {
      friendlyCaptchaEnabled: false,
      friendlyCaptchaSiteKey: '',
      friendlyCaptchaSecretKey: '',
      friendlyCaptchaUrl: '',
      friendlyCaptchaBypass: '',
      sessionTimeout: 10
    }
    const yar = new YarMock()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': configoptions })

    const results = await captchacheck.captchaCheck('', '1111111', yar, server)

    Code.expect((await results).tokenvalid).to.equal(true)
  })

  lab.test('Captcha check fails with captcha turned on', async () => {
    const configoptions = {
      friendlyCaptchaEnabled: true,
      friendlyCaptchaSiteKey: '',
      friendlyCaptchaSecretKey: '',
      friendlyCaptchaUrl: '',
      friendlyCaptchaBypass: '',
      sessionTimeout: 10
    }
    const yar = new YarMock()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': configoptions })

    const results = await captchacheck.captchaCheck('', '1111111', yar, server)

    Code.expect((await results).tokenvalid).to.equal(false)
  })

  lab.test('Captcha check with captcha bypass on passes', async () => {
    const configoptions = {
      friendlyCaptchaEnabled: true,
      friendlyCaptchaSiteKey: '',
      friendlyCaptchaSecretKey: '',
      friendlyCaptchaUrl: 'fakefake',
      friendlyCaptchaBypass: 'blahblah',
      sessionTimeout: 10
    }
    const yar = new YarMock()
    yar.set('captchabypass', true)
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': configoptions })

    const results = await captchacheck.captchaCheck('', '1111111', yar, server)

    Code.expect((await results).tokenvalid).to.equal(true)
  })

  lab.test('Captcha check passes with token set', async () => {
    const configoptions = {
      friendlyCaptchaEnabled: true,
      friendlyCaptchaSiteKey: '',
      friendlyCaptchaSecretKey: '',
      friendlyCaptchaUrl: '',
      friendlyCaptchaBypass: '',
      sessionTimeout: 10
    }
    const yar = new YarMock()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': configoptions })

    yar.set('token', 'thisisatoken')
    yar.set('tokenpostcode', '1111111')
    yar.set('tokenset', Date.now())
    yar.set('tokenvalid', true)

    const results = await captchacheck.captchaCheck('thisisatoken', '1111111', yar, server)

    Code.expect((await results).tokenvalid).to.equal(true)
  })

  lab.test('Captcha check fails with token set but different postcode', async () => {
    const configoptions = {
      friendlyCaptchaEnabled: true,
      friendlyCaptchaSiteKey: '',
      friendlyCaptchaSecretKey: '',
      friendlyCaptchaUrl: '',
      friendlyCaptchaBypass: '',
      sessionTimeout: 10
    }
    const yar = new YarMock()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': configoptions })

    yar.set('token', 'thisisatoken')
    yar.set('tokenpostcode', '1111111')
    yar.set('tokenset', Date.now())
    yar.set('tokenvalid', true)

    const results = await captchacheck.captchaCheck('thisisatoken', '1111112', yar, server)

    Code.expect((await results).tokenvalid).to.equal(false)
  })

  lab.test('Captcha check fails with expired token', async () => {
    const configoptions = {
      friendlyCaptchaEnabled: true,
      friendlyCaptchaSiteKey: '',
      friendlyCaptchaSecretKey: '',
      friendlyCaptchaUrl: '',
      friendlyCaptchaBypass: '',
      sessionTimeout: 10
    }
    const yar = new YarMock()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': configoptions })

    yar.set('token', 'thisisatoken')
    yar.set('tokenpostcode', '1111111')
    yar.set('tokenset', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenvalid', true)

    const results = await captchacheck.captchaCheck('thisisatoken', '1111111', yar, server)

    Code.expect((await results).tokenvalid).to.equal(false)
  })

  lab.test('Captcha check passes with blank token and matching postcode', async () => {
    const configoptions = {
      friendlyCaptchaEnabled: true,
      friendlyCaptchaSiteKey: '',
      friendlyCaptchaSecretKey: '',
      friendlyCaptchaUrl: '',
      friendlyCaptchaBypass: '',
      sessionTimeout: 10
    }
    const yar = new YarMock()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': configoptions })

    yar.set('token', 'thisisatoken')
    yar.set('tokenpostcode', '1111111')
    yar.set('tokenset', Date.now())
    yar.set('tokenvalid', true)

    const results = await captchacheck.captchaCheck('', '1111111', yar, server)

    Code.expect((await results).tokenvalid).to.equal(true)
  })

  lab.test('Captcha check fails with blank token and matching postcode, but expired', async () => {
    const configoptions = {
      friendlyCaptchaEnabled: true,
      friendlyCaptchaSiteKey: '',
      friendlyCaptchaSecretKey: '',
      friendlyCaptchaUrl: '',
      friendlyCaptchaBypass: '',
      sessionTimeout: 10
    }
    const yar = new YarMock()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': configoptions })

    yar.set('token', 'thisisatoken')
    yar.set('tokenpostcode', '1111111')
    yar.set('tokenset', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenvalid', true)

    const results = await captchacheck.captchaCheck('', '1111111', yar, server)

    Code.expect((await results).tokenvalid).to.equal(false)
  })

  lab.test('Captcha check fails with unfinished token', async () => {
    const configoptions = {
      friendlyCaptchaEnabled: true,
      friendlyCaptchaSiteKey: '',
      friendlyCaptchaSecretKey: '',
      friendlyCaptchaUrl: '',
      friendlyCaptchaBypass: '',
      sessionTimeout: 10
    }
    const yar = new YarMock()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': configoptions })

    yar.set('token', 'thisisatoken')
    yar.set('tokenpostcode', '1111111')
    yar.set('tokenset', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenvalid', true)

    const results = await captchacheck.captchaCheck('.UNFINISHED', '1111111', yar, server)

    Code.expect((await results).tokenvalid).to.equal(false)
  })

  lab.test('Captcha check fails with blank token and mis-matching postcode', async () => {
    const configoptions = {
      friendlyCaptchaEnabled: true,
      friendlyCaptchaSiteKey: '',
      friendlyCaptchaSecretKey: '',
      friendlyCaptchaUrl: '',
      friendlyCaptchaBypass: '',
      sessionTimeout: 10
    }
    const yar = new YarMock()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': configoptions })

    yar.set('token', 'thisisatoken')
    yar.set('tokenpostcode', '1111111')
    yar.set('tokenset', Date.now())
    yar.set('tokenvalid', true)

    const results = await captchacheck.captchaCheck('', '1111112', yar, server)

    Code.expect((await results).tokenvalid).to.equal(false)
  })

  lab.test('Captcha check makes a call for a new token', async () => {
    const configoptions = {
      friendlyCaptchaEnabled: true,
      friendlyCaptchaSiteKey: '',
      friendlyCaptchaSecretKey: '',
      friendlyCaptchaUrl: '',
      friendlyCaptchaBypass: '',
      sessionTimeout: 10
    }
    const yar = new YarMock()
    let called = false
    const utilStub = {
      post: function (uri, options, flag) {
        called = true
        return Promise.resolve({ success: true })
      }
    }
    const captchacheck = proxyquire('../../server/services/captchacheck', {
      '../config': configoptions,
      '../util': utilStub
    })

    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, server)

    Code.expect((await results).tokenvalid).to.equal(true)
    Code.expect(called).to.equal(true)
  })

  lab.test('Captcha check makes a call for a new token and handle rejection', async () => {
    const configoptions = {
      friendlyCaptchaEnabled: true,
      friendlyCaptchaSiteKey: '',
      friendlyCaptchaSecretKey: '',
      friendlyCaptchaUrl: '',
      friendlyCaptchaBypass: '',
      sessionTimeout: 10
    }
    const yar = new YarMock()
    let called = false
    const utilStub = {
      post: function (uri, options, flag) {
        called = true
        return Promise.resolve({ success: false, errors: ['an error'] })
      }
    }
    const captchacheck = proxyquire('../../server/services/captchacheck', {
      '../config': configoptions,
      '../util': utilStub
    })

    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, server)

    Code.expect((await results).tokenvalid).to.equal(false)
    Code.expect(called).to.equal(true)
  })

  lab.test('Captcha check makes a call for a new token and handles error as success', async () => {
    const configoptions = {
      friendlyCaptchaEnabled: true,
      friendlyCaptchaSiteKey: '',
      friendlyCaptchaSecretKey: '',
      friendlyCaptchaUrl: '',
      friendlyCaptchaBypass: '',
      sessionTimeout: 10
    }
    const yar = new YarMock()
    let called = false
    const utilStub = {
      post: function (uri, options, flag) {
        called = true
        throw new Error('an error')
      }
    }
    const captchacheck = proxyquire('../../server/services/captchacheck', {
      '../config': configoptions,
      '../util': utilStub
    })

    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, server)

    Code.expect((await results).tokenvalid).to.equal(true)
    Code.expect(called).to.equal(true)
  })
})
