/*global FileReader */
var debug = require('debug')
var debugPrefix = 'blob-stream:effects'

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
    state.log.add(null, JSON.stringify(entry), err => err && done(err))
  },

  'sync with peer': (data, state, send, done) => {
    var d = debug(debugPrefix + ':sync-with-peer')
    var peer = data.peer

    peer.on('error', err => {
      d('simple-peer error')
      done(err)
    })
    peer.on('close', () => {
      d('simple-peer closed')
      done()
    })

    var rs = state.log.createReplicationStream({live: true})
    rs.on('end', () => {
      d('replication stream ended')
      done()
    })

    rs.pipe(peer).pipe(rs)
  }
}
