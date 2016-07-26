const hyperlog = require('hyperlog')
const levelup = require('levelup')

var db = levelup('./db', { db: require('memdown') })

module.exports = () => hyperlog(db)
