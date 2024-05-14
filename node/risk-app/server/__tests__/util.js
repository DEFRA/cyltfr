const STATUS_CODES = require('http2').constants
let wreck
let util
const MOCK_URL = 'http://localhost/'

beforeAll(async () => {
  jest.resetModules()
  jest.mock('@hapi/wreck')
  wreck = require('@hapi/wreck')
  wreck.defaults.mockImplementation(() => wreck)
  util = require('../util')
})

afterAll(async () => {
  jest.unmock('@hapi/wreck')
  jest.resetModules()
})

describe('util.js tests', () => {
  test('Normal get returns the payload', async () => {
    wreck.get.mockImplementationOnce(() => {
      return Promise.resolve({
        res: { statusCode: STATUS_CODES.HTTP_STATUS_OK },
        payload: 'Payload'
      })
    })

    const response = await util.get(MOCK_URL)

    expect(response).toEqual('Payload')
  })

  test('get with anything other than 200 throws an error', async () => {
    const errorResponse = {
      res: { statusCode: STATUS_CODES.HTTP_STATUS_BAD_REQUEST },
      payload: 'Payload'
    }
    wreck.get.mockImplementationOnce(() => {
      return Promise.resolve(errorResponse)
    })
    expect.assertions(1)
    try {
      await util.get(MOCK_URL)
    } catch (error) {
      expect(error.message).toEqual('Requested resource returned a non 200 status code')
    }
  })

  test('Normal getJson returns the payload', async () => {
    wreck.get.mockImplementationOnce(() => {
      return Promise.resolve({
        res: { statusCode: STATUS_CODES.HTTP_STATUS_OK },
        payload: 'Payload'
      })
    })

    const response = await util.getJson(MOCK_URL)

    expect(response).toEqual('Payload')
  })

  test('getJson with anything other than 200 throws an error', async () => {
    const errorResponse = {
      res: { statusCode: STATUS_CODES.HTTP_STATUS_BAD_REQUEST },
      payload: 'Payload'
    }
    wreck.get.mockImplementationOnce(() => {
      return Promise.resolve(errorResponse)
    })
    expect.assertions(1)
    try {
      await util.getJson(MOCK_URL)
    } catch (error) {
      expect(error.message).toEqual('Requested resource returned a non 200 status code')
    }
  })

  test('Normal post returns the payload', async () => {
    wreck.post.mockImplementationOnce(() => {
      return Promise.resolve({
        res: { statusCode: STATUS_CODES.HTTP_STATUS_OK },
        payload: 'Payload'
      })
    })

    const response = await util.post(MOCK_URL)

    expect(response).toEqual('Payload')
  })

  test('post with anything other than 200 throws an error', async () => {
    const errorResponse = {
      res: { statusCode: STATUS_CODES.HTTP_STATUS_BAD_REQUEST },
      payload: 'Payload'
    }
    wreck.post.mockImplementationOnce(() => {
      return Promise.resolve(errorResponse)
    })
    expect.assertions(1)
    try {
      await util.post(MOCK_URL)
    } catch (error) {
      expect(error.message).toEqual('Requested resource returned a non 200 status code')
    }
  })

  test('Normal postJson returns the payload', async () => {
    wreck.post.mockImplementationOnce(() => {
      return Promise.resolve({
        res: { statusCode: STATUS_CODES.HTTP_STATUS_OK },
        payload: 'Payload'
      })
    })

    const response = await util.postJson(MOCK_URL)

    expect(response).toEqual('Payload')
  })

  test('postJson with anything other than 200 throws an error', async () => {
    const errorResponse = {
      res: { statusCode: STATUS_CODES.HTTP_STATUS_BAD_REQUEST },
      payload: 'Payload'
    }
    wreck.post.mockImplementationOnce(() => {
      return Promise.resolve(errorResponse)
    })
    expect.assertions(1)
    try {
      await util.postJson(MOCK_URL)
    } catch (error) {
      expect(error.message).toEqual('Requested resource returned a non 200 status code')
    }
  })

  test('cleanseLocation does not disrupt a clean url', async () => {
    const originalUrl = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890&-'
    const response = await util.cleanseLocation(originalUrl)

    expect(response).toEqual(originalUrl)
  })

  test('cleanseLocation cleans the url', async () => {
    const originalUrl = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890&-'
    const response = await util.cleanseLocation(originalUrl + '<>')

    expect(response).toEqual(originalUrl)
  })

  test('cleanseLocation called with no input still works', async () => {
    const response = await util.cleanseLocation()

    expect(response).toBeUndefined()
  })
})
