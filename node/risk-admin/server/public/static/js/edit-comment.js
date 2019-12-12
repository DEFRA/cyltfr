
;(function () {
  var Form = window.JSONSchemaForm.default
  var React = window.React
  var ReactDOM = window.ReactDOM
  var fetch = window.fetch
  var comment = window.LTFMGMT.commentSchema
  var geometry = window.LTFMGMT.geometry
  var commentMap = window.LTFMGMT.commentMap

  var props = {
    formData: geometry,
    schema: comment.schema,
    uiSchema: comment.uiSchema,
    onSubmit: function (e) {
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

    commentMap(geo, 'root_features_' + index + '_properties_info_map')
  })

  if (geometry.features.length > 1) {
    commentMap(geometry, 'map')
  }
})()
