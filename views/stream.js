const html = require('choo/html')

module.exports = (state, prev, send) => html`
  <main>
    <h1>blob-stream</h1>
    <form><input type=file accept=image/* multiple
      onchange=${(e) => send('user selected files', {fileList: e.target.files})}></form>
    <ol>
      ${latestBlobs(state)}
    </ol>
  </main>
`

function latestBlobs (state) {
  return state.blobs.map((elem, index) => {
    return html`
      <li>
        <p>${humanReadableDate(elem.date)}</p>
        <img src=${elem.dataUrl}>
      </li>
    `
  })
}

function humanReadableDate (date) {
  date = new Date(date)
  return date.getDate() + '.' +
    (date.getMonth() + 1) + '.' +
    date.getFullYear() + ': ' +
    date.getHours() + ':' + date.getMinutes()
}

function getTorrent (magnetLink) {
  return magnetLink
}
