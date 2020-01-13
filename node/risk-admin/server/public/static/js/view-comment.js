
;(function () {
  var geometry = window.LTFMGMT.geometry

  geometry.features.forEach(function (feature, index) {
    var geo = Object.assign({}, geometry, {
      features: geometry.features.filter(function (f) {
        return f === feature
      })
    })

    window.LTFMGMT.commentMap(geo, 'map_' + index)
  })

  if (geometry.features.length > 1) {
    window.LTFMGMT.commentMap(geometry, 'map')
  }
})()
