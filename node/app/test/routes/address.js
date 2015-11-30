var Lab = require('lab')
var Code = require('code')
var proxyquire = require('proxyquire')
var service = require('../lib/service/address')
var lab = exports.lab = Lab.script()
var it = lab.it
var beforeEach = lab.beforeEach
var afterEach = lab.afterEach
var expect = Code.expect

lab.experiment('findById', function () {
  var options = {
    url: '/fwa/gps/json',
    method: 'GET'
  }

  var stub

  beforeEach(function (done) {
    stub = Sinon.stub(service, 'getAllCurrentFloodAlertsAndWarnings')
    done()
  })

  afterEach(function (done) {
    stub.restore()
    done()
  })

  it('Makes the request successfully', function (done) {
    var result = {
      rows: [{ some: 'data' }]
    }
    stub.callsArgWithAsync(1, null, result)

    server.inject(options, function (response) {
      var data = response.result
      var args = stub.getCall(0).args
      expect(args).length(2)
      expect(data).to.be.an.array()
      expect(data).length(1)
      expect(data[0].some).to.be.equal('data')
      done()
    })
  })

  it('Fails to make the request successfully', function (done) {
    var err = new Error()
    stub.callsArgWithAsync(1, err)

    server.inject(options, function (response) {
      expect(response.statusCode).to.equal(400)

      var args = stub.getCall(0).args
      expect(args).length(2)

      var data = response.result
      expect(data.error).to.equal('Bad Request')

      done()
    })
  })
})
