
module.exports = (log) => [
  // read-only data sources that emit actions
  // Signature of (send, done)
  (send, done) => {
    let changesStream = log.createReadStream({
      live: true,
      limit: 5
    })

    changesStream.on('data', function (node) {
      send('logGrew', node, err => err && done(err))
    })
  }
]
