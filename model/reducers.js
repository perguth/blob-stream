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
  },

  'add peer': (data, state) => {
    console.log('adding peer to state', data.id)
    var newState = Object.assign({}, state)
    newState.peers.add(data.peer)
    return newState
  },

  'delete peer': (data, state) => {
    var newState = Object.assign({}, state)
    newState.peers.delete(data.peer)
    return newState
  }
}
