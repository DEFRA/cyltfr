
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
    }).then(function (jsonFileData) {
      const featureMapDivs = document.querySelectorAll('.comment-map')
      const featureTextAreas = document.querySelectorAll('.govuk-textarea')
      const dataName = document.getElementById('data_name')

      // dataName.setAttribute('value', `${jsonFileData.name}`)
      console.log(dataName)

      document.getElementById('file').remove()
      document.getElementById('comment-form').style.display = 'block'

      featureMapDivs.forEach(function (div, index) {
        div.id = 'map_' + index
      })

      jsonFileData.features.forEach(function (feature, index) {
        const geo = Object.assign({}, jsonFileData, {
          features: jsonFileData.features.filter(function (f) {
            return f === feature
          })
        })

        featureTextAreas[index].value = `${jsonFileData.features[index].properties.info}`
        console.log(jsonFileData)
        console.log('featureTextAreas[index]', featureTextAreas[index])
        
        commentMap(geo, 'map_' + index, capabilities)
      })
      console.log(jsonFileData.features)

      if (jsonFileData.features.length > 1) {
        commentMap(jsonFileData, 'map', capabilities, 'The map below shows all geometries contained within the shapefile')
      }
    }).catch(function (err) {
      console.error(err)
      window.alert('Invalid shapefile')
    })
  })
