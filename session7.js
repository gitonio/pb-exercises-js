//import { merkleRoot } from './helper.js';

// Exercise 1
var doubleSha256 = require('./helper.js').doubleSha256;
var merkleParent = require('./helper.js').merkleParent;
var merkleRoot = require('./helper.js').merkleRoot;
var intToLittleEndian = require('./helper.js').intToLittleEndian;
var merkleParentLevel = require('./helper.js').merkleParentLevel;
const block = require('./block.js').Block;
const proof = require('./block.js').Proof;
//const { block, proof } = require('./block.js');
//import { block, proof } from './block.js';
var network = require('./network.js')

var Readable = require('stream').Readable


console.log('Merkle Parent Example')
txHash0 = Buffer.from('c117ea8ec828342f4dfb0ad6bd140e03a50720ece40169ee38bdc15d9eb64cf5','hex')
txHash1 = Buffer.from('c131474164b412e3406696da1ee20ab0fc9bf41c8f05fa8ceea7a08d672d7cc5','hex')
mp = doubleSha256(Buffer.concat([txHash0, txHash1]))
console.log(mp.toString('hex'))

// Exercise 1.1
console.log('\nExercise 1.1')
txHash0 = Buffer.from('f391da6ecfeed1814efae39e7fcb3838ae0b02c02ae7d0a5848a66947c0727b0','hex')
txHash1 = Buffer.from('3d238a92a94532b946c90e19c49351c763696cff3db400485b813aecb8a13181','hex')
mp = doubleSha256(Buffer.concat([txHash0, txHash1]))
console.log(mp.toString('hex'))

console.log('\nMerkle Parent Level Example')
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
console.log('\nExercise 2.1')
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
console.log('\nOdd Merkle Parent Level Example')
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
console.log('\nExercise 3.1')
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
console.log('\nMerkle root Example')
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
console.log('3.1', currentLevel[0].toString('hex'));

// Exercise 4.1
console.log('\nExercise 4.1')
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
console.log(currentLevel[0].toString('hex'));

// Exercise 4.2
console.log('\nBlock Merkle Root Example')


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
console.log('\nExercise 5.1')

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
console.log('\nMerkle Path Example')
merklePath = [];
 totalLevels = Math.ceil(Math.log2(16))
index = 10
for (let i = 0; i < totalLevels; i++) {
    merklePath.push(index)
    index = Math.floor(index / 2)
}
console.log(merklePath);

console.log('\nExercise 6.1')
merklePath = [];
 totalLevels = Math.ceil(Math.log2(27))
index = 13
for (let i = 0; i < totalLevels; i++) {
    merklePath.push(index)
    index = Math.floor(index / 2)
}
console.log(merklePath);


// Merkle Proof Example
console.log('\nMerkle Proof Example')
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
b.merkleTree.map(obj => {
    if (currentIndex % 2 == 1) {
        partner = currentIndex - 1
    } else {
        partner = currentIndex + 1
    }
    proofHashes.push(obj[partner])
    currentIndex = Math.floor(currentIndex/2)
})

p = new proof(b.merkleRoot, txHash, index, proofHashes)
console.log(p.toString())


console.log('\nExercise 7.1')
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
txHexHashes = txHexHashes.map(obj => Buffer.from(obj,'hex'))
txHash = Buffer.from('e8270fb475763bc8d855cfe45ed98060988c1bdcad2ffc8364f783c98999a208','hex')

readable = new Readable()
readable.push(Buffer.from('00000020fcb19f7895db08cadc9573e7915e3919fb76d59868a51d995201000000000000acbcab8bcc1af95d8d563b77d24c3d19b18f1486383d75a5085c4e86c86beed691cfa85916ca061a00000000','hex'))

readable.push(null)
   
b = block.parse(readable)
b.txHashes = txHexHashes

b.calculateMerkleTree()


function findBuffer(element) {
    return
}
index = b.txHashes.findIndex(tx => tx.toString('hex') == txHash.toString('hex'))
proofHashes = []
currentIndex = index
b.merkleTree.map(obj => {
    if (currentIndex % 2 == 1) {
        partner = currentIndex - 1
    } else {
        partner = currentIndex + 1
    }
    proofHashes.push(obj[partner])
    currentIndex = Math.floor(currentIndex/2)
})

p = new proof(b.merkleRoot, txHash, index, proofHashes)
console.log(p.toString())

// Exercise 8.1
console.log('\nExercise 8.1')
txHash = Buffer.from('e8270fb475763bc8d855cfe45ed98060988c1bdcad2ffc8364f783c98999a208','hex')
merkleRoot = Buffer.from('4297fb95a0168b959d1469410c7527da5d6243d99699e7d041b7f3916ba93301','hex')
proofHexHashes = [
    '9ed0a5430b5b530822b1ce1b2b9a03d513c888aaa3f028f041bf143efd8c1b92',
    '1dc4b438b3a842bcdd46b6ea5a4aac8d66be858b0ba412578027a1f1fe838c51',
    '156f3662b07aaa4a0d9762faaa8c18afe4c211ff92eb1eae1952aa66627bbf2e',
    '524c93c6dd0874c5fd9e4e57cfe83176e3c2841c973afb4043d225c22cc52983',
]
proofHashes = proofHexHashes.map(obj => Buffer.from(obj,'hex'))
index = 6;
current = txHash.map(obj => Array.prototype.reverse.call(obj) )
current = Array.prototype.reverse.call(txHash)
currentIndex = index
proofHashes.map ( p => {
    if (currentIndex % 2 == 1) {
        current = merkleParent(p, current)
    } else {
        current = merkleParent(current, p)
    }
    currentIndex = Math.floor(currentIndex / 2);


})

console.log(Array.prototype.reverse.call(current).toString('hex') ==  merkleRoot.toString('hex'))



// Exercise 9.1
console.log('\nExercise 9.1')
msg = Buffer.from('f9beb4d976657261636b000000000000000000005df6e0e2','hex')

magic = msg.slice(0,3)
command = msg.slice(4,15).toString('ascii')
payloadLength = msg.slice(16,19)
checksum = msg.slice(20,23)
payload = msg.slice(24, msg.length-1)
console.log(command)

// Exercise 10.1
console.log('\n# Excercise 10.1')
msg = Buffer.from('f9beb4d974780000000000000000000002010000e293cdbe01000000016dbddb085b1d8af75184f0bc01fad58d1266e9b63b50881990e4b40d6aee3629000000008b483045022100f3581e1972ae8ac7c7367a7a253bc1135223adb9a468bb3a59233f45bc578380022059af01ca17d00e41837a1d58e97aa31bae584edec28d35bd96923690913bae9a0141049c02bfc97ef236ce6d8fe5d94013c721e915982acd2b12b65d9b7d59e20a842005f8fc4e02532e873d37b96f09d6d4511ada8f14042f46614a4c70c0f14beff5ffffffff02404b4c00000000001976a9141aa0cd1cbea6e7458a7abad512a9d9ea1afb225e88ac80fae9c7000000001976a9140eab5bea436a0484cfab12485efda0b78b4ecc5288ac00000000','hex')
readable = new Readable()
readable.push(msg)
readable.push(null)
console.log(network.NetworkEnvelope.parse(readable).toString())


var socket = require('socket.io-client')('46.101.99.121:8333');
socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});