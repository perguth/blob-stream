const choo = require('choo')
const app = choo()

var state = {
  blobs: [
    {date: '08.08.1985'},
    {date: '13.03.1987'}
  ]
}
var reducers = {
  // synchronous functions that modify state
}
var subscriptions = [
  // read-only data sources that emit actions
]
var effects = {
  // asynchronous functions that emit an action when done
}

const model = {
  // models are objects that contain initial state, subscriptions, effects and reducers.
  state, reducers, subscriptions, effects
}

app.model(model)

const streamView = require('./views/streamView.js')

app.router((route) => [
  route('/', streamView)
])

const tree = app.start()
document.body.appendChild(tree)
