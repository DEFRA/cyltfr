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

    // select each map from basic view
    data.mapTypes.forEach(function (item) {
      mapPage.selectMap(item.ref)

      // check selected
      mapTests.assertMapParentSelected(mapPage, item.ref)

      // check others not selected
      data.mapTypes.forEach(function (i) {
        if (i !== item) {
          mapTests.assertMapParentNotSelected(mapPage, i.ref)
        }
      })
    })

    // assert is basic view
    mapTests.assertIsBasicView(mapPage)

    // switch to advanced view
    mapPage.toggleDetailed()

    // assert detailed view visible
    mapTests.assertIsDetailedView(mapPage)

    // select each map from advanced view

    // return to basic view
    mapPage.toggleDetailed()
    mapTests.assertIsBasicView(mapPage)

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
