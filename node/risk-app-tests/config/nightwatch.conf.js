// Get the launchUrl from the argv,
// otherwise default to localhost:3001
var url = 'http://localhost:3001'
var urlIdx = process.argv.indexOf('--url')

if (urlIdx > 1) {
  url = process.argv[urlIdx + 1]
}

console.info('url', url)

module.exports = {
  src_folders: [
    'tests'
  ],
  live_output: true,
  page_objects_path: 'pages',
  output_folder: 'reports',
  test_workers: true,
  selenium: {
    start_process: true,
    server_path: 'bin/selenium.jar',
    log_path: '',
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': 'bin/chromedriver'
    }
  },
  test_settings: {
    'default': {
      filter: 'tests/map/index.js',
      launch_url: url,
      selenium_host: '127.0.0.1',
      selenium_port: 4444,
      silent: true,
      disable_colors: false,
      screenshots: {
        enabled: false,
        path: ''
      },
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    }
  }
}
