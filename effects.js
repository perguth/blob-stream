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
  handleFileBuffer: (fileBuffer) => console.log(fileBuffer)
}

function readFile (handle, send, done) {
  let reader = new FileReader()
  reader.onload = () => {
    send('handleFileBuffer', {fileBuffer: reader.result})
    // throws but shoudnt:
    // done()
  }
  reader.readAsArrayBuffer(handle)
}
