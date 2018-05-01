//var request = require('request')
var https = require('https')
var helper = require('./helper')
var script = require('./script')
var Readable = require('stream').Readable

class Tx {
	constructor(s) {

		let x = s.read(4)
		const version = helper.littleEndianToInt(x)
		this.version = version
		const numInputs = helper.readVarint(s)[0]
		let inputs = []
		for (let index = 0; index < numInputs; index++) {
				inputs.push(new TxIn(s))
		}
		this.inputs = inputs;
		const numOutputs = helper.readVarint(s)[0]
		let outputs = []
		for (let index = 0; index < numOutputs; index++) {
				outputs.push(new TxOut(s))
		}
		this.outputs = outputs;
		this.locktime = helper.littleEndianToInt(s.read(4))

	}	
	
	static parse(s) {
		
	}

	serialize() {
		result = helper.intToLittleEndian(this.version, 4)
		result = Buffer.concat([result , helper.encodeVarint(this.inputs.length)])
		this.inputs.map( obj => {
			result = Buffer.concat([result , obj.serialize()])
			
		})
		result = Buffer.concat([result , helper.encodeVarint(this.outputs.length)])
		this.outputs.map ( obj => {
			result = Buffer.concat([result, obj.serialize()]);
		})
		result = Buffer.concat([result, helper.intToLittleEndian(this.locktime, 4)]);
		return result;
	}
}
 
class TxIn {
	constructor(s) {
		this.prevTx = Buffer.from(Array.prototype.reverse.call(new Uint16Array(s.read(32))));
		this.prevIndex = helper.littleEndianToInt(s.read(4))
		const scriptSigLength = helper.readVarint(s)[0]
		this.scriptSig = new script.Script(s.read(scriptSigLength))
		const x = s.read(4)
		this.sequence = helper.littleEndianToInt(x)
		this.cache = {}
		
	}

	serialize() {
		const ta = Buffer.from(this.prevTx);
		let result = Array.prototype.reverse.call(ta)
		result = Buffer.concat([result , helper.intToLittleEndian(this.prevIndex, 4)]);
		const rawScriptSig = this.scriptSig.serialize();
		result = Buffer.concat([result, helper.encodeVarint(rawScriptSig.length)])
		result = Buffer.concat([result, rawScriptSig]);
		result = Buffer.concat([result, helper.intToLittleEndian(this.sequence,4)])
		return result;
	}
	
	getUrl(testnet = false) {
		return (testnet ?  'https://testnet.blockexplorer.com/api' :  'https://btc-bitcore3.trezor.io/api');
	}
	
	fetchTx(testnet=false) {
		console.log('fetch')
		if (!(this.prevTx in this.cache)) {
			const url = this.getUrl(testnet) + '/rawtx/' + this.prevTx.toString('hex');
			console.log(url)
			return new Promise((resolve, reject) => {
				https.get(url, function(res) { 
					if (res.statusCode < 200 || res.statusCode > 299) {
						reject(new Error('Failed to load page, status code: ' + response.statusCode));
					}
				
					//return JSON.parse(body).rawtx;
					const body = []
					res.on('data', (chunk) => body.push(chunk));
					// we are done, resolve promise with those joined chunks
					res.on('end', () => resolve(body.join('')));			
				});
			})
		}
	}
	
	value(testnet=false) {
		
		return this.fetchTx(testnet=testnet)
			.then( (html) => {
				console.log(html)
				const raw = Buffer.from(JSON.parse(html).rawtx)
				readable = new Readable()
				readable.push(rawTx)
				readable.push(null)
				tx = new Tx(readable);
				console.log(tx)
				console.log('txa',tx.outputs[this.prevIndex].amount)
				//return 42505594;
				return tx.outputs[this.prevIndex].amount;

			}).catch((err) => { return -9999});
			
		//return tx.ouputs[this.prevIndex].amount;
	}
	derSignature(index=0) {
		const signature = this.scriptSig.signature(index=index)
		return signature.slice(0,signature.length-1);
	}
	
	hashType(index=0) {
		const signature = this.scriptSig.signature(index=index)
		return signature[signature.length-1]
	}
	
	secPubkey(index=0) {
		return this.scriptSig.secPubkey(index=index);
	}
}

class TxOut {
	constructor(s) {
		this.amount = helper.littleEndianToInt(s.read(8))
		const scriptPubkeyLength = helper.readVarint(s)[0]
		this.scriptPubkey = new script.Script(s.read(scriptPubkeyLength))
	}

	serialize() {
		let result = helper.intToLittleEndian(this.amount, 8);
		const rawScriptPubkey = this.scriptPubkey.serialize();
		result = Buffer.concat([result, helper.encodeVarint(rawScriptPubkey.length)]);
		result = Buffer.concat([result, rawScriptPubkey]);
		return result;
	}
}
	
module.exports.Tx = Tx;