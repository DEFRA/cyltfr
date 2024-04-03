const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  devtool: 'source-map',
  entry: {
    map: './server/src/js/map.js'
  },
  node: {
    global: true
  },
  output: {
    path: path.resolve(__dirname, 'server/public/build/js'),
    library: 'maps'
  }
}
