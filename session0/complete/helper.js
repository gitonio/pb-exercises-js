var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');


function runTest(test) {
    console.log('testing02')
// Instantiate a Mocha instance.
var mocha = new Mocha();

var testDir = '.'

// Add each .js file to the mocha instance
fs.readdirSync(testDir).filter(function(file){
    // Only keep the .js files
    return file.substr(-3) === '.js';

}).forEach(function(file){
    mocha.addFile(
        path.join(testDir, file)
    );
});

// Run the tests.
mocha.grep( test ).run(function(failures){
  process.exitCode = failures ? -1 : 0;  // exit with non-zero status if there were failures
});
}


function strToBytes(s, encoding='ascii') {
    return Buffer.from(s, encoding);
}

function bytesToString(b, encoding='ascii') {
    return b.toString(encoding);
}

function littleEndianToInt(b) {
	//return b.readUInt32LE()
	return b.readUIntLE(0,Buffer.byteLength(b))
}

function intToLittleEndian(n, length) {
		const buf = Buffer.alloc(length);
        buf.writeUInt32LE(n);  
        return buf;

}

module.exports.strToBytes = strToBytes;
module.exports.bytesToString = bytesToString;
module.exports.littleEndianToInt = littleEndianToInt;
module.exports.intToLittleEndian = intToLittleEndian;
module.exports.runTest = runTest;