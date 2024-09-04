const { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const fs = require('fs')
const s3 = require('../../s3')
const config = require('../../config')
const manifestKey = `${config.holdingCommentsPrefix}/${config.manifestFilename}`

class S3Provider {
  async load() {
    const result = await this.getFile(manifestKey)

    return JSON.parse(await result.Body.transformToString())
  }

  async save(comments) {
    await s3.send(new PutObjectCommand({
      Bucket: config.awsBucketName,
      Key: manifestKey,
      Body: JSON.stringify(comments, null, 2),
    }))
  }

  async addComment(item) {
    const comments = await this.load()
    comments.push(item)
    return this.save(comments)
  }

  async getFile(key) {
    const result = await s3.send(new GetObjectCommand({
      Bucket: config.awsBucketName,
      Key: key,
    }))
    return result
  }

  async uploadFile(keyname, filename) {
    const data = await fs.promises.readFile(filename)

    await s3.send(new PutObjectCommand({
      Bucket: config.awsBucketName,
      Key: `${config.holdingCommentsPrefix}/${keyname}`,
      Body: data,
    }))
  }

  async uploadObject(keyname, data) {
    await s3.send(new PutObjectCommand({
      Bucket: config.awsBucketName,
      Key: `${config.holdingCommentsPrefix}/${keyname}`,
      Body: data,
    }))
  }

  async deleteFile(keyname) {
    await s3.send(new DeleteObjectCommand({
      Bucket: config.awsBucketName,
      Key: `${config.holdingCommentsPrefix}/${keyname}`,
    }))
  }

  async ensureManifestFile() {
    try {
      await s3.send(new GetObjectCommand({
        Bucket: config.awsBucketName,
        Key: manifestKey,
      }))
    } catch (err) {
      if (err.name === 'NoSuchKey') {
        await s3.send(new PutObjectCommand({
          Bucket: config.awsBucketName,
          Key: manifestKey,
          Body: '[]',
        }))
      } else {
        throw err
      }
    }
  }
}

module.exports = S3Provider
