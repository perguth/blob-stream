var hyperlog = require('hyperlog')
var levelup = require('level')
var leveldb = levelup('./ephemeral/hyperlog_state')
var WebTorrent = require('webtorrent')
var log = hyperlog(leveldb)
var effects = require('../model/effects')
var subscriptions = require('../model/subscriptions')({
  wrtc: require('electron-webrtc')()
}, log)

var swarm = new WebTorrent()
var state = {log, swarm}

module.exports = {
  add: (file) => {
    console.log('adding', file)
    var data = {'file': file}
    var send = (send, data) => {
      console.log('create torrent', data.magnetLink)
      effects[send](data, state, null, err => !err && console.log(err))
    }
    effects['create torrent'](data, state, send, err => !err || console.log(err))
  }
}

var findWebRTCPeers = subscriptions.find(elem => elem.name === 'findWebRTCPeers')

findWebRTCPeers((send, data) => {
  console.log('findWebRTCPeers:', send, data)
  effects[send](data, state, null, err => !err && console.log(err))
})
