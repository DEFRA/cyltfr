var acceptButton = document.querySelector('.js-cookies-button-accept')
var rejectButton = document.querySelector('.js-cookies-button-reject')
var acceptedBanner = document.querySelector('.js-cookies-accepted')
var rejectedBanner = document.querySelector('.js-cookies-rejected')
var questionBanner = document.querySelector('.js-question-banner')
var cookieBanner = document.querySelector('.js-cookies-banner')
var cookieContainer = document.querySelector('.js-cookies-container')

cookieContainer.style.display = 'block'

function showBanner (banner) {
  questionBanner.setAttribute('hidden', 'hidden')
  banner.removeAttribute('hidden')
  // Shift focus to the banner
  banner.setAttribute('tabindex', '-1')
  banner.focus()

  banner.addEventListener('blur', function () {
    banner.removeAttribute('tabindex')
  })
}

acceptButton.addEventListener('click', function (event) {
  showBanner(acceptedBanner)
  event.preventDefault()
  submitPreference(true)
})

rejectButton.addEventListener('click', function (event) {
  showBanner(rejectedBanner)
  event.preventDefault()
  submitPreference(false)
})

acceptedBanner.querySelector('.js-hide').addEventListener('click', function () {
  cookieBanner.setAttribute('hidden', 'hidden')
})

rejectedBanner.querySelector('.js-hide').addEventListener('click', function () {
  cookieBanner.setAttribute('hidden', 'hidden')
})

function submitPreference (accepted) {
  window.$.post('/long-term-flood-risk/cookies', {
    analytics: accepted,
    async: true
  }, function (data) {
    console.log(data)
  })
}
