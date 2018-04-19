var hash = require('hash.js');
var BN = require('bn.js');

BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

function hash160(s) {
		s = Buffer.from(s, 'hex')

	const sha = Buffer.from(hash.sha256().update(s).digest('hex'),'hex');
    return hash.ripemd160().update(sha).digest('hex');
}

function doubleSha256(s) {
	s = Buffer.from(s, 'hex')
    let sha1 = Buffer.from(hash.sha256().update(s).digest('hex'), 'hex');
    return hash.sha256().update(sha1).digest('hex');
}

function encodeBase58(s) {
    let b = new BN(s,16);
	console.log('b', b, b.toString(10))
 const base = new BN(58);
    let bmod;
    let count = 0;
    let bf = b.toBuffer('be')
    //console.log('bf:',bf)
    for (let index = 0; index < Buffer.byteLength(s)/2; index=index+2) {
        //console.log('bindex',s.slice(0,2))
         if (s.slice(index, index+2)=='00') {
            count++
        } else {
            break
        }
        
    }
    let prefix = 1 * count;
    let num = parseInt(s.toString('hex'),16);
	console.log('snum', b.toString(10));
    result = []

    while (b > 0) {

        bmod = b.mod(base);
        result.unshift(BASE58_ALPHABET.charAt(bmod))
         b.idivn(base)

        
    }
    if (prefix > 0) {
        result.unshift(prefix)
    }
	console.log('encode', result.join(''));
    return result.join('');
}

function encodeBase58Checksum(s) {
	console.log('dds', doubleSha256(s))
	//return encodeBase58(s );
	return encodeBase58(s + doubleSha256(s).slice(0,4));
}

function decodeBase58(s) {
	let num = new BN(0);
	const base = new BN(58);
	let sb = Buffer.from(s, 'ascii');
	let ba = Buffer.from(BASE58_ALPHABET, 'ascii');
	console.log('ba', ba);
	console.log('sb', sb, sb.length);
	for (let index = 0; index < sb.length; index++) {
		num.imul(base); 
		num.iadd(new BN(ba.indexOf(sb[index])));   
	}
	console.log('num',num.toString(10));
	//let combined = num.readUInt32BE(0); 
	let combined = new BN(num).toBuffer('be'); 
	console.log('combined', combined)
	console.log('combined', combined.slice(0,Buffer.byteLength(combined)-4))
	
	return combined.slice(1,Buffer.byteLength(combined)-4);
}


function strToBytes(s, encoding='ascii') {
    return Buffer.from(s, encoding);
}

function bytesToString(b, encoding='ascii') {
    return b.toString(encoding);
}

function littleEndianToInt(b) {
	b.toString("hex")
}

function intToLittleEndian(n, length) {
		const buf = Buffer.allocUnsafe(length);
		console.log(buf.writeInt16LE(n));
		return buf.writeInt16LE(n);

}


module.exports.hash160 = hash160;
module.exports.doubleSha256 = doubleSha256;
module.exports.encodeBase58 = encodeBase58;
module.exports.encodeBase58Checksum = encodeBase58Checksum;
module.exports.decodeBase58 = decodeBase58;
module.exports.strToBytes = strToBytes;
module.exports.bytesToString = bytesToString;
module.exports.littleEndianToInt = littleEndianToInt;
module.exports.intToLittleEndian = intToLittleEndian;