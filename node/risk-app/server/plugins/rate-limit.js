module.exports = {
  plugin: require('hapi-rate-limit'),
  options: {
    enabled: false, // Enabled on a per-route basis
    userLimit: 10, // 10 requests
    userCache: {
      expiresIn: 60000 // per minute maximum
    },
    pathLimit: false,
    trustProxy: true
  }
}
