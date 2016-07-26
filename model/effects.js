/*global FileReader */
var log = require('../hyperlog')

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
    var peer = data.peer

    var rs = log.createReplicationStream({live: true})
    rs.on('end', () => {
      console.log('this is the wtf case')
    })
    rs.pipe(peer).pipe(rs)

    peer.on('disconnect', (err) => {
      rs.unpipe()
      done(err)
    })
  }
}
