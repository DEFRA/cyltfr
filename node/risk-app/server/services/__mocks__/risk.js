const riskService = jest.createMockFromModule('../risk')

const returnValue = {
  inEngland: true,
  isGroundwaterArea: false,
  floodAlertArea: [],
  floodWarningArea: [],
  inFloodAlertArea: false,
  inFloodWarningArea: false,
  leadLocalFloodAuthority: 'Cheshire West and Chester',
  reservoirRisk: null,
  riverAndSeaRisk: null,
  surfaceWaterRisk: 'Very Low',
  surfaceWaterSuitability: 'County to Town',
  extraInfo: null
}

riskService.__updateReturnValue = function (newValue) {
  Object.keys(newValue).forEach(function (key) {
    returnValue[key] = newValue[key]
  })
  return returnValue
}

riskService.getByCoordinates.mockImplementation((_x, _y, _radius) => {
  return Promise.resolve(returnValue)
})

module.exports = riskService
