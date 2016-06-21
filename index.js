var hyperlog = require('hyperlog')
var levelup = require('levelup')
var steed = require('steed')

var db1 = levelup('./db1', { db: require('memdown') })
var db2 = levelup('./db2', { db: require('memdown') })
var db3 = levelup('./db3', { db: require('memdown') })

var log1 = hyperlog(db1)
var log2 = hyperlog(db2)
var log3 = hyperlog(db3)

steed.waterfall([
  function (cb) { // a
    log1.add(null, 'a: hello', function (err, node) {
      console.log('inserted node', node)
      cb(null, node)
    })
  },
  function (node, cb) { // a
    log1.add([node.key], 'a: world', function (err, node) {
      console.log('inserted new node', node)
      cb()
    })
  },
  function (cb) { // b
    log2.add(null, 'b: world', function (err, node) {
      console.log('inserted new node', node)
      cb()
    })
  },
  function (cb) {
    console.log('---- syncing a:b -----')

    var replicate1 = log1.replicate()
    var replicate2 = log2.replicate()

    replicate1.pipe(replicate2).pipe(replicate1)

    replicate1.on('end', function () {
      console.log('replication ended')
      cb()
    })
  },
  function (cb) {
    console.log('---- syncing a:c -----')

    var replicate1 = log1.replicate()
    var replicate3 = log3.replicate()

    replicate1.pipe(replicate3).pipe(replicate1)

    replicate1.on('end', function () {
      console.log('replication ended')
      cb()
    })
  },
  function (cb) { // c
    log1.add(null, 'a: hello', function (err, node) {
      console.log('inserted node', node)
      cb(null, node)
    })
  }
], function (err, res) {
  log1.createReadStream().on('data', buff => console.log(buff.value.toString()))
})
