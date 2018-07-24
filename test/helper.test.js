var { assert, expect} = require('chai');
var helper = require('../helper');
var BN = require('bn.js');




describe('b58', function() {
    const bytes = Buffer.from('003c176e659bea0f29a3e9bf7880c112b1b31b4dc826268187', 'hex')
    const address = helper.encodeBase58(bytes)
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

describe('little_endian_to_int', function () {
    
		let bytes = helper.strToBytes('99c3980000000000', 'hex')
        console.log('in',bytes.toString('hex'))
		
		let want = 10011545
		it('le1', function() {
			assert.equal(helper.littleEndianToInt(bytes), want)			
		})
	
        bytes = helper.strToBytes('a135ef0100000000', 'hex')
        //console.log(new BN(bytes.reverse().toString('hex'),'hex').toNumber(10))
        console.log('in',bytes.toString('hex'))
		want = 32454049
		it('le2', function() {
			assert.equal(helper.littleEndianToInt(bytes), want)			
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

describe('test_p2pkh_address',  function(){
    h160 = Buffer.from('74d691da1574e6b3c192ecfb52cc8984ee7b6c56','hex')
    it('test_p2pkh_address1', function(){
        want = '1BenRpVUFK65JFWcQSuHnJKzc4M8ZP8Eqa'
        assert.equal(helper.h160ToP2pkhAddress(h160,false),want)
    
    })
    it('test_p2pkh_address2', function(){
        want = 'mrAjisaT4LXL5MzE81sfcDYKU3wqWSvf9q'
        assert.equal(helper.h160ToP2pkhAddress(h160,true), want)
    })
})

describe('test_p2sh_address',  function(){
    h160 = Buffer.from('74d691da1574e6b3c192ecfb52cc8984ee7b6c56','hex')
    it('test_p2sh_address1', function(){
        want = '3CLoMMyuoDQTPRD3XYZtCvgvkadrAdvdXh'
        assert.equal(helper.h160ToP2shAddress(h160,false),want)
    
    })
    it('test_p2sh_address2', function(){
        want = '2N3u1R6uwQfuobCqbCgBkpsgBxvr1tZpe7B'
        assert.equal(helper.h160ToP2shAddress(h160,true), want)
    })
})

describe('test_merkle', function () {

    it('test_merkle_parent', function() {
        txHash1 = Buffer.from('c117ea8ec828342f4dfb0ad6bd140e03a50720ece40169ee38bdc15d9eb64cf5','hex')
        txHash2 = Buffer.from('c131474164b412e3406696da1ee20ab0fc9bf41c8f05fa8ceea7a08d672d7cc5','hex')
        want = Buffer.from('8b30c5ba100f6f2e5ad1e2a742e5020491240f8eb514fe97c713c31718ad7ecd','hex')
        assert.deepEqual(helper.merkleParent(txHash1,txHash2), want)
    })

    it('test_merkle_parent_level0', function() {
        hexHashes = [
            'c117ea8ec828342f4dfb0ad6bd140e03a50720ece40169ee38bdc15d9eb64cf5',
            'c131474164b412e3406696da1ee20ab0fc9bf41c8f05fa8ceea7a08d672d7cc5',
            'f391da6ecfeed1814efae39e7fcb3838ae0b02c02ae7d0a5848a66947c0727b0',
            '3d238a92a94532b946c90e19c49351c763696cff3db400485b813aecb8a13181',
            '10092f2633be5f3ce349bf9ddbde36caa3dd10dfa0ec8106bce23acbff637dae',
            '7d37b3d54fa6a64869084bfd2e831309118b9e833610e6228adacdbd1b4ba161',
            '8118a77e542892fe15ae3fc771a4abfd2f5d5d5997544c3487ac36b5c85170fc',
            'dff6879848c2c9b62fe652720b8df5272093acfaa45a43cdb3696fe2466a3877',
            'b825c0745f46ac58f7d3759e6dc535a1fec7820377f24d4c2c6ad2cc55c0cb59',
            '95513952a04bd8992721e9b7e2937f1c04ba31e0469fbe615a78197f68f52b7c',
            '2e6d722e5e4dbdf2447ddecc9f7dabb8e299bae921c99ad5b0184cd9eb8e5908',
            'b13a750047bc0bdceb2473e5fe488c2596d7a7124b4e716fdd29b046ef99bbf0',
        ]

        wantHexHashes = [
            '8b30c5ba100f6f2e5ad1e2a742e5020491240f8eb514fe97c713c31718ad7ecd',
            '7f4e6f9e224e20fda0ae4c44114237f97cd35aca38d83081c9bfd41feb907800',
            'ade48f2bbb57318cc79f3a8678febaa827599c509dce5940602e54c7733332e7',
            '68b3e2ab8182dfd646f13fdf01c335cf32476482d963f5cd94e934e6b3401069',
            '43e7274e77fbe8e5a42a8fb58f7decdb04d521f319f332d88e6b06f8e6c09e27',
            '4f492e893bf854111c36cb5eff4dccbdd51b576e1cfdc1b84b456cd1c0403ccb',
        ]
        hexHashes = hexHashes.map(obj => Buffer.from(obj,'hex'))
        wantHexHashes = wantHexHashes.map(obj => Buffer.from(obj,'hex'))
 
        assert.deepEqual(helper.merkleParentLevel(hexHashes), wantHexHashes)
    })

    it('test_merkle_parent_level1', function() {
        hexHashes = [
            'c117ea8ec828342f4dfb0ad6bd140e03a50720ece40169ee38bdc15d9eb64cf5',
            'c131474164b412e3406696da1ee20ab0fc9bf41c8f05fa8ceea7a08d672d7cc5',
            'f391da6ecfeed1814efae39e7fcb3838ae0b02c02ae7d0a5848a66947c0727b0',
            '3d238a92a94532b946c90e19c49351c763696cff3db400485b813aecb8a13181',
            '10092f2633be5f3ce349bf9ddbde36caa3dd10dfa0ec8106bce23acbff637dae',
            '7d37b3d54fa6a64869084bfd2e831309118b9e833610e6228adacdbd1b4ba161',
            '8118a77e542892fe15ae3fc771a4abfd2f5d5d5997544c3487ac36b5c85170fc',
            'dff6879848c2c9b62fe652720b8df5272093acfaa45a43cdb3696fe2466a3877',
            'b825c0745f46ac58f7d3759e6dc535a1fec7820377f24d4c2c6ad2cc55c0cb59',
            '95513952a04bd8992721e9b7e2937f1c04ba31e0469fbe615a78197f68f52b7c',
            '2e6d722e5e4dbdf2447ddecc9f7dabb8e299bae921c99ad5b0184cd9eb8e5908',
        ]

        wantHexHashes = [
            '8b30c5ba100f6f2e5ad1e2a742e5020491240f8eb514fe97c713c31718ad7ecd',
            '7f4e6f9e224e20fda0ae4c44114237f97cd35aca38d83081c9bfd41feb907800',
            'ade48f2bbb57318cc79f3a8678febaa827599c509dce5940602e54c7733332e7',
            '68b3e2ab8182dfd646f13fdf01c335cf32476482d963f5cd94e934e6b3401069',
            '43e7274e77fbe8e5a42a8fb58f7decdb04d521f319f332d88e6b06f8e6c09e27',
            '1796cd3ca4fef00236e07b723d3ed88e1ac433acaaa21da64c4b33c946cf3d10',
        ]

        hexHashes = hexHashes.map(obj => Buffer.from(obj,'hex'))
        wantHexHashes = wantHexHashes.map(obj => Buffer.from(obj,'hex'))

        assert.deepEqual(helper.merkleParentLevel(hexHashes), wantHexHashes)
    })

    it('test_merkle_root', function() {
        hexHashes = [
            'c117ea8ec828342f4dfb0ad6bd140e03a50720ece40169ee38bdc15d9eb64cf5',
            'c131474164b412e3406696da1ee20ab0fc9bf41c8f05fa8ceea7a08d672d7cc5',
            'f391da6ecfeed1814efae39e7fcb3838ae0b02c02ae7d0a5848a66947c0727b0',
            '3d238a92a94532b946c90e19c49351c763696cff3db400485b813aecb8a13181',
            '10092f2633be5f3ce349bf9ddbde36caa3dd10dfa0ec8106bce23acbff637dae',
            '7d37b3d54fa6a64869084bfd2e831309118b9e833610e6228adacdbd1b4ba161',
            '8118a77e542892fe15ae3fc771a4abfd2f5d5d5997544c3487ac36b5c85170fc',
            'dff6879848c2c9b62fe652720b8df5272093acfaa45a43cdb3696fe2466a3877',
            'b825c0745f46ac58f7d3759e6dc535a1fec7820377f24d4c2c6ad2cc55c0cb59',
            '95513952a04bd8992721e9b7e2937f1c04ba31e0469fbe615a78197f68f52b7c',
            '2e6d722e5e4dbdf2447ddecc9f7dabb8e299bae921c99ad5b0184cd9eb8e5908',
            'b13a750047bc0bdceb2473e5fe488c2596d7a7124b4e716fdd29b046ef99bbf0',
        ]
        hexHashes = hexHashes.map(obj => Buffer.from(obj,'hex'))

        wantHexHash = 'acbcab8bcc1af95d8d563b77d24c3d19b18f1486383d75a5085c4e86c86beed6'
        wantHash = Buffer.from(wantHexHash,'hex')
        assert.deepEqual(helper.merkleRoot(hexHashes), wantHash)

        
    })

    it('test_merkle_path', function() {
        i = 7
        total = 11
        want = [7, 3, 1, 0]
        assert.deepEqual(helper.merklePath(i, total), want)
    })
})


