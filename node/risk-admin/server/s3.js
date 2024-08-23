const { S3Client } = require('@aws-sdk/client-s3')
const config = require('./config')

const s3Client = new S3Client({
  region: config.awsBucketRegion
})

module.exports = s3Client
