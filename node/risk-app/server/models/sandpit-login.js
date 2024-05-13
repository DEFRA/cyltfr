const { errorSummaryTitle } = require('../helpers')

function SandpitViewModel (errorMessage) {
  if (errorMessage) {
    this.errorMessage = {
      text: errorMessage
    }
  }
}

module.exports = SandpitViewModel
