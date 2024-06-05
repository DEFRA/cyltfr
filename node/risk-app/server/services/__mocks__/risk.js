const riskService = jest.createMockFromModule('../risk')

const originalReturnValue = {
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
let returnValue = { ...originalReturnValue }

riskService.__updateReturnValue = function (newValue) {
  console.log('here')
  Object.keys(newValue).forEach(function (key) {
    returnValue[key] = newValue[key]
  })
  console.log(returnValue)
  return returnValue
}

riskService.__resetReturnValue = function () {
  returnValue = { ...originalReturnValue }
}

riskService.getByCoordinates.mockImplementation((_x, _y, _radius) => {
  return Promise.resolve(returnValue)
})

module.exports = riskService
