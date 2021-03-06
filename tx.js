//var request = require('request')
var https = require('https')
var helper = require('./helper')
var script = require('./script')
var Readable = require('stream').Readable
var BN = require('bn.js')
var request = require('sync-request');
var ecc = require('./ecc')

class Tx {
	constructor(version, inputs, outputs, locktime, testnet =  false) {

	
		this.version = version
		this.inputs = inputs;
		this.outputs = outputs;
		this.locktime = locktime;
		this.testnet = testnet;
	
	}	
	
	static parse(s) {
		let x = s.read(4)
		const version = helper.littleEndianToInt(x)
		//this.version = version
		const numInputs = helper.readVarint(s)
		let inputs = []
		for (let index = 0; index < numInputs; index++) {
				inputs.push(TxIn.parse(s))
		}
		const numOutputs = helper.readVarint(s)
		let outputs = []
		for (let index = 0; index < numOutputs; index++) {
				outputs.push(TxOut.parse(s))
		}
		const locktime = helper.littleEndianToInt(s.read(4))
		return new Tx(version, inputs, outputs, locktime)
	}

	serialize() {
		let result = helper.intToLittleEndian(this.version, 4)
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
	
	fee(testnet=false) {
		//TODO cleanup
		let inputSum = 0;
		let outputSum = 0;
		let x = this.inputs.map(obj => {
			return obj.value(testnet)
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
			return new BN(s256, 16) 
		})
	}
	
	sigHash(inputIndex, hashType) {
		let altTxIns = []
		this.inputs.map( obj => altTxIns.push(new TxIn(obj.prevTx, obj.prevIndex, Buffer.from([]), obj.sequence ,{})))
		let signingInput = altTxIns[inputIndex];
		const scriptPubkey = signingInput.scriptPubkey(this.testnet)
		signingInput.scriptSig = scriptPubkey;
		const altTx = new Tx(this.version, altTxIns, this.outputs, this.locktime, this.testnet)
		const result = Buffer.concat([altTx.serialize() , helper.intToLittleEndian(hashType, 4) ])
		const s256 = helper.doubleSha256(Buffer.from(result));
		return new BN(s256, 16) 
	}

	verifyInput(inputIndex) {
		const txIn = this.inputs[inputIndex];
		const point = ecc.S256Point.parse(txIn.secPubkey());
		const signature = ecc.Signature.parse(txIn.derSignature());
		const hashType = txIn.hashType();
		const z = this.sigHash(inputIndex, hashType);
		return point.verify(z, signature);
	}

	signInput(inputIndex, privateKey, hashType) {
		const z = this.sigHash(inputIndex,hashType);
		const der = privateKey.sign(z).der();
		const sig = Buffer.concat([der, Buffer.from([hashType])])
		const sec = privateKey.point.sec();
		const ss = [sig,sec]
		const scriptSig = new script.Script(ss)
		this.inputs[inputIndex].scriptSig = scriptSig;
		return this.verifyInput(inputIndex);
	}

	isCoinbase() {
		if (this.inputs.length != 1) {
			return false;
		} 
		const firstInput = this.inputs[0]
		if (firstInput.prevTx.toString('hex') != Buffer.alloc(32).toString('hex')) {
			return false;
		}
		if(firstInput.prevIndex != 0xffffffff) {
			return false;
		}
		return true;
	}

	coinbaseHeight() {
		if (!this.isCoinbase()) {
			return undefined;
		}
		const firstInput = this.inputs[0];
		const firstElement = firstInput.scriptSig.elements[0];
		return helper.littleEndianToInt(firstElement);
	}

}

Tx.prototype.toString = function(){
	inputs = ''
	this.inputs.map(obj => {
		inputs = inputs + obj.toString() + '\n';
	})
	outputs = ''
	this.outputs.map(obj => {
		outputs = outputs + obj.toString() + '\n';
	})
	return `version: ${this.version}\nInputs:\n ${inputs}\nOutputs:\n ${outputs}\nLocktime:${this.locktime}`
}


class TxIn {

	constructor (prevTx, prevIndex, scriptSig, sequence, cache){
		this.prevTx = prevTx;
		this.prevIndex = prevIndex;
		this.scriptSig = script.Script.parse(scriptSig);
		this.sequence = sequence;
		this.cache = cache;
	}
	
