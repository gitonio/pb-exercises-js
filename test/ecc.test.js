var { assert, expect} = require('chai');
var ecc = require('../ecc');
var BN = require('bn.js')


 describe('FieldElement', function() {
	var newNum = new ecc.FieldElement(2,3);
	it('constructor with valid args', function() {
		assert.equal(newNum.num, 2);
		assert.equal(newNum.prime, 3);
	})

	it('constructor with invalid args', function() {
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
			function() {p = new ecc.Point(x, y, 5, 7); }
		).to.throw(`(${x}, ${y}) is not on the curve`); 
		expect(
			function() {new ecc.Point(3, -7, 5, 7)}
		).to.not.throw(); 
		expect(
			function() {new ecc.Point(18, 77, 5, 7)}
		).to.not.throw(); 
		
	})
	it('should add0', function () {
		a = new ecc.Point(undefined, undefined, 5, 7);
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
	it('test_add0', function() {
		prime = 223;
		a1 = new ecc.FieldElement(0, prime);
		b1 = new ecc.FieldElement(7, prime);
		x1 = new ecc.FieldElement(192, prime);
		y1 = new ecc.FieldElement(105, prime);
		p1 = new ecc.Point(x1, y1, a1, b1);
		a2 = new ecc.FieldElement(0, prime);
		b2 = new ecc.FieldElement(7, prime);
		x2 = new ecc.FieldElement(17, prime);
		y2 = new ecc.FieldElement(56, prime);
		p2 = new ecc.Point(x2, y2, a2, b2);
		p1.add(p2);
		p1.add(p1);
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
	
	it('test_rmul', function() {
		prime = 223;
		a = new ecc.FieldElement(0, prime);
		b = new ecc.FieldElement(7, prime);
		multiplications = [
			{s:2,x1:192,y1:105,x2:49,y2:71},
			{s:2,x1:143,y1:98,x2:64,y2:168},
			{s:2,x1:47,y1:71,x2:36,y2:111},
			{s:4,x1:47,y1:71,x2:194,y2:51},  
			{s:8,x1:47,y1:71,x2:116,y2:55},
			{s:21,x1:47,y1:71,x2:undefined,y2:undefined},			
		] 
		multiplications.map(obj =>{
			s = obj.s;
			x1 = new ecc.FieldElement(obj.x1, prime);
			y1 = new ecc.FieldElement(obj.y1, prime);
			a = new ecc.FieldElement(0, prime);
			b = new ecc.FieldElement(7, prime);
			p1 = new ecc.Point(x1, y1, a, b);
			x2 = new ecc.FieldElement(obj.x2, prime);
			y2 = new ecc.FieldElement(obj.y2, prime);
			p2 = new ecc.Point(x2, y2, a, b);
			assert.deepEqual(p1.rmul(s), p2);
		})
	})
})


describe('S256Test', function() {

	it('test_order', function() {
		G = new ecc.S256Point(
			new BN(47),
			new BN(71), prime=new BN(223));	
		R = new ecc.S256Point(
			new BN(116),
			new BN(55), prime=new BN(223));	
		
	
		N = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);
		N = new BN(8); 
		console.log(G, G.x.num.toString(10), G.y.num.toString(10));
		nn = G.rmul(N);
		console.log(nn, nn.x.num.toString(10), nn.y.num.toString(10));
		assert.equal(nn.x.num.toString(10) , 116); 
		
	})
	
	it('test_order2', function() {
		G = new ecc.S256Point(
			new BN('79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798', 16),
			new BN('483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8', 16));		
		//G = new ecc.S256Point(
		//	new BN(47),
		//	new BN(71), prime=new BN(223));		
	
		N = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);
		//console.log(G, G.x.num.toString(10), G.y.num.toString(10));
		nn = G.rmul(N);
		//console.log(nn, nn.x.num.toString(10), nn.y.num.toString(10));
		assert.isUndefined(nn.num); 
		
	})

	it('test_pubpoint', function() {
		G = new ecc.S256Point(
			new BN('79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798', 16),
			new BN('483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8', 16));		
		points = [
			{secret: 7, x: '5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc', y: '6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da'},
            //{secret:1485, x: 'c982196a7466fbbbb0e27a940b6af926c1a74d5ad07128c82824a11b5398afda', y: '7a91f9eae64438afb9ce6448a1c133db2d8fb9254e4546b6f001637d50901f55'},
            //{secret:Math.pow(2,128), x: '8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da', y: '662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82'},
            //{secret:Math.pow(2,240)+Math.pow(2,31), x: '9577ff57c8234558f293df502ca4f09cbc65a6572c842b39b366f21717945116', y: '10b49c67fa9365ad7b90dab070be339a1daf9052373ec30ffae4f72d5e66d053'}

		]
		points.map(obj => {
			point = new ecc.S256Point(new BN(obj.x, 16), new BN(obj.y, 16));
			console.log(point)
			let res = G.rmul(obj.secret);
			console.log(res, obj.secret)
			console.log(res.x.prime.toString() == point.x.prime.toString())
			assert.deepEqual(res.x,point.x)
		})
	})

	it('test_sec', function() {
		G = new ecc.S256Point(
			new BN('79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798', 16),
			new BN('483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8', 16));		
		const coefficient = new BN(Math.pow(999,3));
		const uncompressed = new BN('049d5ca49670cbe4c3bfa84c96a8c87df086c6ea6a24ba6b809c9de234496808d56fa15cc7f3d38cda98dee2419f415b7513dde1301f8643cd9245aea7f3f911f9', 16);
		const compressed = new BN('039d5ca49670cbe4c3bfa84c96a8c87df086c6ea6a24ba6b809c9de234496808d5', 16);
		point = G.rmul(coefficient);
		assert.deepEqual(point.sec(), uncompressed.toArray())
		assert.deepEqual(point.sec(true), compressed.toArray())
	})
	
})






