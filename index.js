const choo = require('choo')
const app = choo()
const hyperlog = require('hyperlog')
const levelup = require('levelup')

var db = levelup('./db', { db: require('memdown') })
var log = hyperlog(db)

var state = {
  blobs: [
    {date: '08.08.1985'},
    {date: '13.03.1987'}
  ]
}
var reducers = {
  // synchronous functions that modify state
  // Signature of (data, state)
  logGrew: (data, state) => {
    let newState = Object.assign({}, state)
    newState.blobs.unshift({date: data.node.value.toString()})
    return newState
  }
}
var subscriptions = [
  // read-only data sources that emit actions
  // Signature of (send, done)
  (send, done) => {
    let changesStream = log.createReadStream({live: true})
    changesStream.on('data', function (node) {
      send('logGrew', {'node': node}, err => err && send(err))
    })
  }
]

const model = {
  // models are objects that contain initial state, subscriptions, effects and reducers.
  state, reducers, subscriptions, effects: require('./effects')
}

app.model(model)

const streamView = require('./views/streamView.js')

app.router((route) => [
  route('/', streamView)
])

const tree = app.start()
document.body.appendChild(tree)

// append something to the log
log.add(null, '14.02.1954', function (err, node) {
  if (err) console.log(err)
  console.log('inserted node')
})
