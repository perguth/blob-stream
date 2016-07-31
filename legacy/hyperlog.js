var hyperlog = require('hyperlog')
var levelup = require('level')
var leveldb = levelup('./ephemeral/hyperlog_state')
var WebTorrentHybrid = require('webtorrent-hybrid')
var log = hyperlog(leveldb)
var effects = require('../model/effects')
var subscriptions = require('../model/subscriptions')({
  wrtc: require('electron-webrtc')({headless: true})
}, log)
var fileExists = require('file-exists')
var fs = require('fs')

var swarm = new WebTorrentHybrid()
var state = {log, swarm}
var blobFolder

module.exports = (path) => {
  blobFolder = path.blobFolder
  return {
    add: (file) => {
      console.log('adding', file)
      var data = {'file': file}
      var send = (send, data) => {
        console.log('create torrent', data.magnetLink)
        effects[send](data, state, null, err => err && console.log(err))
      }
      effects['create torrent'](data, state, send, err => err && console.log(err))
    }
  }
}

var findWebRTCPeers = subscriptions.find(elem => elem.name === 'findWebRTCPeers')

findWebRTCPeers((next, data) => {
  console.log('findWebRTCPeers ->', next)
  effects[next](data, state, null, err => err && console.log(err))
})

var subscribeToLogChanges = subscriptions.find(elem => elem.name === 'subscribeToLogChanges')

subscribeToLogChanges((next, data) => {
  console.log('subscribeToLogChanges ->', next, data)

  function writeToDisk (torrent) {
    console.log('writeToDisk')
    var fqn = blobFolder + '/' + torrent.name
    if (fileExists(fqn)) {
      console.log('file exists', torrent.name)
      return
    }
    var ws = fs.createWriteStream(fqn)
    torrent.files[0].createReadStream().pipe(ws)
  }

  var send = (next, data) => {
    console.log('got torrent', data.torrent)
    var torrent = data.torrent
    writeToDisk(torrent)
  }
  effects[next](data, state, send, err => err && console.log(err))
})
