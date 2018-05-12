//import { merkleRoot } from './helper.js';

// Exercise 1
var doubleSha256 = require('./helper.js').doubleSha256;
var merkleParent = require('./helper.js').merkleParent;
var merkleRoot = require('./helper.js').merkleRoot;
var intToLittleEndian = require('./helper.js').intToLittleEndian;
var merkleParentLevel = require('./helper.js').merkleParentLevel;
var block = require('./block.js').Block

txHash0 = Buffer.from('c117ea8ec828342f4dfb0ad6bd140e03a50720ece40169ee38bdc15d9eb64cf5','hex')
txHash1 = Buffer.from('c131474164b412e3406696da1ee20ab0fc9bf41c8f05fa8ceea7a08d672d7cc5','hex')
mp = doubleSha256(Buffer.concat([txHash0, txHash1]))
console.log(mp.toString('hex'))

// Exercise 1.1
txHash0 = Buffer.from('f391da6ecfeed1814efae39e7fcb3838ae0b02c02ae7d0a5848a66947c0727b0','hex')
txHash1 = Buffer.from('3d238a92a94532b946c90e19c49351c763696cff3db400485b813aecb8a13181','hex')
mp = doubleSha256(Buffer.concat([txHash0, txHash1]))
console.log(mp.toString('hex'))

hexHashes = [
    'c117ea8ec828342f4dfb0ad6bd140e03a50720ece40169ee38bdc15d9eb64cf5',
    'c131474164b412e3406696da1ee20ab0fc9bf41c8f05fa8ceea7a08d672d7cc5',
    'f391da6ecfeed1814efae39e7fcb3838ae0b02c02ae7d0a5848a66947c0727b0',
    '3d238a92a94532b946c90e19c49351c763696cff3db400485b813aecb8a13181',
    '10092f2633be5f3ce349bf9ddbde36caa3dd10dfa0ec8106bce23acbff637dae',
    'b13a750047bc0bdceb2473e5fe488c2596d7a7124b4e716fdd29b046ef99bbf0',
]

hexHashes = hexHashes.reduce(function(result, value, index, array) {
    if (index % 2 === 0)
      result.push(array.slice(index, index + 2));
    return result;
  }, []);

hexHashes.map(obj => {
    hashBin1 = Buffer.from(obj[0],'hex')  
    hashBin2 = Buffer.from(obj[1],'hex')
    parent = merkleParent(hashBin1, hashBin2)
    console.log(parent.toString('hex'))
})


// Exercise 2.1
hexHashes = [
    '8b30c5ba100f6f2e5ad1e2a742e5020491240f8eb514fe97c713c31718ad7ecd',
    '7f4e6f9e224e20fda0ae4c44114237f97cd35aca38d83081c9bfd41feb907800',
    'ade48f2bbb57318cc79f3a8678febaa827599c509dce5940602e54c7733332e7',
     '68b3e2ab8182dfd646f13fdf01c335cf32476482d963f5cd94e934e6b3401069',
    '43e7274e77fbe8e5a42a8fb58f7decdb04d521f319f332d88e6b06f8e6c09e27',
    '4f492e893bf854111c36cb5eff4dccbdd51b576e1cfdc1b84b456cd1c0403ccb',
]

hexHashes = hexHashes.reduce(function(result, value, index, array) {
    if (index % 2 === 0)
      result.push(array.slice(index, index + 2));
    return result;
  }, []);


hexHashes.map(obj => {
    hashBin1 = Buffer.from(obj[0],'hex')  
    hashBin2 = Buffer.from(obj[1],'hex')
    parent = merkleParent(hashBin1, hashBin2)
    console.log(parent.toString('hex'))
})

// Exercise 2.2
// Odd Merkle Parent Level Example

