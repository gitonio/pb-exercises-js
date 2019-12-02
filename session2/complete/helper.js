var hash = require('hash.js');
var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');


function runTest(test) {
    // Instantiate a Mocha instance.
    var mocha = new Mocha();

    var testDir = '.'

    // Add each .js file to the mocha instance
    fs.readdirSync(testDir).filter(function (file) {
        // Only keep the .js files
        return file.substr(-3) === '.js';

    }).forEach(function (file) {
        mocha.addFile(
            path.join(testDir, file)
        );
    });

    // Run the tests.
    mocha.grep(test).run(function (failures) {
        process.exitCode = failures ? -1 : 0;  // exit with non-zero status if there were failures
    });
}

BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

function mod(a,b) {

    return a.mod(b).add(b).mod(b)
}


function hash160(s) {
	const sha = Buffer.from(hash.sha256().update(s).digest('hex'),'hex');
    return hash.ripemd160().update(sha).digest('hex');
}

function doubleSha256(s) {
    let sha1 = Buffer.from(hash.sha256().update(s).digest('hex'), 'hex');
    return hash.sha256().update(sha1).digest('hex');
}

function encodeBase58(s) {
    let b = BigInt('0x' + s.toString('hex'));
	const base = 58n;
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
        bmod = mod(b,base);
        result.unshift(BASE58_ALPHABET.charAt(Number(bmod)))
        b = b / base
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

function decodeBase58(s) {
	let num = 0n;
	const base = 58n;
	let sb = Buffer.from(s, 'ascii');
	let ba = Buffer.from(BASE58_ALPHABET, 'ascii');
	for (let index = 0; index < sb.length; index++) {
        num = num * base
        num = num + BigInt(ba.indexOf(sb[index]))
	}
    let combined = Buffer.from(num.toString(16),'hex'); 
    console.log(combined.toString('ascii'))
	const l = Buffer.byteLength(combined);
	const checksum = combined.slice(l-4,l);
	const res = doubleSha256(  combined.slice(0,l-4) )
	
	if (res.slice(0,8) != checksum.toString('hex')) {
        //throw new Error(`bad address: ${checksum.toString('hex')} ${res.slice(0,8)}`);
        console.log(combined.slice(1,Buffer.byteLength(combined)-4))
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

function mod(a, b) {
    return ((a % b) + b) % b;
  }
  
  function pow(b, e, m) {
    let result = 1n;
    b = mod(b, m);
    while (e > 0) {
      if (e & 1n) {
        result = mod(result * b, m);
      }
      e = e >> 1n;
      b = mod(b * b, m);
    }
    return result;
  }
  
  function invert(num, prime) {
    //console.log(num % prime, prime);
    //return (num % prime) ** (prime - BigInt(2)) % prime;
    return pow(num, prime - 2n, prime);
  }
  
module.exports.mod = mod;
module.exports.pow = pow;
module.exports.runTest = runTest;

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
