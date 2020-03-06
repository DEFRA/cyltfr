;(function () {
  var React = window.React
  var useState = window.React.useState

  var holdingCommentBoundaries = [
    'Cumbria and Lancashire (CLA)',
    'Devon, Cornwall and the Isles of Scilly (DCS)',
    'East Anglia (EAN)',
    'East Midlands (EMD)',
    'Greater Manchester, Merseyside and Cheshire (GMC)',
    'Hertfordshire and North London (HNL)',
    'Kent, South London and East Sussex (KSL)',
    'Lincolnshire and Northamptonshire (LNA)',
    'North East (NEA)',
    'Solent and South Downs (SSD)',
    'Thames (THM)',
    'Wessex (WSX)',
    'West Midlands (WMD)',
    'Yorkshire (YOR)'
  ]

  var llfaBoundaries = [
    'Barking and Dagenham',
    'Barnet',
    'Barnsley',
    'Bath and North East Somerset',
    'Bedford',
    'Bexley',
    'Birmingham',
    'Blackburn with Darwen',
    'Blackpool',
    'Blaenau Gwent',
    'Bolton',
    'Bournemouth',
    'Bracknell Forest',
    'Bradford',
    'Brent',
    'Bridgend',
    'Brighton and Hove',
    'Bristol, City of',
    'Bromley',
    'Buckinghamshire',
    'Bury',
    'Caerphilly',
    'Calderdale',
    'Cambridgeshire',
    'Camden',
    'Cardiff',
    'Carmarthenshire',
    'Central Bedfordshire',
    'Ceredigion',
    'Cheshire East',
    'Cheshire West and Chester',
    'City of London',
    'Conwy',
    'Cornwall',
    'County Durham',
    'Coventry',
    'Croydon',
    'Cumbria',
    'Darlington',
    'Denbighshire',
    'Derby',
    'Derbyshire',
    'Devon',
    'Doncaster',
    'Dorset',
    'Dudley',
    'Ealing',
    'East Riding of Yorkshire',
    'East Sussex',
    'Enfield',
    'Essex',
    'Flintshire',
    'Gateshead',
    'Gloucestershire',
    'Greenwich',
    'Gwynedd',
    'Hackney',
    'Halton',
    'Hammersmith and Fulham',
    'Hampshire',
    'Haringey',
    'Harrow',
    'Hartlepool',
    'Havering',
    'Herefordshire, County of',
    'Hertfordshire',
    'Hillingdon',
    'Hounslow',
    'Isle of Anglesey',
    'Isle of Wight',
    'Isles of Scilly',
    'Islington',
    'Kensington and Chelsea',
    'Kent',
    'Kingston upon Hull, City of',
    'Kingston upon Thames',
    'Kirklees',
    'Knowsley',
    'Lambeth',
    'Lancashire',
    'Leeds',
    'Leicester',
    'Leicestershire',
    'Lewisham',
    'Lincolnshire',
    'Liverpool',
    'Luton',
    'Manchester',
    'Medway',
    'Merthyr Tydfil',
    'Merton',
    'Middlesbrough',
    'Milton Keynes',
    'Monmouthshire',
    'Neath Port Talbot',
    'Newcastle upon Tyne',
    'Newham',
    'Newport',
    'Norfolk',
    'Northamptonshire',
    'North East Lincolnshire',
    'North Lincolnshire',
    'North Somerset',
    'North Tyneside',
    'Northumberland',
    'North Yorkshire',
    'Nottingham',
    'Nottinghamshire',
    'Oldham',
    'Oxfordshire',
    'Pembrokeshire',
    'Peterborough',
    'Plymouth',
    'Poole',
    'Portsmouth',
    'Powys',
    'Reading',
    'Redbridge',
    'Redcar and Cleveland',
    'Rhondda, Cynon, Taff',
    'Richmond upon Thames',
    'Rochdale',
    'Rotherham',
    'Rutland',
    'Salford',
    'Sandwell',
    'Sefton',
    'Sheffield',
    'Shropshire',
    'Slough',
    'Solihull',
    'Somerset',
    'Southampton',
    'Southend-on-Sea',
    'South Gloucestershire',
    'South Tyneside',
    'Southwark',
    'Staffordshire',
    'St. Helens',
    'Stockport',
    'Stockton-on-Tees',
    'Stoke-on-Trent',
    'Suffolk',
    'Sunderland',
    'Surrey',
    'Sutton',
    'Swansea',
    'Swindon',
    'Tameside',
    'Telford and Wrekin',
    'The Vale of Glamorgan',
    'Thurrock',
    'Torbay',
    'Torfaen',
    'Tower Hamlets',
    'Trafford',
    'Wakefield',
    'Walsall',
    'Waltham Forest',
    'Wandsworth',
    'Warrington',
    'Warwickshire',
    'West Berkshire',
    'Westminster',
    'West Sussex',
    'Wigan',
    'Wiltshire',
    'Windsor and Maidenhead',
    'Wirral',
    'Wokingham',
    'Wolverhampton',
    'Worcestershire',
    'Wrexham',
    'York'
  ]

  var textareaWidget = function (props) {
    var [charsLeft, setCharsLeft] = useState(Math.max(0, props.schema.maxLength - props.value.length))
    var p = {
      rows: 5,
      id: props.id,
      value: props.value,
      required: props.required,
      maxLength: props.schema.maxLength,
      className: 'govuk-textarea',
      onChange: function (event) {
        var value = event.target.value
        setCharsLeft(props.schema.maxLength - value.length)
        props.onChange(value)
      }
    }

    return React.createElement('div', null, [
      React.createElement('textarea', p),
      React.createElement('p', {
        className: 'govuk-hint govuk-character-count__message'
      }, ['You have ', charsLeft, ' characters remaining'])
    ])
  }

  var inputWidget = function (props) {
    var p = {
      type: props.type || 'text',
      id: props.id,
      className: 'govuk-input govuk-input--width-20',
      value: props.value,
      autoComplete: 'off',
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

  var selectWidget = function (props) {
    var p = {
      rows: 5,
      id: props.id,
      value: props.value,
      required: props.required,
      autoComplete: 'off',
      maxLength: props.schema.maxLength,
      list: 'options',
      className: 'govuk-input',
      onChange: function (event) { props.onChange(event.target.value) }
    }

    const options = props.schema.enum
    return React.createElement(React.Fragment, null, [
      React.createElement('input', p),
      React.createElement('datalist', { id: 'options' }, options.map(function (option) {
        return React.createElement('option', {}, option)
      }))
    ])
  }

  function createSchema (isHoldingComment) {
    var commentSchema = {
      schema: {
        title: 'A geojson form',
        type: 'object',
        required: ['name', 'features', 'boundary'],
        properties: {
          name: {
            type: 'string',
            title: 'Description',
            maxLength: 75
          },
          boundary: {
            type: 'string',
            title: 'Boundary',
            enum: isHoldingComment ? holdingCommentBoundaries : llfaBoundaries
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
                      title: isHoldingComment ? 'Info' : 'Report',
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
        boundary: {
          'ui:widget': selectWidget,
          classNames: 'govuk-form-group boundary',
          'ui:description': 'For internal use, choose the boundary to which this comment applies. This will not be displayed to public users.'
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
                  ? React.createElement('p', null, ['The info text will display to public users in this geometry. Read ', React.createElement('a', { href: '/comment-guidance', target: '_blank' }, ['comment guidance']), ' before writing or pasting anything. The maximum number of characters is 150.'])
                  : 'The report text will display to public users in this geometry.'
              },
              start: {
                'ui:widget': dateWidget,
                classNames: 'govuk-form-group start',
                'ui:description': 'For your reference and will not be displayed to public users. Your comments will not be uploaded automatically on this date. Your comments will go live once they’re approved. If a date picker is not available, use YYYY-MM-DD.'
              },
              end: {
                'ui:widget': dateWidget,
                classNames: 'govuk-form-group end',
                'ui:description': 'For your reference and will not be displayed to public users. Your comments will not be removed automatically. It is your responsibility to remove them on the ‘valid to’ date. If a date picker is not available, use YYYY-MM-DD.'
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
