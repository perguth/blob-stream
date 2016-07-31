var hyperlog = require('hyperlog')
var levelup = require('level')
var leveldb = levelup('./ephemeral/hyperlog_state')
var WebTorrentHybrid = require('webtorrent-hybrid')
var log = hyperlog(leveldb)
var effects = require('../model/effects')
var subscriptions = require('../model/subscriptions')({
  wrtc: require('electron-webrtc')({headless: true})
}, log)

var swarm = new WebTorrentHybrid()
var state = {log, swarm}

module.exports = {
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

var findWebRTCPeers = subscriptions.find(elem => elem.name === 'findWebRTCPeers')

findWebRTCPeers((next, data) => {
  console.log('findWebRTCPeers ->', next)
  effects[next](data, state, null, err => err && console.log(err))
})

var subscribeToLogChanges = subscriptions.find(elem => elem.name === 'subscribeToLogChanges')

subscribeToLogChanges((next, data) => {
  console.log('subscribeToLogChanges ->', next, data)
  var send = (next, data) => {
    console.log('... ->', next)
  }
  effects[next](data, state, send, err => err && console.log(err))
})
