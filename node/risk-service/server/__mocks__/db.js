const query = jest.fn()

const result = {
  rows: []
}

const __queryResult = (newResult) => {
  result.rows = newResult
}

query.mockImplementation(() => {
  return Promise.resolve(result)
})

module.exports = {
  query,
  __queryResult
}
