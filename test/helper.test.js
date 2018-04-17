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

describe('little endian to int')
