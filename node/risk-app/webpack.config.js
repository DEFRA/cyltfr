// const webpack = require('webpack')

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: './server/views/map2.html',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  }
}
