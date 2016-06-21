const choo = require('choo')
const app = choo()

app.model({
  state: { title: 'Set the title' },
  reducers: {
    update: (action, state) => ({ title: action.value })
  },
  subscriptions: [
    (send) => setInterval(() => {send('print', { payload: 'dog?' })}, 1000)
  ],
  effects: {
    print: (action) => {
      console.log(action.payload)
    }
  }
})

const mainView = (params, state, send) => choo.view`
  <main>
    <h1>${state.title}</h1>
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
