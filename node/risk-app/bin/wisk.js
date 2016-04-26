module.exports = [{
  watch: { paths: 'assets/javascripts/core' },
  tasks: [{ command: './bin/build-js-core' }]
}, {
  watch: { paths: 'assets/javascripts/search' },
  tasks: [{ command: './bin/build-js-search' }]
}, {
  watch: { paths: 'assets/javascripts/map' },
  tasks: [{ command: './bin/build-js-map' }]
}, {
  watch: { paths: 'assets/sass' },
  tasks: [{ command: 'npm', args: ['run', 'build:css'] }]
}]
