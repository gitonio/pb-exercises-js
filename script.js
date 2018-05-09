var Readable = require('stream').Readable

OP_CODES = {
  "0": "OP_0", 
  "76": "OP_PUSHDATA1", 
  "77": "OP_PUSHDATA2", 
  "78": "OP_PUSHDATA4", 
  "79": "OP_1NEGATE", 
  "80": "OP_RESERVED", 
  "81": "OP_1", 
  "82": "OP_2", 
  "83": "OP_3", 
  "84": "OP_4", 
  "85": "OP_5", 
  "86": "OP_6", 
  "87": "OP_7", 
  "88": "OP_8", 
  "89": "OP_9", 
  "90": "OP_10", 
  "91": "OP_11", 
  "92": "OP_12", 
  "93": "OP_13", 
  "94": "OP_14", 
  "95": "OP_15", 
  "96": "OP_16", 
  "97": "OP_NOP", 
  "98": "OP_VER", 
  "99": "OP_IF", 
  "100": "OP_NOTIF", 
  "101": "OP_VERIF", 
  "102": "OP_VERNOTIF", 
  "103": "OP_ELSE", 
  "104": "OP_ENDIF", 
  "105": "OP_VERIFY", 
  "106": "OP_RETURN", 
  "107": "OP_TOALTSTACK", 
  "108": "OP_FROMALTSTACK", 
  "109": "OP_2DROP", 
  "110": "OP_2DUP", 
  "111": "OP_3DUP", 
  "112": "OP_2OVER", 
  "113": "OP_2ROT", 
  "114": "OP_2SWAP", 
  "115": "OP_IFDUP", 
  "116": "OP_DEPTH", 
  "117": "OP_DROP", 
  "118": "OP_DUP", 
  "119": "OP_NIP", 
  "120": "OP_OVER", 
  "121": "OP_PICK", 
  "122": "OP_ROLL", 
  "123": "OP_ROT", 
  "124": "OP_SWAP", 
  "125": "OP_TUCK", 
  "126": "OP_CAT", 
  "127": "OP_SUBSTR", 
  "128": "OP_LEFT", 
  "129": "OP_RIGHT", 
  "130": "OP_SIZE", 
  "131": "OP_INVERT", 
  "132": "OP_AND", 
  "133": "OP_OR", 
  "134": "OP_XOR", 
  "135": "OP_EQUAL", 
  "136": "OP_EQUALVERIFY", 
  "137": "OP_RESERVED1", 
  "138": "OP_RESERVED2", 
  "139": "OP_1ADD", 
  "140": "OP_1SUB", 
  "141": "OP_2MUL", 
  "142": "OP_2DIV", 
  "143": "OP_NEGATE", 
  "144": "OP_ABS", 
  "145": "OP_NOT", 
  "146": "OP_0NOTEQUAL", 
  "147": "OP_ADD", 
  "148": "OP_SUB", 
  "149": "OP_MUL", 
  "150": "OP_DIV", 
  "151": "OP_MOD", 
  "152": "OP_LSHIFT", 
  "153": "OP_RSHIFT", 
  "154": "OP_BOOLAND", 
  "155": "OP_BOOLOR", 
  "156": "OP_NUMEQUAL", 
  "157": "OP_NUMEQUALVERIFY", 
  "158": "OP_NUMNOTEQUAL", 
  "159": "OP_LESSTHAN", 
  "160": "OP_GREATERTHAN", 
  "161": "OP_LESSTHANOREQUAL", 
  "162": "OP_GREATERTHANOREQUAL", 
  "163": "OP_MIN", 
  "164": "OP_MAX", 
  "165": "OP_WITHIN", 
  "166": "OP_RIPEMD160", 
  "167": "OP_SHA1", 
  "168": "OP_SHA256", 
  "169": "OP_HASH160", 
  "170": "OP_HASH256", 
  "171": "OP_CODESEPARATOR", 
  "172": "OP_CHECKSIG", 
  "173": "OP_CHECKSIGVERIFY", 
  "174": "OP_CHECKMULTISIG", 
  "175": "OP_CHECKMULTISIGVERIFY", 
  "176": "OP_NOP1", 
  "177": "OP_NOP2", 
  "177": "OP_CHECKLOCKTIMEVERIFY", 
  "178": "OP_NOP3", 
  "178": "OP_CHECKSEQUENCEVERIFY", 
  "179": "OP_NOP4", 
  "180": "OP_NOP5", 
  "181": "OP_NOP6", 
  "182": "OP_NOP7", 
  "183": "OP_NOP8", 
  "184": "OP_NOP9", 
  "185": "OP_NOP10", 
  "252": "OP_NULLDATA", 
  "253": "OP_PUBKEYHASH", 
  "254": "OP_PUBKEY", 
  "255": "OP_INVALIDOPCODE"
}