	static parse(s) {
		const prevTx = Buffer.from(Array.prototype.reverse.call(new Uint16Array(s.read(32))));
		const prevIndex = helper.littleEndianToInt(s.read(4))
		const scriptSigLength = helper.readVarint(s)
		const scriptSig =  s.read(scriptSigLength)
		const x = s.read(4)
		const sequence = helper.littleEndianToInt(x)
		const cache = {}
		return new TxIn(prevTx, prevIndex, scriptSig, sequence, cache);
	}

	serialize() {
		const ta = Buffer.from(this.prevTx);
		let result = Array.prototype.reverse.call(ta);
		result = Buffer.concat([result , helper.intToLittleEndian(this.prevIndex, 4)]);
		const rawScriptSig = this.scriptSig === undefined ? Buffer.from([]) : this.scriptSig.serialize();
		result = Buffer.concat([result, helper.encodeVarint(rawScriptSig.length)]);
		result = Buffer.concat([result, rawScriptSig]);
		result = Buffer.concat([result, helper.intToLittleEndian(this.sequence,4)]);
		return result;
	}
	
	getUrl(testnet = false) {
		return (testnet ?  'https://testnet.blockexplorer.com/api' :  'https://blockexplorer.com/api');
		//return (testnet ?  'http://client:pleasedonthackme@tbtc.programmingblockchain.com:18332' :  'http://pbclient:ecdsaisawesome@btc.programmingblockchain.com:8332');
	}
	
	fetchTxAsync(testnet=false) {
		if (!(this.prevTx in this.cache)) {
			const url = this.getUrl(testnet) + '/rawtx/' + this.prevTx.toString('hex');
			const rr = request('GET', url)
			return new Promise((resolve, reject) => {
				https.get(url, function(res) { 
					if (res.statusCode < 200 || res.statusCode > 299) {
						reject(new Error('Failed to load page, status code: ' + response.statusCode));
					}
				
					const body = []
					res.on('data', (chunk) => body.push(chunk));
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
			const url = this.getUrl(testnet) + '/rawtx/' + this.prevTx.toString('hex');
			const req = request('GET', url)
			const rawtx = JSON.parse(req.getBody('utf8')).rawtx
			const raw = Buffer.from(rawtx,'hex');
			let readable = new Readable();
			readable.push(raw);
			readable.push(null);
			let tx = Tx.parse(readable);
			this.cache[this.prevTx] = tx;
			
		};	
		return this.cache[this.prevTx]
		
	}
	
	
	valueAsync(testnet=false) {	
		return this.fetchTxAsync(testnet=testnet)
			.then( (tx) => {
				return tx.outputs[this.prevIndex].amount;
			}).catch((err) => { console.log(err)});
	}
	
	value(testnet=false) {	
		const tx = this.fetchTx(testnet=testnet)
		return tx.outputs[this.prevIndex].amount;
	}

	scriptPubkeyAsync(testnet=false) {
		return this.fetchTxAsync(testnet=testnet)
		.then( (tx) => {
			return tx.outputs[this.prevIndex].scriptPubkey;
		}).catch((err) => { console.log(err)});
	}
	
	scriptPubkey(testnet=false) {
		const tx = this.fetchTx(testnet=testnet)
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

TxIn.prototype.toString = function(){
	return`${this.prevTx.toString()}:${this.prevIndex}`
}


class TxOut {
	constructor(amount, scriptPubkey) {
		this.amount = amount;
		this.scriptPubkey = script.Script.parse(scriptPubkey);
	}

	static parse(s) {
		const amount = helper.littleEndianToInt(s.read(8))
		const scriptPubkeyLength = helper.readVarint(s)
		const scriptPubkey = s.read(scriptPubkeyLength);
		return new TxOut(amount, scriptPubkey);
	}

	serialize() {
		let result = helper.intToLittleEndian(this.amount, 8);
		const rawScriptPubkey = this.scriptPubkey.serialize();
		result = Buffer.concat([result, helper.encodeVarint(rawScriptPubkey.length)]);
		result = Buffer.concat([result, rawScriptPubkey]);
		return result;
	}
}

TxOut.prototype.toString = function(){
	return `${this.amount} : ${this.scriptPubkey.toString()}`
}

module.exports.Tx = Tx;
module.exports.TxIn = TxIn;
module.exports.TxOut = TxOut;