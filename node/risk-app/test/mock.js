module.exports = {
  replace: function replace (obj, name, fn) {
    // Store the original function
    var original = obj[name]

    // Override the function
    obj[name] = fn

    // Return a handy cleanup function
    return {
      revert: function () {
        obj[name] = original
      }
    }
  },
  makeCallback: function makeCallback () {
    // Assumes error first, callback last semantics
    var args = arguments
    return function () {
      var callback = arguments[arguments.length - 1]
      process.nextTick(function () {
        callback.apply(this, args)
      })
    }
  }
}
