const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  devtool: 'source-map',
  entry: {
    map: ['./server/src/js/map.js', './server/public/static/js/map-page/map-page.js']
  },
  node: {
    global: true
  },
  output: {
    path: path.resolve(__dirname, 'server/public/build/js'),
    library: 'maps'
  }
}
