const choo = require('choo')

module.exports = streamView

function latestBlobs (state) {
  return state.blobs.map((elem, index) => {
    return choo.view`
      <li>
        ${elem.date}
      </li>
    `
  })
}

function streamView (params, state, send) {
  return choo.view`
    <main>
      <h1>blob-stream</h1>
      <form><input type=file></form>
      <ol>
        ${latestBlobs(state)}
      </ol>
    </main>
  `
}
