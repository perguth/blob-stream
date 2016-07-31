
var fs = require('fs')
var path = require('path')
var chokidar = require('chokidar') // file watcher
var flatfile = require('flat-file-db')
var WebTorrent = require('webtorrent')
var effects = require('../model/effects')

var pwd = path.dirname(require.main.filename) + '/'
var ephemeralFolder = pwd + 'ephemeral/'
var blobFolder = '../blob-stream'

function ensureFolderExists (folders) {
  folders.forEach(path => { if (!fs.existsSync(path)) fs.mkdirSync(path) })
}
ensureFolderExists([ephemeralFolder, blobFolder])

var db = flatfile(ephemeralFolder + 'known_files.db')

db.on('open', () => {
  var watcher = chokidar.watch(blobFolder, {ignored: /\.DS_Store/, depth: 0})

  watcher.on('addDir', path => {
    if (db.get(path)) return
    db.put(path, true)
    console.log('subdirectories are not supported, ignoring:', path)
  })

  var newFile = path => {
    if (db.get(path)) return
    console.log('adding file: ', path)
    db.put(path, true)
    addLogEntry(path)
  }
  watcher.on('change', newFile)
  watcher.on('add', newFile)

  watcher.on('unlink', path => {
    if (!db.get(path)) return
    db.rm(path, true)
  })
})

var hyperlog = require('hyperlog')
var levelup = require('level')
var leveldb = levelup('./ephemeral/hyperlog_state')
var log = hyperlog(leveldb)

function addLogEntry (file) {
  var data = {'file': file}
  var swarm = new WebTorrent()
  var state = {log, swarm}
  effects['create torrent'](data, state, (_, data) => {
    data = {'magnetLink': data.magnetLink}
    effects['create log entry'](data, state, _, err => err && console.log(err))
  })
}
