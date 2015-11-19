var $ = require('jquery')
// proj4 is accessed using global variable within openlayers library
window.proj4 = require('proj4')
var ol = require('openlayers')
var parser = new ol.format.WMTSCapabilities()
var config = require('./map-config.json')
var map, callback

// add the projection to Window.proj4
window.proj4.defs(config.projection.ref, config.projection.proj4)

var projection = ol.proj.get(config.projection.ref)

projection.setExtent(config.projection.extent)

$.when($.get(config.OSGetCapabilities), $.get(config.GSGetCapabilities)).done(function (OS, GS) {
  // bug: parser is not getting the matrixwidth and matrixheight values when parsing,
  // therefore sizes is set to undefined array, which sets fullTileRanges_
  // to an array of undefineds thus breaking the map
  var result = parser.read(OS[0])

  var options = ol.source.WMTS.optionsFromCapabilities(
    result,
    {
      layer: config.OSLayer,
      matrixSet: config.OSMatrixSet
    }
  )
  options.attributions = [
    new ol.Attribution({
      html: config.OSAttribution
    })
  ]

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

  var sw_result = parser.read(GS[0])

  for (var i = 0; i < sw_result.Contents.Layer.length; i++) {
    options = ol.source.WMTS.optionsFromCapabilities(sw_result, {layer: sw_result.Contents.Layer[i].Identifier, matrixSet: config.projection.ref})
    source = new ol.source.WMTS(options)

    layers.push(new ol.layer.Tile({
      source: source,
      opacity: 0.8,
      visible: false
    }))
  }

  map = new ol.Map({
    layers: layers,
    target: 'map',
    controls: ol.control.defaults().extend([
      new ol.control.ScaleLine({
        units: 'imperial',
        minWidth: 128
      }),
      new ol.control.FullScreen()
    ]),
    view: new ol.View({
      resolutions: source.tileGrid.getResolutions(),
      projection: projection,
      center: [440000, 310000],
      zoom: 0
    })
  })

  if (callback) {
    callback()
  }
})

function showMap (ref) {
  map.getLayers().forEach(function (layer) {
    var name = layer.getSource().getLayer()
    if (name !== config.OSLayer) {
      layer.setVisible(name === ref)
    }
  })
}

module.exports = {
  showMap: showMap,
  onReady: function (fn) {
    callback = fn
  }
}
