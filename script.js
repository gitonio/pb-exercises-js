var Readable = require('stream').Readable



class Script {
	constructor(ss) {
		console.log(ss.toString('hex'))
		let s = new Readable()
		s.push(ss)
		s.push(null)
		s.setEncoding('UTF8')
		let elements = []
		let current = s.read(1)
		console.log('cur', current);
		let opCode = 0;
		while (current != Buffer.from([''])) {
			opCode = current[0]
			console.log('oc',opCode)
			if (opCode > 0 && opCode <= 75) {
				elements.push(s.read(opCode))
			} else {
				elements.push(opCode)
			}
			current = s.read(1)
			console.log('cur',current)
		}
		this.elements = elements;	
		console.log(elements)
	}
}

module.exports.Script = Script;