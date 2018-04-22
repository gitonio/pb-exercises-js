var { assert, expect} = require('chai');
var helper = require('../helper');
var BN = require('bn.js');




describe('b58', function() {
    const bytes = Buffer.from('003c176e659bea0f29a3e9bf7880c112b1b31b4dc826268187', 'hex')
    let bs = '003c176e659bea0f29a3e9bf7880c112b1b31b4dc826268187'
    const address = helper.encodeBase58(bs)
    it('base58', function() {
        assert.equal(address, '16UjcYNBG9GTK4uq2f7yYEbuifqCzoLMGS')
        
    })

})

describe('bytes', function () {
    const bytes = helper.strToBytes('hello world', 'ascii')
    const str = helper.bytesToString(bytes, 'ascii')
    it('strToBytes', function() {
        assert.deepEqual(bytes, Buffer.from('hello world', 'ascii'))
        assert.deepEqual(str, 'hello world' )
    })
})

describe('test_base58', function() {
	const addr = 'mnrVtF8DWjMu839VW3rBfgYaAfKk8983Xf';
	const h160 = helper.decodeBase58(addr).toString('hex');
	it('b58', function() {
		assert.equal(h160,'507b27411ccf7f16f10297de6cef3f291623eddf');
    })
    const bh160 = Buffer.from('6f507b27411ccf7f16f10297de6cef3f291623eddf','hex')
	let got = helper.encodeBase58Checksum(bh160);
	it('b582', function() {
		assert.equal(got, addr);
	})
})

describe('test flip endian', function() {
    let h = '03ee4f7a4e68f802303bc659f8f817964b4b74fe046facc3ae1be4679d622c45'
    let w = '452c629d67e41baec3ac6f04fe744b4b9617f8f859c63b3002f8684e7a4fee03'
    assert.equal(helper.flipEndian(h), w)
    h = '813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1'
    w = 'd1c789a9c60383bf715f3f6ad9d14b91fe55f3deb369fe5d9280cb1a01793f81'
    assert.equal(helper.flipEndian(h), w)

})

describe('little endian to int', function () {
		let bytes = helper.strToBytes('99c3980000000000', 'hex')
		
		let want = 10011545
		it('le1', function() {
			assert.equal(bytes.readInt32LE(), want)			
		})
		
		bytes = helper.strToBytes('a135ef0100000000', 'hex')
		want = 32454049
		it('le2', function() {
			assert.equal(bytes.readInt32LE(), want)			
		})
})

describe('int to little endian', function () {
	let n = 1;
	let buf = helper.intToLittleEndian(n,4);
    let want = Buffer.from([0x01, 0x0, 0x0, 0x0]);
 	it('le', function () {
		assert.deepEqual(buf, want)
	})
    n = 10011545;
    buf = helper.intToLittleEndian(n,8);
    want = Buffer.from([0x99, 0xc3, 0x98, 0x00, 0x00, 0x00, 0x00, 0x00]);
    it('le2', function() {
        assert.deepEqual(buf, want)
    })
})


