const choo = require('choo')
const app = choo()
const hyperlog = require('hyperlog')
const levelup = require('levelup')

var db = levelup('./db', { db: require('memdown') })
var log = hyperlog(db)

const model = {
  // models are objects that contain initial state, subscriptions, effects and reducers.
  state: {
    log,
    blobs: []
  },
  reducers: require('./model/reducers'),
  subscriptions: require('./model/subscriptions')(log),
  effects: require('./model/effects')
}

app.model(model)

const streamView = require('./views/stream.js')

app.router((route) => [
  route('/', streamView)
])

const tree = app.start()
document.body.appendChild(tree)
