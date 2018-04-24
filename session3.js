var ecc = require('./ecc.js')

var helper = require('./helper.js')
var BN = require('bn.js')
prime = 223;
a = new ecc.FieldElement(0, prime);
b = new ecc.FieldElement(7, prime);

// WIF Example
secret1 = Buffer.from('115792089237316193816632940749697632311307892324477961517254590225120294338560')
secret2 = Buffer.from('ffffffffffffff00000000000000000000000000000000000000000000000000', 'hex')
x = new BN('115792089237316193816632940749697632311307892324477961517254590225120294338560',10)
y = new BN('ffffffffffffff00000000000000000000000000000000000000000000000000', 16)
xb = x.toBuffer('be')
yb = y.toBuffer('be')
helper.encodeBase58Checksum(Buffer.concat([Buffer.from([0x80]), secret2]))
helper.encodeBase58Checksum(Buffer.concat([Buffer.from([0x80]), secret2, Buffer.from([0x01])]))
helper.encodeBase58Checksum(Buffer.concat([Buffer.from([0xef]), secret2]))
helper.encodeBase58Checksum(Buffer.concat([Buffer.from([0xef]), secret2, Buffer.from([0x01])]))

// Exercise 1.1
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
	return wif
})


var fs = require('fs');
var data = ''
var Readable = require('stream').Readable
//var MyStream = fs.createReadStream('input.txt');
MyBuffer = Buffer.from('0dba685b4511dbd3d368e5c4358a1277de9486447af7b3604a69b8d9d8b7889d')
readable = new Readable()
readable.push(MyBuffer)
readable.push(null)
readable.setEncoding('UTF8')

readable.on('readable', ( size) => {
	console.log('do it');
	data = MyStream.read(size);
	console.log('data', data)
  //console.log(`Received data: "${ data }"`);
});


readable.read(10);


readable.on('readable', (size) => {
	console.log('do it');
  console.log(`Received data: "${ size }"`);
});

readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});.
readable.on('end', () => {
  console.log('There will be no more data.');
});





