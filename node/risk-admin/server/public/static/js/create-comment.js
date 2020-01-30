
;(function () {
  var Form = window.JSONSchemaForm.default
  var React = window.React
  var ReactDOM = window.ReactDOM
  var FormData = window.FormData
  var fetch = window.fetch
  var commentMap = window.LTFMGMT.commentMap
  var spinner = document.getElementById('spinner')
  var fileInput = document.getElementById('geometry')

  var type = window.LTFMGMT.type
  var isHoldingComment = type === 'holding'
  var comment = isHoldingComment
    ? window.LTFMGMT.holdingCommentSchema
    : window.LTFMGMT.llfaCommentSchema

  // Handle file change event
  fileInput.addEventListener('change', function (e) {
    var formData = new FormData()

    if (!fileInput.files || !fileInput.files.length) {
      return
    }

    formData.append('geometry', fileInput.files[0])

    fileInput.style.display = 'none'
    spinner.style.display = 'inline'

    fetch('/shp2json/' + type, {
      method: 'post',
      body: formData
    }).then(function (response) {
      spinner.style.display = 'none'

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
        ArrayFieldTemplate: window.LTFMGMT.ArrayFieldTemplate,
        onSubmit: function (e) {
          if (window.confirm('Are you sure you want to add the comment?')) {
            fetch('/comment/create/' + type, {
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

        commentMap(geo, 'map_' + index)
      })

      if (response.features.length > 1) {
        commentMap(response, 'map', 'The map below shows all geometries contained within the shapefile')
      }
    }).catch(function (err) {
      console.error(err)
      window.alert('Invalid shapefile')
    })
  })
})()
