
;(function () {
  var Form = window.JSONSchemaForm.default
  var React = window.React
  var ReactDOM = window.ReactDOM
  var fetch = window.fetch
  var geometry = window.LTFMGMT.geometry
  var type = window.LTFMGMT.comment.type
  var comment = window.LTFMGMT[type + 'CommentSchema']
  var commentMap = window.LTFMGMT.commentMap

  var props = {
    formData: geometry,
    schema: comment.schema,
    uiSchema: comment.uiSchema,
    ArrayFieldTemplate: window.LTFMGMT.ArrayFieldTemplate,
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

    commentMap(geo, 'map_' + index)
  })

  if (geometry.features.length > 1) {
    commentMap(geometry, 'map', 'The map below shows all geometries contained within the shapefile')
  }
})()
