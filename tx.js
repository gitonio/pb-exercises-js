var helper = require('./helper')
var script = require('./script')
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
}
 
class TxIn {
	constructor(s) {
		this.prevTx = Buffer.from(Array.prototype.reverse.call(new Uint16Array(s.read(32))));
		this.prevIndex = helper.littleEndianToInt(s.read(4))
		const scriptSigLength = helper.readVarint(s)[0]
		this.scriptSig = new script.Script(s.read(scriptSigLength))
		const x = s.read(4)
		this.sequence = helper.littleEndianToInt(x)
		
		}
}

class TxOut {
	constructor(s) {
		this.amount = helper.littleEndianToInt(s.read(8))
		const scriptPubkeyLength = helper.readVarint(s)[0]
		this.scriptPubkey = new script.Script(s.read(scriptPubkeyLength))
	}
}
	
module.exports.Tx = Tx;