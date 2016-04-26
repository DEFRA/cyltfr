module.exports = [{
  watch: {
    paths: 'assets/javascripts/core'
  },
  tasks: [{
    command: 'npm',
    args: ['run', 'build:js', '--', 'core']
  }]
}, {
  watch: {
    paths: 'assets/javascripts/search'
  },
  tasks: [{
    command: 'npm',
    args: ['run', 'build:js', '--', 'search']
  }]
}, {
  watch: {
    paths: 'assets/javascripts/map'
  },
  tasks: [{
    command: 'npm',
    args: ['run', 'build:js', '--', 'map']
  }]
}, {
  watch: {
    paths: 'assets/sass'
  },
  tasks: [{
    command: 'npm',
    args: ['run', 'build:css']
  }]
}]
