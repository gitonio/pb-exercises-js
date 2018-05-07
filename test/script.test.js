var { assert, expect} = require('chai');
var Tx = require('../tx');
var script = require('../script')
var BN = require('bn.js')
var Readable = require('stream').Readable


 describe('ScriptTest', function() {
	 /*
	it('test blank', function () {
		scriptPubkeyRaw = Buffer.from('','hex');
		scriptPubkey = new script.Script(scriptPubkeyRaw)
		assert.deepEqual(scriptPubkey.type(), 'blank');		

	}) 
	*/
	
	it('test p2pkh', function() {
		
		scriptPubkeyRaw = Buffer.from('76a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac','hex');
		scriptPubkey = script.Script.parse(scriptPubkeyRaw)
		assert.deepEqual(scriptPubkey.type(), 'p2pkh');		
		assert.deepEqual(scriptPubkey.serialize(), scriptPubkeyRaw) 
		
		scriptSigRaw = Buffer.from('483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278a','hex')
		scriptSig =  script.Script.parse(scriptSigRaw)
		assert.deepEqual(scriptSig.type(), 'p2pkh sig')
		assert.deepEqual(scriptSig.serialize(), scriptSigRaw)
		assert.deepEqual(scriptSig.signature(), Buffer.from('3045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01','hex'))
		assert.deepEqual(scriptSig.secPubkey(), Buffer.from('0349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278a','hex'))
	})
	
	it('test p2sh', function() {
		scriptPubkeyRaw = Buffer.from('a91474d691da1574e6b3c192ecfb52cc8984ee7b6c5687','hex');
		scriptPubkey =  script.Script.parse(scriptPubkeyRaw)
		assert.deepEqual(scriptPubkey.type(), 'p2sh');		
		assert.deepEqual(scriptPubkey.serialize(), scriptPubkeyRaw) 
		scriptSigRaw = Buffer.from('00483045022100dc92655fe37036f47756db8102e0d7d5e28b3beb83a8fef4f5dc0559bddfb94e02205a36d4e4e6c7fcd16658c50783e00c341609977aed3ad00937bf4ee942a8993701483045022100da6bee3c93766232079a01639d07fa869598749729ae323eab8eef53577d611b02207bef15429dcadce2121ea07f233115c6f09034c0be68db99980b9a6c5e75402201475221022626e955ea6ea6d98850c994f9107b036b1334f18ca8830bfff1295d21cfdb702103b287eaf122eea69030a0e9feed096bed8045c8b98bec453e1ffac7fbdbd4bb7152ae','hex')
		scriptSig =  script.Script.parse(scriptSigRaw)

		assert.deepEqual(scriptSig.type(), 'p2sh sig')
		assert.deepEqual(scriptSig.serialize(), scriptSigRaw)
		assert.deepEqual(scriptSig.signature(0), Buffer.from('3045022100dc92655fe37036f47756db8102e0d7d5e28b3beb83a8fef4f5dc0559bddfb94e02205a36d4e4e6c7fcd16658c50783e00c341609977aed3ad00937bf4ee942a8993701','hex'))
		assert.deepEqual(scriptSig.signature(1), Buffer.from('3045022100da6bee3c93766232079a01639d07fa869598749729ae323eab8eef53577d611b02207bef15429dcadce2121ea07f233115c6f09034c0be68db99980b9a6c5e75402201','hex'))
		assert.deepEqual(scriptSig.secPubkey(0), Buffer.from('022626e955ea6ea6d98850c994f9107b036b1334f18ca8830bfff1295d21cfdb70','hex'))
		assert.deepEqual(scriptSig.secPubkey(1), Buffer.from('03b287eaf122eea69030a0e9feed096bed8045c8b98bec453e1ffac7fbdbd4bb71','hex'))
		
	})
	
	
	 
 })
