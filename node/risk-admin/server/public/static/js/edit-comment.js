
;(function () {
  const Form = window.JSONSchemaForm.default
  const React = window.React
  const ReactDOM = window.ReactDOM
  const fetch = window.fetch
  const geometry = window.LTFMGMT.geometry
  const comment = window.LTFMGMT.comment
  const type = comment.type
  const isHoldingComment = type === 'holding'
  const commentSchema = isHoldingComment
    ? window.LTFMGMT.holdingCommentSchema
    : window.LTFMGMT.llfaCommentSchema
  const commentMap = window.LTFMGMT.commentMap
  const capabilities = window.LTFMGMT.capabilities

  const props = {
    formData: geometry,
    schema: commentSchema.schema,
    uiSchema: commentSchema.uiSchema,
    ArrayFieldTemplate: window.LTFMGMT.ArrayFieldTemplate,
    onSubmit: function (e) {
      if (comment.approvedAt) {
        // Comment is already approved.
        // The edit will cause it to be unapproved.
        // Warn the user they will need to get it re-approved.
        if (!window.confirm('The comment will need re-approving. Continue?')) {
          return
        }
      }

      fetch(window.location.href, {
        method: 'put',
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

  geometry.features.forEach(function (feature, index) {
    const geo = Object.assign({}, geometry, {
      features: geometry.features.filter(function (f) {
        return f === feature
      })
    })

    commentMap(geo, 'map_' + index, capabilities)
  })

  if (geometry.features.length > 1) {
    commentMap(geometry, 'map', capabilities, 'The map below shows all geometries contained within the shapefile')
  }
})()
