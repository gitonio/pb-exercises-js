var ecc = require('./ecc.js')
var helper = require('./helper.js')
var tx = require('./tx.js')
var script = require('./script.js')
var BN = require('bn.js')
var Readable = require('stream').Readable
var block = require('./block.js')


// Exercise 3.1
console.log('Exercise 3.1')
hexScriptPubkey = '76a914338c84849423992471bffb1a54a8d9b1d69dc28a88ac';
scriptPubkey = Buffer.from(hexScriptPubkey,'hex')
s = script.Script.parse(scriptPubkey)
h160 = s.elements[2]
console.log(helper.h160ToP2pkhAddress(h160))

// Exercise 4.1
console.log('\nExercise 4.1')
hexBlock = '020000208ec39428b17323fa0ddec8e887b4a7c53b8c0a0a220cfd0000000000000000005b0750fce0a889502d40508d39576821155e9c9e3f5c3157f961db38fd8b25be1e77a759e93c0118a4ffd71d'
binBlock = Buffer.from(hexBlock,'hex')
result = helper.doubleSha256(binBlock)
console.log(result)

// Version Signaling Example
console.log('\nVersion Signaling Example')
readable = new Readable()
readable.push(binBlock)
readable.push(null)
   
b = block.Block.parse(readable)
version = b.version
console.log('BIP9: ', (version >> 29) == 1)
console.log('BIP91: ', (version >> 4 & 1) == 1)
console.log('BIP141: ', (version >> 1 & 1) == 1)


console.log('\nCalculating Target from Bits Example')
bits = Buffer.from('e93c0118','hex')
let exponent = new BN(bits[bits.length-1])
let coefficient = new BN(helper.littleEndianToInt(bits.slice(0,3)))
target = (new BN(2)).pow(exponent.subn(3).muln(8)).mul(coefficient) 
console.log(target.toString(16))

console.log('\nCalculating Difficulty from Target Example')
bitsMin = Buffer.from('ffff001d','hex')
exponentMin = new BN(bitsMin[bitsMin.length-1])
coefficientMin = new BN(helper.littleEndianToInt(bitsMin.slice(0,3)))
min = (new BN(2)).pow(exponentMin.subn(3).muln(8)).mul(coefficientMin)
console.log(min.toString(16))

difficulty = min.div(target)
console.log(difficulty.toString(10))

// Exercise 6.1
console.log('\nExercise 6.1')
bits = Buffer.from('f2881718','hex')
exponent = new BN(bits[bits.length-1])
coefficient = new BN(helper.littleEndianToInt(bits.slice(0,3)))
target = (new BN(2)).pow(exponent.subn(3).muln(8)).mul(coefficient) 
console.log(target.toString(16))

bitsMin = Buffer.from('ffff001d','hex')
exponentMin = new BN(bitsMin[bitsMin.length-1])
coefficientMin = new BN(helper.littleEndianToInt(bitsMin.slice(0,3)))
min = (new BN(2)).pow(exponentMin.subn(3).muln(8)).mul(coefficientMin)
console.log(min.toString(16))

difficulty = min.div(target)
console.log(difficulty.toString(10))

// Exercise 7.1
console.log('\nExercise 7.1')

hexBlock = '04000000fbedbbf0cfdaf278c094f187f2eb987c86a199da22bbb20400000000000000007b7697b29129648fa08b4bcd13c9d5e60abb973a1efac9c8d573c71c807c56c3d6213557faa80518c3737ec1'
binBlock = Buffer.from(hexBlock,'hex')
sha = Buffer.from( helper.doubleSha256(binBlock),'hex' )
proof = helper.littleEndianToInt(sha)
console.log(proof)

// Version Signaling Example
readable = new Readable()
readable.push(binBlock)
readable.push(null)
   
b = block.Block.parse(readable)
target = b.target()
console.log(proof < target)