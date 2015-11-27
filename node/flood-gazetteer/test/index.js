var Lab = require('lab')
var Code = require('code')

var serverFunction = require('../lib/server')

var lab = exports.lab = Lab.script()

lab.experiment('addressByPostcode', function (done) {
  var options = [{
    url: '/addressbypostcode/wa4%201ht',
    method: 'GET'
  }, {
    url: '/addressbypostcode/',
    method: 'GET'
  }, {
    url: '/khsgfdjsfd/sdfds',
    method: 'GET'
  }, {
    url: '/addressbypostcode/WA41HT',
    method: 'GET'
  }, {
    url: '/postcodes/m67',
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

  // addressByPostcode
  lab.test('Makes a successful request with a lower case postcode with a space and gets 15 results', function (done) {
    server.inject(options[0], function (response) {
      Code.expect(response.statusCode).to.equal(200)
      Code.expect(response.result.length).to.equal(15)
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

  lab.test('Makes a successful request with an upper case postcode with no space and gets 15 results', function (done) {
    server.inject(options[3], function (response) {
      Code.expect(response.statusCode).to.equal(200)
      Code.expect(response.result.length).to.equal(15)
      done()
    })
  })

  // postcodes
  lab.test('Makes a successful request for partial postcode', function (done) {
    server.inject(options[4], function (response) {
      Code.expect(response.statusCode).to.equal(200)
      Code.expect(response.result.length).to.equal(181)
      done()
    })
  })
})
