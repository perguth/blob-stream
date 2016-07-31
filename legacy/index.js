
var fs = require('fs')
var chokidar = require('chokidar') // file watcher
var flatfile = require('flat-file-db')

var path = require('path').dirname(require.main.filename) + '/'
var folder = path + 'ephemeral/'

if (!fs.existsSync(folder)) {
  console.log('creating `blob-stream` directory!')
  fs.mkdirSync(folder)
}

var db = flatfile(folder + 'known_files.db')

db.on('open', () => {
  var watcher = chokidar.watch(folder, {ignored: /\.DS_Store/, depth: 0})

  watcher.on('addDir', path => {
    if (db.get(path)) return
    db.put(path, true)
    console.log('subdirectories are not supported!', db.get(path))
  })

  var newFile = path => {
    if (db.get(path)) return
    console.log('adding file: ', path)
    db.put(path, true)
  }
  watcher.on('change', newFile)
  watcher.on('add', newFile)

  watcher.on('unlink', path => {
    if (!db.get(path)) return
    db.rm(path, true)
  })
})
