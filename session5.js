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
//console.log('script pubkey1', helper.p2pkhScript(h160).toString('hex'))
h160 = helper.decodeBase58('mnrVtF8DWjMu839VW3rBfgYaAfKk8983Xf')
txOuts.push(new tx.TxOut(0.10*100000000, helper.p2pkhScript(h160)))
txObj = new tx.Tx(1, txIns, txOuts, 0, true)
//console.log('script pubkey2', helper.p2pkhScript(h160).toString('hex'))

//# Step 3
hashType = 1
z = txObj.sigHash(0,hashType)
secret = new BN(8675309)
pk = new ecc.PrivateKey(secret)
//console.log('sign', pk.sign(z),'\n')
der = pk.sign(z).der()
//console.log('der', der.toString('hex'),'\n')

sig = Buffer.concat([der,Buffer.from([hashType])])
//console.log('sig',sig.toString('hex'),'\n')
sec = pk.point.sec()
//console.log('sec',sec.toString('hex'),'\n')
scriptSig = Buffer.concat([Buffer.from([sig.length]), sig, Buffer.from([sec.length]), sec])
//console.log('script_sig', scriptSig.toString('hex'),'\n')
scriptSig = Buffer.concat([Buffer.from([scriptSig.length]),scriptSig])
//console.log('script_sig', scriptSig.toString('hex'),'\n')
txObj.inputs[0].scriptSig = script.Script.parse(scriptSig)
//console.log('ss',txObj.inputs[0].scriptSig.toString(),'\n')
//console.log('inp ser', txObj.inputs[0].serialize().toString('hex'),'\n')
console.log(txObj.serialize().toString('hex'))


// Exercise 3.1
//Step 1
prevTx = Buffer.from('0025bc3c0fa8b7eb55b9437fdbd016870d18e0df0ace7bc9864efc38414147c8','hex')
prevIndex = 0
targetAddress = 'mnrVtF8DWjMu839VW3rBfgYaAfKk8983Xf'
targetAmount = .02
changeAddress = 'mzx5YhAH9kNHtcN481u6WkjeHjYtVeKVh2'
changeAmount = 1.07
secret = 8675309
priv = new ecc.PrivateKey(secret)

// initialize inputs
txIns = []
// create a new tx input
txIns.push(new tx.TxIn(prevTx, 0, Buffer.from([]),0xffffffff, {}))

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
//console.log(priv.point.address(true, true),priv.point.address(true,true) )

 if (priv.point.address(true,true) !== changeAddress) {
     throw new Error('Private Key does not correspond to Change Address, check priv_key and change_address')
 }
console.log('Script', txIns[0].scriptPubkey(true).toString())
// if (txIns[0].scriptPubkey(true).elements[2] != helper.decodeBase58(changeAddress) ){
//     throw new Error('Output is not something you can spend with this private key. Check that the prev_tx and prev_index are correct')
// }

 if (txObj.fee() > .05 * 100000000 || txObj.fee() <= 0) {
     throw new Error(`Check that the change amount is reasonable. Fee is ${txObj.fee()}`)
 }

console.log(txObj.serialize().toString('hex'))

//Exercise 4.1

hexRedeemScript = '5221022626e955ea6ea6d98850c994f9107b036b1334f18ca8830bfff1295d21cfdb702103b287eaf122eea69030a0e9feed096bed8045c8b98bec453e1ffac7fbdbd4bb7152ae'
redeemScript = Buffer.from(hexRedeemScript,'hex')
h160 = helper.hash160(redeemScript)
console.log(h160)

// P2SH address construction example
Buffer.concat([Buffer.from([0x05]), Buffer.from('74d691da1574e6b3c192ecfb52cc8984ee7b6c56','hex')])
console.log(helper.encodeBase58Checksum(Buffer.concat([Buffer.from([0x05]), Buffer.from('74d691da1574e6b3c192ecfb52cc8984ee7b6c56','hex')])))

