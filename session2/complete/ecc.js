
//https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
var hash = require('hash.js');
var helper = require('./helper')
var Readable = require('stream').Readable



class FieldElement {
	constructor(num, prime) {
		if (num == undefined) {
			this.num = undefined
			this.prime = BigInt(prime);
		} else {
			this.num = (num && typeof num === 'bigint') ? num : BigInt(num);
			this.prime = BigInt(prime);
		}
		if (num && num < 0) {
			throw new Error(`Num ${num} not in field range 0 to ${prime - 1}`);
		}
	}

	equals(fe) {
		if (this.num == fe.num) return 'true'
	}

	add(fe) {
		if (this.prime != fe.prime ) {
			throw new Error('Primes must be the same');
		}
		const num = helper.mod(this.num + fe.num,this.prime);
		return new FieldElement(num, fe.prime);
	}
	sub(fe) {
		if (this.prime != fe.prime ) {
			throw new Error('Primes must be the same');
		}
		//https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
		//const num = (((this.num - fe.num) % this.prime) + this.prime) % this.prime;
		const num = helper.mod(this.num - fe.num,this.prime)
		return new FieldElement(num, fe.prime);
	}

	mul(fe) {
		if (this.prime != fe.prime ) {
			throw new Error('Primes must be the same');
		}
		const num = helper.mod(this.num * fe.num, this.prime);
		return new FieldElement(num, fe.prime);
	}

	rmul(f) {
		const num = helper.mod(this.num * BigInt(f),this.prime)
		return new FieldElement(num, this.prime);
	}

	pow(f) {
		let num;
		if (f < 0) {
			num = helper.pow(helper.pow(this.num, -BigInt(f), this.prime), this.prime - 2n, this.prime)
		} else if (typeof f === 'bigint') {
			num = helper.pow(this.num, f, this.prime)
		} else {
			num = helper.pow(this.num, BigInt(f), this.prime)
		}
		return new FieldElement(num, this.prime);
	}

	div(fe) {
		if ( this.prime != fe.prime) {
			throw new Error('Primes must be the same');
		}
		const num = helper.mod(this.num * helper.pow(fe.num, fe.prime - 2n, fe.prime), fe.prime)
		return new FieldElement(num, this.prime);

	}
};

FieldElement.prototype.toString = function(){
	return `FieldElement_${this.prime}(${this.num})`
}
 
class Point {
	constructor(x, y, a, b) {
		this.x = x;
		this.y = y;
		this.a = a;
		this.b = b;
		if (x instanceof FieldElement) {
			if (this.x.num == undefined) {
				return
			}
			if (this.y.pow(2).num !== (this.x.pow(3).add(this.a.mul(this.x)).add(this.b).num)) {
				throw new Error(`(${this.x.num}, ${this.y.num}) is not on the curve1`);
			}
		} else {
			if (this.x == undefined) {
				return
			}
			if (Math.pow(this.y, 2) != (Math.pow(this.x, 3) + this.a * this.x + this.b)) {
				throw new Error(`(${this.x}, ${this.y}) is not on the curve`);
			}
		}

	}

	eq(other) {
		if (x instanceof FieldElement) {
			return this.x.equals(other.x) && this.y.equals(other.y) && this.a.equals(other.a) && this.b.equals(other.b)
		} else {
			return this.x.num == other.x.num && this.y.num == other.y.num && this.a.num == other.a.num && this.b.num == other.b.num
		}
	}
	
