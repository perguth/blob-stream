/* global FileReader */
var debug = require('debug')
var debugPrefix = 'blob-stream:effects'
var rusha = new (require('rusha'))()

module.exports = {
  // asynchronous functions that emit an action when done
  // Signature of (data, state, send, done)

  'user selected files': (data, state, send, done) => {
    function readFile (file) {
      var reader = new FileReader()
      reader.onload = () => {
        var dataUrl = reader.result
        var hash = rusha.digestFromString(dataUrl)
        send('create torrent', {
          file,
          name: hash,
          dataUrl
        }, err => err && done(err))
      }
      reader.readAsDataURL(file)
    }

    var fileList = data.fileList
    for (let prop in fileList) {
      if (isNaN(prop)) continue
      let file = fileList.item(prop)
      readFile(file)
    }
  },

  'create log entry': (data, state, send, done) => {
    var d = debug(debugPrefix + ':create-log-entry')
    var magnetLink = data.magnetLink
    var dateNow = Date.now()

    let entry = {magnetLink, dateNow}
    d('saving entry to log', entry)
    state.log.add(null, JSON.stringify(entry), (err, node) => err && done(err))
  },

  'create torrent': (data, state, send, done) => {
    // var d = debug(debugPrefix + ':create-torrent')
    var file = data.file
    var name = data.name
    console.log(name, file)
    state.swarm.seed(file, {name}, torrent => {
      send('create log entry', Object.assign(data, {
        magnetLink: torrent.magnetURI
      }), err => err && done(err))
    })
  },

  'attach dataUrl': (data, state, send, done) => {
    //  var d = debug(debugPrefix + ':get-torrent')
    var magnetLink = data.magnetLink
    var torrent = state.swarm.get(magnetLink)

    function handleTorrent (torrent) {
      torrent.files[0].getBlobURL((err, dataUrl) => {
        if (err) done(err)
        send('append log entry to state', Object.assign(data, {
          dataUrl
        }), err => err && done(err))
      })
    }

    if (torrent) {
      handleTorrent(torrent)
      return
    }
    state.swarm.add(magnetLink, {}, torrent => handleTorrent(torrent))
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
