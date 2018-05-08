var ecc = require('./ecc.js')
var helper = require('./helper.js')
var tx = require('./tx.js')
var script = require('./script.js')
var BN = require('bn.js')
var Readable = require('stream').Readable

// Exercise 1.1
//Step 1
txIns = []
prevTx = Buffer.from('0025bc3c0fa8b7eb55b9437fdbd016870d18e0df0ace7bc9864efc38414147c8','hex')
txIns.push(new tx.TxIn(prevTx, 0, Buffer.from([]),0xffffffff))

//# Step 2
txOuts = []
h160 = helper.decodeBase58('mzx5YhAH9kNHtcN481u6WkjeHjYtVeKVh2')
txOuts.push(new tx.TxOut(0.99*100000000, helper.p2pkhScript(h160)))
console.log('script pubkey1', helper.p2pkhScript(h160).toString('hex'))
h160 = helper.decodeBase58('mnrVtF8DWjMu839VW3rBfgYaAfKk8983Xf')
txOuts.push(new tx.TxOut(0.10*100000000, helper.p2pkhScript(h160)))
txObj = new tx.Tx(1, txIns, txOuts, 0, true)
console.log('script pubkey2', helper.p2pkhScript(h160).toString('hex'))

//# Step 3
hashType = 1
z = txObj.sigHash(0,hashType)
secret = new BN(8675309)
pk = new ecc.PrivateKey(secret)
console.log('sign', pk.sign(z),'\n')
der = pk.sign(z).der()
console.log('der', der.toString('hex'),'\n')

sig = Buffer.concat([der,Buffer.from([hashType])])
console.log('sig',sig.toString('hex'),'\n')
sec = pk.point.sec()
console.log('sec',sec.toString('hex'),'\n')
scriptSig = Buffer.concat([Buffer.from([sig.length]), sig, Buffer.from([sec.length]), sec])
console.log('script_sig', scriptSig.toString('hex'),'\n')
scriptSig = Buffer.concat([Buffer.from([scriptSig.length]),scriptSig])
console.log('script_sig', scriptSig.toString('hex'),'\n')
txObj.inputs[0].scriptSig = script.Script.parse(scriptSig)
console.log('ss',txObj.inputs[0].scriptSig.toString(),'\n')
console.log('inp ser', txObj.inputs[0].serialize().toString('hex'),'\n')
console.log(txObj.serialize().toString('hex'))


// Exercise 3.1
//Step 1
prevTx = Buffer.from('0025bc3c0fa8b7eb55b9437fdbd016870d18e0df0ace7bc9864efc38414147c8','hex')
prevIndex = 0
targetAddress = 'mnrVtF8DWjMu839VW3rBfgYaAfKk8983Xf'
targetAmount = .02
changeAddress = 'mzx5YhAH9kNHtcN481u6WkjeHjYtVeKVh2'
changeAmount = 1.07
secret = new BN('8675309',10)
priv = new ecc.PrivateKey(secret)

// initialize inputs
txIns = []
// create a new tx input
txIns.push(new tx.TxIn(prevTx, 0, Buffer.from([]),0xffffffff))

//# initialize outputs
txOuts = []
// decode the hash160 from the target address
h160 = helper.decodeBase58(targetAddress)
scriptPubkey = helper.p2pkhScript(h160)
targetSatoshis = targetAmount*100000000
txOuts.push(new tx.TxOut(targetSatoshis, scriptPubkey))

h160 = helper.decodeBase58(changeAddress)
scriptPubkey =  helper.p2pkhScript(h160)
changeSatoshis = changeAmount*100000000
txOuts.push(new tx.TxOut(changeSatoshis, scriptPubkey))
txObj = new tx.Tx(1, txIns, txOuts, 0, true)

//# Step 3
txObj.signInput(0, priv, 1)
console.log(priv.point.address(true),priv.point.address(true,true) !== changeAddress)

// if (priv.point.address(true,true) !== changeAddress) {
//     throw new Error('Private Key does not correspond to Change Address, check priv_key and change_address')
// }

// if (txIns[0].scriptPubkey(true).elements[2] != helper.decodeBase58(changeAddress) ){
//     throw new Error('Output is not something you can spend with this private key. Check that the prev_tx and prev_index are correct')
// }

// if (txObj.fee() > .05 * 100000000 || txObj.fee() <= 0) {
//     throw new Error(`Check that the change amount is reasonable. Fee is ${txObj.fee()}`)
// }

console.log(txObj.serialize().toString('hex'))

//Exercise 4.1

hexRedeemScript = '5221022626e955ea6ea6d98850c994f9107b036b1334f18ca8830bfff1295d21cfdb702103b287eaf122eea69030a0e9feed096bed8045c8b98bec453e1ffac7fbdbd4bb7152ae'
redeemScript = Buffer.from(hexRedeemScript,'hex')
h160 = helper.hash160(redeemScript)
console.log(h160.toString('hex'))