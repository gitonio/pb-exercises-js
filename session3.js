var ecc = require('./ecc.js')
var Readable = require('stream').Readable

var helper = require('./helper.js')
var Tx = require('./tx.js')
var BN = require('bn.js')
prime = 223;
a = new ecc.FieldElement(0, prime);
b = new ecc.FieldElement(7, prime);
G = new ecc.S256Point(
	new BN('79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798', 16),
	new BN('483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8', 16));	
	N = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);

console.log('\nSigning Example')
secret = new BN('1800555555518005555555',10)
z = Buffer.from(helper.doubleSha256(Buffer.from('ECDSA is awesome!')),'hex')
z = new BN(z)
randMax = new BN('115792089237316195423570985008687907853269984665640564039457584007913129639936',10)
k = randMax.muln(Math.random())
r = G.rmul(k).x.num
s = r.mul(secret).add(z)

var red = BN.red(N)
var redk = k.toRed(red)

s = (r.mul(secret).add(z)).mul(redk.redPow(N.subn(2)).mod(N)).mod(N)
console.log(z.toString(16))
console.log(r.toString(16))
console.log(s.toString(16))

//Verification Example
console.log('\nVerification Example')
point = new ecc.S256Point(
			new BN('04519fac3d910ca7e7138f7013706f619fa8f033e6ec6e09370ea38cee6a7574', 16),
			new BN('82b51eab8c27c66e26c858a079bcdf4f1ada34cec420cafc7eac1a42216fb6c4', 16));
z = new BN('bc62d4b80d9e36da29c16c5d4d9f11731f36052c72401a76c23c0fb5a9b74423', 16);
r = new BN('37206a0610995c58074999cb9767b87af4c4978db68c06e8e6e81d282047a7c6', 16);
s = new BN('8ca63759c1157ebeaec0d03cecca119fc9a75bf8e6d0fa65c841c8e2738cdaec', 16);

var red = BN.red(N)
var reds = s.toRed(red)
			
u = z.mul(reds.redPow(N.subn(2))).mod(N)
v = r.mul(reds.redPow(N.subn(2))).mod(N)

console.log(G.rmul(u).add(point.rmul(v)).x.num.eq(r))

console.log('\nExercise 1.1')

px = '887387e452b8eacc4acfde10d9aaf7f6d9a0f975aabb10d006e4da568744d06c'
py = '61de6d95231cd89026e286df3b6ae4a894a3378e393e93a0f45b666329a0ae34'

signatures = [
       ['ec208baa0fc1c19f708a9ca96fdeff3ac3f230bb4a7ba4aede4942ad003c0f60',
		'ac8d1c87e51d0d441be8b3dd5b05c8795b48875dffe00b7ffcfac23010d3a395',
		'68342ceff8935ededd102dd876ffd6ba72d6a427a3edb13d26eb0781cb423c4'],
	   ['7c076ff316692a3d7eb3c3bb0f8b1488cf72e1afcd929e29307032997a838a3d',
		'eff69ef2b1bd93a66ed5219add4fb51e11a840f404876325a1e8ffe0529a2c',
		'c7207fee197d27c618aea621406f6bf5ef6fca38681d82b2f06fddbdce6feab6'],
   ]
point = new ecc.S256Point(new BN(px,16), new BN(py,16))
signatures.map(obj => {
	var red = BN.red(N)
	z = new BN(obj[0],16)
	r = new BN(obj[1],16)
	s = new BN(obj[2],16)
	var reds = s.toRed(red)
	u = z.mul(reds.redPow(N.subn(2))).mod(N)
	v = r.mul(reds.redPow(N.subn(2))).mod(N)
	console.log(G.rmul(u).add(point.rmul(v)).x.num.eq(r))

})


console.log('\nExercise 2.1')

der = Buffer.from('304402201f62993ee03fca342fcb45929993fa6ee885e00ddad8de154f268d98f083991402201e1ca12ad140c04e0e022c38f7ce31da426b8009d02832f0b44f39a6b178b7a1','hex')
sec = Buffer.from('0204519fac3d910ca7e7138f7013706f619fa8f033e6ec6e09370ea38cee6a7574','hex')
z = new BN(helper.doubleSha256(Buffer.from('ECDSA is awesome!')),'hex')
console.log(z.toString(10))
sig = ecc.Signature.parse(der)
point = ecc.S256Point.parse(sec)
console.log(point.verify(z,sig))

