//var request = require('request')
var https = require('https')
var helper = require('./helper')
var script = require('./script')
var Readable = require('stream').Readable
var BN = require('bn.js')
var request = require('sync-request');

class Tx {
	constructor(version, inputs, outputs, locktime, testnet=false) {

	
		this.version = version
		this.inputs = inputs;
		this.outputs = outputs;
		this.locktime = locktime
	
	}	
	
	static parse(s) {
		let x = s.read(4)
		console.log('x',x)
		const version = helper.littleEndianToInt(x)
		//this.version = version
		console.log('version', version)
		const numInputs = helper.readVarint(s)
		console.log('numinputs', numInputs)
		let inputs = []
		for (let index = 0; index < numInputs; index++) {
				inputs.push(TxIn.parse(s))
		}
		//this.inputs = inputs;
		console.log('ip', inputs)
		//const temp = helper.readVarint(s)
		//console.log('temp', temp)
		const numOutputs = helper.readVarint(s)
		//const numOutputs = temp
		console.log('nop', numOutputs)
		let outputs = []
		for (let index = 0; index < numOutputs; index++) {
				outputs.push(new TxOut(s))
		}
		//this.outputs = outputs;
		console.log('op', outputs)
		const locktime = helper.littleEndianToInt(s.read(4))
		console.log('lt',locktime)
		return new Tx(version, inputs, outputs, locktime)
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

	feeAsync() {
		//TODO cleanup
		let inputSum = 0;
		let outputSum = 0;
		let x = this.inputs.map(obj => {
			return obj.value()
		})

		let results = Promise.all(x)
		let y = this.outputs.map(obj => {
			return obj.amount
		})

		let resultsy = Promise.all(y)
		
		const reducer = (ac,cu) => ac + cu;
		
		return results.then(data => data.reduce(reducer))
			   .then(  xx => resultsy.then(data => {data.reduce(reducer); return xx - data.reduce(reducer)   }))
			   
	}
	
	fee() {
		//TODO cleanup
		let inputSum = 0;
		let outputSum = 0;
		console.log('this.inputs len', this.inputs.length)
		let x = this.inputs.map(obj => {
			console.log('input', obj)
			return obj.value()
		})

		let y = this.outputs.map(obj => {
			return obj.amount
		})

		
		const reducer = (ac,cu) => ac + cu;
		
		return x.reduce(reducer) - y.reduce(reducer)  
			   
	}
	
	
	sigHashAsync(inputIndex, hashType) {
		let altTxIns = []
		this.inputs.map( obj => altTxIns.push(new TxIn(obj.prevTx, obj.prevIndex, Buffer.from([]), obj.sequence ,{})))
		let signingInput = altTxIns[inputIndex];
		return signingInput.scriptPubkeyAsync(this.testnet).then(scriptPubkey => {
			signingInput.scriptSig = scriptPubkey;
			const altTx = new Tx(this.version, altTxIns, this.outputs, this.locktime)
			const result = Buffer.concat([altTx.serialize() , helper.intToLittleEndian(hashType, 4) ])
			const s256 = helper.doubleSha256(Buffer.from(result));
			console.log('s256', s256)
			return new BN(s256, 16) 
		})
	}
	
		sigHash(inputIndex, hashType) {
		let altTxIns = []
		this.inputs.map( obj => altTxIns.push(new TxIn(obj.prevTx, obj.prevIndex, Buffer.from([]), obj.sequence ,{})))
		let signingInput = altTxIns[inputIndex];
		const scriptPubkey = signingInput.scriptPubkey(this.testnet)
			signingInput.scriptSig = scriptPubkey;
			const altTx = new Tx(this.version, altTxIns, this.outputs, this.locktime)
			const result = Buffer.concat([altTx.serialize() , helper.intToLittleEndian(hashType, 4) ])
			const s256 = helper.doubleSha256(Buffer.from(result));
			return new BN(s256, 16) 
		
	}

}
 
class TxIn {

