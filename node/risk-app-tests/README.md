
## Local test
Both the selenium jar and the chromedriver are in the /bin directory, so there shouldn't be any manual setup here, nightwatch handles the selenium server_path

`npm run test-e2e-local`

## Remote test (BROWSERSTACK)

Need environment variables for, BS user and key:

`export BS_USER=
export BS_KEY=`

Browserstack tunnel then needs setting up, either download the latst binary from https://www.browserstack.com/automate/node#firefox-profile ctrl-f for "Setting up local testing"

or go to /bin and run `./BrowserStackLocal $BS_KEY`

With this running in a terminal you'll then be able to run tests against your localhost or a private domain ie dev/test

To setup bespoke environments for testing use the tool at https://www.browserstack.com/automate/node#firefox-profile to select browser/os/screensize and it gives the config options

## Remote test (Sauce labs)

In your environment variable location add, populated with the saucelabs connection details:

`export SAUCE_USERNAME=
export SAUCE_ACCESS_KEY=`

If you are wanting to test your localhost using sauce labs then a tunnel will need to be created for the remote to access your local.  This is done through Sauce Connect.  See https://wiki.saucelabs.com/display/DOCS/Setting+Up+Sauce+Connect

In the terminal run:

`/bin/sc -u ${SAUCE_USERNAME} -k ${SAUCE_ACCESS_KEY} -B all`

This will need to be left running whilst the remote tests are run:

`npm run test-e2e-remote`
