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
      send('append log entry to state', node, err => err && done(err))
    })
  },

  function findWebRTCPeers (send, done) {
    var webrtcSwarm = require('webrtc-swarm')
    var signalhub = require('signalhub')
    var hub = signalhub('blob-stream', ['https://signalhub.perguth.de:65300'])
    var swarm = webrtcSwarm(hub)

    var peers = []
    swarm.on('connect', (peer, id) => {
      console.log('whohooo, new peer!')
      peers[id] = peer
    })
    swarm.on('disconnect', (peer, id) => {
      var i = peers.indexOf(peer)
      if (i > -1) peers.splice(i, 1)
    })
  }
]
