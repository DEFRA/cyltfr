;(function () {
  function commentMap (geojson, target, capabilities, title) {
    var ol = window.ol
    var proj4 = window.proj4

    var vectorSource = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(geojson)
    })

    var styleFunction = function (feature) {
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'blue',
          lineDash: [4],
          width: 3
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      })
    }

    var vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: styleFunction
    })

    proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
        '+x_0=400000 +y_0=-100000 +ellps=airy ' +
        '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
        '+units=m +no_defs')
    ol.proj.proj4.register(proj4)
    var proj27700 = ol.proj.get('EPSG:27700')
    proj27700.setExtent([0, 0, 700000, 1300000])

    var parser = new ol.format.WMTSCapabilities()
    var result = parser.read(capabilities)

    var options = ol.source.WMTS.optionsFromCapabilities(result, {
      layer: 'Outdoor_27700',
      matrixSet: 'EPSG:27700',
      crossOrigin: 'anonymous'
    })

    var source = new ol.source.WMTS(options)

    var layer = new ol.layer.Tile({
      ref: 'osgb',
      source: source
    })

    var map = new ol.Map({
      target: target,
      view: new ol.View({
        projection: proj27700,
        center: [0, 0],
        zoom: 2
      }),
      layers: [
        layer,
        vectorLayer
      ],
      controls: ol.control.defaults({ attribution: false })
    })

    map.setView(new ol.View({
      projection: 'EPSG:27700'
    }))

    var ext = vectorSource.getExtent()
    map.getView().fit(ext, map.getSize())

    map.on('singleclick', function (evt) {
      console.log(evt.coordinate.map(function (p) {
        return Math.round(p)
      }))
    })

    if (title) {
      var titleEl = document.createElement('h3')
      titleEl.textContent = title
      var mapEl = map.getTargetElement()
      mapEl.parentNode.insertBefore(titleEl, mapEl)
    }
  }

  window.LTFMGMT.commentMap = commentMap
})()
