;(function () {
  function commentMap (geojson) {
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

    var map = new ol.Map({
      target: 'map',
      view: new ol.View({
        projection: 'EPSG:3857',
        center: [0, 0],
        zoom: 2
      }),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        vectorLayer
      ],
      controls: ol.control.defaults({ attribution: false })
    })

    map.setView(new ol.View({
      projection: 'EPSG:27700'
    }))

    var ext = vectorSource.getExtent()
    map.getView().fit(ext, map.getSize())
  }

  window.LTFMGMT.commentMap = commentMap
})()