	add(other) {
		if (this.x instanceof FieldElement) {
			if (this.x.num == undefined) {
				return other;
			}
			if (other.x.num == undefined) {
				return this;
			}
			if (this.a.num != other.a.num || this.b.num != other.b.num) {
				throw new Error(`Points (${this}, ${other}) are not on the same curve`)
			}
			if (this.x.num && this.x.num != other.x.num) {
				const s = other.y.sub(this.y).div(other.x.sub(this.x));

				let x = s.pow(2).sub(this.x).sub(other.x);
				let y = s.mul(this.x.sub(x)).sub(this.y);
				return new Point(x, y, this.a, this.b);

			}
			if (this.x.num && this.x.num === other.x.num && this.y.num === other.y.num) {
				const s = (this.x.pow(2).rmul(3).add(this.a)).div(this.y.rmul(2));
				let x = s.pow(2).sub(this.x.rmul(2));
				let y = s.mul(this.x.sub(x)).sub(this.y);
				return new Point(x, y, this.a, this.b);
			}
			if (this.x.num && this.x.num === other.x.num && this.y.num !== other.y.num) {
				return new Point(new FieldElement(undefined, this.x.prime),
					new FieldElement(undefined, this.x.prime),
					this.a, this.b)
			}
		} else {
			//Real
			if (this.x == undefined) {
				return other;
			}
			if (this.a != other.a || this.b != other.b) {
				throw new Error(`Points (${this}, ${other}) are not on the same curve`)
			}
			else if (isNaN(this.x)) return other;
			else if (isNaN(other.x)) return this;
			else if (this.x == other.x && this.y != other.y) return new Point(undefined, undefined, 5, 7);
			else if (this.x != other.x) {
				const s = (other.y - this.y) / (other.x - this.x);
				x = Math.pow(s, 2) - this.x - other.x;
				y = s * (this.x - x) - this.y;
				return new Point(x, y, this.a, this.b);
			}
			else {
				const s = (3 * Math.pow(this.x, 2) + this.a) / (2 * this.y);
				x = Math.pow(s, 2) - 2 * this.x;
				y = s * (this.x - x) - this.y;
				return new Point(x, y, this.a, this.b);
			}

		}
	}
	rmul(coefficient) {
		if (this.x instanceof FieldElement || BN.isBN(this.x.num)) {
			x1 = new FieldElement(undefined, this.x.prime);
			y1 = new FieldElement(undefined, this.x.prime);
			let product = new Point(x1, y1, this.a, this.b);
			for (let index = 0; index < coefficient; index++) {

				product = product.add(this);

			}
			return product;
		}
	}
}

Point.prototype.toString = function(){
	if (this.x == undefined) {
		return 'Point(infinity)'
	} else {
		return `Point (${this.x.toString()}, ${this.y.toString()})`
	}
}



//let prime = new BN('fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f ',16);
//let prime = new BN(223);

class S256Field extends FieldElement {

	constructor(num, prime = BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f ')) {
		super(num, prime);
		this.prime = prime;
	}

	pow(f) {
		return new S256Field(super.pow(f).num)
	}

	add(f) {
		return new S256Field(super.add(f).num);
	}

	sqrt() {
		const P = BigInt('115792089237316195423570985008687907853269984665640564039457584007908834671663',10);
		const ep = P.addn(1).divn(4)
		return new S256Field(this.pow(ep).num, this.prime)
	}

}
S256Field.prototype.toString = function(){
	if (this.num == undefined) {
		this.num
	} else {
		return this.num.toString(16)
	}
}


class S256Point extends Point {
	constructor(x, y) {
		let prime = BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f ')
		let a = new S256Field(0n, prime);
		let b = new S256Field(7n, prime);
		if (x instanceof FieldElement) {
			super(x, y, a, b);
		} else {
			super(new S256Field(x, prime), new S256Field(y, prime), a, b);
		}
	}

	rmul(coefficient) {
		const bits = 256;
		let coef = BigInt(coefficient)
		let current = new S256Point(this.x, this.y);

		let result = new S256Point(undefined, undefined);
		for (let index = 0; index < bits; index++) {

			if (coef & 1n) {

				result = result.add(current);

			}
			current = current.add(current);

			coef = coef >> 1n;

		}

		let nx = new S256Field(result.x.num, result.a.prime);
		let ny = new S256Field(result.y.num, result.a.prime);
		return new S256Point(nx, ny)

	}

