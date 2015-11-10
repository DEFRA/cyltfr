var moment = require('moment')
var Sprintf = require('sprintf-js')

function splitMe (value, delimiter, arrayValue) {
  return value.split(delimiter)[arrayValue]
}

function toFixed (value, dp) {
  // return parseFloat(value).toFixed(dp)
  return Number(Math.round(value + 'e' + dp) + 'e-' + dp)
}

function eachWhen (list, k, v, opts) {
  var i
  var result = ''
  for (i = 0; i < list.length; ++i) {
    if (list[i][k] === v) {
      result = result + opts.fn(list[i])
    }
  }

  return result
}

function formatDate (date, format) {
  return moment(new Date(date)).format(format)
}

function dateDiff (date1, date2) {
  return moment(date1).diff(moment(date2), 'days')
}

function pluraliseDescription (severity, count, tagMe) {
  var descriptions = [
    '', // wipe out 0 based value :)
    '%ssevere flood warning<<plural>>%s - severe flooding. Danger to life.%s',
    '%sflood warning<<plural>>%s - flooding is expected. Immediate action required.%s',
    '%sflood alert<<plural>>%s - flooding is possible. Be prepared.%s',
    '%swarning<<plural>> no longer in force%s - flood warnings and flood alerts removed in the last 24 hours.%s'
  ]

  // replace %s with html tags
  var description
  if (tagMe) {
    description = Sprintf.vsprintf(descriptions[severity], ['', '<span>', '</span>'])
  } else {
    description = Sprintf.vsprintf(descriptions[severity], ['', '', ''])
  }

  // return the value pluralised
  return count === 1 ? capitalise(description.replace('<<plural>>', '')) : capitalise(description.replace('<<plural>>', 's'))
}

function capitalise (str) {
  return str && str[0].toUpperCase() + str.slice(1)
}

function summariseCount (summaryWarnings) {
  var index
  var total = 0

  for (index = 0; index < 3; index++) {
    total = total + summaryWarnings[index].count
  }

  switch (total) {
    case 0:
      return 'are currently no warnings'
    case 1:
      return 'is currently 1 warning'
    default:
      return 'are currently ' + total + ' warnings'
  }
}

function group (list, options) {
  options = options || {}

  var fn = options.fn || noop
  var inverse = options.inverse || noop
  var hash = options.hash
  var prop = hash && hash.by
  var keys = []
  var groups = {}

  if (!prop || !list || !list.length) {
    return inverse(this)
  }

  function groupKey (item) {
    var key = get(item, prop)

    if (keys.indexOf(key) === -1) {
      keys.push(key)
    }

    if (!groups[key]) {
      groups[key] = {
        value: key,
        items: []
      }
    }

    groups[key].items.push(item)
  }

  function renderGroup (buffer, key) {
    return buffer + fn(groups[key])
  }

  list.forEach(groupKey)

  return keys.reduce(renderGroup, '')
}

function get (obj, prop) {
  var parts = prop.split('.')
  var last = parts.pop()

  while ((prop = parts.shift())) {
    obj = obj[prop]

    if (obj === null) {
      return
    }
  }

  return obj[last]
}

function noop () {
  return ''
}

function bannerClass (bannerData) {
  // set the class for the banner styling
  var warnings = bannerData.summaryWarnings[0].count + bannerData.summaryWarnings[1].count
  var alerts = bannerData.summaryWarnings[2].count

  if (warnings > 0) {
    return 'warning'
  } else if (alerts > 0) {
    return 'alert'
  } else {
    return ''
  }
}

function bannerMessage (bannerData) {
  var warnings = bannerData.summaryWarnings[0].count + bannerData.summaryWarnings[1].count
  var alerts = bannerData.summaryWarnings[2].count
  var all = warnings + alerts

  var template = 'There <<inner>> in force ' + bannerData.messageSuffix

  var build = function (string) {
    return template.replace('<<inner>>', string)
  }

  // set the banner message based on the count of the warnings and alerts
  switch (true) {
    case all === 0:
      return build('are currently no warnings or alerts')
    case warnings === 0 && alerts === 1:
      return build('is currently one alert')
    case warnings === 1 && alerts === 0:
      return build('is currently one warning')
    case warnings === 0 && alerts > 1:
      return build('are currently ' + alerts + ' alerts')
    case warnings > 1 && alerts === 0:
      return build('are currently ' + warnings + ' warnings')
    case warnings === 1 && alerts === 1:
      return build('is currently one warning and one alert')
    case warnings > 1 && alerts === 1:
      return build('are currently ' + warnings + ' warnings and one alert')
    case warnings === 1 && alerts > 1:
      return build('is currently one warning and ' + alerts + ' alerts')
    case warnings > 1 && alerts > 1:
      return build('are currently ' + warnings + ' warnings and ' + alerts + ' alerts')
    default:
      return template
  }
}

function stationSuffix (station) {
  var returnValue = ''

  if (station.status.toLowerCase() === 'suspended') {
    returnValue = ' - temporarily out of service'
  }

  return returnValue
}

function gt (value, test, options) {
  if (value > test) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}

function is (value, test, options) {
  if (value === test) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}

function isnt (value, test, options) {
  if (value !== test) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}

function length (array) {
  return (!array) ? 0 : array.length
}

function lowercase (str) {
  if (str && typeof str === 'string') {
    return str.toLowerCase()
  }
}

function lte (value, test, options) {
  if (value <= test) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}

function gte (value, test, options) {
  if (value >= test) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}

function topDate (severity, socketDate, severityDate) {
  switch (severity) {
    case 4:
      return 'No longer in force<br/> ' + moment(new Date(severityDate)).format('h:mma dddd DD MMMM GGGG')
    default:
      return 'In force<br/> ' + moment(new Date(socketDate)).format('h:mma dddd DD MMMM GGGG')
  }
}

function bottomDate (severity, messageDate) {
  switch (severity) {
    case 4:
      return ''
    default:
      return 'Situation last changed ' + moment(new Date(messageDate)).format('h:mma dddd DD MMMM GGGG')
  }
}

function rloiLink (point) {
  point = JSON.parse(point)
  return '/riverlevels?lng=' + point.coordinates[0].toFixed(5) + '&lat=' + point.coordinates[1].toFixed(5)
}

module.exports = {
  formatDate: formatDate,
  group: group,
  pluraliseDescription: pluraliseDescription,
  summariseCount: summariseCount,
  eachWhen: eachWhen,
  toFixed: toFixed,
  splitMe: splitMe,
  bannerClass: bannerClass,
  bannerMessage: bannerMessage,
  stationSuffix: stationSuffix,
  dateDiff: dateDiff,
  gt: gt,
  is: is,
  isnt: isnt,
  length: length,
  lowercase: lowercase,
  lte: lte,
  gte: gte,
  topDate: topDate,
  bottomDate: bottomDate,
  rloiLink: rloiLink
}
