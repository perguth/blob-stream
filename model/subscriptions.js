module.exports = (log) => [
  // read-only data sources that emit actions
  // Signature of (send, done)

  function subscribeToLogChanges (send, done) {
    // subscribe to all hyperlog changes
    // caused through syncing or by ourselves
    let changesStream = log.createReadStream({
      live: true,
      limit: 5
    })

    changesStream.on('end', () => {
      done(new Error('hyperlog changesStream ended'))
    })
    changesStream.on('data', node => {
      send('append-log-entry-to-state', node, err => err && done(err))
    })
  },

  function (send, done) {
    done()
  }
]
