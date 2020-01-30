/* global */

var $ = window.$
var ol = window.ol
var parser = new ol.format.WMTSCapabilities()
var wmsparser = new ol.format.WMSCapabilities()
var config = {
  projection: {
    ref: 'EPSG:27700',
    proj4: '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs',
    extent: [0, 0, 800000, 1400000]
  },
  OSGetCapabilities: 'os-get-capabilities',
  OSAttribution: "&#169; Crown copyright and database rights {{year}} <a class='govuk-link' href='http://www.ordnancesurvey.co.uk'>OS</a> 100024198. Use of this mapping data is subject to terms and conditions",
  OSLayer: 'osgb',
  OSMatrixSet: 'ZoomMap',
  GSWMSGetCapabilities: 'gwc-proxy?SERVICE=WMS&VERSION=1.1.1&REQUEST=getcapabilities&TILED=true',
  GSWMS: 'gwc-proxy?'
}
// var overlayTemplate = require('./overlay.hbs')
var map, callback, currentLayer, $overlay, $overlayContent
var isLoading = false
var loading = 0
var loaded = 0
var maxResolution = 1000

function overlayTemplate (data) {
  return window.nunjucks.render('overlay.html', data)
}

function loadMap (point) {
  var $body = $(document.body)

  // add the projection to Window.proj4
  window.proj4.defs(config.projection.ref, config.projection.proj4)
  ol.proj.proj4.register(window.proj4)

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
      matrixSet: config.OSMatrixSet,
      crossOrigin: 'anonymous'
    })

    var attributionText = config.OSAttribution.replace('{{year}}', new Date().getFullYear())

    options.attributions = [
      attributionText
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
          VERSION: wmsResult.version
        },
        tileGrid: new ol.tilegrid.TileGrid({
          extent: wmsResult.Capability.Layer.Layer[i].BoundingBox[0].extent,
          resolutions: source.tileGrid.getResolutions(),
          tileSize: [250, 250]
        })
      })

      var progress = new Progress(document.getElementById('progress'))

      source.on('tileloadstart', function () {
        progress.addLoading()
      })

      source.on('tileloadend', function () {
        progress.addLoaded()
      })

      source.on('tileloaderror', function () {
        progress.addLoaded()
      })

      WmsSource.on('tileloadstart', function () {
        isLoading = true
        loading++
        progress.addLoading()
      })

      WmsSource.on('tileloadend', function () {
        loaded++
        if (loading === loaded) {
          layerLoaded()
        }
        progress.addLoaded()
      })

      WmsSource.on('tileloaderror', function () {
        loaded++
        if (loading === loaded) {
          layerLoaded()
        }
        progress.addLoaded()
      })

      if (wmsResult.Capability.Layer.Layer[i].Name.indexOf('SW') > -1) {
        maxResolution = 20
      }

      layers.push(new ol.layer.Tile({
        ref: wmsResult.Capability.Layer.Layer[i].Name,
        source: WmsSource,
        opacity: 0.7,
        visible: false,
        maxResolution: maxResolution
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
            src: 'assets/images/crosshair.png'
          })
        })
      })
      layers.push(centreLayer)
    }

    map = new ol.Map({
      controls: ol.control.defaults({ attributionOptions: { collapsible: true } }).extend([
        new ol.control.ScaleLine({
          units: 'metric',
          minWidth: 128
        }),
        new ol.control.Attribution()
      ]),
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      }),
      layers: layers,
      pixelRatio: 1,
      target: 'map',
      view: new ol.View({
        resolutions: source.tileGrid.getResolutions(),
        projection: projection,
        center: point || [440000, 310000],
        zoom: point ? 9 : 0,
        extent: config.projection.extent
      })
    })

    $('#legend').on('click', 'a[data-id]', function (e) {
      e.preventDefault()
      // Build a view model from the properties
      var $link = $(this)
      var id = $link.data('id')
      var viewModel = {
        isRiskDescription: true,
        isRiversOrSeas: id.substr(0, 11) === 'rivers-seas',
        isSurfaceWater: id.substr(0, 13) === 'surface-water',
        id: id
      }

      // Get the overlay content html using the template
      var html = overlayTemplate(viewModel)

      // Update the content
      $overlayContent.html(html)

      // Show the overlay
      $overlay.show()

      window.GOVUK.performance.sendGoogleAnalyticsEvent('ltfri', 'map', 'risk-type-legend-' + id)
    })

    // Map interaction functions
    map.on('pointermove', function (e) {
      var currentLayerRef = currentLayer && currentLayer.getProperties().ref
      if (e.dragging) {
        return
      }

      var pixel = map.getEventPixel(e.originalEvent)
      if ((currentLayerRef === 'risk:1-ROFRS' || currentLayerRef === 'risk:6-SW-Extent') || (bullseye(pixel) && !(currentLayerRef !== 'risk:1-ROFRS' && currentLayerRef !== 'risk:6-SW-Extent' && currentLayerRef !== 'risk:2-FWLRSF'))) {
        $body.css('cursor', 'pointer')
      } else {
        $body.css('cursor', 'default')
      }
    })

    map.on('singleclick', function (e) {
      var currentLayerRef = currentLayer && currentLayer.getProperties().ref

      if (currentLayerRef !== 'risk:1-ROFRS' && currentLayerRef !== 'risk:6-SW-Extent' && currentLayerRef !== 'risk:2-FWLRSF') {
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
        if (!data || !data.features) {
          return
        }

        var viewModel, properties, feature

        if (currentLayerRef === 'risk:1-ROFRS') {
          if (data.features.length) {
            feature = data.features[0]
            properties = feature.properties
          }

          viewModel = {
            isRiskDescription: true,
            isRiversOrSeas: true,
            isSurfaceWater: false,
            id: 'rivers-seas-' + (properties ? properties.prob_4band.toLowerCase() : 'very-low')
          }
        } else if (currentLayerRef === 'risk:6-SW-Extent') {
          var levels = {}
          var level = ''

          data.features.forEach(function (item) {
            if (item.id.indexOf('ufmfsw_extent_1_in_30_') > -1) {
              levels['30'] = true
            } else if (item.id.indexOf('ufmfsw_extent_1_in_100_') > -1) {
              levels['100'] = true
            } else if (item.id.indexOf('ufmfsw_extent_1_in_1000_') > -1) {
              levels['1000'] = true
            }
          })

          if (levels['30']) {
            level = 'high'
          } else if (levels['100']) {
            level = 'medium'
          } else if (levels['1000']) {
            level = 'low'
          } else {
            level = 'very-low'
          }

          viewModel = {
            isRiskDescription: true,
            isRiversOrSeas: false,
            isSurfaceWater: true,
            id: 'surface-water-' + level
          }
        } else {
          if (!data.features.length) {
            return
          }

          feature = data.features[0]
          properties = feature.properties

          // Get the feature and build a view model from the properties
          var isRiverLevelStation = feature.id.indexOf('river_level') === 0
          viewModel = {
            isMonitoringStation: true,
            flow30: isRiverLevelStation && toFixed(properties.flow_30),
            flow100: isRiverLevelStation && toFixed(properties.flow_100),
            flow1000: isRiverLevelStation && toFixed(properties.flow_1000),
            depth30: toFixed(isRiverLevelStation ? properties.depth_30 : properties.lev_30),
            depth100: toFixed(isRiverLevelStation ? properties.depth_100 : properties.lev_100),
            depth1000: toFixed(isRiverLevelStation ? properties.depth_1000 : properties.lev_1000),
            isRiverLevelStation: isRiverLevelStation,
            stationName: properties.location || properties.site
          }
        }

        // Get the overlay content html using the template
        var html = overlayTemplate(viewModel)

        // update the content
        $overlayContent.html(html)

        // Show the overlay
        $overlay.show()

        if (viewModel.isRiskDescription) {
          window.GOVUK.performance.sendGoogleAnalyticsEvent('ltfri', 'map', 'risk-type-map-' + viewModel.id)
        }
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

function updateSize () {
  map.updateSize()
}

function panTo (point, zoom) {
  var view = map.getView()
  view.setCenter(point)
  view.setZoom(zoom)
}

function closeOverlay () {
  $overlay.hide()
}

function bullseye (pixel) {
  return map.forEachLayerAtPixel(pixel, function (layer) {
    return true
  }, null, function (layer) {
    return layer.get('ref') !== config.OSLayer // Ignore OS background map as causes CORs issue on query and covers whole map anyway so will always return true
  })
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
  isLoading = false
}

function Progress (el) {
  this.el = el
  this.tilesLoading = 0
  this.tilesLoaded = 0
}

Progress.prototype.addLoading = function () {
  if (this.tilesLoading === 0) {
    this.show()
  }
  ++this.tilesLoading
  this.update()
}

Progress.prototype.addLoaded = function () {
  var this_ = this
  setTimeout(function () {
    ++this_.tilesLoaded
    this_.update()
  }, 100)
}

Progress.prototype.update = function () {
  var width = (this.tilesLoaded / this.tilesLoading * 100).toFixed(1) + '%'
  this.el.style.width = width
  if (this.tilesLoading === this.tilesLoaded) {
    this.tilesLoading = 0
    this.tilesLoaded = 0
    var this_ = this
    setTimeout(function () {
      this_.hide()
    }, 500)
  }
}

Progress.prototype.show = function () {
  this.el.style.visibility = 'visible'
}

Progress.prototype.hide = function () {
  if (this.tilesLoading === this.tilesLoaded) {
    this.el.style.visibility = 'hidden'
    this.el.style.width = 0
  }
}

window.maps = {
  loadMap: loadMap,
  showMap: showMap,
  panTo: panTo,
  updateSize: updateSize,
  closeOverlay: closeOverlay,
  testValues: testValues,
  onReady: function (fn) {
    callback = fn
  }
}
