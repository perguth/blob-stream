module.exports = {
  // synchronous functions that modify state
  // Signature of (data, state)
  logGrew: (data, state) => {
    let dataUrl = data.node.value.toString()
    let newState = Object.assign({}, state)

    newState.blobs.unshift({dataUrl})
    return newState
  }
}
