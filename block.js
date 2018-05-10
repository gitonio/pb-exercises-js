var helper = require('./helper')
var script = require('./script')
var Readable = require('stream').Readable
var BN = require('bn.js')
var request = require('sync-request');
var ecc = require('./ecc')

class Block {
    constructor(version, prevBlock, merkleRoot, timestamp, bits, nonce) {
        this.version = version;
        this.prevBlock = prevBlock;
        this.merkleRoot = merkleRoot;
        this.timestamp = timestamp;
        this.bits = bits;
        this.nonce = nonce;
    }

    static parse(s) {
        const version = helper.littleEndianToInt(s.read(4));
        const prevBlock = Buffer.from(Array.prototype.reverse.call(new Uint16Array(s.read(32))));
        const merkleRoot = Buffer.from(Array.prototype.reverse.call(new Uint16Array(s.read(32))));
        const timestamp = helper.littleEndianToInt(s.read(4));
        const bits = s.read(4);
        const nonce = s.read(4);
        return new Block(version, prevBlock, merkleRoot, timestamp, bits, nonce)
    }

    serialize() {
        let result = helper.intToLittleEndian(this.version,4);
        const prevBlock = Buffer.from(Array.prototype.reverse.call(new Uint16Array(this.prevBlock)));
        result = Buffer.concat([result, prevBlock]);
        const merkleRoot = Buffer.from(Array.prototype.reverse.call(new Uint16Array(this.merkleRoot)));
        result = Buffer.concat([result, merkleRoot]);
        const timestamp = helper.intToLittleEndian(this.timestamp,4);
        result = Buffer.concat([result,timestamp]);
        result = Buffer.concat([result, this.bits, this.nonce]);
        return result;
    }

    hash() {
        const s = this.serialize();
        const sha = helper.doubleSha256(s);
        return Buffer.from(Array.prototype.reverse.call(new Uint16Array(Buffer.from(sha,'hex'))))
    }

    bip9() {
        return ((this.version >> 29) == 1)
    }

    bip91() {
        return ((this.version >> 4 & 1) == 1)
    }

    bip141() {
        return((this.version >> 1 & 1) == 1)
    }

    target() {
        const exponent = new BN(this.bits[this.bits.length-1])
        const coefficient = new BN(helper.littleEndianToInt(this.bits.slice(0,3)))
        return (new BN(2)).pow(exponent.subn(3).muln(8)).mul(coefficient) 
    }

    difficulty() {
        const lowest = 0xffff * Math.pow(2,8 * 0x1d-3);
        return lowest / this.target();
    }

    checkPOW() {
        const sha = helper.doubleSha256(this.serialize());
        const proof = helper.littleEndianToInt(Buffer.from(sha,'hex'))
        return proof < this.target()
    }
}

module.exports.Block = Block;