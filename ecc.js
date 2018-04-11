//https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
var BN = require('bn.js');

class FieldElement {
	constructor(num, prime) {
		if (num == undefined) {
			this.num = undefined
			this.prime = new BN(prime);
		} else {
			this.num = (BN.isBN(num) && num!= undefined) ? num : new BN(num); 
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
		console.log('div', this.num, fe.num, 'this prime', this.prime.toString(10))
		console.log('div2', this.prime.add(new BN(2)))
		const inv =  fe.num.pow( this.prime.sub(new BN(2)) ).mod(this.prime);
		console.log('div inv', inv)
		const num = (new BN(this.num).mul(inv)).mod(new BN(this.prime)).toNumber();
		console.log('div num', num)
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
			if ( !this.y.pow(2).num.eq( this.x.pow(3).add(this.a.mul(this.x)).add(this.b).num) ) {
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

	add(other) {
		if (this.x instanceof FieldElement) {
			if (this.x.num == undefined) {
				return other;
			}
			if (other.x.num  == undefined) {
				return this;
			}
			if (!this.a.num.eq(other.a.num) || !this.b.num.eq(other.b.num)) {
				throw new Error(`Points (${this}, ${other}) are not on the same curve`)
			}
			if (this.x.num && !this.x.num.eq(other.x.num)) {
				const s = other.y.sub(this.y).div(other.x.sub(this.x));

				x = s.pow(2).sub(this.x).sub(other.x);
				y = s.mul(this.x.sub(x)).sub(this.y);
				return new Point(x, y, this.a, this.b);

			}
			if (this.x.num && this.x.num.eq(other.x.num) && this.y.num.eq(other.y.num)) {
				console.log(this.x.pow(2).rmul(3).add(this.a))
				console.log(this.y.rmul(2))
				const s = (this.x.pow(2).rmul(3).add(this.a)).div(this.y.rmul(2));
				consoloe.log('s', s)
				x = s.pow(2).sub(this.x.rmul(2));
				y = s.mul(this.x.sub(x)).sub(this.y);
				return new Point(x, y, this.a, this.b);				
			}
			if (this.x.num && this.x.num.eq(other.x.num) && !this.y.num.eq(other.y.num)) {
				return new Point(new FieldElement(undefined, x.prime),
				new FieldElement(undefined, x.prime),
				this.a, this.b
			)
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
let prime = new BN('fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f ',16);

class S256Field extends FieldElement {
	
	constructor(num) {
		super(num, prime);
		this.prime = prime;
	}
	
}

class S256Point extends Point {
	constructor(x, y) {
		let a = new S256Field(new BN(0));
		let b = new S256Field(new BN(7));
		if (x instanceof FieldElement){
			super(x, y, a, b);			
		} else {
			super(new S256Field(x),  new S256Field(y), a, b);
		}
	}
	
		rmul(coefficient) {
		N = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141',16);
		const bits = 256;
		const coe = new BN(coefficient)
		const coef = coe.mod(N);
		console.log('coef',coef);
		let current = this;
		console.log('current', current);
		let result = new S256Point(undefined,undefined);
		console.log('result', result);
		for (let index = 0; index < bits; index++) {
			console.log(index);
			if (coef & 1) {
				console.log('inif');
				result = result.add(current);
			}
			console.log('curradd')
			current = current.add(current);
			console.log('current2', current)
			coef.shrn(1);
		}
		
	}

}

module.exports.FieldElement = FieldElement;
module.exports.Point = Point;
module.exports.S256Field = S256Field;
module.exports.S256Point = S256Point;