// z for p2sh example
sha = helper.doubleSha256(Buffer.from('0100000001868278ed6ddfb6c1ed3ad5f8181eb0c7a385aa0836f01d5e4789e6bd304d87221a000000475221022626e955ea6ea6d98850c994f9107b036b1334f18ca8830bfff1295d21cfdb702103b287eaf122eea69030a0e9feed096bed8045c8b98bec453e1ffac7fbdbd4bb7152aeffffffff04d3b11400000000001976a914904a49878c0adfc3aa05de7afad2cc15f483a56a88ac7f400900000000001976a914418327e3f3dda4cf5b9089325a4b95abdfa0334088ac722c0c00000000001976a914ba35042cfe9fc66fd35ac2224eebdafd1028ad2788acdc4ace020000000017a91474d691da1574e6b3c192ecfb52cc8984ee7b6c56870000000001000000','hex'))

console.log(sha)

//p2sh verification example
z = new BN(sha,'hex')
point = ecc.S256Point.parse(Buffer.from('022626e955ea6ea6d98850c994f9107b036b1334f18ca8830bfff1295d21cfdb70','hex'))
sig = ecc.Signature.parse(Buffer.from('3045022100dc92655fe37036f47756db8102e0d7d5e28b3beb83a8fef4f5dc0559bddfb94e02205a36d4e4e6c7fcd16658c50783e00c341609977aed3ad00937bf4ee942a89937','hex'))
console.log(point.verify(z, sig))

// Exercise 6.1
hexSec = '03b287eaf122eea69030a0e9feed096bed8045c8b98bec453e1ffac7fbdbd4bb71'
hexDer = '3045022100da6bee3c93766232079a01639d07fa869598749729ae323eab8eef53577d611b02207bef15429dcadce2121ea07f233115c6f09034c0be68db99980b9a6c5e754022'
hexRedeemScript = '5221022626e955ea6ea6d98850c994f9107b036b1334f18ca8830bfff1295d21cfdb702103b287eaf122eea69030a0e9feed096bed8045c8b98bec453e1ffac7fbdbd4bb7152ae'
sec = Buffer.from(hexSec,'hex')
der = Buffer.from(hexDer,'hex')
redeemScript = Buffer.from(hexRedeemScript,'hex')

hexTx = '0100000001868278ed6ddfb6c1ed3ad5f8181eb0c7a385aa0836f01d5e4789e6bd304d87221a000000db00483045022100dc92655fe37036f47756db8102e0d7d5e28b3beb83a8fef4f5dc0559bddfb94e02205a36d4e4e6c7fcd16658c50783e00c341609977aed3ad00937bf4ee942a8993701483045022100da6bee3c93766232079a01639d07fa869598749729ae323eab8eef53577d611b02207bef15429dcadce2121ea07f233115c6f09034c0be68db99980b9a6c5e75402201475221022626e955ea6ea6d98850c994f9107b036b1334f18ca8830bfff1295d21cfdb702103b287eaf122eea69030a0e9feed096bed8045c8b98bec453e1ffac7fbdbd4bb7152aeffffffff04d3b11400000000001976a914904a49878c0adfc3aa05de7afad2cc15f483a56a88ac7f400900000000001976a914418327e3f3dda4cf5b9089325a4b95abdfa0334088ac722c0c00000000001976a914ba35042cfe9fc66fd35ac2224eebdafd1028ad2788acdc4ace020000000017a91474d691da1574e6b3c192ecfb52cc8984ee7b6c568700000000'
readable = new Readable()
readable.push(Buffer.from(hexTx,'hex'))
readable.push(null)

point = ecc.S256Point.parse(sec)
sig = ecc.Signature.parse(der)
t = tx.Tx.parse(readable)
t.inputs[0].scriptSig = script.Script.parse(redeemScript)
ser = t.serialize()
ser = Buffer.concat([ser, helper.intToLittleEndian(1,4)])
toSign = helper.doubleSha256(ser)
console.log(toSign)
z = new BN(toSign,'hex')
console.log(point.verify(z , sig))