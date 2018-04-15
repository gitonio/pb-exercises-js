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
