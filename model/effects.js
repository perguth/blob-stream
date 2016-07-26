/*global FileReader */
var log = require('../hyperlog')

/*
var peers = new Set()
var nextPeerGenerator = function * () {
  while (true) {
    let allPeers = peers.entries()
    do {
      var peer = allPeers.next().value
      console.log('will yield', peer, peers.size)
      yield peer
    } while (peer)
  }
}
var nextPeer = nextPeerGenerator()
*/

module.exports = {
  // asynchronous functions that emit an action when done
  // Signature of (data, state, send, done)

  'user selected files': (data, state, send, done) => {
    function readFile (handle, send, done) {
      let reader = new FileReader()
      reader.onload = () => {
        send('add entry to log', {dataUrl: reader.result}, err => err && done(err))
      }
      reader.readAsDataURL(handle)
    }
    let fileList = data.fileList
    for (let prop in fileList) {
      if (isNaN(prop)) continue
      readFile(fileList.item(prop), send, done)
    }
  },

  'add entry to log': (data, state, send, done) => {
    let dataUrl = data.dataUrl
    let dateNow = Date.now()
    let entry = {dataUrl, dateNow}
    log.add(null, JSON.stringify(entry), err => err && done(err))
  },

  'sync with peer': (data, state, send, done) => {
    send('add peer', data, err => err && done(err))

    var rs = log.createReplicationStream({live: true})
    rs.on('end', () => {
      console.log('in sync with peer:', data.id)
      // rs.unpipe(data.peer)
      // done()
    })
    rs.pipe(data.peer).pipe(rs)
  },

  'forget peer': (data, state, send, done) => {
    send('delete peer', data, err => err && done(err))
  }
}
