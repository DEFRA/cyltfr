var maps = require('../../../lib/models/maps.json')

function Maps (ref) {
  this._data = maps
  this._categories = maps.categories
  this.setCurrent(ref)
}

/**
 * setCurrent
 * @param {string} ref The ref of either a category or map. If a category ref is passed, the first map in that category is used.
 */
Maps.prototype.setCurrent = function (ref) {
  // Work out the current category and map
  var category, map, defaultCategory, defaultMap
  for (var i = 0; i < this._categories.length; i++) {
    category = this._categories[i]
    if (i === 0) {
      defaultCategory = category
    }

    if (category.ref === ref) {
      this.currMap = category.maps[0]
      this.currCategory = category
      return
    }

    for (var j = 0; j < category.maps.length; j++) {
      map = category.maps[j]
      if (i === 0 && j === 0) {
        defaultMap = map
      }

      if (map.ref === ref) {
        this.currMap = map
        this.currCategory = category
        return
      }
    }
  }

  this.currMap = defaultMap
  this.currCategory = defaultCategory
}

module.exports = Maps
