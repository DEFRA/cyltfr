/* global */

const $ = window.$
const ol = window.ol
const parser = new ol.format.WMTSCapabilities()
const wmsparser = new ol.format.WMSCapabilities()
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
let map, callback, currentLayer
let isLoading = false
let loading = 0
let loaded = 0
let maxResolution = 1000

function loadMap (point) {
  const $body = $(document.body)

  // add the projection to Window.proj4
  window.proj4.defs(config.projection.ref, config.projection.proj4)
  ol.proj.proj4.register(window.proj4)

  const projection = ol.proj.get(config.projection.ref)

  projection.setExtent(config.projection.extent)

  $.when($.get(config.OSGetCapabilities), $.get(config.GSWMSGetCapabilities)).done(function (OS, WMS) {
    // bug: parser is not getting the matrixwidth and matrixheight values when parsing,
    // therefore sizes is set to undefined array, which sets fullTileRanges_
    // to an array of undefineds thus breaking the map      return
    const result = parser.read(OS[0])

    const options = ol.source.WMTS.optionsFromCapabilities(result, {
      layer: config.OSLayer,
      matrixSet: config.OSMatrixSet,
      crossOrigin: 'anonymous'
    })

    const source = new ol.source.WMTS(options)
    source.setUrl(config.OSWMTS)

    const layer = new ol.layer.Tile({
      ref: config.OSLayer,
      source
    })
    const layers = []
    // add the base map layer
    layers.push(layer)

    const wmsResult = wmsparser.read(WMS[0])

    // I can't find a better way of doing this for a tileWMS source, WMTS souce has
    // optionsFromCapabilities function which does some of the work for you, but it looks
    // like that function just does this anyway, although i think the WMTS version does a lot more with setting up matrixSet and things
    for (let i = 0; i < wmsResult.Capability.Layer.Layer.length; i++) {
      const WmsSource = new ol.source.TileWMS({
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

      const progress = new Progress(document.getElementById('progress'))

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
        maxResolution
      }))
    }

    if (point) {
      const centreLayer = new ol.layer.Vector({
        ref: 'pointMarker',
        className: 'pointMarker',
        visible: true,
        source: new ol.source.Vector({
          features: [new ol.Feature({
            geometry: new ol.geom.Point(point)
          })]
        }),
        style: new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: 'assets/images/icon-location.png'
          })
        })
      })
      layers.push(centreLayer)
    }

    let controls = ol.control.defaults({ attributionOptions: { collapsible: true } })
      .extend([
        new ol.control.ScaleLine({
          units: 'metric',
          minWidth: 128
        })
      ])

    if (document.body.requestFullscreen) {
      controls = controls.extend([new ol.control.FullScreen()])
    }

    // Prevent map from zooming in too far
    const resolutions = source.tileGrid.getResolutions().slice(0, 10)

    map = new ol.Map({
      controls,
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      }),
      layers,
      pixelRatio: 1,
      target: 'map',
      view: new ol.View({
        resolutions,
        projection,
        center: point || [440000, 310000],
        zoom: point ? 9 : 0,
        extent: config.projection.extent
      })
    })

    $('#legend').on('click', 'a[data-id]', function (e) {
      e.preventDefault()
      // Build a view model from the properties
      const $link = $(this)
      const id = $link.data('id')

      sendGoogleAnalyticsEvent('ltfri', 'map', 'risk-type-legend-' + id)
    })

    // Map interaction functions
    map.on('pointermove', function (e) {
      if (e.dragging) {
        return
      }

      const currentLayerRef = currentLayer && currentLayer.getProperties().ref
      const pixel = map.getEventPixel(e.originalEvent)
      if ((currentLayerRef === 'risk:1-ROFRS' || currentLayerRef === 'risk:6-SW-Extent') || (bullseye(pixel) && !(currentLayerRef !== 'risk:1-ROFRS' && currentLayerRef !== 'risk:6-SW-Extent' && currentLayerRef !== 'risk:2-FWLRSF'))) {
        $body.css('cursor', 'pointer')
      } else {
        $body.css('cursor', 'default')
      }
    })

    // Callback to notify map is ready
    if (callback) {
      callback()
    }
  })
}

function sendGoogleAnalyticsEvent (category, event, label) {
  if (window.GOVUK && window.GOVUK.performance) {
    window.GOVUK.performance.sendGoogleAnalyticsEvent(category, event, label)
  }
}

function showMap (layerReference, hasLocation) {
  map.getLayers().forEach(function (layer) {
    const layerName = layer.getProperties().ref
    if (layerName !== config.OSLayer && layerName !== 'pointMarker') {
      currentLayer = layerName === layerReference ? layer : currentLayer
      layer.setVisible(layerName === layerReference)
    }
    if (layerName === 'pointMarker') {
      const className = layer.getProperties().className
      if (className === 'pointMarker' && hasLocation) {
        layer.setVisible(true)
        layer.setZIndex(1)
      } else {
        layer.setVisible(false)
      }
    }
  })
}

function updateSize () {
  map.updateSize()
}

function panTo (point, zoom) {
  const view = map.getView()
  view.setCenter(point)
  view.setZoom(zoom)
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
    isLoading
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
  const this_ = this
  setTimeout(function () {
    ++this_.tilesLoaded
    this_.update()
  }, 100)
}

Progress.prototype.update = function () {
  const width = (this.tilesLoaded / this.tilesLoading * 100).toFixed(1) + '%'
  this.el.style.width = width
  if (this.tilesLoading === this.tilesLoaded) {
    this.tilesLoading = 0
    this.tilesLoaded = 0
    const this_ = this
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
  loadMap,
  showMap,
  panTo,
  updateSize,
  testValues,
  onReady: function (fn) {
    callback = fn
  }
}