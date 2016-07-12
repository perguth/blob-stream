/*global FileReader */

module.exports = {
  // asynchronous functions that emit an action when done
  // Signature of (data, state, send, done)
  fileSelected: (data, state, send) => {
    let fileList = data.fileList
    for (let prop in fileList) {
      if (isNaN(+prop)) continue
      readFile(fileList.item(prop), send)
    }
  },
  handleFileBuffer: (fileBuffer) => console.log(fileBuffer)
}

function readFile (handle, send) {
  let reader = new FileReader()
  reader.onload = () => {
    send('handleFileBuffer', {fileBuffer: reader.result})
  }
  reader.readAsArrayBuffer(handle)
}
