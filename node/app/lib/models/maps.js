var maps = require('./maps.json')

function Maps (ref) {
  this._data = maps
  this._categories = maps.categories
  this.setCurrentMap(ref)
}
Maps.prototype.setCurrentMap = function (ref) {
  // Work out the current category and map
  var category, map, defaultCategory, defaultMap
  for (var i = 0; i < this._categories.length; i++) {
    category = this._categories[i]
    if (i === 0) {
      defaultCategory = category
    }

    for (var j = 0; j < category.maps.length; j++) {
      map = category.maps[i]
      if (i === 0 && j === 0) {
        defaultMap = map
      }

      if (map.ref === ref) {
        this.currMap = map
        this.currCategory = category
        return map
      }
    }
  }

  this.currMap = defaultMap
  this.currCategory = defaultCategory
}

module.exports = Maps
