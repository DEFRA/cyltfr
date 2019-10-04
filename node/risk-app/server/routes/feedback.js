module.exports = {
  method: 'GET',
  path: '/feedback',
  options: {
    description: 'Get the feedback page',
    handler: (request, h) => {
      return h.redirect('https://defragroup.eu.qualtrics.com/jfe/form/SV_eVcuXnaMi8wiVkF')
      // const ref = (request.info.referrer && request.info.referrer.indexOf('/feedback') === -1)
      //   ? request.info.referrer
      //   : request.server.info.protocol + '://' + request.info.host

      // const agent = request.headers['user-agent']
      //   ? request.headers['user-agent']
      //   : ''

      // return h.view('feedback', {
      //   ref: encodeURIComponent(ref),
      //   feedback: false,
      //   pageTitle: 'Provide feedback about this service - GOV.UK',
      //   userAgent: encodeURIComponent(agent)
      // })
    }
  }
}
