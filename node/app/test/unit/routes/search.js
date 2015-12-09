var Lab = require('lab')
var Code = require('code')
var Sinon = require('sinon')
var server = require('../../../lib/server')
var service = require('../../../lib/services/address')
var lab = exports.lab = Lab.script()
var it = lab.it
var beforeEach = lab.beforeEach
var afterEach = lab.afterEach
var expect = Code.expect
var addresses = [
  {
    id: '564204688f0978d4c6c5962b', text: '1 Beechmill Drive, Wigan, Lancashire. L12 5TH',
    postcode: 'M15 5TN', easting: 330000, northing: 558000
  },
  {
    id: '564203b38f0978d4c6628c6e', text: 'Buckingham Palace, Buckingamshire, London. L1 1XX',
    postcode: 'L1 1LN', easting: 528000, northing: 224000
  },
  {
    id: '564203d88f0978d4c6763d59', text: 'Old Trafford, Stretford, Manchester. M1 1TT',
    postcode: 'CW7 3RH', easting: 366000, northing: 444000
  },
  {
    id: '5642040c8f0978d4c6926cd5', text: 'Wembley Stadium, Wembley, London. L4 1YX',
    postcode: 'CW8 4BH', easting: 510000, northing: 216000
  },
  {
    id: '564204668f0978d4c6c44972', text: 'Richard Fairclough House, Latchford, Warrington. WA14 1EP',
    postcode: 'WA14 1EP', easting: 358000, northing: 406000
  },
  {
    id: '5642043b8f0978d4c6ac2bef', text: 'Station House, Latchford, Warrington. WA14 1EP',
    postcode: 'WA14 1EP', easting: 358000, northing: 406000
  }
]

lab.experiment('Requesting the postcode `search` page', function () {
  var options = {
    url: '/search?postcode=WA14 1EP',
    method: 'GET'
  }

  var stub

  beforeEach(function (done) {
    stub = Sinon.stub(service, 'findByPostcode')
    done()
  })

  afterEach(function (done) {
    stub.restore()
    done()
  })

  it('triggers a successful call to the `addressService.findByPostcode` function', function (done) {
    // Instruct the stub to call the callback
    // function with two arguments, (null, addresses)
    stub.callsArgWithAsync(1, null, addresses)

    // Make the server call
    server.inject(options, function (response) {
      // Check for successful response
      expect(response.statusCode).to.equal(200)

      // Check the stub was called with the correct arguments
      var args = stub.getCall(0).args
      expect(args).length(2)
      expect(args[0]).to.equal('WA14 1EP')
      expect(args[1]).to.be.a.function()
      expect(stub.withArgs('WA14 1EP').calledOnce).to.equal(true)

      done()
    })
  })

  it('triggers an unsuccessful call to the `addressService.findByPostcode` function', function (done) {
    // Instruct the stub to call the callback
    // function with one error argument (err)
    stub.callsArgWithAsync(1, new Error('Service failed'))

    // Make the server call
    server.inject(options, function (response) {
      // Check for successful response
      expect(response.statusCode).to.equal(400)

      // Check the stub was called with the correct arguments
      var args = stub.getCall(0).args
      expect(args).length(2)
      expect(args[0]).to.equal('WA14 1EP')
      expect(args[1]).to.be.an.function()
      expect(stub.withArgs('WA14 1EP').calledOnce).to.equal(true)

      done()
    })
  })

  it('triggers an successful call to the `addressService.findByPostcode` function. No results found', function (done) {
    // Instruct the stub to call the callback
    // function with two arguments, (null, [])
    stub.callsArgWithAsync(1, null, [])

    // Make the server call
    server.inject(options, function (response) {
      // Check for successful response
      expect(response.statusCode).to.equal(200)
      done()
    })
  })
})

lab.experiment('Requesting the postcode `search` page without a postcode', function () {
  var options = {
    url: '/search',
    method: 'GET'
  }

  it('fails the joi validation', function (done) {
    server.inject(options, function (response) {
      // Check for unsuccessful response
      expect(response.statusCode).to.equal(400)
      done()
    })
  })
})
