/* global FileReader */
// var debug = require('debug')
// var debugPrefix = 'blob-stream:effects'

module.exports = {
  // asynchronous functions that emit an action when done
  // Signature of (data, state, send, done)

  'user selected files': (data, state, send, done) => {
    function readFile (handle) {
      var reader = new FileReader()
      reader.onload = () => {
        send('add entry to log', {dataUrl: reader.result}, err => err && done(err))
      }
      reader.readAsDataURL(handle)
    }

    var fileList = data.fileList
    for (let prop in fileList) {
      if (isNaN(prop)) continue
      readFile(fileList.item(prop))
    }
  },

  'add entry to log': (data, state, send, done) => {
    let dataUrl = data.dataUrl
    let dateNow = Date.now()
    let entry = {dataUrl, dateNow}

    state.log.add(null, JSON.stringify(entry), (err, node) => err && done(err))
  },

  'sync with peer': (data, state, send, done) => {
    var peer = data.peer

    peer.on('error', err => done(err))
    peer.on('close', () => done(new Error('simple-peer closed')))

    var rs = state.log.createReplicationStream({live: true})
    rs.on('end', () => done(new Error('replication stream ended')))

    rs.pipe(peer).pipe(rs)
  }
}
