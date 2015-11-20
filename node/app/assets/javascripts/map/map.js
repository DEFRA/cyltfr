var $ = require('jquery')
// proj4 is accessed using global variable within openlayers library
window.proj4 = require('proj4')
var ol = require('openlayers')
var parser = new ol.format.WMTSCapabilities()
var wmsparser = new ol.format.WMSCapabilities()
var config = require('./map-config.json')
var map, callback, currentLayer

function loadMap () {
  // add the projection to Window.proj4
  window.proj4.defs(config.projection.ref, config.projection.proj4)

  var projection = ol.proj.get(config.projection.ref)

  projection.setExtent(config.projection.extent)

  $.when($.get(config.OSGetCapabilities), /* $.get(config.GSGetCapabilities),*/$.get(config.GSWMSGetCapabilities)).done(function (OS,/* GS, */ WMS) {
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
      ref: config.OSLayer,
      source: source
    })
    var layers = []
    // add the base map layer
    layers.push(layer)

    // This commented code is to plug in the WMTS layers, below it plugs in the WMS-C layers

  /*  var sw_result = parser.read(GS[0])

    for (var i = 0; i < sw_result.Contents.Layer.length; i++) {

      var WMTSoptions = ol.source.WMTS.optionsFromCapabilities(sw_result, {layer: sw_result.Contents.Layer[i].Identifier, matrixSet: config.projection.ref})
      WMTSoptions.urls = [config.GSWMTS]
      var WMTSSource = new ol.source.WMTS(WMTSoptions)

      layers.push(new ol.layer.Tile({
        ref: sw_result.Contents.Layer[i].Identifier,
        source: WMTSSource,
        opacity: 0.8,
        visible: false
      }))
    }
*/
    var wms_result = wmsparser.read(WMS[0])

    for (var i = 0; i < wms_result.Capability.Layer.Layer.length; i++) {
      var WMSsource = new ol.source.TileWMS({
        url: config.GSWMS,
        params: {
          'LAYERS': wms_result.Capability.Layer.Layer[i].Name,
          'SRS': config.projection.ref,
          'TILED': true,
          'VERSION': wms_result.version},
        serverType: 'geoserver',
        tileGrid: new ol.tilegrid.TileGrid({
          extent: wms_result.Capability.Layer.Layer[i].BoundingBox[0].extent,
          resolutions: source.tileGrid.getResolutions(),
          tileSize: [250, 250]
        })
      })

      layers.push(new ol.layer.Tile({
        ref: wms_result.Capability.Layer.Layer[i].Name,
        source: WMSsource,
        opacity: 0.8,
        visible: false
      }))
    }

    var polygonHighlight = function (feature, resolution) {
      return [
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'rgba(255,0,0,1)',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255,0,0,1)'
          })
        })
      ]
    }

    var highlightSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        projection: 'EPSG:27700'
    })

    var highlightLayer = new ol.layer.Vector({
      ref: 'overlay',
      source: highlightSource,
      style: polygonHighlight,
      visible: true
    })

    layers.push(highlightLayer)

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


    // Map interaction functions
    map.on('singleclick', function (e) {
      if (!bullseye(e.pixel)) {
        return
      }

      var url = currentLayer.getSource().getGetFeatureInfoUrl(
        e.coordinate,
        map.getView().getResolution(),
        config.projection.ref,
        {'INFO_FORMAT': 'application/json'}
      )

      $.get(url, function (data) {
        $('.feature').html(JSON.stringify(data))

        var geom = new ol.geom.MultiPolygon(data.features[0].geometry.coordinates)

        var feature = new ol.Feature({
          name: 'help',
          geometry: geom
        })

        highlightSource.clear()

        highlightSource.addFeature(feature)
      })
    })

    map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return
      }

      var pixel = map.getEventPixel(evt.originalEvent)

      document.body.style.cursor = bullseye(pixel) ? 'pointer' : 'default'
    })

    if (callback) {
      callback()
    }
  })
}

function showMap (ref) {
  map.getLayers().forEach(function (layer) {
    var name = layer.getProperties().ref
    if (name !== config.OSLayer && name !== 'overlay') {
      currentLayer = name === ref ? layer : currentLayer
      layer.setVisible(name === ref)
    }
  })
}

function bullseye (pixel) {
  return map.forEachLayerAtPixel(pixel, function (layer) {
    return true
  }, null, function (layer) {
    // filter function to only check current risk layer
    return layer === currentLayer
  })
}

module.exports = {
  loadMap: loadMap,
  showMap: showMap,
  onReady: function (fn) {
    callback = fn
  }
}
