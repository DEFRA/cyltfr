const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const proxyquire = require('proxyquire').noPreserveCache()
const { createMockYar } = require('../mock')
const getConfigOptions = ({
  friendlyCaptchaEnabled = true,
  friendlyCaptchaSiteKey = '',
  friendlyCaptchaSecretKey = '',
  friendlyCaptchaUrl = '',
  friendlyCaptchaBypass = '',
  sessionTimeout = 10
}) => ({
  friendlyCaptchaEnabled,
  friendlyCaptchaSiteKey,
  friendlyCaptchaSecretKey,
  friendlyCaptchaUrl,
  friendlyCaptchaBypass,
  sessionTimeout
})

lab.experiment('CaptchaCheck', () => {
  lab.before(async () => {
    console.log('Creating server')
  })

  lab.after(async () => {
    console.log('Stopping server')
  })

  lab.test('passes with captcha turned off', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', {
      '../config': getConfigOptions({
        friendlyCaptchaEnabled: false
      })
    })

    const results = await captchacheck.captchaCheck('', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(true)
  })

  lab.test('fails with captcha turned on', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    const results = await captchacheck.captchaCheck('', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(false)
  })

  lab.test('passed on captcha bypass', async () => {
    const yar = createMockYar()
    yar.set('captchabypass', true)
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    const results = await captchacheck.captchaCheck('', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(true)
  })

  lab.test('passes with token set', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', Date.now())
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('thisisatoken', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(true)
  })

  lab.test('fails with token set with invalid expiry', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', '')
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('thisisatoken', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(false)
  })

  lab.test('fails with token set but different postcode', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', 'Ab23op')
    yar.set('tokenSet', Date.now())
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('thisisatoken', 'PO45LE', yar, null)

    Code.expect(results.tokenValid).to.equal(false)
  })

  lab.test('should not fail even if token postcode formatted different to postcode', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', 'sp09rA')
    yar.set('tokenSet', Date.now())
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('thisisatoken', 'SP09RA', yar, null)

    Code.expect(results.tokenValid).to.equal(true)
  })

  lab.test('fails with expired token', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })
    const SessionTimeoutInMs = 10 * 60 * 1000

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - SessionTimeoutInMs)
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('thisisatoken', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(false)
  })

  lab.test('passes with blank token and matching postcode', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', Date.now())
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(true)
  })

  lab.test('fails with blank token and matching postcode, but expired', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(false)
  })

  lab.test('fails with blank token and matching postcode, but expired', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(false)
  })

  lab.test('fails with unfinished token', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('.UNFINISHED', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(false)
  })

  lab.test('fails with unstarted token', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('.UNSTARTED', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(false)
  })

  lab.test('fails with expired token', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('.EXPIRED', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(false)
  })

  lab.test('fails with undefined token', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('undefined', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(false)
  })

  lab.test('fails with fetching token', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('.FETCHING', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(false)
  })

  lab.test('fails with error token', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('.ERROR', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(false)
  })

  lab.test('fails with blank token and mis-matching postcode', async () => {
    const yar = createMockYar()
    const captchacheck = proxyquire('../../server/services/captchacheck', { '../config': getConfigOptions({}) })

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', Date.now())
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('', '1111112', yar, null)

    Code.expect(results.tokenValid).to.equal(false)
  })

  lab.test('makes a call for a new token', async () => {
    const configoptions = getConfigOptions({})
    const yar = createMockYar()
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
    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(true)
    Code.expect(called).to.equal(true)
  })

  lab.test('makes a call for a new token when new token passed (same postcode)', async () => {
    const configoptions = getConfigOptions({})
    const yar = createMockYar()
    let called = false
    const utilStub = {
      post: function (uri, options, flag) {
        called = true
        return Promise.resolve({ success: true })
      }
    }
    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', Date.now())
    yar.set('tokenValid', true)
    const captchacheck = proxyquire('../../server/services/captchacheck', {
      '../config': configoptions,
      '../util': utilStub
    })
    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, null)

    Code.expect(results.tokenValid).to.equal(true)
    Code.expect(called).to.equal(true)
  })

  lab.test('makes a call for a new token when new token passed (different postcode)', async () => {
    const configoptions = getConfigOptions({})
    const yar = createMockYar()
    let called = false
    const utilStub = {
      post: function (uri, options, flag) {
        called = true
        return Promise.resolve({ success: true })
      }
    }
    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', Date.now())
    yar.set('tokenValid', true)
    const captchacheck = proxyquire('../../server/services/captchacheck', {
      '../config': configoptions,
      '../util': utilStub
    })
    const results = await captchacheck.captchaCheck('newtoken', '11111112', yar, null)

    Code.expect(results.tokenValid).to.equal(true)
    Code.expect(called).to.equal(true)
  })

  lab.test('makes a call for a new token and handle rejection with notify', async () => {
    const configoptions = getConfigOptions({})
    const yar = createMockYar()
    let called = false
    const postResult = { success: false, errors: ['an error'] }
    const utilStub = {
      post: function (uri, options, flag) {
        called = true
        return Promise.resolve(postResult)
      }
    }
    const captchacheck = proxyquire('../../server/services/captchacheck', {
      '../config': configoptions,
      '../util': utilStub
    })
    let notifyResult
    const server = { methods: { notify: (error) => { notifyResult = error } } }

    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, server)

    Code.expect(results.tokenValid).to.equal(false)
    Code.expect(called).to.equal(true)
    Code.expect(notifyResult).to.equal('FriendlyCaptcha server check returned error: \'an error\'')
  })

  lab.test('makes a call for a new token and handle rejection without notify', async () => {
    const configoptions = getConfigOptions({})
    const yar = createMockYar()
    let called = false
    const postResult = { success: false, errors: ['an error'] }
    const utilStub = {
      post: function (uri, options, flag) {
        called = true
        return Promise.resolve(postResult)
      }
    }
    const captchacheck = proxyquire('../../server/services/captchacheck', {
      '../config': configoptions,
      '../util': utilStub
    })
    const server = { methods: { } }

    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, server)

    Code.expect(results.tokenValid).to.equal(false)
    Code.expect(called).to.equal(true)
  })

  lab.test('makes a call for a new token and handles error as success', async () => {
    const configoptions = getConfigOptions({})
    const yar = createMockYar()
    let called = false
    const utilStub = {
      post: function (uri, options, flag) {
        called = true
        throw new Error('an error')
      }
    }
    let notifyResult
    const server = { methods: { notify: (error) => { notifyResult = error } } }
    const captchacheck = proxyquire('../../server/services/captchacheck', {
      '../config': configoptions,
      '../util': utilStub
    })

    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, server)

    Code.expect(results.tokenValid).to.equal(true)
    Code.expect(called).to.equal(true)
    Code.expect(notifyResult).to.be.an.error()
  })

  lab.test('makes a call for a new token and handles error without notify', async () => {
    const configoptions = getConfigOptions({})
    const yar = createMockYar()
    let called = false
    const utilStub = {
      post: function (uri, options, flag) {
        called = true
        throw new Error('an error')
      }
    }
    const server = { methods: { } }
    const captchacheck = proxyquire('../../server/services/captchacheck', {
      '../config': configoptions,
      '../util': utilStub
    })

    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, server)

    Code.expect(results.tokenValid).to.equal(true)
    Code.expect(called).to.equal(true)
  })
})
