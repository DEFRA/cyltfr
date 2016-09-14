module.exports = {
  method: 'GET',
  path: '/feedback',
  config: {
    description: 'Get the feedback page',
    handler: function (request, reply) {
      reply.view('feedback', { ref: encodeURIComponent(request.info.referrer || request.info.host), feedback: false })
    }
  }
}
