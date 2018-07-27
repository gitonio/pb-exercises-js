var { assert, expect} = require('chai');
var Tx = require('../tx');
var Script = require('../script')
var BN = require('bn.js')
var Readable = require('stream').Readable
var ecc = require('../ecc')
var helper = require('../helper')
var block = require('../block.js').Block
var proof = require('../block.js').Proof

describe('BlockTest', function() {

    
    blockRaw = Buffer.from('020000208ec39428b17323fa0ddec8e887b4a7c53b8c0a0a220cfd0000000000000000005b0750fce0a889502d40508d39576821155e9c9e3f5c3157f961db38fd8b25be1e77a759e93c0118a4ffd71d','hex')
    readable = new Readable()
    readable.push(blockRaw)
    readable.push(null)
    b = block.parse(readable)

    it('test_parse_block', function() {
        assert.equal(b.version, 0x20000002);
        want = Buffer.from('000000000000000000fd0c220a0a8c3bc5a7b487e8c8de0dfa2373b12894c38e','hex')
        assert.deepEqual(b.prevBlock, want)
        want = Buffer.from('be258bfd38db61f957315c3f9e9c5e15216857398d50402d5089a8e0fc50075b','hex')
        assert.deepEqual(b.merkleRoot, want)
        assert.deepEqual(b.timestamp, 0x59a7771e)
        assert.deepEqual(b.bits, Buffer.from('e93c0118','hex'))
        assert.deepEqual(b.nonce, Buffer.from('a4ffd71d','hex'))
    })

    it('test_serialize_block', function() {
        assert.deepEqual(b.serialize(), blockRaw)
    })

    it('test_hash_block', function() {
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
       assert.deepEqual(b.target(), new BN('13ce9000000000000000000000000000000000000000000', 16) )
     })

     it('test_check_pow', function() {
        blockRaw = Buffer.from('04000000fbedbbf0cfdaf278c094f187f2eb987c86a199da22bbb20400000000000000007b7697b29129648fa08b4bcd13c9d5e60abb973a1efac9c8d573c71c807c56c3d6213557faa80518c3737ec1','hex')
        readable = new Readable()
        readable.push(blockRaw)
        readable.push(null)
        b = block.parse(readable)
        assert.isTrue(b.checkPOW() )

        blockRaw = Buffer.from('04000000fbedbbf0cfdaf278c094f187f2eb987c86a199da22bbb20400000000000000007b7697b29129648fa08b4bcd13c9d5e60abb973a1efac9c8d573c71c807c56c3d6213557faa80518c3737ec0','hex')
        readable = new Readable()
        readable.push(blockRaw)
        readable.push(null)
        b = block.parse(readable)
        assert.isFalse(b.checkPOW() )

     })

     it('test_validate_merkle_root', function() {


         hashesHex = [
            'f54cb69e5dc1bd38ee6901e4ec2007a5030e14bdd60afb4d2f3428c88eea17c1',
            'c57c2d678da0a7ee8cfa058f1cf49bfcb00ae21eda966640e312b464414731c1',
            'b027077c94668a84a5d0e72ac0020bae3838cb7f9ee3fa4e81d1eecf6eda91f3',
            '8131a1b8ec3a815b4800b43dff6c6963c75193c4190ec946b93245a9928a233d',
            'ae7d63ffcb3ae2bc0681eca0df10dda3ca36dedb9dbf49e33c5fbe33262f0910',
            '61a14b1bbdcdda8a22e61036839e8b110913832efd4b086948a6a64fd5b3377d',
            'fc7051c8b536ac87344c5497595d5d2ffdaba471c73fae15fe9228547ea71881',
            '77386a46e26f69b3cd435aa4faac932027f58d0b7252e62fb6c9c2489887f6df',
            '59cbc055ccd26a2c4c4df2770382c7fea135c56d9e75d3f758ac465f74c025b8',
            '7c2bf5687f19785a61be9f46e031ba041c7f93e2b7e9212799d84ba052395195',
            '08598eebd94c18b0d59ac921e9ba99e2b8ab7d9fccde7d44f2bd4d5e2e726d2e',
            'f0bb99ef46b029dd6f714e4b12a7d796258c48fee57324ebdc0bbc4700753ab1',
        ]

        hashes = hashesHex.map(obj => 
            Buffer.from(obj,'hex')
        )


        blockRaw = Buffer.from('00000020fcb19f7895db08cadc9573e7915e3919fb76d59868a51d995201000000000000acbcab8bcc1af95d8d563b77d24c3d19b18f1486383d75a5085c4e86c86beed691cfa85916ca061a00000000','hex')
        readable = new Readable()
        readable.push(blockRaw)
        readable.push(null)
        b = block.parse(readable)
        b.txHashes = hashes;
        assert.isTrue(b.validateMerkleRoot())
     })

     it('test_calculate_merkle_tree', function() {
         hashesHex = [
            'f54cb69e5dc1bd38ee6901e4ec2007a5030e14bdd60afb4d2f3428c88eea17c1',
            'c57c2d678da0a7ee8cfa058f1cf49bfcb00ae21eda966640e312b464414731c1',
            'b027077c94668a84a5d0e72ac0020bae3838cb7f9ee3fa4e81d1eecf6eda91f3',
            '8131a1b8ec3a815b4800b43dff6c6963c75193c4190ec946b93245a9928a233d',
            'ae7d63ffcb3ae2bc0681eca0df10dda3ca36dedb9dbf49e33c5fbe33262f0910',
            '61a14b1bbdcdda8a22e61036839e8b110913832efd4b086948a6a64fd5b3377d',
            'fc7051c8b536ac87344c5497595d5d2ffdaba471c73fae15fe9228547ea71881',
            '77386a46e26f69b3cd435aa4faac932027f58d0b7252e62fb6c9c2489887f6df',
            '59cbc055ccd26a2c4c4df2770382c7fea135c56d9e75d3f758ac465f74c025b8',
            '7c2bf5687f19785a61be9f46e031ba041c7f93e2b7e9212799d84ba052395195',
            '08598eebd94c18b0d59ac921e9ba99e2b8ab7d9fccde7d44f2bd4d5e2e726d2e',
            'f0bb99ef46b029dd6f714e4b12a7d796258c48fee57324ebdc0bbc4700753ab1',
        ]
        hashes = hashesHex.map(obj => Buffer.from(obj,'hex'))
        blockRaw = Buffer.from('00000020fcb19f7895db08cadc9573e7915e3919fb76d59868a51d995201000000000000acbcab8bcc1af95d8d563b77d24c3d19b18f1486383d75a5085c4e86c86beed691cfa85916ca061a00000000','hex')
        readable = new Readable()
        readable.push(blockRaw)
        readable.push(null)
        b = block.parse(readable)
        b.txHashes = hashes;
        b.calculateMerkleTree();

        want0 = [
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

        want1 = [
            '8b30c5ba100f6f2e5ad1e2a742e5020491240f8eb514fe97c713c31718ad7ecd',
            '7f4e6f9e224e20fda0ae4c44114237f97cd35aca38d83081c9bfd41feb907800',
            'ade48f2bbb57318cc79f3a8678febaa827599c509dce5940602e54c7733332e7',
            '68b3e2ab8182dfd646f13fdf01c335cf32476482d963f5cd94e934e6b3401069',
            '43e7274e77fbe8e5a42a8fb58f7decdb04d521f319f332d88e6b06f8e6c09e27',
            '4f492e893bf854111c36cb5eff4dccbdd51b576e1cfdc1b84b456cd1c0403ccb',
        ]

        want2 = [
            '26906cb2caeb03626102f7606ea332784281d5d20e2b4839fbb3dbb37262dbc1',
            '717a0d17538ff5ad2c020bab38bdcde66e63f3daef88f89095f344918d5d4f96',
            'd20629030c7e48e778c1c837d91ebadc2f2ee319a0a0a461f4a9538b5cae2a69',
            'd20629030c7e48e778c1c837d91ebadc2f2ee319a0a0a461f4a9538b5cae2a69',
        ]

        want3 = [
            'b9f5560ce9630ea4177a7ac56d18dea73c8f76b59e02ab4805eaeebd84a4c5b1',
            '00aa9ad6a7841ffbbf262eb775f8357674f1ea23af11c01cfb6d481fec879701',
        ]

        //console.log(b.merkleTree)
        assert.deepEqual(b.merkleTree[0],want0.map(obj => Buffer.from(obj,'hex')))
        assert.deepEqual(b.merkleTree[1],want1.map(obj => Buffer.from(obj,'hex')))
        assert.deepEqual(b.merkleTree[2],want2.map(obj => Buffer.from(obj,'hex')))
        assert.deepEqual(b.merkleTree[3],want3.map(obj => Buffer.from(obj,'hex')))

     })

     it('test_create_merkle_proof', function(){
        hashesHex = [
            'f54cb69e5dc1bd38ee6901e4ec2007a5030e14bdd60afb4d2f3428c88eea17c1',
            'c57c2d678da0a7ee8cfa058f1cf49bfcb00ae21eda966640e312b464414731c1',
            'b027077c94668a84a5d0e72ac0020bae3838cb7f9ee3fa4e81d1eecf6eda91f3',
            '8131a1b8ec3a815b4800b43dff6c6963c75193c4190ec946b93245a9928a233d',
            'ae7d63ffcb3ae2bc0681eca0df10dda3ca36dedb9dbf49e33c5fbe33262f0910',
            '61a14b1bbdcdda8a22e61036839e8b110913832efd4b086948a6a64fd5b3377d',
            'fc7051c8b536ac87344c5497595d5d2ffdaba471c73fae15fe9228547ea71881',
            '77386a46e26f69b3cd435aa4faac932027f58d0b7252e62fb6c9c2489887f6df',
            '59cbc055ccd26a2c4c4df2770382c7fea135c56d9e75d3f758ac465f74c025b8',
            '7c2bf5687f19785a61be9f46e031ba041c7f93e2b7e9212799d84ba052395195',
            '08598eebd94c18b0d59ac921e9ba99e2b8ab7d9fccde7d44f2bd4d5e2e726d2e',
            'f0bb99ef46b029dd6f714e4b12a7d796258c48fee57324ebdc0bbc4700753ab1',
        ]
        hashes = hashesHex.map(obj => Buffer.from(obj,'hex'))
        blockRaw = Buffer.from('00000020fcb19f7895db08cadc9573e7915e3919fb76d59868a51d995201000000000000acbcab8bcc1af95d8d563b77d24c3d19b18f1486383d75a5085c4e86c86beed691cfa85916ca061a00000000','hex')
        readable = new Readable()
        readable.push(blockRaw)
        readable.push(null)
        b = block.parse(readable)
        b.txHashes = hashes;
        h = hashes[7]
        p = b.createMerkleProof(h)
        assert.equal(p.index, 7)
        want = [
            '8118a77e542892fe15ae3fc771a4abfd2f5d5d5997544c3487ac36b5c85170fc',
            'ade48f2bbb57318cc79f3a8678febaa827599c509dce5940602e54c7733332e7',
            '26906cb2caeb03626102f7606ea332784281d5d20e2b4839fbb3dbb37262dbc1',
            '00aa9ad6a7841ffbbf262eb775f8357674f1ea23af11c01cfb6d481fec879701',
        ]
        assert.deepEqual(p.proofHashes ,want.map(obj => Buffer.from(obj,'hex')))
     })

     it('test_verify_merkle_proof', function() {
        merkleRoot = Buffer.from('d6ee6bc8864e5c08a5753d3886148fb1193d4cd2773b568d5df91acc8babbcac','hex')
        txHash = Buffer.from('77386a46e26f69b3cd435aa4faac932027f58d0b7252e62fb6c9c2489887f6df','hex')
        index = 7
        proofHexHashes = [
            '8118a77e542892fe15ae3fc771a4abfd2f5d5d5997544c3487ac36b5c85170fc',
            'ade48f2bbb57318cc79f3a8678febaa827599c509dce5940602e54c7733332e7',
            '26906cb2caeb03626102f7606ea332784281d5d20e2b4839fbb3dbb37262dbc1',
            '00aa9ad6a7841ffbbf262eb775f8357674f1ea23af11c01cfb6d481fec879701',
        ]
        proofHashes = proofHexHashes.map(obj => Buffer.from(obj,'hex'))
        p = new proof(merkleRoot, txHash, index, proofHashes)
        assert.isTrue(p.verify())

     })


     

})