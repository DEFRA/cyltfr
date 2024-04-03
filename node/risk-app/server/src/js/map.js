import { Map, View } from 'ol'
import proj4 from 'proj4'
import { get as getProjection } from 'ol/proj.js'
import { register } from 'ol/proj/proj4'
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS.js'
import WMSCapabilities from 'ol/format/WMSCapabilities.js'
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js'
import TileLayer from 'ol/layer/Tile.js'
import TileWMS from 'ol/source/TileWMS.js'
import WMTSTileGrid from 'ol/tilegrid/WMTS.js'
import VectorSource from 'ol/source/Vector.js'
import VectorLayer from 'ol/layer/Vector.js'
import Feature from 'ol/Feature.js'
import Circle from 'ol/geom/Circle.js'
import Style from 'ol/style/Style.js'
import Fill from 'ol/style/Fill.js'
import Stroke from 'ol/style/Stroke.js'
import Point from 'ol/geom/Point.js'
import Icon from 'ol/style/Icon.js'

let map, callback, currentLayer
let maxResolution = 1000

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

export async function loadMap (point) {
  proj4.defs(config.projection.ref, config.projection.proj4)
  register(proj4)

  const projection = getProjection(config.projection.ref)

  projection.setExtent(config.projection.extent)

  // load capabilities from OS and GSWSM

  const responses = await Promise.all([fetch(config.OSGetCapabilities), fetch(config.GSWMSGetCapabilities)])
  const OS = await responses[0].text()
  const WMS = await responses[1].text()
  const parser = new WMTSCapabilities()
  const wmsparser = new WMSCapabilities()
  const result = parser.read(OS)

  const options = optionsFromCapabilities(result, {
    layer: config.OSLayer,
    matrixSet: config.OSMatrixSet,
    crossOrigin: 'anonymous'
  })

  const source = new WMTS(options)
  source.setUrl(config.OSWMTS)

  const layer = new TileLayer({
    ref: config.OSLayer,
    source
  })
  const layers = []
  // add the base map layer
  layers.push(layer)

  const wmsResult = wmsparser.read(WMS)

  // I can't find a better way of doing this for a tileWMS source, WMTS souce has
  // optionsFromCapabilities function which does some of the work for you, but it looks
  // like that function just does this anyway, although i think the WMTS version does a lot more with setting up matrixSet and things
  for (let i = 0; i < wmsResult.Capability.Layer.Layer.length; i++) {
    const WmsSource = new TileWMS({
      url: config.GSWMS,
      params: {
        LAYERS: wmsResult.Capability.Layer.Layer[i].Name,
        TILED: true,
        VERSION: wmsResult.version
      },
      tileGrid: new WMTSTileGrid({
        extent: wmsResult.Capability.Layer.Layer[i].BoundingBox[0].extent,
        resolutions: source.tileGrid.getResolutions(),
        tileSize: [250, 250]
      })
    })

    if (wmsResult.Capability.Layer.Layer[i].Name.indexOf('SW') > -1) {
      maxResolution = 20
    }

    layers.push(new TileLayer({
      ref: wmsResult.Capability.Layer.Layer[i].Name,
      source: WmsSource,
      opacity: 0.7,
      visible: false,
      maxResolution
    }))
  }

  if (point) {
    const radiusLayer = new VectorLayer({
      ref: 'radiusMarker',
      className: 'radiusMarker',
      visible: false,
      source: new VectorSource({
        features: [new Feature({
          geometry: new Circle(point, 15)
        })]
      }),
      style: new Style({
        fill: new Fill({
          color: 'rgba(237, 231, 46, 0.6)'
        }),
        stroke: new Stroke({
          color: 'rgba(237, 231, 46, 1)',
          width: 2
        })
      })
    })

    const centreLayer = new VectorLayer({
      ref: 'pointMarker',
      className: 'pointMarker',
      visible: true,
      source: new VectorSource({
        features: [new Feature({
          geometry: new Point(point)
        })]
      }),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'assets/images/icon-location.png'
        })
      })
    })
    layers.push(centreLayer, radiusLayer)
  }

  const resolutions = source.tileGrid.getResolutions().slice(0, 10)

  map = new Map({
    // controls,
    // interactions: ol.interaction.defaults({
    //   altShiftDragRotate: false,
    //   pinchRotate: false
    // }),
    layers,
    pixelRatio: 1,
    target: 'map',
    view: new View({
      resolutions,
      projection,
      center: point || [440000, 310000],
      zoom: point ? 9 : 0,
      extent: config.projection.extent
    })
  })

  map.on('pointermove', function (e) {
    if (e.dragging) {
      return
    }

    const currentLayerRef = currentLayer && currentLayer.get('ref')
    const $body = document.getElementsByTagName('body')[0]
    if ((currentLayerRef === 'risk:1-ROFRS' || currentLayerRef === 'risk:6-SW-Extent') || !(currentLayerRef !== 'risk:1-ROFRS' && currentLayerRef !== 'risk:6-SW-Extent' && currentLayerRef !== 'risk:2-FWLRSF')) {
      $body.style.cursor = 'pointer'
    } else {
      $body.style.cursor = 'default'
    }
  })

  if (callback) {
    callback()
  }
}

export function showMap (layerReference, hasLocation) {
  map.getLayers().forEach(function (layer) {
    const layerName = layer.get('ref')
    if (layerName !== config.OSLayer) {
      currentLayer = layerName === layerReference ? layer : currentLayer
      layer.setVisible(layerName === layerReference)
    }

    if (layerName === 'pointMarker' && hasLocation) {
      layer.setVisible(true)
      layer.setZIndex(1)
    }
    if (layerName === 'radiusMarker' && hasLocation && layerReference.substr(7, 2) === 'SW') {
      layer.setVisible(true)
      layer.setZIndex(0)
    }
  })
}

export function updateSize () {
  map.updateSize()
}

export function panTo (point, zoom) {
  const view = map.getView()
  view.setCenter(point)
  view.setZoom(zoom)
}

export function onReady (fn) {
  callback = fn
}
