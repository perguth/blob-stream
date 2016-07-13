/*global FileReader */

module.exports = {
  // asynchronous functions that emit an action when done
  // Signature of (data, state, send, done)
  fileSelected: (data, state, send, done) => {
    let fileList = data.fileList
    for (let prop in fileList) {
      if (isNaN(prop)) continue
      readFile(fileList.item(prop), send, done)
    }
  },

  handleFileBuffer: (data, state, send, done) => {
    let dataUrl = data.dataUrl
    let dateNow = Date.now()
    let entry = {dataUrl, dateNow}
    state.log.add(null, JSON.stringify(entry), err => err && done(err))
  }
}

function readFile (handle, send, done) {
  let reader = new FileReader()
  reader.onload = () => {
    send('handleFileBuffer', {dataUrl: reader.result}, err => err && done(err))
  }
  reader.readAsDataURL(handle)
}
