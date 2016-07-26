var debug = require('debug')
var debugPrefix = 'blob-stream:subscriptions'

module.exports = (log) => [
  // read-only data sources that emit actions
  // Signature of (send, done)

  function subscribeToLogChanges (send, done) {
    // subscribe to all hyperlog changes
    // caused through syncing or by ourselves
    var changesStream = log.createReadStream({
      live: true,
      limit: 5
    })

    changesStream.on('end', () => done(new Error('hyperlog createReadStream ended')))
    changesStream.on('data', node => {
      send('append log entry to state', node, err => err && done(err))
    })
  },

  function findWebRTCPeers (send, done) {
    var d = debug(debugPrefix + ':findWebRTCPeers')

    var webrtcSwarm = require('webrtc-swarm')
    var signalhub = require('signalhub')
    var hub = signalhub('blob-stream', ['https://signalhub.perguth.de:65300'])
    var swarm = webrtcSwarm(hub)

    swarm.on('connect', (peer, id) => {
      d('✔ peer connected', id)
      send('sync with peer', {peer, id}, err => err && done(err))
    })
    swarm.on('disconnect', (peer, id) => {
      d('✕ peer disconnected', id)
    })
    swarm.on('close', () => done(new Error('swarm closed')))
  }
]
