var hash = require('hash.js');
var BN = require('bn.js');

BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

function hash160(s) {
    let sha = new BN(hash.sha256().update(s).digest('hex'), 16).toBuffer('be');
    return hash.ripemd160().update(sha).digest('hex');
}

function doubleSha256(s) {
    let sha1 = new BN(hash.sha256().update(s).digest('hex'), 16).toBuffer('be')
    return hash.sha256().update(sha1).digest('hex');
}

function encodeBase58(s) {
    let b = new BN(s,16);
    const base = new BN(58);
    let bmod;
    let count = 0;
    //console.log('b', b.toBuffer('be'))
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
module.exports.hash160 = hash160;
module.exports.doubleSha256 = doubleSha256;
module.exports.encodeBase58 = encodeBase58;