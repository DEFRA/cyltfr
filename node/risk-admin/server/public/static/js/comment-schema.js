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

    return React.createElement('textarea', p)
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

  function createSchema (isHoldingComment) {
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
                    apply: {
                      type: 'string',
                      title: 'Apply',
                      const: isHoldingComment ? 'holding' : 'llfa',
                      default: isHoldingComment ? 'holding' : 'llfa'
                    },
                    info: {
                      type: 'string',
                      title: isHoldingComment ? 'Comment' : 'Report',
                      enum: isHoldingComment ? undefined : [
                        'Flood report',
                        'Non compliant mapping',
                        'Proposed schemes',
                        'Completed schemes',
                        'Flood action plan',
                        'Other info'
                      ]
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
              apply: {
                'ui:widget': 'hidden'
              },
              info: {
                'ui:widget': isHoldingComment ? textareaWidget : 'radio',
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

    return commentSchema
  }

  function ArrayFieldTemplate (props) {
    return React.createElement('div', null, props.items.map(el => {
      var item = React.createElement('div', {
        id: 'item_' + el.index,
        className: 'array-item'
      }, [
        el.children,
        React.createElement('div', {
          id: 'map_' + el.index,
          className: 'comment-map'
        })
      ])

      return item
    }))
  }

  window.LTFMGMT.holdingCommentSchema = createSchema(true)
  window.LTFMGMT.llfaCommentSchema = createSchema(false)
  window.LTFMGMT.ArrayFieldTemplate = ArrayFieldTemplate
})()