class Script {

  constructor(elements) {
    this.elements = elements;
  }

	static parse (ss) {
		let s = new Readable()
		s.push(ss)
		s.push(null)
		let elements = []
		let current = s.read(1)
		let opCode = 0;
		while (current != null) {
			opCode = current[0]
			if (opCode > 0 && opCode <= 75) {
				elements.push(s.read(opCode))
			} else {
				elements.push(opCode)
			}
			current = s.read(1)
		}
		return new Script(elements);	
	}
	
	type () {
		
		if (this.elements.length == 0) {
			return 'blank'
		} else if ( 
			this.elements[0] == 0x76 &&
			this.elements[1] == 0xa9 &&
			this.elements[2] instanceof Buffer &&
			this.elements[2].length == 0x14 &&
			this.elements[3] == 0x88 &&
			this.elements[4] == 0xac
		) {
			return 'p2pkh'
		} else if (
			this.elements[0] == 0xa9 &&
			this.elements[1] instanceof Buffer &&
			this.elements[1].length == 0x14 &&
			this.elements[this.elements.length-1] == 0x87
		) {
			return 'p2sh'
		} else if (
			this.elements[0]  instanceof Buffer &&
			[0x47, 0x48, 0x49].indexOf(this.elements[0].length) != -1 &&
			this.elements[1] instanceof Buffer &&
			[0x21, 0x41].indexOf(this.elements[1].length) != -1 
		) {
			return 'p2pkh sig'
		} else if (
			this.elements.length > 1 &&
			[0x47, 0x48, 0x49].indexOf(this.elements[1].length) != -1 &&
			this.elements[this.elements.length-1][this.elements[this.elements.length-1].length-1] == 0xae
		) {
			return 'p2sh sig'
		} else {
			return 'unknown'
		}
	}			
	
	serialize() {
		let result = Buffer.from([])
		this.elements.map( obj => {
			if (typeof obj === "number") {
				result = Buffer.concat([result, Buffer.from([obj])])
			} else {
				result = Buffer.concat([result, Buffer.from([obj.length]), obj])
			}
			
		})
		return result
	}
	
	signature(index=0) {
		const sigType = this.type();
		if (sigType == 'p2pkh sig') {
			return this.elements[0];
		} else if (sigType == 'p2sh sig') {
			return this.elements[index + 1]
		} else {
			throw new Error('script type needs to be p2pkh sig or p2sh sig');
		}
	}
	
	secPubkey(index = 0) {
    const sigType = this.type();
		if (sigType == 'p2pkh sig') {
			return this.elements[1];
		} else if (sigType == 'p2sh sig') {
			const redeemScript = Script.parse(this.elements[this.elements.length-1])
			return redeemScript.elements[index + 1];
		} 
		
	}
	
	
	
}

Script.prototype.toString = function(){
		let result = ''
   this.elements.map( obj => {
			if (typeof obj === "number") {
				result =  result + ' ' + OP_CODES[obj]
			} else {
				result = result + ' ' + obj.toString('hex')
			}
			
		})
		return result
}




module.exports.Script = Script;