// WIF Example
console.log('\nWIF Example')
secret1 = Buffer.from('115792089237316193816632940749697632311307892324477961517254590225120294338560')
secret2 = Buffer.from('ffffffffffffff00000000000000000000000000000000000000000000000000', 'hex')
x = new BN('115792089237316193816632940749697632311307892324477961517254590225120294338560',10)
y = new BN('ffffffffffffff00000000000000000000000000000000000000000000000000', 16)
xb = x.toBuffer('be')
yb = y.toBuffer('be')
console.log(helper.encodeBase58Checksum(Buffer.concat([Buffer.from([0x80]), secret2])))
console.log(helper.encodeBase58Checksum(Buffer.concat([Buffer.from([0x80]), secret2, Buffer.from([0x01])])))
console.log(helper.encodeBase58Checksum(Buffer.concat([Buffer.from([0xef]), secret2])))
console.log(helper.encodeBase58Checksum(Buffer.concat([Buffer.from([0xef]), secret2, Buffer.from([0x01])])))

// Exercise 3.1
console.log('\nExercise 3.1')
components = [
				['ffffffffffffff80000000000000000000000000000000000000000000000000', false, true],
				['fffffffffffffe00000000000000000000000000000000000000000000000000', true,  false],
				['0dba685b4511dbd3d368e5c4358a1277de9486447af7b3604a69b8d9d8b7889d', false, false],
				['1cca23de92fd1862fb5b76e5f4f50eb082165e5191e116c18ed1a6b24be6a53f', true, true]
]

components.map( obj => {
	secretBytes = Buffer.from(obj[0],'hex')
	if (obj[1]) {
		prefix = Buffer.from([0xef])
	} else {
		prefix = Buffer.from([0x80])
	}
	if (obj[2]) {
		suffix = Buffer.from([0x01])
	} else {
		suffix = Buffer.from([])
	}
	wif = helper.encodeBase58Checksum(Buffer.concat([prefix, secretBytes, suffix]))
	console.log(wif)
})

console.log('\nExercise 8.1/8.2/8.3')
hex_transaction = '010000000456919960ac691763688d3d3bcea9ad6ecaf875df5339e148a1fc61c6ed7a069e010000006a47304402204585bcdef85e6b1c6af5c2669d4830ff86e42dd205c0e089bc2a821657e951c002201024a10366077f87d6bce1f7100ad8cfa8a064b39d4e8fe4ea13a7b71aa8180f012102f0da57e85eec2934a82a585ea337ce2f4998b50ae699dd79f5880e253dafafb7feffffffeb8f51f4038dc17e6313cf831d4f02281c2a468bde0fafd37f1bf882729e7fd3000000006a47304402207899531a52d59a6de200179928ca900254a36b8dff8bb75f5f5d71b1cdc26125022008b422690b8461cb52c3cc30330b23d574351872b7c361e9aae3649071c1a7160121035d5c93d9ac96881f19ba1f686f15f009ded7c62efe85a872e6a19b43c15a2937feffffff567bf40595119d1bb8a3037c356efd56170b64cbcc160fb028fa10704b45d775000000006a47304402204c7c7818424c7f7911da6cddc59655a70af1cb5eaf17c69dadbfc74ffa0b662f02207599e08bc8023693ad4e9527dc42c34210f7a7d1d1ddfc8492b654a11e7620a0012102158b46fbdff65d0172b7989aec8850aa0dae49abfb84c81ae6e5b251a58ace5cfeffffffd63a5e6c16e620f86f375925b21cabaf736c779f88fd04dcad51d26690f7f345010000006a47304402200633ea0d3314bea0d95b3cd8dadb2ef79ea8331ffe1e61f762c0f6daea0fabde022029f23b3e9c30f080446150b23852028751635dcee2be669c2a1686a4b5edf304012103ffd6f4a67e94aba353a00882e563ff2722eb4cff0ad6006e86ee20dfe7520d55feffffff0251430f00000000001976a914ab0c0b2e98b1ab6dbf67d4750b0a56244948a87988ac005a6202000000001976a9143c82d7df364eb6c75be8c80df2b3eda8db57397088ac4643060000'

bin_transaction = Buffer.from(hex_transaction, 'hex');
		readable = new Readable()
		readable.push(bin_transaction)
		readable.push(null)
		
		tx = Tx.Tx.parse(readable)
console.log(tx.inputs[1].scriptSig.toString())
console.log(tx.outputs[0].scriptPubkey.toString())
console.log(tx.outputs[0].amount)



