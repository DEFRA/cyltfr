import { Map, View } from 'ol'
import proj4 from 'proj4/proj4.js'
import { register, get as getProjection } from 'ol/proj'

const config = {
  projection: {
    ref: 'EPSG:27700',
    proj4: '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs',
    extent: [0, 0, 800000, 1400000]
  },
  OSGetCapabilities: 'os-get-capabilities',
  OSWMTS: 'os-maps-proxy',
  OSAttribution: "&#169; Crown copyright and database rights {{year}} <a class='govuk-link' href='http://www.ordnancesurvey.co.uk'>OS</a> AC0000807064. Use of this mapping data is subject to terms and conditions",
  OSLayer: 'Outdoor_27700',
  OSMatrixSet: 'EPSG:27700',
  GSWMSGetCapabilities: 'gwc-proxy?SERVICE=WMS&VERSION=1.1.1&REQUEST=getcapabilities&TILED=true',
  GSWMS: 'gwc-proxy?'
}

proj4.defs(config.projection.ref, config.projection.proj4)
register(proj4)

const projection = getProjection(config.projection.ref)

projection.setExtent(config.projection.extent)

const map = new Map({
  target: 'map',
  view: new View({
    projection
  })
})