	sec(compressed=true) {
		if (compressed) {
//			let ba = this.x.num.toBuffer('be')
			let ba = Buffer.from(this.x.num.toString(16),'hex')
		if(helper.mod(this.y.num, 2n) == 0) {
				let prefix = Buffer.from([2])
				let arr = [prefix, ba]
				var buf = Buffer.concat(arr)
				return buf;
			} else {

				let prefix = Buffer.from([3])
				let arr = [prefix, ba]
				var buf = Buffer.concat(arr)
				return buf;
			}
		} else {
			let prefix = Buffer.from([4]);
			//let nax = Buffer.alloc(8)
			//let nay = Buffer.alloc(8)
//			let nax = this.x.num.toBuffer('be')
//			let nay = this.y.num.toBuffer('be')
			console.log(this.x.num)
			//nax.writeBigUInt64BE(this.x.num,0)
			//nay.writeBigUInt64BE(this.y.num, 0)
			let nax = Buffer.from(this.x.num.toString(16),'hex')
			let nay = Buffer.from(this.y.num.toString(16),'hex') 
			let arr = [prefix, nax, nay]
			return Buffer.concat(arr);
			
		}
	}

	address(compressed=true, testnet=false) {
		const sec = this.sec(compressed);
		const h160 = Buffer.from(helper.hash160(sec), 'hex'); 
		//new BN(helper.hash160(sec), 16).toBuffer('be');
		if (testnet) {
			const prefix = Buffer.from([0x6f]);
			let arr = [prefix, h160]
			const raw = Buffer.concat(arr);
			const checksum = Buffer.from(helper.doubleSha256(raw).slice(0, 8),'hex')
			const total = Buffer.concat([raw, checksum])
			const address = helper.encodeBase58(total)
			return address;
		} else {
			let prefix = Buffer.from([0x00])
			let arr = [prefix, h160]
			const raw = Buffer.concat(arr);
			const checksum = Buffer.from(helper.doubleSha256(raw).slice(0, 8),'hex')
			const total = Buffer.concat([raw, checksum])
			const address = helper.encodeBase58(total)
			return address;
		}
	}
	
	/*
	verify(z, sig) {
		const N = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);
		const G = new S256Point(
			new BN('79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798', 16),
			new BN('483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8', 16));	

		var red = BN.red(N)
		
		let reds = sig.s.toRed(red)
		let inv_reds = reds.redPow(N.subn(2))
		let s_inv = inv_reds.fromRed()
		let u = s_inv.mul(z).mod(N);
		let v = sig.r.mul(s_inv).mod(N);
		let total = G.rmul(u).add(this.rmul(v))
		return total.x.num.eq(sig.r);
	}

	static parse( secBin ) {
		const P = new BN('115792089237316195423570985008687907853269984665640564039457584007908834671663',10);

		if (secBin[0] == 4) {
			let x = new BN(secBin.slice(0,15));
			let y = new BN(secBin.slice(15,32));
			return new S256Point(x,y);
		}
		const isEven = secBin[0] == 2;
		let x = new S256Field(secBin.slice(1,secBin.length))
		const B = new S256Field(7)
		const alpha = x.pow(3).add(B);
		const beta = alpha.sqrt()
		let evenBeta, oddBeta;
		if (beta.num.isEven()) {
			evenBeta = beta
			oddBeta = new S256Field(P.sub(beta.num))
		} else {
			evenBeta = new S256Field(P.sub(beta.num))
			oddBeta = beta;
		}
		if (isEven) {
			return new S256Point(x, evenBeta)
		} else {
			return new S256Point(x, oddBeta)
		}
	}
	*/
}
S256Point.prototype.toString = function(){
	if (this.x == undefined) {
		return 'S256Point(infinity)'
	} else {
		return `S256Point (${this.x.toString()}, ${this.y.toString()})`
	}
}


let G = new S256Point(
	BigInt('0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'),
	BigInt('0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8'));	
let N = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');


module.exports.FieldElement = FieldElement;
module.exports.Point = Point;
module.exports.S256Field = S256Field;
module.exports.S256Point = S256Point;
module.exports.G = G;
module.exports.N = N; 