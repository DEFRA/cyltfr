/*
 * TODO: Replace with real postcode lookup implementation
 */
function lookup (postcode, callback) {
  var data = [
    { id: 1, text: 'Buckingham Palace, Buckingamshire, London. L1 1XX' },
    { id: 2, text: 'Old Trafford, Stretford, Manchester. M1 1TT' },
    { id: 3, text: 'Wembley Stadium, Wembley, London. L4 1YX' },
    { id: 4, text: 'Richard Fairclough House, Latchford, Warrington. WA14 1EP' }
  ]

  process.nextTick(function () {
    callback(null, data)
  })
}

module.exports = lookup
