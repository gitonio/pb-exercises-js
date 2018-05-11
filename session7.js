//import { merkleRoot } from './helper.js';

// Exercise 1
var doubleSha256 = require('./helper.js').doubleSha256;
var merkleParent = require('./helper.js').merkleParent;
var merkleRoot = require('./helper.js').merkleRoot;
var merkleParentLevel = require('./helper.js').merkleParentLevel;

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
console.log(merkleRoot(hexHashes))