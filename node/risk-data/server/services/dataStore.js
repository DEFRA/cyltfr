const { point } = require('@turf/helpers')
const booleanPointInPolygon = require('@turf/boolean-point-in-polygon').default

class DataStore {
  // list of all the extra_info data
  constructor (manifestJson) {
    this._originalManifest = manifestJson
    this._featureDataLoaded = false
  }

  loadFeatureData () {
    this._originalManifest.forEach((item) => {
      const featureData = this.loadIndividualFeature(item)
      item.features = featureData
    })
    this._featureDataLoaded = true
  }

  loadIndividualFeature (item) {

  }

  featuresAtPoint (x, y, approvedOnly) {
    if (!this._featureDataLoaded) {
      this.loadFeatureData()
    }
    const pointToCheck = point([x, y])
    const dataToCheck = approvedOnly ? this._originalManifest.filter((item) => { return item.approvedBy ? item : null }) : this._originalManifest
    const dataToReturn = []
    dataToCheck.forEach((item) => {
      item.features.features.forEach((feature) => {
        // if (!feature.polygon) {
        //   feature.polygon = polygon(feature.geometry.coordinates)
        // }
        if (booleanPointInPolygon(pointToCheck, feature)) {
          dataToReturn.push([item, feature])
        }
      })
    })
    return dataToReturn
  }
}

module.exports = DataStore
