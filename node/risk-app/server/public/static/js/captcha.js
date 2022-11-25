
const captcha = document.querySelector('.frc-captcha')
const button = document.getElementById('post-code-button')
const captchaError = document.querySelector('input[name="captchaErrorMessage"]')


async function myCallback(solution) {
  console.log("Captcha finished with solution " + solution);
  button.disabled = false
  const url = 'https://api.friendlycaptcha.com/api/v1/siteverify';
  const secretKey = 'A1VQS1FKTITJCDEKGEGL0F1IGGHE51PN5ETPQ8F2JLFG0RTV193U5NE6MB';
  do a post call
  let responseObj = {};
   const payload =  {
      solution: solution,
      secret: secretKey
    }
  
  try{
    console.log('...Making http call')
     await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer',
      body: JSON.stringify(payload),
    }).then((response) => {
      console.log('Response => ', response)
      return response.json()
    })
    .then((data) => {
      if(data.success){
        console.log('Data', data)
        responseObj['success'] = data.success
        responseObj['details'] = data.details
        button.disabled = false
      }else{
        console.log('Data after success false',data)
        responseObj['success'] = data.success
        responseObj['details'] = data.details
        captchaError.value = data.details
      }
      console.log('Response object =>  ', responseObj)
      return responseObj;
    }).catch((err) => {
      console.log('eer: ', err)
    })
  }catch(e){
    console.log('error gotten ', e)
  }
}
