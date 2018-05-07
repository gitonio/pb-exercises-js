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
prevTx = Buffer.from('2758794a7a5c68ecd8b813f20fa3058adfcafa68c60afe499edbc3eba42d10a8','hex')
prevIndex = 0
targetAddress = 'mnrVtF8DWjMu839VW3rBfgYaAfKk8983Xf'
targetAmount = .02
changeAddress = 'mzx5YhAH9kNHtcN481u6WkjeHjYtVeKVh2'
changeAmount = .029
secret = new BN('1800555555518005555555',10)
priv = new ecc.PrivateKey(secret)

txIns = []

txIns.push(new tx.TxIn(prevTx, 0, Buffer.from([]),0xffffffff))
console.log('tx_ins1', txIns[0].scriptSig.toString())
//# Step 2
txOuts = []
h160 = helper.decodeBase58(targetAddress)
scriptPubkey = helper.p2pkhScript(h160)
targetSatoshis = targetAmount*100000000
txOuts.push(new tx.TxOut(targetSatoshis, scriptPubkey))
console.log('script pubkey1', helper.p2pkhScript(h160).toString('hex'))
h160 = helper.decodeBase58(changeAddress)
scriptPubkey =  helper.p2pkhScript(h160)
changeSatoshis = changeAmount*100000000
txOuts.push(new tx.TxOut(changeSatoshis, scriptPubkey))
txObj = new tx.Tx(1, txIns, txOuts, 0, true)
console.log('script pubkey2', helper.p2pkhScript(h160).toString('hex'))
console.log(txObj)
console.log('tx_ins2', txObj.inputs[0].scriptSig.toString())
//# Step 3
txObj.signInput(0, priv, 1)
