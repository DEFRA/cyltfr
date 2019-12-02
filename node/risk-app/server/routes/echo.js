module.exports = {
  method: 'get',
  path: '/echo',
  handler: (request, h) => {
    const { headers, method, path } = request
    console.log({ headers, method, path })
    return { headers, method, path }
  }
}
