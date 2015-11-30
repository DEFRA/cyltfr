function Address (doc) {
  this._id = doc._id
  this.uprn = doc.UPRN
  this.objectId = doc.OBJECTID
  this.buildingNumber = doc.BLDGNUMBER
  this.buildingName = doc.BLDGNAME
  this.subBuildingName = doc.SUBBLDGNAME
  this.organisation = doc.ORGANISATION
  this.department = doc.DEPARTMENT
  this.thoroughfare = doc.THOROUGHFARE
  this.locality = doc.LOCALITY
  this.posttown = doc.POSTTOWN
  this.postcode = doc.POSTCODE
  this.easting = doc.EASTING
  this.northing = doc.NORTHING

  // Full address
  this.fullAddress = (this.buildingName || '')
  if (this.buildingNumber) {
    this.fullAddress += ' ' + this.buildingNumber
  }
  if (this.subBuildingName) {
    this.fullAddress += ' ' + this.subBuildingName
  }
  if (this.thoroughfare) {
    this.fullAddress += ' ' + this.thoroughfare
  }
  if (this.locality) {
    this.fullAddress += ' ' + this.locality
  }
  if (this.posttown) {
    this.fullAddress += ' ' + this.posttown
  }
  if (this.postcode) {
    this.fullAddress += ' ' + this.postcode
  }
}

module.exports = Address
