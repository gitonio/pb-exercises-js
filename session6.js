var ecc = require('./ecc.js')
var helper = require('./helper.js')
var tx = require('./tx.js')
var script = require('./script.js')
var BN = require('bn.js')
var Readable = require('stream').Readable
var block = require('./block.js')


// Exercise 3.1
hexScriptPubkey = '76a914338c84849423992471bffb1a54a8d9b1d69dc28a88ac';
scriptPubkey = Buffer.from(hexScriptPubkey,'hex')
s = script.Script.parse(scriptPubkey)
h160 = s.elements[2]
console.log(helper.h160ToP2pkhAddress(h160))

// Exercise 4.1
hexBlock = '020000208ec39428b17323fa0ddec8e887b4a7c53b8c0a0a220cfd0000000000000000005b0750fce0a889502d40508d39576821155e9c9e3f5c3157f961db38fd8b25be1e77a759e93c0118a4ffd71d'
binBlock = Buffer.from(hexBlock,'hex')
result = helper.doubleSha256(binBlock)
console.log(result)

// Version Signaling Example
readable = new Readable()
readable.push(binBlock)
readable.push(null)
   
b = block.Block.parse(readable)
version = b.version
console.log('BIP9: ', (version >> 29) == 1)
console.log('BIP91: ', (version >> 4 & 1) == 1)
console.log('BIP141: ', (version >> 1 & 1) == 1)


