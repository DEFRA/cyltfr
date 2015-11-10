var Lab = require('lab')
var Code = require('code')

var serverFunction = require('../lib/server')

var lab = exports.lab = Lab.script()

lab.experiment('addressByPostcode', function (done) {
  var options = [{
    url: '/addressbypostcode/M67PW',
    method: 'GET'
  }, {
    url: '/addressbypostcode/',
    method: 'GET'
  }, {
    url: '/khsgfdjsfd/sdfds',
    method: 'GET'
  }]

  var server

  lab.before(function (done) {
    // server start is async so call it in before
    serverFunction(function (ret) {
      server = ret
      done()
    })
  })

  lab.test('Makes the request successfully', function (done) {
    server.inject(options[0], function (response) {
      Code.expect(response.statusCode).to.equal(200)
      done()
    })
  })

  lab.test('Makes postcode request with no param', function (done) {
    server.inject(options[1], function (response) {
      Code.expect(response.statusCode).to.equal(404)
      done()
    })
  })

  lab.test('Makes request to unknown url', function (done) {
    server.inject(options[2], function (response) {
      Code.expect(response.statusCode).to.equal(404)
      done()
    })
  })
})
