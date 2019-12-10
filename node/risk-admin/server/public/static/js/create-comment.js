
;(function () {
  var Form = window.JSONSchemaForm.default
  var React = window.React
  var ReactDOM = window.ReactDOM
  var FormData = window.FormData
  var fetch = window.fetch
  var comment = window.LTFMGMT.commentSchema
  var commentMap = window.LTFMGMT.commentMap
  var geometry = document.getElementById('geometry')

  // Handle file change event
  geometry.addEventListener('change', function (e) {
    var formData = new FormData()

    if (!geometry.files || !geometry.files.length) {
      return
    }

    formData.append('geometry', geometry.files[0])

    fetch('/shp2json', {
      method: 'post',
      body: formData
    }).then(function (response) {
      return response.json()
    }).then(function (response) {
      var props = {
        formData: response,
        schema: comment.schema,
        uiSchema: comment.uiSchema,
        onSubmit: function (e) {
          if (window.confirm('Are you sure you want to add the comment?')) {
            fetch('/comment/create', {
              method: 'post',
              body: JSON.stringify(e.formData),
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
            }).then(function (response) {
              if (response.ok) {
                window.location.href = '/'
              } else {
                throw new Error(response.statusText)
              }
            }).catch(function (err) {
              window.alert('Error: ' + err)
            })
          } else {
            e.preventDefault()
          }
        }
      }

      const submitButton = React.createElement('button', {
        type: 'submit',
        className: 'govuk-button'
      }, 'Save')

      ReactDOM.render(
        React.createElement(Form, props, submitButton),
        document.getElementById('root')
      )

      commentMap(response)
    }).catch(function (err) {
      console.error(err)
      window.alert('Invalid shapefile')
    })
  })
})()
