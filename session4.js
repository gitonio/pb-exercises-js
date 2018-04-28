var ecc = require('./ecc.js')
var helper = require('./helper.js')
var tx = require('./tx.js')
var script = require('./script.js')
var BN = require('bn.js')


// Exercise 1.1
hexScript = '767695935687'
s = new script.Script(Buffer.from(hexScript,'hex'))
s.toString()

// Exercise 2.1
hexScript = '6e879169a77ca787'
s = new script.Script(Buffer.from(hexScript,'hex'))
s.toString()



