//https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
var BN = require('bn.js');

class FieldElement {
	constructor(num, prime) {
		this.num = num;
		this.prime = prime;
		if (this.num < 0) {
			throw new Error(`Num ${this.num} not in field range 0 to ${this.prime - 1}`);
		}
	}

	equals(fe) {
		if (this.num == fe.num) return 'true'
	}

	add(fe) {
		console.log('fe',fe)
		if (this.prime != fe.prime) {
			throw new Error('Primes must be the same');
		}
		const num = (this.num + fe.num) % this.prime;
		return new FieldElement(num, fe.prime);
	}
	sub(fe) {
		if (this.prime != fe.prime) {
			throw new Error('Primes must be the same');
		}
		//https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
		const num = (((this.num - fe.num) % this.prime) + this.prime) % this.prime;
		return new FieldElement(num, fe.prime);
	}
	mul(fe) {
		if (this.prime != fe.prime) {
			throw new Error('Primes must be the same');
		}
		const num = (this.num * fe.num) % this.prime;
		return new FieldElement(num, fe.prime);
	}
	rmul(f) {
		const num = (this.num * f) % this.prime;
		return new FieldElement(num, this.prime);
	}
	pow(f) {
		let num;
		if (f < 0) {
			num = new BN(Math.pow(this.num, -f)).pow(new BN(this.prime - 2)).mod(new BN(this.prime)).toNumber();
		} else {
			num = Math.pow(this.num, f % (this.prime - 1)) % this.prime;
		}
		return new FieldElement(num, this.prime);
	}
	div(fe) {
		if (this.prime != fe.prime) {
			throw new Error('Primes must be the same');
		}
		const inv = new BN(fe.num).pow(new BN(this.prime - 2)).mod(new BN(this.prime));
		const num = (new BN(this.num).mul(inv)).mod(new BN(this.prime)).toNumber();
		return new FieldElement(num, this.prime);

	}
};

class Point {
	constructor(x, y, a, b) {
		this.x = x;
		this.y = y;
		this.a = a;
		this.b = b;
		console.log('this',this)
		if (x instanceof FieldElement) {
			if (this.x.num == undefined) {
				return
			}
			// if (this.y.pow(2).num != this.x.pow(3).add(this.a.mul(this.x)).add(this.b).num) {
			// 	throw new Error(`(${this.x.num}, ${this.y.num}) is not on the curve1`);
			// }
			console.log('this.y',this.y)
			console.log('left',new BN(this.y.pow(new BN(2)).num).mod(this.x.prime).toString(10) )
			console.log('right', new BN(this.x.pow(new BN(3)).add(this.a.mul(this.x)).add(this.b).num).mod(this.x.prime).toString(10)  ) 
			if (this.y.pow(new BN(2)).num != this.x.pow(new BN(3)).add(this.a.mul(this.x)).add(this.b).num) {
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
		if (x instanceof FieldElement) {
			if (this.x.num == undefined) {
				return other;
			}
			if (other.x.num == undefined) {
				return this;
			}
			if (this.a.num != other.a.num || this.b.num != other.b.num) {
				throw new Error(`Points (${this}, ${other}) are not on the same curve`)
			}
			if (this.x.num != other.x.num) {
				const s = other.y.sub(this.y).div(other.x.sub(this.x));

				x = s.pow(2).sub(this.x).sub(other.x);
				y = s.mul(this.x.sub(x)).sub(this.y);
				return new Point(x, y, this.a, this.b);

			}
			if (this.x.num == other.x.num && this.y.num == other.y.num) {
				const s = (this.x.pow(2).rmul(3).add(this.a)).div(this.y.rmul(2));
				x = s.pow(2).sub(this.x.rmul(2));
				y = s.mul(this.x.sub(x)).sub(this.y);
				return new Point(x, y, this.a, this.b);				
			}
			if (this.x.num == other.x.num && this.y.num != other.y.num) {
				return new Point(new FieldElement(undefined, x.prime),
				new FieldElement(undefined, x.prime),
				this.a, this.b
			)
			}
		} else {
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
	rmul(coefficent) {
		if (x instanceof FieldElement) {
			x1 = new FieldElement(undefined, prime);
			y1 = new FieldElement(undefined, prime);
			let product = new Point(x1, y1, this.a, this.b);
			for (let index = 0; index < coefficent; index++) {
				product = product.add(this);
			}
			return product;
		}
	}
}
let prime = new BN('1.1579209e+77',10);
//console.log(prime)
class S256Field extends FieldElement {
	
	constructor(num) {
		super(num, prime);
		this.prime = prime;
	}
}

class S256Point extends Point {
	constructor(x, y) {
		a = new S256Field(new BN(0));
		b = new S256Field(new BN(7));
		if (x instanceof FieldElement){
			super(x, y, a, b);			
		} else {
			super(new S256Field(x),  new S256Field(y), a, b);
		}
	}
}

module.exports.FieldElement = FieldElement;
module.exports.Point = Point;
module.exports.S256Field = S256Field;
module.exports.S256Point = S256Point;