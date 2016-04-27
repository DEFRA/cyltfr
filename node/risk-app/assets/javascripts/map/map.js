var $ = require('jquery')
// proj4 is accessed using global variable within openlayers library
window.proj4 = require('proj4')
var raf = require('raf')
var ol = require('openlayers')
var parser = new ol.format.WMTSCapabilities()
var wmsparser = new ol.format.WMSCapabilities()
var config = require('./map-config.json')
var overlayTemplate = require('./overlay.hbs')
var map, callback, currentLayer, $overlay, $overlayContent
var isLoading = false
var loading = 0
var loaded = 0
var loadError = 0

function loadMap (point) {
  // add the projection to Window.proj4
  window.proj4.defs(config.projection.ref, config.projection.proj4)

  // ie9 requires polyfill for window.requestAnimationFrame
  raf.polyfill()

  var projection = ol.proj.get(config.projection.ref)

  projection.setExtent(config.projection.extent)

  $.when($.get(config.OSGetCapabilities), $.get(config.GSWMSGetCapabilities)).done(function (OS, WMS) {
    // bug: parser is not getting the matrixwidth and matrixheight values when parsing,
    // therefore sizes is set to undefined array, which sets fullTileRanges_
    // to an array of undefineds thus breaking the map      return
    var result = parser.read(OS[0])
    // TODO
    // need to set tiles to https
    // follow up with OS
    result.OperationsMetadata.GetTile.DCP.HTTP.Get[0].href = result.OperationsMetadata.GetTile.DCP.HTTP.Get[0].href.replace('http://', 'https://')

    var options = ol.source.WMTS.optionsFromCapabilities(result, {
      layer: config.OSLayer,
      matrixSet: config.OSMatrixSet
    })

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
    source.tileGrid.b = null

    var layer = new ol.layer.Tile({
      ref: config.OSLayer,
      source: source
    })
    var layers = []
    // add the base map layer
    layers.push(layer)

    var wmsResult = wmsparser.read(WMS[0])

    // I can't find a better way of doing this for a tileWMS source, WMTS souce has
    // optionsFromCapabilities function which does some of the work for you, but it looks
    // like that function just does this anyway, although i think the WMTS version does a lot more with setting up matrixSet and things
    for (var i = 0; i < wmsResult.Capability.Layer.Layer.length; i++) {
      var WmsSource = new ol.source.TileWMS({
        url: config.GSWMS,
        params: {
          LAYERS: wmsResult.Capability.Layer.Layer[i].Name,
          TILED: true,
          VERSION: wmsResult.version},
        tileGrid: new ol.tilegrid.TileGrid({
          extent: wmsResult.Capability.Layer.Layer[i].BoundingBox[0].extent,
          resolutions: source.tileGrid.getResolutions(),
          tileSize: [250, 250]
        })
      })

      WmsSource.on('tileloadstart', function () {
        isLoading = true
        loading++
      })

      WmsSource.on('tileloadend', function () {
        loaded++
        if (loading === loaded) {
          layerLoaded()
        }
      })

      WmsSource.on('tileloaderror', function () {
        loadError++
        loaded++
        if (loading === loaded) {
          layerLoaded()
        }
      })

      layers.push(new ol.layer.Tile({
        ref: wmsResult.Capability.Layer.Layer[i].Name,
        source: WmsSource,
        opacity: 0.7,
        visible: false
      }))
    }

    if (point) {
      var centreLayer = new ol.layer.Vector({
        ref: 'crosshair',
        visible: true,
        source: new ol.source.Vector({
          features: [new ol.Feature({
            geometry: new ol.geom.Point(point)
          })]
        }),
        style: new ol.style.Style({
          image: new ol.style.Icon({
            src: '/public/images/crosshair.png'
          })
        })
      })
      layers.push(centreLayer)
    }

    map = new ol.Map({
      controls: ol.control.defaults().extend([
        new ol.control.ScaleLine({
          units: 'imperial',
          minWidth: 128
        }),
        new ol.control.FullScreen()
      ]),
      layers: layers,
      target: 'map',
      view: new ol.View({
        resolutions: source.tileGrid.getResolutions(),
        projection: projection,
        center: point || [440000, 310000],
        zoom: point ? 9 : 0,
        extent: config.projection.extent
      })
    })

    // Map interaction functions
    map.on('singleclick', function (e) {
      var currentLayerRef = currentLayer && currentLayer.getProperties().ref

      // The overlay is only for the FWLRSF
      if (currentLayerRef !== 'risk:2-FWLRSF' || !bullseye(e.pixel)) {
        return
      }

      var resolution = map.getView().getResolution()
      var url = currentLayer.getSource().getGetFeatureInfoUrl(e.coordinate, resolution, config.projection.ref, {
        INFO_FORMAT: 'application/json',
        FEATURE_COUNT: 10
      })

      function toFixed (number) {
        if (typeof number !== 'undefined') {
          return number.toFixed(2)
        }
      }

      $.get(url, function (data) {
        if (!data || !data.features.length) {
          return
        }

        // Get the feature and build a view model from the properties
        var feature = data.features[0]
        var properties = feature.properties
        var isRiverLevelStation = feature.id.indexOf('river_level') === 0
        var viewModel = {
          flow30: isRiverLevelStation && toFixed(properties.flow_30),
          flow100: isRiverLevelStation && toFixed(properties.flow_100),
          flow1000: isRiverLevelStation && toFixed(properties.flow_1000),
          depth30: toFixed(isRiverLevelStation ? properties.depth_30 : properties.lev_30),
          depth100: toFixed(isRiverLevelStation ? properties.depth_100 : properties.lev_100),
          depth1000: toFixed(isRiverLevelStation ? properties.depth_1000 : properties.lev_1000),
          isRiverLevelStation: isRiverLevelStation,
          stationName: properties.location || properties.site
        }

        // Get the overlay content html using the template
        var html = overlayTemplate(viewModel)

        // update the content
        $overlayContent.html(html)

        // Show the overlay
        $overlay.show()
      })
    })

    // Initialise the overlays
    function hideOverlay (e) {
      e.preventDefault()
      $overlay.hide()
    }
    $overlay = $('#map-overlay')
    $overlay
      .on('click', '.map-overlay-close', hideOverlay)
      .on('click', '.map-overlay-close-link', hideOverlay)

    $overlayContent = $('.map-overlay-content', $overlay)

    // Callback to notify map is ready
    if (callback) {
      callback()
    }
  })
}

function showMap (ref) {
  closeOverlay()
  map.getLayers().forEach(function (layer) {
    var name = layer.getProperties().ref
    if (name !== config.OSLayer && name !== 'crosshair') {
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

function closeOverlay () {
  $overlay.hide()
}

function testValues () {
  return {
    zoom: map.getView().getZoom(),
    point: map.getView().getCenter(),
    layer: currentLayer && currentLayer.getProperties().ref,
    isLoading: isLoading
  }
}

function layerLoaded () {
  loading = 0
  loaded = 0
  loadError = 0
  isLoading = false
}

module.exports = {
  loadMap: loadMap,
  showMap: showMap,
  closeOverlay: closeOverlay,
  testValues: testValues,
  onReady: function (fn) {
    callback = fn
  }
}
