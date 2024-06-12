const FileDataStore = require('../fileDataStore.js')

describe('/FileDataStore test', () => {
  let fileDataStore

  beforeAll(() => {
    fileDataStore = new FileDataStore('./server/services/__tests__/data', 'manifest.json')
  })
  test('loads the manifest file', async () => {
    const matchingData = fileDataStore.featuresAtPoint(374676.7543833861, 164573.87856146507, true)
    console.log(matchingData)
  })
})
