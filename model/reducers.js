module.exports = {
  // synchronous functions that modify state
  // Signature of (data, state)

  'append log entry to state': (data, state) => {
    var dataUrl = data.dataUrl
    var date = data.dateNow
    var newState = Object.assign({}, state)

    newState.blobs.unshift({date, dataUrl})
    return newState
  }
}
