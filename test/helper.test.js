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
	want = Buffer.from([1]);
	//buf.writeInt8(1);
	console.log(buf);
	it('le', function () {
		assert.deepEqual(buf, want)
	})
	//let want = 
})

describe('test_base58', function() {
	const addr = 'mnrVtF8DWjMu839VW3rBfgYaAfKk8983Xf';
	const h160 = helper.decodeBase58(addr).toString('hex');
	it('b58', function() {
		assert.equal(h160,'507b27411ccf7f16f10297de6cef3f291623eddf');
	})
	let got = helper.encodeBase58Checksum('6f507b27411ccf7f16f10297de6cef3f291623eddf');
	it('b582', function() {
		assert.equal(got, addr);
	})
})
