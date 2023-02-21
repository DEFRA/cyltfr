
async function myCallback (solution, captchaUrl, captchaSiteKey) {
  console.log('Captcha finished with solution ' + solution)
  const url = `${captchaUrl}`
  const siteKey = `${captchaSiteKey}`
  // do a post call
  const responseObj = {}
  const payload = {
    solution,
    secret: siteKey
  }

  try {
    console.log('...Making http call')
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
      console.log('Response => ', response)
      return response.json()
    })
      .then((data) => {
        if (data.success) {
          console.log('Data', data)
          responseObj.success = data.success
          responseObj.details = data.details
        } else {
          console.log('Data after success false', data)
          responseObj.success = data.success
          responseObj.details = data.details
        }
        console.log('Response object =>  ', responseObj)
        return responseObj
      }).catch((err) => {
        console.log('eer: ', err)
      })
  } catch (e) {
    console.log('error gotten ', e)
  }
}

module.exports = myCallback
