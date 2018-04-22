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
	const base = new BN(58);
    let count = 0;
    for (let index = 0; index < Buffer.byteLength(s)/2; index=index+2) {
         if (s.slice(index, index+2)=='00') {
            count++
        } else {
            break
        }       
    }
	
    let prefix = 1 * count;
    result = []

    while (b > 0) {
        bmod = b.mod(base);
        result.unshift(BASE58_ALPHABET.charAt(bmod))
        b.idivn(base)
    }
	
    if (prefix > 0) {
        result.unshift(prefix)
    }
    return result.join('');
}

function encodeBase58Checksum(s) {
    s = s.toString('hex');
	return encodeBase58(s + doubleSha256(s).slice(0,8));
}

function decodeBase58(s) {
	let num = new BN(0);
	const base = new BN(58);
	let sb = Buffer.from(s, 'ascii');
	let ba = Buffer.from(BASE58_ALPHABET, 'ascii');
	for (let index = 0; index < sb.length; index++) {
		num.imul(base); 
		num.iadd(new BN(ba.indexOf(sb[index])));   
	}
	let combined = new BN(num).toBuffer('be'); 
	const l = Buffer.byteLength(combined);
	const checksum = combined.slice(l-4,l);
	const res = doubleSha256(  combined.slice(0,l-4) )
	
	if (res.slice(0,8) != checksum.toString('hex')) {
		throw new Error(`bad address: ${checksum.toString('hex')} ${res.slice(0,8)}`);
	}
	return combined.slice(1,Buffer.byteLength(combined)-4);
}


function strToBytes(s, encoding='ascii') {
    return Buffer.from(s, encoding);
}

function bytesToString(b, encoding='ascii') {
    return b.toString(encoding);
}

function flipEndian(h) {
    return h.match(/.{2}/g).reverse().join('');
}

function littleEndianToInt(b) {
	b.toString("hex")
}

function intToLittleEndian(n, length) {
		const buf = Buffer.alloc(length);
        buf.writeInt32LE(n);
        return buf;

}




module.exports.hash160 = hash160;
module.exports.doubleSha256 = doubleSha256;
module.exports.encodeBase58 = encodeBase58;
module.exports.encodeBase58Checksum = encodeBase58Checksum;
module.exports.decodeBase58 = decodeBase58;
module.exports.strToBytes = strToBytes;
module.exports.bytesToString = bytesToString;
module.exports.flipEndian = flipEndian;
module.exports.littleEndianToInt = littleEndianToInt;
module.exports.intToLittleEndian = intToLittleEndian;