var { assert, expect} = require('chai');
var ecc = require('../ecc');

 describe('FieldElement', function() {
	var newNum = new ecc.FieldElement(2,3);

	it('constructor with valid args', function() {
		assert.equal(newNum.num, 2);
		assert.equal(newNum.prime, 3);
	})
	
	it('constructor with invalide args', function() {
		var x = -22;
		var y = 3;
		expect(
			function() {new ecc.FieldElement(x,y)}
		).to.throw(`Num ${x} not in field range 0 to ${y-1}`); 
	})
	
	it('add', function() {
		a = new ecc.FieldElement(2, 31);
		b = new ecc.FieldElement(15,31);
		assert.deepEqual(a.add(b), new ecc.FieldElement(17,31));
		a = new ecc.FieldElement(17, 31);
		b = new ecc.FieldElement(21,31);
		assert.deepEqual(a.add(b), new ecc.FieldElement(7,31));
	})
	
	it('sub', function() {
		a = new ecc.FieldElement(29, 31);
		b = new ecc.FieldElement(4,31);
		assert.deepEqual(a.sub(b), new ecc.FieldElement(25,31));
		a = new ecc.FieldElement(15, 31);
		b = new ecc.FieldElement(30,31);
		assert.deepEqual(a.sub(b), new ecc.FieldElement(16,31));	
	})

	it('mul', function() {
		a = new ecc.FieldElement(24, 31);
		b = new ecc.FieldElement(19, 31);
		assert.deepEqual(a.mul(b), new ecc.FieldElement(22,31));
	})
	
	it('rmul', function() {
		a = new ecc.FieldElement(24, 31);
		b = 2;
		assert.deepEqual(a.rmul(b), a.add(a));
	})
	
	it('pow', function() {
		a = new ecc.FieldElement(17, 31);
		b = 3;
		assert.deepEqual(a.pow(b), new ecc.FieldElement(15,31));
		a = new ecc.FieldElement(5, 31);
		b = new ecc.FieldElement(18, 31);
		assert.deepEqual(a.pow(5).mul(b), new ecc.FieldElement(16,31));	
	})
	
	it('div', function() {
		a = new ecc.FieldElement(3, 31);
		b = new ecc.FieldElement(24, 31);
		assert.deepEqual(a.div(b), new ecc.FieldElement(4,31));
		a = new ecc.FieldElement(17, 31);
		b = -3;
		assert.deepEqual(a.pow(b), new ecc.FieldElement(29,31));	 
		a = new ecc.FieldElement(4, 31);
		b = new ecc.FieldElement(11, 31);
		assert.deepEqual(a.pow(-4).mul(b), new ecc.FieldElement(13,31));
	})

})

describe('Point', function() {
	x = -2;
	y =  4;
	it('should validate curve', function () {
		expect(
			function() {p = new ecc.Point(x, y, 5, 7); console.log(p)}
		).to.throw(`(${x}, ${y}) is not on the curve`); 
		expect(
			function() {new ecc.Point(3, -7, 5, 7)}
		).to.not.throw(); 
		expect(
			function() {new ecc.Point(18, 77, 5, 7)}
		).to.not.throw(); 
		
	})
	it('should add0', function () {
		a = new ecc.Point(NaN, NaN, 5, 7);
		b = new ecc.Point(2, 5, 5, 7);
		c = new ecc.Point(2, -5, 5, 7);
		assert.deepEqual(a.add(b), b);
		assert.deepEqual(b.add(a), b);
		assert.deepEqual(b.add(c), a);
	})
	it('should add1', function () {
		a = new ecc.Point(3, 7, 5, 7);
		b = new ecc.Point(-1, -1, 5, 7);
		c = new ecc.Point(2, -5, 5, 7);
		assert.deepEqual(a.add(b),c);
	})
	it('should add2', function() {
		a = new ecc.Point(-1, 1, 5, 7);
		b = new ecc.Point(18, -77, 5, 7);
		assert.deepEqual(a.add(a), b); 
	})
})
 
describe('ECC', function() {
	it('test_on_curve', function () {
		prime = 223;
		a = new ecc.FieldElement(0, prime);
		b = new ecc.FieldElement(7, prime);
		valid_points =   [ {x:192,y:105}, {x:17,y:56}, {x:1,y:193}];
		invalid_points = [ {x:200,y:119}, {x:42,y:99}];
		valid_points.map(obj => {
			x = new ecc.FieldElement(obj.x, prime);
			y = new ecc.FieldElement(obj.y, prime);
			expect( function() {new ecc.Point(x, y, a, b)}).to.not.throw()
		})
		invalid_points.map(obj => {
			x = new ecc.FieldElement(obj.x, prime);
			y = new ecc.FieldElement(obj.y, prime);
			expect( function() {p = new ecc.Point(x, y, a, b); }).to.throw(`(${x.num}, ${y.num}) is not on the curve`)
		})		
	})
	it('test_add1', function() {
		prime = 223;
		a = new ecc.FieldElement(0, prime);
		b = new ecc.FieldElement(7, prime);
		additions =   [[ {x:192,y:105}, {x:17,y:56}, {x:170,y:142} ],
		[ {x:47,y:71}, {x:117,y:141}, {x:60,y:139} ],
		[ {x:143,y:98}, {x:76,y:66}, {x:47,y:71} ]]
		additions.map(obj => {
			x1 = new ecc.FieldElement(obj[0].x, prime);
			y1 = new ecc.FieldElement(obj[0].y, prime);
			p1 = new ecc.Point(x1, y1, a, b);
			x2 = new ecc.FieldElement(obj[1].x, prime);
			y2 = new ecc.FieldElement(obj[1].y, prime);
			p2 = new ecc.Point(x2, y2, a, b);
			x3 = new ecc.FieldElement(obj[2].x, prime);
			y3 = new ecc.FieldElement(obj[2].y, prime);
			p3 = new ecc.Point(x3, y3, a, b);
			assert.deepEqual(p1.add(p2), p3)
		})
	})
})