	constructor (prevTx, prevIndex, scriptSig, sequence, cache){
		this.prevTx = prevTx;
		this.prevIndex = prevIndex;
		this.scriptSig = scriptSig;
		this.sequence = sequence;
		this.cache = cache;
	}
	
	static parse(s) {
		const prevTx = Buffer.from(Array.prototype.reverse.call(new Uint16Array(s.read(32))));
		console.log('TxIn prevtx', prevTx)
		const prevIndex = helper.littleEndianToInt(s.read(4))
		console.log('TxIn prevIndex', prevIndex)
		const scriptSigLength = helper.readVarint(s)
		console.log('TxIn ssl',scriptSigLength) 
		const scriptSig = new script.Script(s.read(scriptSigLength))
		const x = s.read(4)
		const sequence = helper.littleEndianToInt(x)
		const cache = {}
		return new TxIn(prevTx, prevIndex, scriptSig, sequence, cache);
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
	
	fetchTxAsync(testnet=false) {
		if (!(this.prevTx in this.cache)) {
			const url = this.getUrl(testnet) + '/rawtx/' + this.prevTx.toString('hex');
			const rr = request('GET', url)
			console.log('rr',JSON.parse(rr.getBody('utf8')).rawtx)
			return new Promise((resolve, reject) => {
				https.get(url, function(res) { 
					if (res.statusCode < 200 || res.statusCode > 299) {
						reject(new Error('Failed to load page, status code: ' + response.statusCode));
					}
				
					//return JSON.parse(body).rawtx;
					const body = []
					res.on('data', (chunk) => body.push(chunk));
					// we are done, resolve promise with those joined chunks
					res.on('end', () => {
						let html = body.join('');
						const raw = Buffer.from(JSON.parse(html).rawtx,'hex');
						let readable = new Readable();
						readable.push(raw);
						readable.push(null);
						let tx = Tx.parse(readable);
						resolve( tx );
					});			
				});
			})
		}
	}
	
	fetchTx(testnet=false) {
		if (!(this.prevTx in this.cache)) {
			console.log('no cache');
			const url = this.getUrl(testnet) + '/rawtx/' + this.prevTx.toString('hex');
			console.log(url)
			const req = request('GET', url)
			const rawtx = JSON.parse(req.getBody('utf8')).rawtx
			
			const raw = Buffer.from(rawtx,'hex');
			console.log('fetch raw', rawtx)
			let readable = new Readable();
			readable.push(raw);
			readable.push(null);
			let tx = Tx.parse(readable);
			console.log('fetched tx', tx);
			this.cache[this.prevTx] = tx;
			
		};	
		return this.cache[this.prevTx]
	}
	
	
	valueAsync(testnet=false) {	
		return this.fetchTxAsync(testnet=testnet)
		/*
			.then( (html) => {
				const raw = Buffer.from(JSON.parse(html).rawtx,'hex')
				readable = new Readable()
				readable.push(raw)
				readable.push(null)
				tx = Tx.parse(readable);
				return tx.outputs[this.prevIndex].amount;
			}).catch((err) => { console.log(err)});
		*/
			.then( (tx) => {
				return tx.outputs[this.prevIndex].amount;
			}).catch((err) => { console.log(err)});
	}
	
	value(testnet=false) {	
		tx = this.fetchTx(testnet=testnet)
		return tx.outputs[this.prevIndex].amount;
	}

	scriptPubkeyAsync(testnet=false) {
		return this.fetchTxAsync(testnet=testnet)
		.then( (tx) => {
			return tx.outputs[this.prevIndex].scriptPubkey;
		}).catch((err) => { console.log(err)});
	}
	
	scriptPubkey(testnet=false) {
		tx = this.fetchTx(testnet=testnet)
		return tx.outputs[this.prevIndex].scriptPubkey;
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
		const scriptPubkeyLength = helper.readVarint(s)
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
module.exports.TxIn = TxIn;