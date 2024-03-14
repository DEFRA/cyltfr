
;(function () {
  const Form = window.JSONSchemaForm.default
  const React = window.React
  const ReactDOM = window.ReactDOM
  const FormData = window.FormData
  const fetch = window.fetch
  const commentMap = window.LTFMGMT.commentMap
  const capabilities = window.LTFMGMT.capabilities

  const spinner = document.getElementById('spinner')
  const fileInput = document.getElementById('geometry')

  const type = window.LTFMGMT.type
  const isHoldingComment = type === 'holding'
  const commentSchema = isHoldingComment
    ? window.LTFMGMT.holdingCommentSchema
    : window.LTFMGMT.llfaCommentSchema

  // Handle file change event
  fileInput.addEventListener('change', function (e) {
    const formData = new FormData()

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

      const props = {
        formData: response,
        schema: commentSchema.schema,
        uiSchema: commentSchema.uiSchema,
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
        const geo = Object.assign({}, response, {
          features: response.features.filter(function (f) {
            return f === feature
          })
        })

        commentMap(geo, 'map_' + index, capabilities)
      })

      if (response.features.length > 1) {
        commentMap(response, 'map', capabilities, 'The map below shows all geometries contained within the shapefile')
      }
    }).catch(function (err) {
      console.error(err)
      window.alert('Invalid shapefile')
    })
  })
})()
