;(function () {
  var React = window.React

  var textareaWidget = (props) => {
    var p = {
      rows: 5,
      id: props.id,
      value: props.value,
      required: props.required,
      className: 'govuk-textarea',
      onChange: (event) => props.onChange(event.target.value)
    }

    return React.createElement('div', null, [
      React.createElement('textarea', p),
      React.createElement('div', {
        id: props.id + '_map',
        className: 'comment-map'
      })
    ])
  }

  var inputWidget = (props) => {
    var p = {
      type: props.type || 'text',
      id: props.id,
      className: 'govuk-input govuk-input--width-20',
      value: props.value,
      required: props.required,
      onChange: (event) => props.onChange(event.target.value)
    }

    return React.createElement('input', p)
  }

  var dateWidget = (props) => {
    props.type = 'date'
    return inputWidget(props)
  }

  var commentSchema = {
    schema: {
      title: 'A geojson form',
      type: 'object',
      required: ['name', 'features'],
      properties: {
        name: {
          type: 'string',
          title: 'Description'
        },
        features: {
          type: 'array',
          required: [
            'type',
            'properties'
          ],
          items: {
            type: 'object',
            properties: {
              properties: {
                type: 'object',
                required: ['start', 'end', 'info'],
                properties: {
                  info: {
                    type: 'string',
                    title: 'Comment'
                  },
                  start: {
                    type: 'string',
                    format: 'date',
                    title: 'Start date'
                  },
                  end: {
                    type: 'string',
                    format: 'date',
                    title: 'End date'
                  }
                }
              }
            }
          }
        }
      }
    },
    uiSchema: {
      name: {
        'ui:widget': inputWidget,
        classNames: 'govuk-form-group info'
      },
      features: {
        'ui:options': {
          orderable: false,
          addable: false,
          removable: false
        },
        items: {
          'ui:options': {
            label: false
          },
          properties: {
            info: {
              'ui:widget': textareaWidget,
              classNames: 'govuk-form-group info'
            },
            start: {
              'ui:widget': dateWidget,
              classNames: 'govuk-form-group start'
            },
            end: {
              'ui:widget': dateWidget,
              classNames: 'govuk-form-group end'
            }
          }
        }
      }
    }
  }

  window.LTFMGMT.commentSchema = commentSchema
})()
