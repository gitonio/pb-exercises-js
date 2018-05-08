var hash = require('hash.js');
var BN = require('bn.js');

SIGHASH_ALL = 1;
BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'


function hash160(s) {
		//s = Buffer.from(s, 'hex')

	const sha = Buffer.from(hash.sha256().update(s).digest('hex'),'hex');
    return hash.ripemd160().update(sha).digest('hex');
}

function doubleSha256(s) {
	//s = Buffer.from(s, 'hex')
    let sha1 = Buffer.from(hash.sha256().update(s).digest('hex'), 'hex');
    return hash.sha256().update(sha1).digest('hex');
}

function encodeBase58(s) {
    let b = new BN(s.toString('hex'),16);
	const base = new BN(58);
    let count = 0;

    for (let index = 0; index < s.length; index++) {
         if (s[index] == 0) {
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
	checksum = Buffer.from(doubleSha256(s).slice(0,8), 'hex')
	total = Buffer.concat([s, checksum])
	return encodeBase58(total);
}

function p2pkhScript(h160) {
    return Buffer.concat([Buffer.from([0x76, 0xa9, 0x14]),h160, Buffer.from([0x88, 0xac])])
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
	//return b.readUInt32LE()
	return b.readUIntLE(0,Buffer.byteLength(b))
}

function intToLittleEndian(n, length) {
		const buf = Buffer.alloc(length);
        buf.writeUInt32LE(n);  
        return buf;

}

function readVarint(s) {
	//TODO add logic
	const i = s.read(1)[0]
	if (i == 0xfd) {
		return littleEndianToInt(s.read(2))
	} else if (i == 0xfe){
		return littleEndianToInt(s.read(4))
	} else if (i == 0xff) {
		return littleEndianToInt(s.read(8))
	} else {
		return i
	}
}

function encodeVarint(i) {
    if (i < 0xfd) {
        return Buffer.from([i])
    } else if (i < 0x1000) {
        return Buffer.concat([0xfd, intToLittleEndian(i,2)])
    } else if (i < 0x100000000) {
        return Buffer.concat([0xfe, intToLittleEndian(i,4)])
    } else if (i < 0x10000000000000000) {
        return Buffer.concat([0xff, intToLittleEndian(i,8)])
    } else {
        throw new Error('integer too large ${i}')
    }
}

function h160ToP2pkhAddress(h160, testnet=false) {

    prefix = testnet ?  Buffer.from([0x6f]) : Buffer.from([0x00])
    return encodeBase58Checksum(Buffer.concat([prefix, h160]))
}

function h160ToP2shAddress(h160, testnet=false) {

    prefix = testnet ?  Buffer.from([0xc4]) : Buffer.from([0x05])
    return encodeBase58Checksum(Buffer.concat([prefix, h160]))
}

module.exports.SIGHASH_ALL = SIGHASH_ALL;

module.exports.hash160 = hash160;
module.exports.doubleSha256 = doubleSha256;
module.exports.encodeBase58 = encodeBase58;
module.exports.encodeBase58Checksum = encodeBase58Checksum;
module.exports.p2pkhScript = p2pkhScript;
module.exports.decodeBase58 = decodeBase58;
module.exports.strToBytes = strToBytes;
module.exports.bytesToString = bytesToString;
module.exports.flipEndian = flipEndian;
module.exports.littleEndianToInt = littleEndianToInt;
module.exports.intToLittleEndian = intToLittleEndian;
module.exports.readVarint = readVarint;
module.exports.encodeVarint = encodeVarint;
module.exports.h160ToP2pkhAddress = h160ToP2pkhAddress;
module.exports.h160ToP2shAddress = h160ToP2shAddress;
