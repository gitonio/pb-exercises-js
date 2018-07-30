var helper = require('./helper')
var script = require('./script')
var Readable = require('stream').Readable
var BN = require('bn.js')
var request = require('sync-request');
var ecc = require('./ecc')


class Proof {
    constructor(merkleRoot, txHash, index, proofHashes) {
        this.merkleRoot = merkleRoot;
        this.txHash = txHash;
        this.index = index;
        this.proofHashes = proofHashes;
    }

    verify () {
        let current = Buffer.from(Array.prototype.reverse.call(new Uint16Array(this.txHash)));
        let currentIndex = this.index;
        this.proofHashes.map( obj => {
            if (currentIndex % 2 == 1) {
                current = helper.merkleParent(obj, current);
            } else {
                current = helper.merkleParent(current, obj)
            }
            currentIndex = Math.floor(currentIndex / 2);
        })
        return Buffer.from(Array.prototype.reverse.call(new Uint16Array(current))).toString('hex') == this.merkleRoot.toString('hex');

    }
}

Proof.prototype.toString = function(){
    let s = ''

    s = `${this.merkleRoot.toString("hex")} : ${this.txHash.toString("hex")} : ${this.index}`;
    this.proofHashes.map( p => {
        s = s + `\t\n${p.toString('hex')}`
    })

    return s
}

class Block {
    constructor(version, prevBlock, merkleRoot, timestamp, bits, nonce, txHashes=undefined) {
        this.version = version;
        this.prevBlock = prevBlock;
        this.merkleRoot = merkleRoot;
        this.timestamp = timestamp;
        this.bits = bits;
        this.nonce = nonce;
        this.txHashes = txHashes;
        this.merkleTree = undefined;
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

    validateMerkleRoot() {
        const hashes = this.txHashes.map(obj => Array.prototype.reverse.call(Buffer.from(Array.prototype.slice.call(obj))) );
        const root = helper.merkleRoot(hashes);
        return Array.prototype.reverse.call(root).toString('hex') === this.merkleRoot.toString('hex');
    }

    calculateMerkleTree() {
        this.merkleTree = [];

        let currentLevel = this.txHashes.map(obj =>  Array.prototype.reverse.call(Buffer.from(Array.prototype.slice.call(obj)))  );
        while (currentLevel.length > 1) {
            this.merkleTree.push(currentLevel);
            currentLevel = helper.merkleParentLevel(currentLevel);
        }
    
    }

    createMerkleProof(txHash) {
        if (this.merkleTree == undefined) {
            this.calculateMerkleTree();
        }
        const index = this.txHashes.findIndex(tx => tx.toString('hex') == txHash.toString('hex'));
        let proofHashes = [];
        let currentIndex = index;
        let partner = 0;
        this.merkleTree.map(obj => {
            if (currentIndex % 2 == 1) {
                partner = currentIndex - 1
            } else {
                partner = currentIndex + 1
            }
            proofHashes.push(obj[partner])
            currentIndex = Math.floor(currentIndex/2)
        })
        
        return new Proof(b.merkleRoot, txHash, index, proofHashes)
        

    }
}

module.exports.Block = Block;
module.exports.Proof = Proof;