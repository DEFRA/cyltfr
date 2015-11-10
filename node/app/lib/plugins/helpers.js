function lt (value, test, options) {
  if (value > test) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}

function gt (value, test, options) {
  if (value > test) {
    return options.fn(this)
  } else {
    return options.inverse(this)
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

module.exports = {
  lt: lt,
  gt: gt,
  is: is,
  isnt: isnt,
  lte: lte,
  gte: gte
}
