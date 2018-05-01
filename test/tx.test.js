var { assert, expect} = require('chai');
var Tx = require('../tx');
var Script = require('../script')
var BN = require('bn.js')
var Readable = require('stream').Readable


 describe('TxTest', function() {
	 
 	rawTx = Buffer.from('0100000001813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1000000006b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef01000000001976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc762dd5423e332166702cb75f40df79fea1288ac19430600','hex')
	rawTx2 = Buffer.from('76a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac','hex') 
	readable = new Readable()
	readable.push(rawTx)
	readable.push(null)
		
	tx = new Tx.Tx(readable)
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
	
	it('test parse outputs', function() {
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
	
	it('test serialize', function() {

		assert.deepEqual(tx.serialize(), rawTx)

	})
	
	it('test input value', function() {

		txHash = 'd1c789a9c60383bf715f3f6ad9d14b91fe55f3deb369fe5d9280cb1a01793f81'
		index = 0
		want = 42505594
		txIn = tx.inputs[0]
		//console.log('tiv0', tx.inputs[0].value())
		tx.inputs[0].value().then(data => {
			console.log('data', data)
			assert.equal(data, want) 
			//done()

		})
		console.log('tiv1')
		//done()
		
	})
	 
 })
