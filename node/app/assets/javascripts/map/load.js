var ol = require('openlayers')
// var proj4 = require('proj4')
var parser = new ol.format.WMTSCapabilities()

var extent = [0, 0, 800000, 1400000]

proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs')

var projection = ol.proj.get('EPSG:27700')

projection.setExtent(extent)

var request = new window.XMLHttpRequest()
request.open('GET', 'http://ondemandapi.ordnancesurvey.co.uk/osmapapi/wmtsgc/segab6nu/GetCapabilities?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities&URL=https://flood-warning-information.service.gov.uk/', false)
request.send(null)

// bug parser is not getting the matrixwidth and matrixheight values when parsing,
// therefore sizes is set to undefined array, which sets fullTileRanges_
// to an array of undefineds thus breaking the map
var result = parser.read(request.responseXML)

var options = ol.source.WMTS.optionsFromCapabilities(
  result,
  {
    layer: 'osgb',
    matrixSet: 'ZoomMap'

  }
)

options.attributions = [
  new ol.Attribution({
    html: '&#169; Crown copyright and database rights 2015 <a href="http://www.ordnancesurvey.co.uk">Ordnance Survey</a>'
  })
]

options.urls[0] += 'URL=https://flood-warning-information.service.gov.uk/'

options.tileGrid.a = null

var source = new ol.source.WMTS(options)

// array of ol.tileRange can't find any reference to this object in ol3 documentation, but is set to NaN and stops the map from functioning
// openlayers doesn't expose fulltileranges as a property, so when using minified ol have to set tilegrid.a to null, which is what fulltileranges
// is mapped as, hopefully OS will fix their service, otherwise something more robust needs sorting out

source.tileGrid.fullTileRanges_ = null
source.tileGrid.a = null

var layer = new ol.layer.Tile({
  source: source
})

var layers = []
// add the base map layer
layers.push(layer)

// loading the surface water WMTS
var swrequest = new window.XMLHttpRequest()
swrequest.open('GET', '/geoserver/gwc/service/wmts?REQUEST=GetCapabilities', false)
swrequest.send(null)

var sw_result = parser.read(swrequest.responseText)

for (var i = 0; i < sw_result.Contents.Layer.length; i++) {
  var options = ol.source.WMTS.optionsFromCapabilities(sw_result, {layer: sw_result.Contents.Layer[i].Identifier, matrixSet: 'EPSG:27700'})
  var source = new ol.source.WMTS(options)

  layers.push(new ol.layer.Tile({
    source: source,
    opacity: 0.8,
    visible: false
  }))

}

// setup additional controls
var controls = ol.control.defaults()

controls.push(new ol.control.ScaleLine({
  units: 'imperial',
  minWidth: 128
}))

controls.push(new ol.control.FullScreen({
  // can change the default symbology for the fullscreen button in here
}))

map = new ol.Map({
  layers: layers,
  target: 'map',
  controls: controls,
  view: new ol.View({
    resolutions: source.tileGrid.getResolutions(),
    projection: projection,
    center: [440000, 310000],
    zoom: 0
  })
})

function showMap (ref) {
  map.getLayers().forEach(function (layer) {
    var name = layer.getSource().getLayer()
    if (name != 'osgb') {
      layer.setVisible(name === ref)
    }
  })

}

module.exports = {
  showMap: showMap
}
