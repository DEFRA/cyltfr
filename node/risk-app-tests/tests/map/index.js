var mapTests = require('../../common/map')
var data = require('./data.js')

module.exports = {
  'vanilla-map': function (client) {
    var mapPage = client.page.map()

    // load the map with no parameters
    mapTests.loadPageNoParams(mapPage)

    // assert that the return to risk page with address link is hidden
    mapTests.assertRiskAddressHidden(mapPage)

    // assert we have the correct map visible
    mapTests.assertMapParentSelected(mapPage, data.mapTypes[0].ref)
    mapTests.assertMapParentNotSelected(mapPage, data.mapTypes[1].ref)
    mapTests.assertMapParentNotSelected(mapPage, data.mapTypes[2].ref)

    // kill
    client.end()
  },
  'parameterised-map': function (client) {
    data.addresses.forEach(function (item) {
      var mapPage = client.page.map()

      // load map with data parameters
      mapTests.loadPageWithParams(mapPage, item.addressId, item.easting, item.northing)

      // assert risk address link visible
      mapTests.assertRiskAddressVisible(mapPage)

      // assert we have the default map visible
      mapTests.assertMapParentSelected(mapPage, data.mapTypes[0].ref)
      mapTests.assertMapParentNotSelected(mapPage, data.mapTypes[1].ref)
      mapTests.assertMapParentNotSelected(mapPage, data.mapTypes[2].ref)
    })

    // kill
    client.end()
  },
  'parameterised-map-with-type': function (client) {
    data.mapTypes.forEach(function (item) {
      var mapPage = client.page.map()

      // load map with a type
      mapTests.loadPageWithParams(mapPage, data.addresses[0].addressId, data.addresses[0].easting, data.addresses[0].northing, item.ref)

      // assert risk address link visible
      mapTests.assertRiskAddressVisible(mapPage)

      // assert we have the correct map visible
      mapTests.assertMapParentSelected(mapPage, item.ref)

      data.mapTypes.forEach(function (i) {
        if (i !== item) {
          mapTests.assertMapParentNotSelected(mapPage, i.ref)
        }
      })
    })
    // kill
    client.end()
  }
}
