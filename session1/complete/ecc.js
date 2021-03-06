
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
		/*
		let red = BN.red(this.prime);
		let fer = fe.num.toRed(red)
		const inv = fer.redPow(this.prime.sub(new BN(2))).mod(this.prime)
		const num = (new BN(this.num).mul(inv)).mod(new BN(this.prime));
		*/
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

Point.prototype.toString = function(){
	if (this.x == undefined) {
		return 'Point(infinity)'
	} else {
		return `Point (${this.x.toString()}, ${this.y.toString()})`
	}
}

module.exports.FieldElement = FieldElement;
module.exports.Point = Point;
