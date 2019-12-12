
const fs = require('fs')
const util = require('util')
const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const ogr2ogr = require('ogr2ogr')
const moment = require('moment-timezone')
const rename = util.promisify(fs.rename)

module.exports = {
  method: 'POST',
  path: '/shp2json',
  handler: async (request, h) => {
    const { geometry } = request.payload

    try {
      const tmpfile = geometry.path
      const zipfile = tmpfile + '.zip'
      await rename(tmpfile, zipfile)

      const geojson = await ogr2ogr(zipfile, 'ESRI Shapefile')
        .format('GeoJSON')
        .promise()

      // var geojson = {"type":"FeatureCollection","name":"Functionality 2","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG::27700"}},"features":[{"type":"Feature","properties":{"Id":0,"Start_date":"2019/09/01","End_date":"2020/03/30","inclusion":"yes","contact":"WSX PSO","live_date":"0219/09/01","rem_date":"2020/03/30","evidence":"Asset improvements","display2":"There are improvements to the flood defences in this area, we expect the flood liklihood in this area to change on 1 April 2020"},"geometry":{"type":"Polygon","coordinates":[[[374405.28611047845,164717.59705888666],[374510.223426057,164592.1285293866],[374676.7543833861,164573.87856146507],[374843.285340718,164478.0662298482],[374971.03511620406,164418.75383408368],[375114.75361362845,164361.72268431634],[375192.31597731635,164352.5977003537],[375331.4719827557,164348.0352083724],[375308.6595228482,164491.753705794],[375324.62824478373,164646.87843316793],[375237.9408971304,164788.3156845998],[375180.90974735934,164888.69050819613],[375178.6285013687,164929.7529360298],[375281.28457095753,164957.12788791955],[375322.3469987931,164934.31542801112],[375406.75310045294,164749.53450275585],[375482.0342181502,164635.47220321558],[375513.9716620222,164539.6598715987],[375470.627988196,164430.1600640379],[375452.3780202698,164300.1290425621],[375383.94064054545,164231.69166283868],[375221.9721751958,164186.06674301997],[375016.66003602184,164195.1917269826],[374866.09780062735,164240.8166468013],[374679.03562937677,164350.31645436212],[374519.3484100206,164457.53501593135],[374437.22355435137,164521.40990367346],[374364.2236826448,164589.8472834006],[374307.19253287464,164614.94098929875],[374405.28611047845,164717.59705888666]]]}},{"type":"Feature","properties":{"Id":0,"Start_date":"2019/09/01","End_date":"2020/03/30","inclusion":"yes","contact":"WSX PSO","live_date":"0219/09/01","rem_date":"2020/03/30","evidence":"Asset improvements","display2":"There are improvements to the flood defences in this area, we expect the flood liklihood in this area to change on 1 April 2020"},"geometry":{"type":"Polygon","coordinates":[[[374405.28611047845,164717.59705888666],[374510.223426057,164592.1285293866],[374676.7543833861,164573.87856146507],[374843.285340718,164478.0662298482],[374971.03511620406,164418.75383408368],[375114.75361362845,164361.72268431634],[375192.31597731635,164352.5977003537],[375331.4719827557,164348.0352083724],[375308.6595228482,164491.753705794],[375324.62824478373,164646.87843316793],[375237.9408971304,164788.3156845998],[375180.90974735934,164888.69050819613],[375178.6285013687,164929.7529360298],[375281.28457095753,164957.12788791955],[375322.3469987931,164934.31542801112],[375406.75310045294,164749.53450275585],[375482.0342181502,164635.47220321558],[375513.9716620222,164539.6598715987],[375470.627988196,164430.1600640379],[375452.3780202698,164300.1290425621],[375383.94064054545,164231.69166283868],[375221.9721751958,164186.06674301997],[375016.66003602184,164195.1917269826],[374866.09780062735,164240.8166468013],[374679.03562937677,164350.31645436212],[374519.3484100206,164457.53501593135],[374437.22355435137,164521.40990367346],[374364.2236826448,164589.8472834006],[374307.19253287464,164614.94098929875],[374405.28611047845,164717.59705888666]]]}}]}

      geojson.features.forEach(f => {
        const props = f.properties

        f.properties = {
          start: props.Start_date
            ? moment(props.Start_date, 'YYYY/MM/DD').format('YYYY-MM-DD')
            : '',
          end: props.End_date
            ? moment(props.End_date, 'YYYY/MM/DD').format('YYYY-MM-DD')
            : '',
          info: props.display2
        }
      })

      return geojson
    } catch (err) {
      return boom.badRequest(err.message)
    }
  },
  options: {
    payload: {
      maxBytes: 209715200,
      output: 'file',
      parse: true,
      allow: 'multipart/form-data'
    },
    validate: {
      payload: joi.object().keys({
        geometry: joi.object().keys({
          bytes: joi.number().greater(0).required(),
          filename: joi.string().required(),
          headers: joi.object().required(),
          path: joi.string().required()
        }).required()
      })
    },
    app: {
      useErrorPages: false
    }
  }
}
