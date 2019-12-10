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
  constructor (data, err) {
    // this.minStartDate = moment().add(1, 'days').format('YYYY-MM-DD')
    // this.minEndDate = moment().add(2, 'days').format('YYYY-MM-DD')
    this.data = data

    if (err) {
      this.errors = mapErrors(err.details)
    }
  }
}

module.exports = CommentCreate
