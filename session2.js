var ecc = require('./ecc.js')

var helper = require('./helper.js')
var BN = require('bn.js')
prime = 223;
a = new ecc.FieldElement(0, prime);
b = new ecc.FieldElement(7, prime);

//Exercise 1.1
points = [{x:192,y:105},{x:17,y:56},{x:200,y:119},{x:1,y:193},{x:42,y:99}]
p = points.map(obj => {
		try {
			return new ecc.Point(new ecc.FieldElement(obj.x, prime), new ecc.FieldElement(obj.y, prime), a, b);
		} catch(error) {
			return;
		}
		
	}
)

console.log(p)


//Exercise 2.1
additions =   [[ {x:192,y:105}, {x:17,y:56}, {x:170,y:142} ],
		[ {x:47,y:71}, {x:117,y:141}, {x:60,y:139} ],
		[ {x:143,y:98}, {x:76,y:66}, {x:47,y:71} ]]
pa = additions.map(obj => {
	x1 = new ecc.FieldElement(obj[0].x, prime);
	y1 = new ecc.FieldElement(obj[0].y, prime);
	p1 = new ecc.Point(x1, y1, a, b);
	x2 = new ecc.FieldElement(obj[1].x, prime);
	y2 = new ecc.FieldElement(obj[1].y, prime);
	p2 = new ecc.Point(x2, y2, a, b);
	x3 = new ecc.FieldElement(obj[2].x, prime);
	y3 = new ecc.FieldElement(obj[2].y, prime);
	p3 = new ecc.Point(x3, y3, a, b);
	pa = p1.add(p2)
	return pa
})

//Exercise 3.1

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
	return p1.rmul(s);
})

//Exercise 4.1
x = new ecc.FieldElement(15, prime)
y = new ecc.FieldElement(86, prime)

p = new ecc.Point(x, y, a, b)
inf = new ecc.Point(new ecc.FieldElement(undefined), new ecc.FieldElement(undefined), a, b)
product = p
counter = 1
while (!product.eq(inf)) {
	product = product.add(p)
	counter++
}
counter


//Excercise 4.2 
p = new BN('115792089237316195423570985008687907853269984665640564039457584007908834671663', 10)
x = new BN('79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798', 'hex')
y = new BN('483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8', 'hex')
y.pow(new BN(2)).mod(p).eq(x.pow(new BN(3)).addn(7).mod(p))


G = new ecc.S256Point(
	new BN('79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798', 16),
	new BN('483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8', 16));	
N = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);
G.rmul(N)

secret = 999
G.rmul(secret)

//Exercise 5.1
secrets = ['7', '1485', '340282366920938463463374607431768211456', 
'1766847064778384329583297500742918515827483896875618958121606203440103424']
secrets.map(x => G.rmul(x))


// Exercise 6.1
secrets = [Math.pow(999,3), 123, 42424242]
x = secrets.map( secret => { 
	point = G.rmul(secret)
	uncompressed = Buffer.concat([Buffer.from([0x04]), point.x.num.toBuffer('be'), point.y.num.toBuffer('be')]);
	console.log(uncompressed.toString('hex'))
	if (point.y.num.mod(new BN(2)).eqn(1)) {
		compressed = Buffer.concat([Buffer.from([0x03]), point.x.num.toBuffer('be')])
	} else {
		compressed = Buffer.concat([Buffer.from([0x02]), point.x.num.toBuffer('be')])
	}
	console.log(compressed.toString('hex'))
})

//Exercise 7.1
components = [[true,Math.pow(888,3)],[false, 321],[false, 4242424242]]
components.map( o => {
	point = G.rmul(o[1])
	sec = point.sec(o[0])
	h160 = Buffer.from(helper.hash160(sec),'hex')
	raw = Buffer.concat([Buffer.from([0x00]), h160])
	checksum = Buffer.from(helper.doubleSha256(raw).slice(0,8),'hex')
	total = Buffer.concat([raw, checksum])
	console.log(helper.encodeBase58(total))

	raw = Buffer.concat([Buffer.from([0x6f]), h160])
	checksum = Buffer.from(helper.doubleSha256(raw).slice(0,8),'hex')
	total = Buffer.concat([raw, checksum])
	console.log(helper.encodeBase58(total))
})

//Exercise 8.1
secret = new BN('1800555555518005555555',10)
point = G.rmul(secret)
point.address(true, testnet=true)

//Signing example
secret = new BN('4', 10)
z = Math.floor(Math.random()*100)
k = new BN(Math.floor(Math.random()*100))

r = (G.rmul(k)).x.num
var red = BN.red(N)
var redk = k.toRed(red)

s = (r.mul(secret).addn(z)).mul(redk.redPow(N.subn(2)).mod(N)).mod(N)
z.toString(16)
r.toString(16)
s.toString(16)

//Verification Example
point = new ecc.S256Point(
			new BN('e493dbf1c10d80f3581e4904930b1404cc6c13900ee0758474fa94abe8c4cd13', 16),
			new BN('51ed993ea0d455b75642e2098ea51448d967ae33bfbdfe40cfe97bdc47739922', 16));
z = new BN('524c14a77b666d906fbe56973becf3b3b9eac65442774473c68407e89c5659de', 16);
r = new BN('c0824a3ccdf3482f1435ef1917fad4a1d5573a15f0fa18a9b81dc76a941c4a3c', 16);
s = new BN('84ada30118411ef3f1777690d3dc182c289e04486375e91ba73bc48c51c59da7', 16);

var red = BN.red(N)
var reds = s.toRed(red)
			
u = z.mul(reds.redPow(N.subn(2))).mod(N)
v = r.mul(reds.redPow(N.subn(2))).mod(N)
(G.rmul(u).add(point.rmul(v))).x.num.eq(r)

//Exercise 9.1

px = new BN('887387e452b8eacc4acfde10d9aaf7f6d9a0f975aabb10d006e4da568744d06c', 16)
py = new BN('61de6d95231cd89026e286df3b6ae4a894a3378e393e93a0f45b666329a0ae34', 16)
signatures =[['ec208baa0fc1c19f708a9ca96fdeff3ac3f230bb4a7ba4aede4942ad003c0f60', 'ac8d1c87e51d0d441be8b3dd5b05c8795b48875dffe00b7ffcfac23010d3a395', '68342ceff8935ededd102dd876ffd6ba72d6a427a3edb13d26eb0781cb423c4' ],
			 ['7c076ff316692a3d7eb3c3bb0f8b1488cf72e1afcd929e29307032997a838a3d', 'eff69ef2b1bd93a66ed5219add4fb51e11a840f404876325a1e8ffe0529a2c', 'c7207fee197d27c618aea621406f6bf5ef6fca38681d82b2f06fddbdce6feab6' ]
]
point = new ecc.S256Point( px, py)

signatures.map(obj => {
	z = new BN(obj[0], 'hex')
	r = new BN(obj[1], 'hex')
	s = new BN(obj[2], 'hex')
	
	reds = s.toRed(red) 
	u = z.mul(reds.redPow(N.subn(2))).mod(N)
	v = r.mul(reds.redPow(N.subn(2))).mod(N)
	return (G.rmul(u).add(point.rmul(v))).x.num.eq(r)
})