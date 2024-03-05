const createMockYar = () => {
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

  const yar = new YarMock()

  return yar
}
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

let config, util

describe('/captchacheck test', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.mock('../../config')
    config = require('../../config')
    jest.mock('../../util')
    util = require('../../util')
  })

  test('passes with captcha turned off', async () => {
    const yar = createMockYar()

    config.setConfigOptions(getConfigOptions({
      friendlyCaptchaEnabled: false
    }))

    const captchacheck = require('../captchacheck')

    const results = await captchacheck.captchaCheck('', '1111111', yar, null)
    expect(results.tokenValid).toBeTruthy()
  })

  test('fails with captcha turned on', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')
    const results = await captchacheck.captchaCheck('', '1111111', yar, null)

    expect(results.tokenValid).toBeFalsy()
  })

  test('passed on captcha bypass', async () => {
    const yar = createMockYar()
    yar.set('captchabypass', true)
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')
    const results = await captchacheck.captchaCheck('', '1111111', yar, null)

    expect(results.tokenValid).toBeTruthy()
  })

  test('passes with token set', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', Date.now())
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('thisisatoken', '1111111', yar, null)

    expect(results.tokenValid).toBeTruthy()
  })

  test('fails with token set with invalid expiry', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', '')
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('thisisatoken', '1111111', yar, null)

    expect(results.tokenValid).toBeFalsy()
  })

  test('fails with token set but different postcode', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', 'Ab23op')
    yar.set('tokenSet', Date.now())
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('thisisatoken', 'PO45LE', yar, null)

    expect(results.tokenValid).toBeFalsy()
  })

  test('should not fail even if token postcode formatted different to postcode', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', 'sp09rA')
    yar.set('tokenSet', Date.now())
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('thisisatoken', 'SP09RA', yar, null)

    expect(results.tokenValid).toBeTruthy()
  })

  test('fails with expired token', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')
    const SessionTimeoutInMs = 10 * 60 * 1000

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - SessionTimeoutInMs)
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('thisisatoken', '1111111', yar, null)

    expect(results.tokenValid).toBeFalsy()
  })

  test('passes with blank token and matching postcode', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', Date.now())
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('', '1111111', yar, null)

    expect(results.tokenValid).toBeTruthy()
  })

  test('fails with blank token and matching postcode, but expired', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('', '1111111', yar, null)

    expect(results.tokenValid).toBeFalsy()
  })

  test('fails with blank token and matching postcode, but expired', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('', '1111111', yar, null)

    expect(results.tokenValid).toBeFalsy()
  })

  test('fails with unfinished token', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('.UNFINISHED', '1111111', yar, null)

    expect(results.tokenValid).toBeFalsy()
  })

  test('fails with unstarted token', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('.UNSTARTED', '1111111', yar, null)

    expect(results.tokenValid).toBeFalsy()
  })

  test('fails with expired token', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('.EXPIRED', '1111111', yar, null)

    expect(results.tokenValid).toBeFalsy()
  })

  test('fails with undefined token', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('undefined', '1111111', yar, null)

    expect(results.tokenValid).toBeFalsy()
  })

  test('fails with fetching token', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('.FETCHING', '1111111', yar, null)

    expect(results.tokenValid).toBeFalsy()
  })

  test('fails with error token', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', (Date.now() - 1) - (10 * 60 * 1000))
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('.ERROR', '1111111', yar, null)

    expect(results.tokenValid).toBeFalsy()
  })

  test('fails with blank token and mis-matching postcode', async () => {
    const yar = createMockYar()
    config.setConfigOptions(getConfigOptions({}))

    const captchacheck = require('../captchacheck')

    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', Date.now())
    yar.set('tokenValid', true)

    const results = await captchacheck.captchaCheck('', '1111112', yar, null)

    expect(results.tokenValid).toBeFalsy()
  })

  test('makes a call for a new token', async () => {
    config.setConfigOptions(getConfigOptions({}))
    const yar = createMockYar()
    util.post.mockImplementation(() => {
      return Promise.resolve({ success: true })
    })

    const captchacheck = require('../captchacheck')

    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, null)

    expect(results.tokenValid).toBeTruthy()
    expect(util.post.mock.calls).toHaveLength(1)
  })

  test('makes a call for a new token when new token passed (same postcode)', async () => {
    config.setConfigOptions(getConfigOptions({}))
    const yar = createMockYar()
    util.post.mockImplementation(() => {
      return Promise.resolve({ success: true })
    })

    const captchacheck = require('../captchacheck')
    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', Date.now())
    yar.set('tokenValid', true)
    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, null)

    expect(results.tokenValid).toBeTruthy()
    expect(util.post.mock.calls).toHaveLength(1)
  })

  test('makes a call for a new token when new token passed (different postcode)', async () => {
    config.setConfigOptions(getConfigOptions({}))
    const yar = createMockYar()
    util.post.mockImplementation(() => {
      return Promise.resolve({ success: true })
    })

    const captchacheck = require('../captchacheck')
    yar.set('token', 'thisisatoken')
    yar.set('tokenPostcode', '1111111')
    yar.set('tokenSet', Date.now())
    yar.set('tokenValid', true)
    const results = await captchacheck.captchaCheck('newtoken', '11111112', yar, null)

    expect(results.tokenValid).toBeTruthy()
    expect(util.post.mock.calls).toHaveLength(1)
  })

  test('makes a call for a new token and handle rejection with notify', async () => {
    config.setConfigOptions(getConfigOptions({}))
    const yar = createMockYar()
    const mockpostResult = { success: false, errors: ['an error'] }
    util.post.mockImplementation(() => {
      return Promise.resolve(mockpostResult)
    })
    const captchacheck = require('../captchacheck')
    let notifyResult
    const server = { methods: { notify: (error) => { notifyResult = error } } }

    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, server)

    expect(results.tokenValid).toBeFalsy()
    expect(util.post.mock.calls).toHaveLength(1)
    expect(notifyResult).toEqual('FriendlyCaptcha server check returned error: \'an error\'')
  })

  test('makes a call for a new token and handle rejection without notify', async () => {
    config.setConfigOptions(getConfigOptions({}))
    const yar = createMockYar()
    const mockpostResult = { success: false, errors: ['an error'] }
    util.post.mockImplementation(() => {
      return Promise.resolve(mockpostResult)
    })
    const captchacheck = require('../captchacheck')
    const server = { methods: { } }

    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, server)

    expect(results.tokenValid).toBeFalsy()
    expect(util.post.mock.calls).toHaveLength(1)
  })

  test('makes a call for a new token and handles error as success', async () => {
    config.setConfigOptions(getConfigOptions({}))
    const yar = createMockYar()
    util.post.mockImplementation(() => {
      throw new Error('an error')
    })
    const captchacheck = require('../captchacheck')
    let notifyResult
    const server = { methods: { notify: (error) => { notifyResult = error } } }

    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, server)

    expect(results.tokenValid).toBeTruthy()
    expect(util.post.mock.calls).toHaveLength(1)
    expect(notifyResult).toBeInstanceOf(Error)
  })

  test('makes a call for a new token and handles error without notify', async () => {
    config.setConfigOptions(getConfigOptions({}))
    const yar = createMockYar()
    util.post.mockImplementation(() => {
      throw new Error('an error')
    })
    const server = { methods: { } }
    const captchacheck = require('../captchacheck')

    const results = await captchacheck.captchaCheck('newtoken', '1111111', yar, server)

    expect(results.tokenValid).toBeTruthy()
    expect(util.post.mock.calls).toHaveLength(1)
  })
})
