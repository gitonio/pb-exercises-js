var { assert, expect} = require('chai');
var Tx = require('../tx');
var Script = require('../script')
var BN = require('bn.js')
var Readable = require('stream').Readable
var ecc = require('../ecc')
var helper = require('../helper')
var block = require('../block').Block

describe('BlockTest', function() {
	
    blockRaw = Buffer.from('020000208ec39428b17323fa0ddec8e887b4a7c53b8c0a0a220cfd0000000000000000005b0750fce0a889502d40508d39576821155e9c9e3f5c3157f961db38fd8b25be1e77a759e93c0118a4ffd71d','hex')
    readable = new Readable()
    readable.push(blockRaw)
    readable.push(null)
    b = block.parse(readable)

    it('test parse block', function() {
        assert.equal(b.version, 0x20000002);
        want = Buffer.from('000000000000000000fd0c220a0a8c3bc5a7b487e8c8de0dfa2373b12894c38e','hex')
        assert.deepEqual(b.prevBlock, want)
        want = Buffer.from('be258bfd38db61f957315c3f9e9c5e15216857398d50402d5089a8e0fc50075b','hex')
        assert.deepEqual(b.merkleRoot, want)
        assert.deepEqual(b.timestamp, 0x59a7771e)
        assert.deepEqual(b.bits, Buffer.from('e93c0118','hex'))
        assert.deepEqual(b.nonce, Buffer.from('a4ffd71d','hex'))
    })

    it('test serialize block', function() {
        assert.deepEqual(b.serialize(), blockRaw)
    })

    it('test hash block', function() {
        assert.deepEqual(b.hash(), Buffer.from('0000000000000000007e9e4c586439b0cdbe13b1370bdd9435d76a644d047523','hex'))
    })

 
    it('test_bip9' , function() {
        assert.isTrue(b.bip9())
        blockRaw = Buffer.from('0400000039fa821848781f027a2e6dfabbf6bda920d9ae61b63400030000000000000000ecae536a304042e3154be0e3e9a8220e5568c3433a9ab49ac4cbb74f8df8e8b0cc2acf569fb9061806652c27','hex')
        readable1 = new Readable()
        readable1.push(blockRaw)
        readable1.push(null)
        b = block.parse(readable1)
        assert.isFalse(b.bip9())
    })

    it('test_bip91' , function() {
        blockRaw = Buffer.from('1200002028856ec5bca29cf76980d368b0a163a0bb81fc192951270100000000000000003288f32a2831833c31a25401c52093eb545d28157e200a64b21b3ae8f21c507401877b5935470118144dbfd1','hex')
        readable = new Readable()
        readable.push(blockRaw)
        readable.push(null)
        b = block.parse(readable)
       assert.isTrue(b.bip91())
        blockRaw = Buffer.from('020000208ec39428b17323fa0ddec8e887b4a7c53b8c0a0a220cfd0000000000000000005b0750fce0a889502d40508d39576821155e9c9e3f5c3157f961db38fd8b25be1e77a759e93c0118a4ffd71d','hex')
        readable = new Readable()
        readable.push(blockRaw)
        readable.push(null)
        b = block.parse(readable)
        assert.isFalse(b.bip91())
    })

    it('test_bip141' , function() {
        blockRaw = Buffer.from('020000208ec39428b17323fa0ddec8e887b4a7c53b8c0a0a220cfd0000000000000000005b0750fce0a889502d40508d39576821155e9c9e3f5c3157f961db38fd8b25be1e77a759e93c0118a4ffd71d','hex')
        readable = new Readable()
        readable.push(blockRaw)
        readable.push(null)
        b = block.parse(readable)
       assert.isTrue(b.bip141())
        blockRaw = Buffer.from('0000002066f09203c1cf5ef1531f24ed21b1915ae9abeb691f0d2e0100000000000000003de0976428ce56125351bae62c5b8b8c79d8297c702ea05d60feabb4ed188b59c36fa759e93c0118b74b2618','hex')
        readable = new Readable()
        readable.push(blockRaw)
        readable.push(null)
        b = block.parse(readable)
        assert.isFalse(b.bip141())
    })

    it('test_target' , function() {
        blockRaw = Buffer.from('020000208ec39428b17323fa0ddec8e887b4a7c53b8c0a0a220cfd0000000000000000005b0750fce0a889502d40508d39576821155e9c9e3f5c3157f961db38fd8b25be1e77a759e93c0118a4ffd71d','hex')
        readable = new Readable()
        readable.push(blockRaw)
        readable.push(null)
        b = block.parse(readable)
        console.log('target', b.target())
        console.log(new BN('13ce9000000000000000000000000000000000000000000', 16).toString(10))
        assert.deepEqual(b.target(), new BN('13ce9000000000000000000000000000000000000000000', 16) )
     })

})