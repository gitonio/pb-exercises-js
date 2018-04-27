var ecc = require('./ecc.js')
var Readable = require('stream').Readable

var helper = require('./helper.js')
var Tx = require('./tx.js')
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


hex_transaction = '010000000456919960ac691763688d3d3bcea9ad6ecaf875df5339e148a1fc61c6ed7a069e010000006a47304402204585bcdef85e6b1c6af5c2669d4830ff86e42dd205c0e089bc2a821657e951c002201024a10366077f87d6bce1f7100ad8cfa8a064b39d4e8fe4ea13a7b71aa8180f012102f0da57e85eec2934a82a585ea337ce2f4998b50ae699dd79f5880e253dafafb7feffffffeb8f51f4038dc17e6313cf831d4f02281c2a468bde0fafd37f1bf882729e7fd3000000006a47304402207899531a52d59a6de200179928ca900254a36b8dff8bb75f5f5d71b1cdc26125022008b422690b8461cb52c3cc30330b23d574351872b7c361e9aae3649071c1a7160121035d5c93d9ac96881f19ba1f686f15f009ded7c62efe85a872e6a19b43c15a2937feffffff567bf40595119d1bb8a3037c356efd56170b64cbcc160fb028fa10704b45d775000000006a47304402204c7c7818424c7f7911da6cddc59655a70af1cb5eaf17c69dadbfc74ffa0b662f02207599e08bc8023693ad4e9527dc42c34210f7a7d1d1ddfc8492b654a11e7620a0012102158b46fbdff65d0172b7989aec8850aa0dae49abfb84c81ae6e5b251a58ace5cfeffffffd63a5e6c16e620f86f375925b21cabaf736c779f88fd04dcad51d26690f7f345010000006a47304402200633ea0d3314bea0d95b3cd8dadb2ef79ea8331ffe1e61f762c0f6daea0fabde022029f23b3e9c30f080446150b23852028751635dcee2be669c2a1686a4b5edf304012103ffd6f4a67e94aba353a00882e563ff2722eb4cff0ad6006e86ee20dfe7520d55feffffff0251430f00000000001976a914ab0c0b2e98b1ab6dbf67d4750b0a56244948a87988ac005a6202000000001976a9143c82d7df364eb6c75be8c80df2b3eda8db57397088ac4643060000'

bin_transaction = Buffer.from(hex_transaction, 'hex');
		readable = new Readable()
		readable.push(bin_transaction)
		readable.push(null)
		
		tx = new Tx.Tx(readable)
		tx.inputs[1].scriptSig.toString()
		tx.outputs[0].scriptPubkey.toString()
		tx.outputs[0].amount



