var Lab = require('lab')
var Code = require('code')
var lab = exports.lab = Lab.script()
var composeServer = require('../../')

lab.experiment('Integration', function () {
  var server

  // Make a server before the tests
  lab.before(done => {
    console.log('Creating server')
    composeServer(function (err, result) {
      if (err) {
        return done(err)
      }

      server = result
      server.initialize(done)
    })
  })

  lab.after((done) => {
    console.log('Stopping server')
    server.stop(done)
  })

  var urls = [
    '/floodrisk/391416/102196/20'
  ]

  urls.forEach(function (url) {
    lab.test(url, function (done) {
      var options = {
        method: 'GET',
        url: url
      }

      server.inject(options, function (response) {
        Code.expect(response.statusCode).to.equal(200)
        done()
      })
    })
  })
})
