const AWS = require('@aws-sdk/client-s3')
const { mockClient } = require('aws-sdk-client-mock')
const { sdkStreamMixin } = require('@smithy/util-stream')
const { createReadStream } = require('fs')
const path = require('path')
const client = require('../index')
const mockShapeFile = require('./data/4653d83il5p.json')

const s3Mock = mockClient(AWS.S3Client)

const resolveStream = function (options) {
  const filename = options.Key.replace('holding-comments/', '')
  const stream = createReadStream(path.join('./server/providers/s3/__tests__/data', filename))
  const sdkStream = sdkStreamMixin(stream)
  return { Body: sdkStream }
}

beforeAll(async () => {
  // mock the Amazon stuff
  s3Mock.on(AWS.GetObjectCommand).callsFake(resolveStream)
})

afterAll(async () => {
})

describe('s3 client test', () => {
  test('getFile should get the manifest with 6 holding comments', async () => {
    const newClient = new client()
    const data = await newClient.getFile()
    expect(data.length).toBe(6)
  })
})