hexHashes = [
    'c117ea8ec828342f4dfb0ad6bd140e03a50720ece40169ee38bdc15d9eb64cf5',
    'c131474164b412e3406696da1ee20ab0fc9bf41c8f05fa8ceea7a08d672d7cc5',
    'f391da6ecfeed1814efae39e7fcb3838ae0b02c02ae7d0a5848a66947c0727b0',
    '3d238a92a94532b946c90e19c49351c763696cff3db400485b813aecb8a13181',
    '10092f2633be5f3ce349bf9ddbde36caa3dd10dfa0ec8106bce23acbff637dae',
]

hexHashes = hexHashes.reduce(function(result, value, index, array) {
    if (index % 2 === 0)
      result.push(array.slice(index, index + 2));
    return result;
  }, []);
if (hexHashes[hexHashes.length-1].length == 1) {
    hexHashes[hexHashes.length-1].push(hexHashes[hexHashes.length-1][0])
}
hexHashes.map(obj => {
    hashBin1 = Buffer.from(obj[0],'hex')  
    hashBin2 = Buffer.from(obj[1],'hex')
    parent = merkleParent(hashBin1, hashBin2)
    console.log(parent.toString('hex'))
})


// Exercise 3.1
hexHashes = [
    '8b30c5ba100f6f2e5ad1e2a742e5020491240f8eb514fe97c713c31718ad7ecd',
    '7f4e6f9e224e20fda0ae4c44114237f97cd35aca38d83081c9bfd41feb907800',
    'ade48f2bbb57318cc79f3a8678febaa827599c509dce5940602e54c7733332e7',
    '68b3e2ab8182dfd646f13fdf01c335cf32476482d963f5cd94e934e6b3401069',
    '43e7274e77fbe8e5a42a8fb58f7decdb04d521f319f332d88e6b06f8e6c09e27',
]
hexHashes = hexHashes.reduce(function(result, value, index, array) {
    if (index % 2 === 0)
      result.push(array.slice(index, index + 2));
    return result;
  }, []);

  if (hexHashes[hexHashes.length-1].length == 1) {
    hexHashes[hexHashes.length-1].push(hexHashes[hexHashes.length-1][0])
}
hexHashes.map(obj => {
    hashBin1 = Buffer.from(obj[0],'hex')  
    hashBin2 = Buffer.from(obj[1],'hex')
    parent = merkleParent(hashBin1, hashBin2)
    console.log(parent.toString('hex'))
})

//Exercise 3.2
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

currentLevel = hexHashes

while (currentLevel.length > 1) {
    currentLevel = merkleParentLevel(currentLevel);
}
console.log('3.1', currentLevel[0]);

// Exercise 4.1
hexHashes = [
    '42f6f52f17620653dcc909e58bb352e0bd4bd1381e2955d19c00959a22122b2e',
    '94c3af34b9667bf787e1c6a0a009201589755d01d02fe2877cc69b929d2418d4',
    '959428d7c48113cb9149d0566bde3d46e98cf028053c522b8fa8f735241aa953',
    'a9f27b99d5d108dede755710d4a1ffa2c74af70b4ca71726fa57d68454e609a2',
    '62af110031e29de1efcad103b3ad4bec7bdcf6cb9c9f4afdd586981795516577',
    '766900590ece194667e9da2984018057512887110bf54fe0aa800157aec796ba',
    'e8270fb475763bc8d855cfe45ed98060988c1bdcad2ffc8364f783c98999a208',
    '921b8cfd3e14bf41f028f0a3aa88c813d5039a2b1bceb12208535b0b43a5d09e',
    '15535864799652347cec66cba473f6d8291541238e58b2e03b046bc53cfe1321',
    '1c8af7c502971e67096456eac9cd5407aacf62190fc54188995666a30faf99f0',
    '3311f8acc57e8a3e9b68e2945fb4f53c07b0fa4668a7e5cda6255c21558c774d',
]
hexHashes = hexHashes.map(obj => Buffer.from(obj,'hex'))

currentLevel = hexHashes

