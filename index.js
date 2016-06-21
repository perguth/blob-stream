const choo = require('choo')
const app = choo()

var state = {}
var reducers = {
  print: (action, state) => ({ title: action.payload })
}
var subscriptions = [
  (send) => setInterval(() => {send('print', { payload: 'dawg?' })}, 1000)
]
var effects = {
  print: (action, reducer) => {
    console.log(action.payload)
    console.log(reducer)
  }
}

var model = {state, reducers, subscriptions, effects}
app.model(model)

const mainView = (params, state, send) => choo.view`
  <main>
    <h1>blob-stream</h1>
    <input
      type="text"
      oninput=${(e) => send('update', { value: e.target.value })}>
  </main>
`

app.router((route) => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
