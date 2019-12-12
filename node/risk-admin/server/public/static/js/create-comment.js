
;(function () {
  var Form = window.JSONSchemaForm.default
  var React = window.React
  var ReactDOM = window.ReactDOM
  var FormData = window.FormData
  var fetch = window.fetch
  var comment = window.LTFMGMT.commentSchema
  var commentMap = window.LTFMGMT.commentMap
  var fileInput = document.getElementById('geometry')

  // Handle file change event
  fileInput.addEventListener('change', function (e) {
    var formData = new FormData()

    if (!fileInput.files || !fileInput.files.length) {
      return
    }

    formData.append('geometry', fileInput.files[0])

    fetch('/shp2json', {
      method: 'post',
      body: formData
    }).then(function (response) {
      if (!response.ok) {
        throw new Error(response.statusText)
      }

      return response
    }).then(function (response) {
      return response.json()
    }).then(function (response) {
      document.getElementById('file').remove()

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
              console.error(err)
              window.alert('Save failed')
            })
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

      response.features.forEach(function (feature, index) {
        var geo = Object.assign({}, response, {
          features: response.features.filter(function (f) {
            return f === feature
          })
        })

        commentMap(geo, 'root_features_' + index + '_properties_info_map')
      })

      if (response.features.length > 1) {
        commentMap(response, 'map')
      }
    }).catch(function (err) {
      console.error(err)
      window.alert('Invalid shapefile')
    })
  })
})()
