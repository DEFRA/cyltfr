
;(function () {
  var Form = window.JSONSchemaForm.default
  var React = window.React
  var ReactDOM = window.ReactDOM
  var fetch = window.fetch
  var geometry = window.LTFMGMT.geometry
  var comment = window.LTFMGMT.comment
  var type = comment.type
  var isHoldingComment = type === 'holding'
  var commentSchema = isHoldingComment
    ? window.LTFMGMT.holdingCommentSchema
    : window.LTFMGMT.llfaCommentSchema
  var commentMap = window.LTFMGMT.commentMap
  var capabilities = window.LTFMGMT.capabilities

  var props = {
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
    var geo = Object.assign({}, geometry, {
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
