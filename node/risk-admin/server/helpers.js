const spawn = require('child_process').spawn
const moment = require('moment-timezone')
const { dateFormat } = require('./constants')

function shortId () {
  return Math.random().toString(36).substring(2)
}

function formatDate (str, format = dateFormat) {
  return moment(str).format(format)
}

function run (cmd, args, opts) {
  return new Promise((resolve, reject) => {
    console.log('Spawning', cmd, args, opts)
    const cp = spawn(cmd, args, opts)
    console.log('Spawned', cmd, args, opts)
    let stdout = ''
    let stderr = ''

    cp.stdout.on('data', (data) => {
      stdout += data
    })

    cp.stderr.on('data', (data) => {
      stderr += data
    })

    cp.on('error', reject)

    cp.on('close', (code) => {
      if (code === 0) {
        resolve(stdout)
      } else {
        reject(new Error(`${stderr}, ${code}`))
      }
    })
  })
}

module.exports = {
  run,
  shortId,
  formatDate
}
