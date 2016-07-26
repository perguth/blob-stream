const choo = require('choo')
const app = choo()
const hyperlog = require('./hyperlog')()

const model = {
  // models are objects that contain initial state, subscriptions, effects and reducers.
  state: {
    log: hyperlog,
    peers: new Set(),
    blobs: []
  },
  reducers: require('./model/reducers'),
  subscriptions: require('./model/subscriptions')(hyperlog),
  effects: require('./model/effects')
}

app.model(model)

const streamView = require('./views/stream.js')

app.router((route) => [
  route('/', streamView)
])

const tree = app.start()
document.body.appendChild(tree)
