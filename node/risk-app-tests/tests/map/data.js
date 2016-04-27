const data = {
  addresses: [{
    addressId: '100011400873',
    easting: '378426',
    northing: '400345'
  }],
  mapTypes: [{
    ref: 'RiversOrSea',
    maps: [{
      ref: 'RiversOrSea_1-ROFRS'
    }, {
      ref: 'RiversOrSea_2-FWLRSF'
    }]
  }, {
    ref: 'SurfaceWater',
    maps: [{
      ref: 'SurfaceWater_6-SW-Extent'
    }, {
      ref: 'SurfaceWater_9-SWDH'
    }, {
      ref: 'SurfaceWater_12-SWVH'
    }, {
      ref: 'SurfaceWater_8-SWDM'
    }, {
      ref: 'SurfaceWater_11-SWVM'
    }, {
      ref: 'SurfaceWater_7-SWDL'
    }, {
      ref: 'SurfaceWater_10-SWVL'
    }]
  }, {
    ref: 'Reservoirs',
    maps: [{
      ref: 'Reservoirs_3-ROFR'
    }, {
      ref: 'Reservoirs_4-DOFR'
    }, {
      ref: 'Reservoirs_5-SOFR'
    }]
  }]
}

module.exports = data
