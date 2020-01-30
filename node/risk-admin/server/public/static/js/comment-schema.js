;(function () {
  var React = window.React

  var textareaWidget = function (props) {
    var p = {
      rows: 5,
      id: props.id,
      value: props.value,
      required: props.required,
      maxLength: props.schema.maxLength,
      className: 'govuk-textarea',
      onChange: function (event) { props.onChange(event.target.value) }
    }

    return React.createElement('textarea', p)
  }

  var inputWidget = function (props) {
    var p = {
      type: props.type || 'text',
      id: props.id,
      className: 'govuk-input govuk-input--width-20',
      value: props.value,
      required: props.required,
      maxLength: props.schema.maxLength,
      onChange: function (event) { props.onChange(event.target.value) }
    }

    return React.createElement('input', p)
  }

  var dateWidget = function (props) {
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
            title: 'Description',
            maxLength: 75
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
                      ],
                      maxLength: 150
                    },
                    start: {
                      type: 'string',
                      format: 'date',
                      title: 'Valid from'
                    },
                    end: {
                      type: 'string',
                      format: 'date',
                      title: 'Valid to'
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
          classNames: 'govuk-form-group name',
          'ui:description': 'For internal use, to describe the comments that you are uploading. This will not be displayed to public users.'
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
                classNames: 'govuk-form-group info',
                'ui:description': isHoldingComment
                  ? 'The comment text will display to public users in this geometry. Read ‘comment guidance’ before writing or pasting anything. The maximum number of characters is 150.'
                  : 'The report text will display to public users in this geometry.'
              },
              start: {
                'ui:widget': dateWidget,
                classNames: 'govuk-form-group start',
                'ui:description': 'For internal use and will not be displayed to public users. If a date picker is not available, use YYYY-MM-DD.'
              },
              end: {
                'ui:widget': dateWidget,
                classNames: 'govuk-form-group end',
                'ui:description': 'For your reference and will not be displayed to public users. The comments will not be removed automatically. It is your responsibility to remove them on the ‘valid to’ date. If a date picker is not available, use YYYY-MM-DD.'
              }
            }
          }
        }
      }
    }

    return commentSchema
  }

  function ArrayFieldTemplate (props) {
    return React.createElement('div', null, props.items.map(function (el) {
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
