//https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
var BN = require('bn.js');

class FieldElement  {
	constructor(num, prime){
	this.num = num;
	this.prime = prime;
	if ( this.num < 0) {
		throw new Error(`Num ${this.num} not in field range 0 to ${this.prime-1}`);
		//throw `Num ${this.num} not in field range 0 to ${this.prime-1}`;
	}	}

	equals(fe) {
		if (this.num == fe.num) return 'true'
	}
	
	add(fe) {
		if (this.prime != fe.prime) {
			throw new Error('Primes must be the same');
		}
		const num = (this.num + fe.num) % this.prime;
		return new FieldElement( num, fe.prime);
	}
	sub(fe) {
		if (this.prime != fe.prime) {
			throw new Error('Primes must be the same');
		}
		//https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
		const num = (((this.num - fe.num) % this.prime) + this.prime) % this.prime ;
		return new FieldElement( num, fe.prime);
	}
	mul(fe) {
		if (this.prime != fe.prime) {
			throw new Error('Primes must be the same');
		}
		const num = (this.num * fe.num) % this.prime;
		return new FieldElement( num, fe.prime);
	}
	rmul(f) {
		const num = (this.num * f) % this.prime;
		return new FieldElement( num, this.prime);
	}
	pow(f) {
		let num;
		if (f<0) {
			num = new BN(Math.pow(this.num, -f )).pow(new BN(this.prime - 2)).mod(new BN(this.prime)).toNumber();			
		} else {
			num = Math.pow(this.num, f  % (this.prime - 1)) % this.prime;
		}
		return new FieldElement( num, this.prime);		
	}
	div(fe) {
		if (this.prime != fe.prime) {
			throw new Error('Primes must be the same');
		}
		const inv = new BN(fe.num).pow(new BN(this.prime-2)).mod( new BN(this.prime));
		const num = (new BN(this.num).mul(inv)).mod(new BN(this.prime)).toNumber();
		return new FieldElement( num, this.prime);
		
	}
};

class Point {
	constructor( x, y, a, b) {
		this.x = (x.num !== undefined) ? x : x;
		this.y = (y.num !== undefined) ? y : y;
		this.a = (a.num !== undefined) ? a : a;
		this.b = (b.num !== undefined) ? b : b;
		if (isNaN(this.x) && typeof this.x == 'number'  && isNaN(this.y) && typeof this.y == 'number' ) { return; }
		if (x.num !== undefined) {
		if ( this.y.pow(2).num !=  this.x.pow(3).add( this.a.mul(this.x )).add( this.b).num ) { 
			throw new Error(`(${this.x.num}, ${this.y.num}) is not on the curve`);
		}
			
		} else {
		if (Math.pow(this.y,2) != (Math.pow(this.x,3) + this.a * this.x + this.b)) {
			throw new Error(`(${this.x}, ${this.y}) is not on the curve`);
		}
		}
		
	}
	
	add(other) {
		if (other.x.num != undefined) {
			const s = other.y.sub(this.y).div(other.x.sub(this.x));
			x = s.pow(2).sub(this.x).sub(other.x);
			y = s.mul(this.x.sub(x)).sub(this.y);
			return new Point(x, y, this.a, this.b);
		} else {
			if (this.a != other.a || this.b != other.b) {
				throw new Error(`Points (${this}, ${other}) are not on the same curve`)
			}
			else if (isNaN(this.x)) return other;
			else if (isNaN(other.x)) return this;
			else if (this.x == other.x && this.y != other.y) return new Point( NaN, NaN, 5, 7 ); 
			else if (this.x != other.x) {
				const s = (other.y - this.y) / (other.x - this.x);
				x = Math.pow(s, 2) - this.x  - other.x;
				y = s * (this.x - x) - this.y;
				return new Point(x, y, this.a, this.b);
			}
			else {
				const s = (3 * Math.pow(this.x,2) + this.a) /(2*this.y);
				x = Math.pow(s,2) - 2 * this.x;
				y = s*(this.x - x) - this.y;
				return new Point(x, y, this.a, this.b);
			}

		}
	}
}

class S256Field extends FieldElement {
	constructor(num) {
		super(num, Math.pow(2,256) - Math.pow(2,32) - 977)
	}
}

class S256Point extends Point {
	constructor (x, y, a, b) {
		a = S256Field(0);
		b = S256Field(7);
		super(x, y, a, b);
	}
}

module.exports.FieldElement = FieldElement;
module.exports.Point = Point;
