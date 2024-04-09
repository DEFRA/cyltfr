const STATUS_CODES = require('http2').constants
const createServer = require('../../../server')
const db = require('../../db')
const options = {
  method: 'GET',
  url: '/floodrisk/391416/102196/20'
}

jest.mock('../../db')
let server

describe('Unit tests - /floodrisk', () => {
  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('Normal get returns the payload', async () => {
    db.__queryResult([
      {
        calculate_flood_risk: {
          in_england: true,
          flood_alert_area: null,
          flood_warning_area: null,
          rofrs_risk: null,
          surface_water_risk: 'Very Low',
          reservoir_risk: null,
          surface_water_suitability: 'County to Town',
          lead_local_flood_authority: 'Cheshire West and Chester',
          extra_info: null
        }
      }
    ])

    const response = await server.inject(options)
    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
  })

  test('/floodrisk/{x}/{y}/{radius} - Throws db error', async () => {
    db.query.mockImplementationOnce(() => { throw new Error('Mock Error') })
    const response = await server.inject(options)
    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_BAD_REQUEST)
  })

  test('/floodrisk/{x}/{y}/{radius} - No db result', async () => {
    db.__queryResult([])

    const response = await server.inject(options)
    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_BAD_REQUEST)
  })

  test('/floodrisk/{x}/{y}/{radius} - Valid db result', async () => {
    const options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    db.__queryResult([
      {
        calculate_flood_risk: {
          in_england: true,
          flood_alert_area: [
            '033WAF204'
          ],
          flood_warning_area: [
            '033FWF3AVON013'
          ],
          rofrs_risk: {
            prob_4band: 'Medium',
            suitability: 'Street to Parcels of land',
            risk_for_insurance_sop: 'Yes'
          },
          surface_water_risk: 'High',
          reservoir_risk: [
            {
              resname: 'Draycote Water',
              risk_desig: 'High Risk',
              location: '445110, 270060',
              ut_company: 'Severn Trent Water Authority',
              ea_area: 'Environment Agency - Staffordshire, Warwickshire and West Midlands',
              llfa_name: 'Warwickshire',
              comments: 'If you have questions about local emergency plans for this reservoir you should contact the named Local Authority'
            }
          ],
          surface_water_suitability: 'County to Town',
          lead_local_flood_authority: 'Warwickshire',
          extra_info: null
        }
      }
    ])

    const response = await server.inject(options)
    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
  })

  test('/floodrisk/{x}/{y}/{radius} - Invalid db result', async () => {
    db.__queryResult([{ error_result: '' }])

    const response = await server.inject(options)
    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_BAD_REQUEST)
  })

  test('/floodrisk/{x}/{y}/{radius} - Groundwater alert result', async () => {
    db.__queryResult([
      {
        calculate_flood_risk: {
          in_england: true,
          flood_alert_area: [
            '033WAG204'
          ],
          flood_warning_area: [
            '033FWF3AVON013'
          ],
          rofrs_risk: {
            prob_4band: 'Medium',
            suitability: 'Street to Parcels of land',
            risk_for_insurance_sop: 'Yes'
          },
          surface_water_risk: 'High',
          reservoir_risk: [
            {
              resname: 'Draycote Water',
              risk_desig: 'High Risk',
              location: '445110, 270060',
              ut_company: 'Severn Trent Water Authority',
              ea_area: 'Environment Agency - Staffordshire, Warwickshire and West Midlands',
              llfa_name: 'Warwickshire',
              comments: 'If you have questions about local emergency plans for this reservoir you should contact the named Local Authority'
            }
          ],
          surface_water_suitability: 'County to Town',
          lead_local_flood_authority: 'Warwickshire',
          extra_info: null
        }
      }
    ])

    const response = await server.inject(options)
    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
  })

  test('/floodrisk/{x}/{y}/{radius} - Groundwater warning result', async () => {
    db.__queryResult([
      {
        calculate_flood_risk: {
          in_england: true,
          flood_alert_area: [
            '033WAF204'
          ],
          flood_warning_area: [
            '033FWG3AVON013'
          ],
          rofrs_risk: {
            prob_4band: 'Medium',
            suitability: 'Street to Parcels of land',
            risk_for_insurance_sop: 'Yes'
          },
          surface_water_risk: 'High',
          reservoir_risk: [
            {
              resname: 'Draycote Water',
              risk_desig: 'High Risk',
              location: '445110, 270060',
              ut_company: 'Severn Trent Water Authority',
              ea_area: 'Environment Agency - Staffordshire, Warwickshire and West Midlands',
              llfa_name: 'Warwickshire',
              comments: 'If you have questions about local emergency plans for this reservoir you should contact the named Local Authority'
            }
          ],
          surface_water_suitability: 'County to Town',
          lead_local_flood_authority: 'Warwickshire',
          extra_info: null
        }
      }
    ])

    const response = await server.inject(options)
    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
  })

  test('/floodrisk/{x}/{y}/{radius} - Groundwater area error', async () => {
    db.__queryResult([
      {
        calculate_flood_risk: {
          in_england: true,
          flood_alert_area: 'Error',
          flood_warning_area: 'Error'
        }
      }
    ])

    const response = await server.inject(options)
    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
  })

  test('/floodrisk/{x}/{y}/{radius} - Extra info error', async () => {
    db.__queryResult([
      {
        calculate_flood_risk: {
          in_england: true,
          flood_alert_area: [
            '033WAF204'
          ],
          flood_warning_area: [
            '033FWG3AVON013'
          ],
          rofrs_risk: {
            prob_4band: 'Medium',
            suitability: 'Street to Parcels of land',
            risk_for_insurance_sop: 'Yes'
          },
          surface_water_risk: 'High',
          reservoir_risk: [
            {
              resname: 'Draycote Water',
              risk_desig: 'High Risk',
              location: '445110, 270060',
              ut_company: 'Severn Trent Water Authority',
              ea_area: 'Environment Agency - Staffordshire, Warwickshire and West Midlands',
              llfa_name: 'Warwickshire',
              comments: 'If you have questions about local emergency plans for this reservoir you should contact the named Local Authority'
            }
          ],
          surface_water_suitability: 'County to Town',
          lead_local_flood_authority: 'Warwickshire',
          extra_info: 'Error'
        }
      }
    ])

    const response = await server.inject(options)
    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
  })

  test('/floodrisk/{x}/{y}/{radius} - Extra info result', async () => {
    db.__queryResult([
      {
        calculate_flood_risk: {
          in_england: true,
          flood_alert_area: [
            '033WAF204'
          ],
          flood_warning_area: [
            '033FWG3AVON013'
          ],
          rofrs_risk: {
            prob_4band: 'Medium',
            suitability: 'Street to Parcels of land',
            risk_for_insurance_sop: 'Yes'
          },
          surface_water_risk: 'High',
          reservoir_risk: [
            {
              resname: 'Draycote Water',
              risk_desig: 'High Risk',
              location: '445110, 270060',
              ut_company: 'Severn Trent Water Authority',
              ea_area: 'Environment Agency - Staffordshire, Warwickshire and West Midlands',
              llfa_name: 'Warwickshire',
              comments: 'If you have questions about local emergency plans for this reservoir you should contact the named Local Authority'
            }
          ],
          surface_water_suitability: 'County to Town',
          lead_local_flood_authority: 'Warwickshire',
          extra_info: [{
            info: '',
            apply: 'holding',
            riskoverride: 'Low'
          },
          {
            info: '',
            apply: 'holding',
            riskoverride: 'Do not override'
          },
          {
            info: 'There are improvements to the flood defences in this area, we expect the flood liklihood in this area to change on 1 April 2020',
            apply: 'holding',
            riskoverride: 'Do not override'
          },
          {
            info: 'Some improvements to the flood defences in this area, we expect the flood liklihood in this area to change on 1 April 2020',
            apply: 'holding',
            riskoverride: 'Do not override'
          },
          {
            info: 'Proposed schemes',
            apply: 'llfa',
            riskoverride: null
          },
          {
            info: 'Flood action plan',
            apply: 'llfa',
            riskoverride: 'Do not override'
          }]
        }
      }
    ])

    const response = await server.inject(options)
    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
    expect(response.payload).toMatch('"surfaceWaterRisk":"Low"')
  })
})
