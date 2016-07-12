const html = require('choo/html')

module.exports = streamView

function latestBlobs (state) {
  return state.blobs.map((elem, index) => {
    return html`
      <li>
        ${elem.date}
      </li>
    `
  })
}

function streamView (state, prev, send) {
  return html`
    <main>
      <h1>blob-stream</h1>
      <form><input type=file accept=image/* multiple
        onchange=${(e) => send('fileSelected', {fileList: e.target.files})}></form>
      <ol>
        ${latestBlobs(state)}
      </ol>
    </main>
  `
}
