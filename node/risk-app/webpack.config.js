// const webpack = require('webpack')

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: './server/public/static/js/mapv2.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  }
}
