const DataStore = require('./dataStore.js')
const fs = require('fs')
const path = require('path')

class FileDataStore extends DataStore {
  constructor (filepath, filename) {
    const data = fs.readFileSync(path.join(filepath, filename))
    const jsonData = JSON.parse(data)
    super(jsonData)
    this._filepath = filepath
    this.loadFeatureData()
  }

  loadIndividualFeature (item) {
    const key = item.keyname
    const data = fs.readFileSync(path.join(this._filepath, key))
    const jsonData = JSON.parse(data)
    jsonData.parent = item
    return jsonData
  }
}

module.exports = FileDataStore
