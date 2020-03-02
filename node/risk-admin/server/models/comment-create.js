const errorMessages = {
  description: 'Enter a description',
  start: 'Enter a valid start date',
  end: 'Enter a valid end date',
  info: 'Enter a holding comment',
  geometry: 'Enter a valid geometry file'
}

function mapErrors (errors) {
  const map = {}

  errors.forEach(error => {
    const contextKey = error.path[0]
    map[contextKey] = {
      text: errorMessages[contextKey]
    }
  })

  return map
}

class CommentCreate {
  constructor (type, capabilities, data, err) {
    this.type = type
    this.data = data
    this.capabilities = capabilities

    if (err) {
      this.errors = mapErrors(err.details)
    }
  }
}

module.exports = CommentCreate
