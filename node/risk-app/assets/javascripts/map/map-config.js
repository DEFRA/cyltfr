var config = require('../../../config')

module.exports = {
  projection: {
    ref: 'EPSG:27700',
    proj4: '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs',
    extent: [0, 0, 800000, 1400000]
  },
  mountPath: config.mountPath,
  OSGetCapabilities: (config.mountPath ? '/' + config.mountPath : '') + '/os-get-capabilities',
  OSAttribution: "&#169; Crown copyright and database rights 2015 <a href='http://www.ordnancesurvey.co.uk'>Ordnance Survey</a>",
  OSLayer: 'osgb',
  OSMatrixSet: 'ZoomMap',
  GSWMSGetCapabilities: (config.mountPath ? '/' + config.mountPath : '') + '/gwc-proxy?SERVICE=WMS&VERSION=1.1.1&REQUEST=getcapabilities&TILED=true',
  GSWMS: (config.mountPath ? '/' + config.mountPath : '') + '/gwc-proxy?'
}
