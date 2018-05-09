
//https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
var BN = require('bn.js');
var hash = require('hash.js');
var helper = require('./helper')
var Readable = require('stream').Readable



class FieldElement {
	constructor(num, prime) {
		if (num == undefined) {
			this.num = undefined
			this.prime = new BN(prime);
		} else {
			this.num = (BN.isBN(num) && num != undefined) ? num : new BN(num);
			this.prime = new BN(prime);
		}
		// this.num = num==undefined? undefined: 0;
		// this.num = (BN.isBN(num) && num!= undefined ? num : new BN(num));
		//this.prime = BN.isBN(prime)  && num!= undefined ? prime : new BN(prime);
		if (this.num && this.num.isNeg()) {
			throw new Error(`Num ${this.num} not in field range 0 to ${this.prime - 1}`);
		}
	}

	equals(fe) {
		if (this.num == fe.num) return 'true'
	}

	add(fe) {
		if (!this.prime.eq(fe.prime)) {
			throw new Error('Primes must be the same');
		}
		const num = this.num.add(fe.num).mod(this.prime);
		return new FieldElement(num, fe.prime);
	}
	sub(fe) {
		if (!this.prime.eq(fe.prime)) {
			throw new Error('Primes must be the same');
		}
		//https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
		//const num = (((this.num - fe.num) % this.prime) + this.prime) % this.prime;
		const num = this.num.sub(fe.num).mod(this.prime).add(this.prime).mod(this.prime);
		return new FieldElement(num, fe.prime);
	}
	mul(fe) {
		if (!this.prime.eq(fe.prime)) {
			throw new Error('Primes must be the same');
		}
		//		const num = (this.num * fe.num) % this.prime;
		const num = this.num.mul(fe.num).mod(this.prime);
		return new FieldElement(num, fe.prime);
	}
	rmul(f) {
		//const num = (this.num * f) % this.prime;
		const num = this.num.mul(new BN(f)).mod(this.prime);
		return new FieldElement(num, this.prime);
	}
	pow(f) {
		let num;
		if (f < 0) {
			num = new BN(Math.pow(this.num, -f)).pow(new BN(this.prime - 2)).mod(new BN(this.prime)).toNumber();
		} else if (BN.isBN(f)) {
			let red = BN.red(this.prime)
			let numred = this.num.toRed(red)
			//let fred = f.toRed(red)
			//let one = new BN(1)
			//let fone = one.toRed(red)
			//numred = numred.redPow(fred.redSub(fone))
			let x = numred.redPow(f.mod(this.prime.subn(1)))
			//const pf = f.mod(this.prime.sub(new BN(1)))
			//numred = numred.redPow(pf).mod(this.prime);
			num = x.fromRed();
		} else {
			num = Math.pow(this.num, f % (this.prime - 1)) % this.prime;
			const pf = new BN(f).mod(this.prime.sub(new BN(1)))

			num = this.num.pow(pf).mod(this.prime);

		}
		return new FieldElement(num, this.prime);
	}
	div(fe) {
		if (!this.prime.eq(fe.prime)) {
			throw new Error('Primes must be the same');
		}
		let red = BN.red(this.prime);
		let fer = fe.num.toRed(red)
		//const inv =  fe.num.pow( this.prime.sub(new BN(2)) ).mod(this.prime);
		const inv = fer.redPow(this.prime.sub(new BN(2))).mod(this.prime)
		const num = (new BN(this.num).mul(inv)).mod(new BN(this.prime));
		return new FieldElement(num, this.prime);

	}
};

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
			if (!this.y.pow(2).num.eq(this.x.pow(3).add(this.a.mul(this.x)).add(this.b).num)) {
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
			if (!this.a.num.eq(other.a.num) || !this.b.num.eq(other.b.num)) {
				throw new Error(`Points (${this}, ${other}) are not on the same curve`)
			}
			if (this.x.num && !this.x.num.eq(other.x.num)) {
				const s = other.y.sub(this.y).div(other.x.sub(this.x));

				let x = s.pow(2).sub(this.x).sub(other.x);
				let y = s.mul(this.x.sub(x)).sub(this.y);
				return new Point(x, y, this.a, this.b);

			}
			if (this.x.num && this.x.num.eq(other.x.num) && this.y.num.eq(other.y.num)) {
				const s = (this.x.pow(2).rmul(3).add(this.a)).div(this.y.rmul(2));
				let x = s.pow(2).sub(this.x.rmul(2));
				let y = s.mul(this.x.sub(x)).sub(this.y);
				return new Point(x, y, this.a, this.b);
			}
			if (this.x.num && this.x.num.eq(other.x.num) && !this.y.num.eq(other.y.num)) {
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

//let prime = new BN('fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f ',16);
//let prime = new BN(223);

class S256Field extends FieldElement {

	constructor(num, prime = new BN('fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f ', 16)) {
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
		const P = new BN('115792089237316195423570985008687907853269984665640564039457584007908834671663',10);
		const ep = P.addn(1).divn(4)
		return new S256Field(this.pow(ep).num, this.prime)
	}

}

class S256Point extends Point {
	constructor(x, y) {
		let prime = new BN('fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f ', 16)
		let a = new S256Field(new BN(0), prime);
		let b = new S256Field(new BN(7), prime);
		if (x instanceof FieldElement) {
			super(x, y, a, b);
		} else {
			super(new S256Field(x, prime), new S256Field(y, prime), a, b);
		}
	}

	rmul(coefficient) {
		const bits = 256;
		let coef = new BN(coefficient)
		let current = new S256Point(this.x, this.y);

		let result = new S256Point(undefined, undefined);
		for (let index = 0; index < bits; index++) {

			if (coef.andln(1)) {

				result = result.add(current);

			}
			current = current.add(current);

			coef = coef.shrn(1);

		}

		let nx = new S256Field(result.x.num, result.a.prime);
		let ny = new S256Field(result.y.num, result.a.prime);
		return new S256Point(nx, ny)

	}

	sec(compressed=true) {
		if (compressed) {
			let ba = this.x.num.toBuffer('be')
			if (this.y.num.mod(new BN(2)).toString()==0) {
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
			let nax = this.x.num.toBuffer('be')
			let nay = this.y.num.toBuffer('be')
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
}

class Signature {
	constructor (r, s) {
		this.r = r;
		this.s = s;
	}
	
	der () {

		let rbin = this.r.toBuffer('be');
		if (rbin[0] > 128) {
			let pref = Buffer.from([0])
			rbin = Buffer.concat([pref, rbin])
		}
		let result = Buffer.alloc(34);
		let pref = Buffer.from([2, rbin.length])
		result = Buffer.concat([pref, rbin]);
		
		let sbin = this.s.toBuffer('be')
		if (sbin[0] > 128) {
			let pref = Buffer.from([0])
			sbin = Buffer.concat([pref, sbin])
		}
		pref = Buffer.from([2, sbin.length])
		result = Buffer.concat([result, pref, sbin]);
		pref = Buffer.from([0x30, result.length]); 
		result = Buffer.concat([pref,  result])
		return result;

	}
	
	static parse (sig) {
		let ss = new Readable();
		ss.push(sig);
		ss.push(null);

		const compound = ss.read(1)[0]
		if (compound != 0x30) {
			throw new Error('Bad Signature');
		}
		const length = ss.read(1)[0]
		if (length + 2 != sig.length) {
			throw new Error('Bad Signature Length');
		}
		let marker = ss.read(1)[0] 
		if (marker != 0x02) {
			throw new Error('Bad Signature');
		}
		const rlength = ss.read(1)[0]
		const r = ss.read(rlength)
		marker = ss.read(1)[0]
		if (marker != 0x02) {
			throw new Error('Bad Signature');
		}
		const slength = ss.read(1)[0]
		const s = ss.read(slength)
		if (sig.length != rlength + slength + 6) {
			throw new Error("Signature too long");
		}
		return new Signature(new BN(r),new BN(s));
	}
}

let G = new S256Point(
	new BN('79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798', 16),
	new BN('483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8', 16));	
let N = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);

class PrivateKey {
	
	constructor(secret) {
		this.secret = new BN(secret, 10);		
		this.point = G.rmul(new BN(secret, 10));
	}
	
	sign(z) {
		//z = new BN(z)
		let two = new BN(2);
		let red = BN.red(N)
		let k = new BN('400', 10);
		let redk = k.toRed(red)
		let k_inv_red = redk.redPow(N.subn(2))
		let k_inv = k_inv_red.fromRed()

		let r = G.rmul(k).x.num;
		let s = r.mul(this.secret).add(z).mul(k_inv).mod(N);
		if(s.gt(N.divRound(two))) {
			s = N.sub(s);
		}
		return new Signature(r,s);
	}

	wif(compressed=true, testnet=false) {
		
		let sb = this.secret.toBuffer('be');
		let prefix = testnet ? Buffer.from([0xef]) : Buffer.from([0x80]);
		let suffix = compressed ? Buffer.from([0x01]) : Buffer.from([]);
		let complet = Buffer.concat([prefix, sb, suffix])
		return helper.encodeBase58Checksum(complet)
	}
}

function parseHexString(str) {
	var result = [];
	while (str.length >= 8) {
		result.push(parseInt(str.substring(0, 8), 16));

		str = str.substring(8, str.length);
	}

	return result;
}

module.exports.FieldElement = FieldElement;
module.exports.Point = Point;
module.exports.S256Field = S256Field;
module.exports.S256Point = S256Point;
module.exports.parseHexString = parseHexString;
module.exports.Signature = Signature;
module.exports.PrivateKey = PrivateKey;