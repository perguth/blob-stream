var hyperlog = require('hyperlog')
var memdb = require('memdb')

module.exports = () => hyperlog(memdb())
