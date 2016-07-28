var fs = require('fs')
var chokidar = require('chokidar') // file watcher
var dirty = require('dirty') // DB
// var steed = require('steed') // async handling
// var rusha = new (require('rusha'))(24)
// var hash = input => rusha.digestFromString(input)

var path = require('path').dirname(require.main.filename)
var folder = path + '/ephemeral'

if (!fs.existsSync(folder)) {
  console.log('creating `blob-stream` directory!')
  fs.mkdirSync(folder)
}

var db = dirty(folder + 'known_files.db')

db.on('load', () => {
  var watcher = chokidar.watch(folder, {ignored: /\.DS_Store/, depth: 0})

  watcher.on('addDir', path => {
    if (db.get(path)) return
    if (!db.get(path)) db.set(path, true)
    console.log('subdirectories are not supported!', db.get(path))
  })

  var newFile = path => {
    if (db.get(path)) return
    if (!db.get(path)) db.set(path, true)
    console.log('file added: ', path, db.get(path))
  }
  watcher.on('change', newFile)
  watcher.on('add', newFile)

  watcher.on('unlink', path => {
    if (!db.get(path)) return
    db.rm(path, true)
  })
})
