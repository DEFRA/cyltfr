function submitForm () {
  const comment = window.LTFMGMT.comment
  const serverUrl = '/comment/edit/'
  const commentId = comment.id
  const fetch = window.fetch
  if (comment.approvedAt && !window.confirm('The comment will need re-approving. Continue?')) {
    return
  }
  const formData = {
    name: document.getElementById('comment-description').value,
    boundary: document.getElementById('comment-boundary').value,
    features: []
  }
  const featureContainers = document.querySelectorAll('.feature')
  featureContainers.forEach((featureContainer, index) => {
    formData.features.push({
      // To do: read feature input values from the form (there might be an easier way too)
    })
  })
  fetch(serverUrl + commentId, {
    method: 'PUT',
    body: JSON.stringify(formData),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    if (response.ok) {
      window.location.assign('/')
    } else {
      throw new Error(response.statusText)
    }
  }).catch(function (err) {
    window.alert('Error: ' + err)
  })
}
