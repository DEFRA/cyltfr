
const fs = require('fs')
const util = require('util')
const joi = require('joi')
const boom = require('@hapi/boom')
const ogr2ogr = require('ogr2ogr').default
const moment = require('moment-timezone')
const rename = util.promisify(fs.rename)

module.exports = {
  method: 'POST',
  path: '/shp2json/{type}',
  handler: async (request, h) => {
    const { payload, params } = request
    console.log('payload:', payload)
    console.log('params:', params)
    const { geometry } = payload
    console.log('geometry:', geometry)

    try {
      const tmpfile = geometry.path
      const zipfile = tmpfile + '.zip'
      await rename(tmpfile, zipfile)

      const { data: geojson } = await ogr2ogr(zipfile)

      geojson.features.forEach(f => {
        const props = f.properties

        f.properties = {
          apply: params.type,
          start: props.Start_date
            ? moment(props.Start_date, 'YYYY/MM/DD').format('YYYY-MM-DD')
            : '',
          end: props.End_date
            ? moment(props.End_date, 'YYYY/MM/DD').format('YYYY-MM-DD')
            : '',
          info: props.display2 || props.Data_Type || ''
        }
      })

      return geojson
    } catch (err) {
      return boom.badRequest(err.message, err)
    }
  },
  options: {
    payload: {
      maxBytes: 209715200,
      output: 'file',
      parse: true,
      allow: 'multipart/form-data',
      multipart: true
    },
    validate: {
      params: joi.object().keys({
        type: joi.string().valid('holding', 'llfa').required()
      }),
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