while (currentLevel.length > 1) {
    currentLevel = merkleParentLevel(currentLevel);
}
console.log('4.1', currentLevel[0]);

// Exercise 4.2
hexHashes = [
    '42f6f52f17620653dcc909e58bb352e0bd4bd1381e2955d19c00959a22122b2e',
    '94c3af34b9667bf787e1c6a0a009201589755d01d02fe2877cc69b929d2418d4',
    '959428d7c48113cb9149d0566bde3d46e98cf028053c522b8fa8f735241aa953',
    'a9f27b99d5d108dede755710d4a1ffa2c74af70b4ca71726fa57d68454e609a2',
    '62af110031e29de1efcad103b3ad4bec7bdcf6cb9c9f4afdd586981795516577',
    '766900590ece194667e9da2984018057512887110bf54fe0aa800157aec796ba',
    'e8270fb475763bc8d855cfe45ed98060988c1bdcad2ffc8364f783c98999a208',
]
hexHashes = hexHashes.map(obj => Buffer.from(obj,'hex'))

console.log(merkleRoot(hexHashes))
currentLevel = hexHashes

while (currentLevel.length > 1) {
    currentLevel = merkleParentLevel(currentLevel);
}
console.log('4.2', currentLevel[0]);


//Buffer.from(Array.prototype.reverse.call(new Uint16Array(s.read(32))));

txHexHashes = [
    '42f6f52f17620653dcc909e58bb352e0bd4bd1381e2955d19c00959a22122b2e',
    '94c3af34b9667bf787e1c6a0a009201589755d01d02fe2877cc69b929d2418d4',
    '959428d7c48113cb9149d0566bde3d46e98cf028053c522b8fa8f735241aa953',
    'a9f27b99d5d108dede755710d4a1ffa2c74af70b4ca71726fa57d68454e609a2',
    '62af110031e29de1efcad103b3ad4bec7bdcf6cb9c9f4afdd586981795516577',
    '766900590ece194667e9da2984018057512887110bf54fe0aa800157aec796ba',
    'e8270fb475763bc8d855cfe45ed98060988c1bdcad2ffc8364f783c98999a208',
]
txHexHashes = txHexHashes.map(obj => Array.prototype.reverse.call(Buffer.from(obj,'hex')) )
merkleRoot(txHexHashes)
console.log(Array.prototype.reverse.call(Buffer.from(merkleRoot(txHexHashes),'hex')).toString('hex'));

// Exercise 5.1
txHexHashes = [
    '42f6f52f17620653dcc909e58bb352e0bd4bd1381e2955d19c00959a22122b2e',
    '94c3af34b9667bf787e1c6a0a009201589755d01d02fe2877cc69b929d2418d4',
    '959428d7c48113cb9149d0566bde3d46e98cf028053c522b8fa8f735241aa953',
    'a9f27b99d5d108dede755710d4a1ffa2c74af70b4ca71726fa57d68454e609a2',
    '62af110031e29de1efcad103b3ad4bec7bdcf6cb9c9f4afdd586981795516577',
    '766900590ece194667e9da2984018057512887110bf54fe0aa800157aec796ba',
    'e8270fb475763bc8d855cfe45ed98060988c1bdcad2ffc8364f783c98999a208',
    '921b8cfd3e14bf41f028f0a3aa88c813d5039a2b1bceb12208535b0b43a5d09e',
    '15535864799652347cec66cba473f6d8291541238e58b2e03b046bc53cfe1321',
    '1c8af7c502971e67096456eac9cd5407aacf62190fc54188995666a30faf99f0',
    '3311f8acc57e8a3e9b68e2945fb4f53c07b0fa4668a7e5cda6255c21558c774d',
]
txHexHashes = txHexHashes.map(obj => Array.prototype.reverse.call(Buffer.from(obj,'hex')) )
merkleRoot(txHexHashes)
console.log(Array.prototype.reverse.call(Buffer.from(merkleRoot(txHexHashes),'hex')).toString('hex'));

