const errorSummaryTitle = 'There is a problem'
const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i

const redirectToHomeCounty = (h, postcode, region) => {
  const encodedPostcode = encodeURIComponent(postcode)
  const url = `/england-only?postcode=${encodedPostcode}&region=${region}#`
  return h.redirect(url)
}

const runningUnitTests = () => {
  if (!require.main.filename.includes('risk-data')) {
    return (process.mainModule.path.endsWith('/lab/bin'))
  }
}

module.exports = {
  postcodeRegex,
  errorSummaryTitle,
  redirectToHomeCounty,
  runningUnitTests
}
