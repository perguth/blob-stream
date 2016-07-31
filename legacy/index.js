
var fs = require('fs')
var path = require('path')
var chokidar = require('chokidar') // file watcher
var flatfile = require('flat-file-db')

var pwd = path.dirname(require.main.filename) + '/'
var ephemeralFolder = pwd + 'ephemeral/'
var blobFolder = '../blob-stream'
var log = require('./hyperlog')({pwd, ephemeralFolder, blobFolder})

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
    log.add(path)
  }
  watcher.on('change', newFile)
  watcher.on('add', newFile)

  watcher.on('unlink', path => {
    if (!db.get(path)) return
    db.rm(path, true)
  })
})
