
;(function () {
  var geometry = window.LTFMGMT.geometry
  window.LTFMGMT.commentMap(geometry, 'map')

  if (geometry.features.length > 1) {
    geometry.features.forEach(function (feature, index) {
      var geo = Object.assign({}, geometry, {
        features: geometry.features.filter(function (f) {
          return f === feature
        })
      })

      window.LTFMGMT.commentMap(geo, 'map_' + index)
    })
  }
})()