// Merkle Path Example

merklePath = [];
 totalLevels = Math.ceil(Math.log2(16))
index = 10
for (let i = 0; i < totalLevels; i++) {
    merklePath.push(index)
    index = Math.floor(index / 2)
}
console.log(merklePath);

merklePath = [];
 totalLevels = Math.ceil(Math.log2(27))
index = 13
for (let i = 0; i < totalLevels; i++) {
    merklePath.push(index)
    index = Math.floor(index / 2)
}
console.log(merklePath);


// Merkle Proof Example
txHexHashes = [
    "9745f7173ef14ee4155722d1cbf13304339fd00d900b759c6f9d58579b5765fb",
    "5573c8ede34936c29cdfdfe743f7f5fdfbd4f54ba0705259e62f39917065cb9b",
    "82a02ecbb6623b4274dfcab82b336dc017a27136e08521091e443e62582e8f05",
    "507ccae5ed9b340363a0e6d765af148be9cb1c8766ccc922f83e4ae681658308",
    "a7a4aec28e7162e1e9ef33dfa30f0bc0526e6cf4b11a576f6c5de58593898330",
    "bb6267664bd833fd9fc82582853ab144fece26b7a8a5bf328f8a059445b59add",
    "ea6d7ac1ee77fbacee58fc717b990c4fcccf1b19af43103c090f601677fd8836",
    "457743861de496c429912558a106b810b0507975a49773228aa788df40730d41",
    "7688029288efc9e9a0011c960a6ed9e5466581abf3e3a6c26ee317461add619a",
    "b1ae7f15836cb2286cdd4e2c37bf9bb7da0a2846d06867a429f654b2e7f383c9",
    "9b74f89fa3f93e71ff2c241f32945d877281a6a50a6bf94adac002980aafe5ab",
    "b3a92b5b255019bdaf754875633c2de9fec2ab03e6b8ce669d07cb5b18804638",
    "b5c0b915312b9bdaedd2b86aa2d0f8feffc73a2d37668fd9010179261e25e263",
    "c9d52c5cb1e557b92c84c52e7c4bfbce859408bedffc8a5560fd6e35e10b8800",
    "c555bc5fc3bc096df0a0c9532f07640bfb76bfe4fc1ace214b8b228a1297a4c2",
    "f9dbfafc3af3400954975da24eb325e326960a25b87fffe23eef3e7ed2fb610e",
    "8e694f5092f6a644ab587ca445f9e949e4f5991d3c3c72bd4574a7c9896a2402",
    "9cc887977168f430f4f896dfc6fc7379834733ce938abe7cd8a1a668d1ea1841",   
]
txHexHashes = txHexHashes.map(obj => Buffer.from(obj,'hex'))
txHash = Buffer.from('9b74f89fa3f93e71ff2c241f32945d877281a6a50a6bf94adac002980aafe5ab','hex')
b = new block(version=536870914,
    prevBlock = Buffer.from('00000000000002dda81fd83ac5b944ad88592a213bfaf54bffad68725c782639','hex'),
    merkleRoot = Buffer.from('f2710c8f3652ec6bfe79769458ae4be8117cad46964ce9dab9ce570bcb2ff9b0','hex'),
    bits = intToLittleEndian(437256176,4),
    nonce=Buffer.from([0x00, 0x00, 0x00, 0x00]),
    timeStamp=1512503014,
    txHashes=txHexHashes
)
b.calculateMerkleTree()

function findBuffer(element) {
    return
}
index = b.txHashes.findIndex(tx => tx.toString('hex') == txHash.toString('hex'))
proofHashes = []
currentIndex = index
console.log(b.merkleTree)
b.merkleTree.map(obj => {
    if (currentIndex % 2 == 1) {
        partner = currentIndex - 1
    } else {
        partner = currentIndex + 1
    }
    proofHashes.push(obj[partner])
    currentIndex = Math.floor(currentIndex/2)
})
