var { assert, expect} = require('chai');
var Tx = require('../tx');
var Script = require('../script')
var BN = require('bn.js')
var Readable = require('stream').Readable
var ecc = require('../ecc')
var helper = require('../helper')


 describe('TxTest', function() {
	
 	rawTx = Buffer.from('0100000001813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1000000006b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef01000000001976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc762dd5423e332166702cb75f40df79fea1288ac19430600','hex')
	rawTx2 = Buffer.from('76a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac','hex') 
	readable = new Readable()
	readable.push(rawTx)
	readable.push(null)
		
	tx = Tx.Tx.parse(readable)
	sc = new Script.Script(rawTx2);

	it('test parse version', function() {
		assert.equal(tx.version, 1);
	})

	 
	it('test parse inputs', function() {
		assert.equal(tx.inputs.length,1)
		want = Buffer.from('d1c789a9c60383bf715f3f6ad9d14b91fe55f3deb369fe5d9280cb1a01793f81','hex');
		assert.deepEqual(tx.inputs[0].prevTx, want);
		assert.deepEqual(tx.inputs[0].prevIndex, 0)
		want = Buffer.from('483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278a','hex')
		
		assert.deepEqual(tx.inputs[0].scriptSig.serialize(), want) 
		assert.deepEqual(tx.inputs[0].sequence, 0xfffffffe)
	})
	
	it('test_parse_outputs', function() {
		assert.equal(tx.outputs.length,2)
		want = 32454049
		assert.equal(tx.outputs[0].amount, want)
		want = Buffer.from('76a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac','hex')
		assert.deepEqual(tx.outputs[0].scriptPubkey.serialize(), want)
		want = 10011545
		assert.equal(tx.outputs[1].amount, want)
		want = Buffer.from('76a9141c4bc762dd5423e332166702cb75f40df79fea1288ac','hex')
		assert.deepEqual(tx.outputs[1].scriptPubkey.serialize(), want)
	})
	
	it('test parse locktime', function() {
		assert.deepEqual(tx.locktime, 410393);

	})
	
	it('test der signature', function() {
		want = '3045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed'
		der = tx.inputs[0].derSignature()
		hashType = tx.inputs[0].hashType()
		assert.equal(der.toString('hex'), want)
		assert.equal(hashType, SIGHASH_ALL)

	})
	
	it('test sec pubkey', function() {
		want = '0349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278a'
		assert.equal(tx.inputs[0].secPubkey().toString('hex'), want)
	})
	
	it('test_serialize', function() {

		assert.deepEqual(tx.serialize(), rawTx)

	})
	
	
	it('test input value async', function() {

		txHash = 'd1c789a9c60383bf715f3f6ad9d14b91fe55f3deb369fe5d9280cb1a01793f81'
		index = 0
		let txIn = new Tx.TxIn(Buffer.from(txHash,'hex'), index, Buffer.from([]),0, {})
		txIn.valueAsync().then(data => {
			want = 42505594
			assert.equal(data, want) 
	
		})
		want = 42505594
		assert.equal(txIn.value(), want);
		
	})
	
	
	it('test_input_value', function() {

		txHash = 'd1c789a9c60383bf715f3f6ad9d14b91fe55f3deb369fe5d9280cb1a01793f81'
		index = 0
		let txIn = new Tx.TxIn(Buffer.from(txHash,'hex'), index, Buffer.from([]),0, {})
		want = 42505594
		assert.equal(txIn.value(), want);
		
	})

	
	
	it('test input pubkey async', function() {
		txHash = 'd1c789a9c60383bf715f3f6ad9d14b91fe55f3deb369fe5d9280cb1a01793f81'
		index = 0
		txIn = new Tx.TxIn(Buffer.from(txHash,'hex'), index, Buffer.from([]),0, {})
		txIn.scriptPubkeyAsync().then(data => {
			want = Buffer.from('76a914a802fc56c704ce87c42d7c92eb75e7896bdc41ae88ac','hex');
			assert.deepEqual(data.serialize(),want)
		})

	})
	
	
	it('test_input_pubkey', function() {
		txHash = 'd1c789a9c60383bf715f3f6ad9d14b91fe55f3deb369fe5d9280cb1a01793f81'
		index = 0
		txIn = new Tx.TxIn(Buffer.from(txHash,'hex'), index, Buffer.from([]),0, {})
		got = txIn.scriptPubkey().serialize();
			want = Buffer.from('76a914a802fc56c704ce87c42d7c92eb75e7896bdc41ae88ac','hex');
			assert.deepEqual(got,want)
		

	})
	
	
	it('test fee async', function(){
		rawTx = Buffer.from('0100000001813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1000000006b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef01000000001976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc762dd5423e332166702cb75f40df79fea1288ac19430600','hex')
		readable = new Readable()
		readable.push(rawTx)
		readable.push(null)
		
		tx = Tx.Tx.parse(readable)
		tx.feeAsync().then(fee=> {
			want = 40000;
			assert.equal(fee,want)
		})
	})
	
	
	it('test fee', function(){
		rawTx = Buffer.from('0100000001813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1000000006b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef01000000001976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc762dd5423e332166702cb75f40df79fea1288ac19430600','hex')
		readable = new Readable()
		readable.push(rawTx)
		readable.push(null)
		
		tx = Tx.Tx.parse(readable)
		got = tx.fee()
		want = 40000;
		assert.equal(got,want)
		
	})

	it('test_fee2', function(){
		//rawTx = Buffer.from('0100000001c228021e1fee6f158cc506edea6bad7ffa421dd14fb7fd7e01c50cc9693e8dbe02000000fdfe0000483045022100c679944ff8f20373685e1122b581f64752c1d22c67f6f3ae26333aa9c3f43d730220793233401f87f640f9c39207349ffef42d0e27046755263c0a69c436ab07febc01483045022100eadc1c6e72f241c3e076a7109b8053db53987f3fcc99e3f88fc4e52dbfd5f3a202201f02cbff194c41e6f8da762e024a7ab85c1b1616b74720f13283043e9e99dab8014c69522102b0c7be446b92624112f3c7d4ffc214921c74c1cb891bf945c49fbe5981ee026b21039021c9391e328e0cb3b61ba05dcc5e122ab234e55d1502e59b10d8f588aea4632102f3bd8f64363066f35968bd82ed9c6e8afecbd6136311bb51e91204f614144e9b53aeffffffff05a08601000000000017a914081fbb6ec9d83104367eb1a6a59e2a92417d79298700350c00000000001976a914677345c7376dfda2c52ad9b6a153b643b6409a3788acc7f341160000000017a914234c15756b9599314c9299340eaabab7f1810d8287c02709000000000017a91469be3ca6195efcab5194e1530164ec47637d44308740420f00000000001976a91487fadba66b9e48c0c8082f33107fdb01970eb80388ac00000000','hex')
		rawTx = Buffer.from('010000000456919960ac691763688d3d3bcea9ad6ecaf875df5339e148a1fc61c6ed7a069e010000006a47304402204585bcdef85e6b1c6af5c2669d4830ff86e42dd205c0e089bc2a821657e951c002201024a10366077f87d6bce1f7100ad8cfa8a064b39d4e8fe4ea13a7b71aa8180f012102f0da57e85eec2934a82a585ea337ce2f4998b50ae699dd79f5880e253dafafb7feffffffeb8f51f4038dc17e6313cf831d4f02281c2a468bde0fafd37f1bf882729e7fd3000000006a47304402207899531a52d59a6de200179928ca900254a36b8dff8bb75f5f5d71b1cdc26125022008b422690b8461cb52c3cc30330b23d574351872b7c361e9aae3649071c1a7160121035d5c93d9ac96881f19ba1f686f15f009ded7c62efe85a872e6a19b43c15a2937feffffff567bf40595119d1bb8a3037c356efd56170b64cbcc160fb028fa10704b45d775000000006a47304402204c7c7818424c7f7911da6cddc59655a70af1cb5eaf17c69dadbfc74ffa0b662f02207599e08bc8023693ad4e9527dc42c34210f7a7d1d1ddfc8492b654a11e7620a0012102158b46fbdff65d0172b7989aec8850aa0dae49abfb84c81ae6e5b251a58ace5cfeffffffd63a5e6c16e620f86f375925b21cabaf736c779f88fd04dcad51d26690f7f345010000006a47304402200633ea0d3314bea0d95b3cd8dadb2ef79ea8331ffe1e61f762c0f6daea0fabde022029f23b3e9c30f080446150b23852028751635dcee2be669c2a1686a4b5edf304012103ffd6f4a67e94aba353a00882e563ff2722eb4cff0ad6006e86ee20dfe7520d55feffffff0251430f00000000001976a914ab0c0b2e98b1ab6dbf67d4750b0a56244948a87988ac005a6202000000001976a9143c82d7df364eb6c75be8c80df2b3eda8db57397088ac46430600','hex')
		rawTx = Buffer.from('0100000001813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1000000006b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef01000000001976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc762dd5423e332166702cb75f40df79fea1288ac19430600','hex')
		readable = new Readable()
		readable.push(rawTx)
		readable.push(null)
		
		tx = Tx.Tx.parse(readable)
		got = tx.fee()
		want = 40000;
		assert.equal(got,want)
		
	})

	
	it('test sig hash async ', function() {
		rawTx = Buffer.from('0100000001813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1000000006b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef01000000001976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc762dd5423e332166702cb75f40df79fea1288ac19430600','hex')
		readable = new Readable()
		readable.push(rawTx)
		readable.push(null)
		
		tx = Tx.Tx.parse(readable)
		hash_type = 1 //SIGHASH_ALL
		tx.sigHashAsync(0, hashType).then( got =>{
			want = new BN('27e0c5994dec7824e56dec6b2fcb342eb7cdb0d0957c2fce9882f715e85d81a6', 16)
			assert.deepEqual(got,want)
			
		}) 
	})
	
	
	it('test_sig_hash', function() {
		rawTx = Buffer.from('0100000001813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1000000006b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef01000000001976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc762dd5423e332166702cb75f40df79fea1288ac19430600','hex')
		readable = new Readable()
		readable.push(rawTx)
		readable.push(null)
		
		tx = Tx.Tx.parse(readable)
		hashType = 1 //SIGHASH_ALL
		got = tx.sigHash(0, hashType)
			want = new BN('27e0c5994dec7824e56dec6b2fcb342eb7cdb0d0957c2fce9882f715e85d81a6', 16)
			assert.deepEqual(got,want)
			
		
	})

	it('test verify input', function() {
		rawTx = Buffer.from('0100000001813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1000000006b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef01000000001976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc762dd5423e332166702cb75f40df79fea1288ac19430600','hex')
		readable = new Readable()
		readable.push(rawTx)
		readable.push(null)
		
		tx = Tx.Tx.parse(readable)
		assert.ok(tx.verifyInput(0))
	})
	
	it('test_sign_input', function() {
		this.timeout(0)
		privateKey = new ecc.PrivateKey(new BN(8675309))
		txIns = []
		prevTx = Buffer.from('0025bc3c0fa8b7eb55b9437fdbd016870d18e0df0ace7bc9864efc38414147c8','hex')
		txIns.push(new Tx.TxIn(prevTx, 0, Buffer.from([]), 0xffffffff))
		txOuts = []
		h160 = helper.decodeBase58('mzx5YhAH9kNHtcN481u6WkjeHjYtVeKVh2')
		txOuts.push(new Tx.TxOut(.99*100000000,helper.p2pkhScript(h160)))
		h160 = helper.decodeBase58('mnrVtF8DWjMu839VW3rBfgYaAfKk8983Xf')
		txOuts.push(new Tx.TxOut(.1*100000000,helper.p2pkhScript(h160)))
		tx = new Tx.Tx(1, txIns, txOuts, 0, true)
		assert.isTrue(tx.signInput(0, privateKey, 1))
	})

	it('test_is_coinbase', function() {
		rawTx = Buffer.from('01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff5e03d71b07254d696e656420627920416e74506f6f6c20626a31312f4542312f4144362f43205914293101fabe6d6d678e2c8c34afc36896e7d9402824ed38e856676ee94bfdb0c6c4bcd8b2e5666a0400000000000000c7270000a5e00e00ffffffff01faf20b58000000001976a914338c84849423992471bffb1a54a8d9b1d69dc28a88ac00000000','hex')
		readable = new Readable()
		readable.push(rawTx)
		readable.push(null)
		tx = Tx.Tx.parse(readable)
		assert.isTrue(tx.isCoinbase())

	})

	it('test_coinbase_height', function() {
		rawTx = Buffer.from('01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff5e03d71b07254d696e656420627920416e74506f6f6c20626a31312f4542312f4144362f43205914293101fabe6d6d678e2c8c34afc36896e7d9402824ed38e856676ee94bfdb0c6c4bcd8b2e5666a0400000000000000c7270000a5e00e00ffffffff01faf20b58000000001976a914338c84849423992471bffb1a54a8d9b1d69dc28a88ac00000000','hex')
		readable = new Readable()
		readable.push(rawTx)
		readable.push(null)
		tx = Tx.Tx.parse(readable)
		assert.equal(tx.coinbaseHeight(), 465879)

		rawTx = Buffer.from('0100000001813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1000000006b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef01000000001976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc762dd5423e332166702cb75f40df79fea1288ac19430600','hex')
		readable = new Readable()
		readable.push(rawTx)
		readable.push(null)
		tx = Tx.Tx.parse(readable)
		assert.equal(tx.coinbaseHeight(), undefined)
	})

	 
 })
