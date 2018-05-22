
var ecc = require('./ecc.js')
var helper = require('./helper.js')
var tx = require('./tx.js')
var script = require('./script.js')
var BN = require('bn.js')
var Readable = require('stream').Readable


// Exercise 1.1
console.log('\nExercise 1.1')
hexScript = '767695935687'
s = script.Script.parse(Buffer.from(hexScript,'hex'))
console.log(s.toString())

// Exercise 2.1
console.log('\nExercise 2.1')
hexScript = '6e879169a77ca787'
s = script.Script.parse(Buffer.from(hexScript,'hex'))
console.log(s.toString())

// Exercise 3.1
console.log('\nExercise 3.1')
prevTx = Buffer.from('d1c789a9c60383bf715f3f6ad9d14b91fe55f3deb369fe5d9280cb1a01793f81','hex') 
txIn = new tx.TxIn(prevTx, 0, Buffer.from([]), 0xffffffff, {})
/*
tx = txIn.fetchTx(0).then( tx => {
	console.log(tx)
	return tx
})
*/

tx0 = txIn.fetchTx(0)
console.log(tx0.toString())

// Exercise 4.1
console.log('\nExercise 4.1')
prevIndex = 0
prevOutput = tx0.outputs[prevIndex]
console.log(prevOutput.amount)
console.log(prevOutput.scriptPubkey.toString())


// Exercise  5.1
console.log('\nExercise 5.1')
hexTx = '010000000456919960ac691763688d3d3bcea9ad6ecaf875df5339e148a1fc61c6ed7a069e010000006a47304402204585bcdef85e6b1c6af5c2669d4830ff86e42dd205c0e089bc2a821657e951c002201024a10366077f87d6bce1f7100ad8cfa8a064b39d4e8fe4ea13a7b71aa8180f012102f0da57e85eec2934a82a585ea337ce2f4998b50ae699dd79f5880e253dafafb7feffffffeb8f51f4038dc17e6313cf831d4f02281c2a468bde0fafd37f1bf882729e7fd3000000006a47304402207899531a52d59a6de200179928ca900254a36b8dff8bb75f5f5d71b1cdc26125022008b422690b8461cb52c3cc30330b23d574351872b7c361e9aae3649071c1a7160121035d5c93d9ac96881f19ba1f686f15f009ded7c62efe85a872e6a19b43c15a2937feffffff567bf40595119d1bb8a3037c356efd56170b64cbcc160fb028fa10704b45d775000000006a47304402204c7c7818424c7f7911da6cddc59655a70af1cb5eaf17c69dadbfc74ffa0b662f02207599e08bc8023693ad4e9527dc42c34210f7a7d1d1ddfc8492b654a11e7620a0012102158b46fbdff65d0172b7989aec8850aa0dae49abfb84c81ae6e5b251a58ace5cfeffffffd63a5e6c16e620f86f375925b21cabaf736c779f88fd04dcad51d26690f7f345010000006a47304402200633ea0d3314bea0d95b3cd8dadb2ef79ea8331ffe1e61f762c0f6daea0fabde022029f23b3e9c30f080446150b23852028751635dcee2be669c2a1686a4b5edf304012103ffd6f4a67e94aba353a00882e563ff2722eb4cff0ad6006e86ee20dfe7520d55feffffff0251430f00000000001976a914ab0c0b2e98b1ab6dbf67d4750b0a56244948a87988ac005a6202000000001976a9143c82d7df364eb6c75be8c80df2b3eda8db57397088ac46430600'
bytTx = Buffer.from(hexTx, 'hex')
readable = new Readable()
readable.push(bytTx)
readable.push(null)
		
t = tx.Tx.parse(readable)

//# initialize input sum
inpuSum = 0
outputSum = 0
//# iterate over all inputs (t.tx_ins)
x = t.inputs.map(obj => {
	return obj.value()
})
y = t.outputs.map(obj => {
	return obj.amount
})

		
const reducer = (ac,cu) => ac + cu;
inputSum = x.reduce(reducer)	
outputSum = y.reduce(reducer)
const fee = inputSum - outputSum
console.log('fee', fee)	



// double sha 256 to get Z
console.log('\n double sha 256 to get z')
modifiedTx = Buffer.from('0100000001813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1000000001976a914a802fc56c704ce87c42d7c92eb75e7896bdc41ae88acfeffffff02a135ef01000000001976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc762dd5423e332166702cb75f40df79fea1288ac1943060001000000','hex')
h = helper.doubleSha256(modifiedTx)
z = new BN(h,16)
console.log(z.toString(16))

console.log('\n Validation example')
readable = new Readable()
readable.push(Buffer.from('0100000001813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1000000006b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef01000000001976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc762dd5423e332166702cb75f40df79fea1288ac19430600','hex'))
readable.push(null)
transaction = tx.Tx.parse(readable)
txIn = transaction.inputs[0]

sig = ecc.Signature.parse(txIn.derSignature())

point = ecc.S256Point.parse(txIn.secPubkey())
console.log(point.verify(z, sig))

// Exercise 7.1
console.log('\nExercise 7.1')
sec = Buffer.from('0349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278a','hex')
z = new BN('27e0c5994dec7824e56dec6b2fcb342eb7cdb0d0957c2fce9882f715e85d81a6','hex')
r = new BN('ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f','hex')
s = new BN('7a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed','hex')
point = ecc.S256Point.parse(sec)
sig = new ecc.Signature(r,s)
console.log(point.verify(z, sig))

der = Buffer.from('3045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed','hex')
point = ecc.S256Point.parse(sec)
sig = ecc.Signature.parse(der)
console.log(point.verify(z, sig))


// Exercise 8.1
console.log('\nExercise 8.1')
hexTx = Buffer.from('01000000012f5ab4d2666744a44864a63162060c2ae36ab0a2375b1c2b6b43077ed5dcbed6000000006a473044022034177d53fcb8e8cba62432c5f6cc3d11c16df1db0bce20b874cfc61128b529e1022040c2681a2845f5eb0c46adb89585604f7bf8397b82db3517afb63f8e3d609c990121035e8b10b675477614809f3dde7fd0e33fb898af6d86f51a65a54c838fddd417a5feffffff02c5872e00000000001976a91441b835c78fb1406305727d8925ff315d90f9bbc588acae2e1700000000001976a914c300e84d277c6c7bcf17190ebc4e7744609f8b0c88ac31470600','hex')
readable = new Readable()
readable.push(hexTx)
readable.push(null)
index = 0
t = tx.Tx.parse(readable)
txIn = t.inputs[index]

der = txIn.derSignature()
sig = ecc.Signature.parse(der)
sec = txIn.secPubkey()
hashType = txIn.hashType()

point = ecc.S256Point.parse(sec)
z = t.sigHash(index, hashType)
console.log(point.verify(z,sig))

