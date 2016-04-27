var mapTests = require('../../common/map')
var data = require('./data.js')
module.exports = {
  'beforeEach': function (client) {
    // Force browser to pretendo-mobile
    // client.resizeWindow(300, 600)
  },
  'vanilla-map': function (client) {
    var mapPage = client.page.map()
    // load the map with no parameters
    mapTests.loadPageNoParams(mapPage)

    // client.execute(function() {
    //   alert('injected')
    // })

    // assert that the return to risk page with address link is hidden
    mapTests.assertRiskAddressHidden(mapPage)

    mapPage.isMobile(function (isMobile) {
      if (!isMobile) {
        // assert we have the correct map visible
        mapTests.assertMapSelected(mapPage, data.mapTypes[0].ref)
        mapTests.assertMapNotSelected(mapPage, data.mapTypes[1].ref)
        mapTests.assertMapNotSelected(mapPage, data.mapTypes[2].ref)

        // select each map from basic view
        data.mapTypes.forEach(function (item) {
          mapPage.selectMap(item.ref)

          // check selected TODO, this is flakey need to test map for visible layer
          mapTests.assertMapSelected(mapPage, item.ref)

          // check others not selected
          data.mapTypes.forEach(function (i) {
            if (i !== item) {
              mapTests.assertMapNotSelected(mapPage, i.ref)
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
        data.mapTypes.forEach(function (item) {
          item.maps.forEach(function (i) {
            // click the map child
            mapPage.selectMap(i.ref)

            // assert child gets selected class TODO, this is flakey need to test map for visible layer
            mapTests.assertMapSelected(mapPage, i.ref)
          })
        })

        // return to basic view
        mapPage.toggleDetailed()
        mapTests.assertIsBasicView(mapPage)
      } else {
        // do Mobile version of tests

        // assert we have the correct map visible

        data.mapTypes.forEach(function (item) {
          item.maps.forEach(function (map) {
            // select map from drop down
            mapPage.selectMapMobile(map.ref)

          // assert correct map selected
          })
        })
      }
    })
    client.end()
  },
  'parameterised-map': function (client) {
    data.addresses.forEach(function (item) {
      var mapPage = client.page.map()

      // load map with data parameters
      mapTests.loadPageWithParams(mapPage, item.addressId, item.easting, item.northing)

      // assert risk address link visible
      mapTests.assertRiskAddressVisible(mapPage)

      mapPage.isMobile(function (isMobile) {
        if (!isMobile) {
          // assert we have the default map visible
          mapTests.assertMapSelected(mapPage, data.mapTypes[0].ref)
          mapTests.assertMapNotSelected(mapPage, data.mapTypes[1].ref)
          mapTests.assertMapNotSelected(mapPage, data.mapTypes[2].ref)
        }
      })
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

      mapPage.isMobile(function (isMobile) {
        if (!isMobile) {
          // assert we have the correct map visible
          mapTests.assertMapSelected(mapPage, item.ref)

          data.mapTypes.forEach(function (i) {
            if (i !== item) {
              mapTests.assertMapNotSelected(mapPage, i.ref)
            }
          })
        }
      })
    })
    // kill
    client.end()
  }
}
