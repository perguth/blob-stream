module.exports = {
  // synchronous functions that modify state
  // Signature of (data, state)

  'append log entry to state': (data, state) => {
    var entry = JSON.parse(data.value.toString())
    var dataUrl = entry.dataUrl
    var date = entry.dateNow
    var newState = Object.assign({}, state)

    newState.blobs.unshift({date, dataUrl})
    return newState
  }
}
