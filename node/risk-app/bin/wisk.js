module.exports = [{
  paths: ['assets/javascripts/core'],
  on: { all: ['./bin/build-js-core'] }
}, {
  paths: ['assets/javascripts/search'],
  on: { all: ['./bin/build-js-search'] }
}, {
  paths: ['assets/javascripts/map'],
  on: { all: ['./bin/build-js-map'] }
}, {
  paths: ['assets/sass'],
  on: { all: ['npm run build:css'] }
}]
