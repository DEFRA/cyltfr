
async function myCallback (solution, captchaUrl, captchaSiteKey) {
  const url = `${captchaUrl}`
  const siteKey = `${captchaSiteKey}`
  // do a post call
  const responseObj = {}
  const payload = {
    solution,
    secret: siteKey
  }

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(payload)
    }).then((response) => {
      return response.json()
    })
      .then((data) => {
        if (data.success) {
          responseObj.success = data.success
          responseObj.details = data.details
        } else {
          responseObj.success = data.success
          responseObj.details = data.details
        }
        return responseObj
      }).catch((err) => {
        console.log('eer: ', err)
      })
  } catch (e) {
    console.log('error gotten ', e)
  }
}

module.exports = myCallback
