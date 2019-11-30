var Mocha = require('mocha'),
  fs = require('fs'),
  path = require('path');

function runTest(test) {
  // Instantiate a Mocha instance.
  var mocha = new Mocha();

  var testDir = '.';

  // Add each .js file to the mocha instance
  fs.readdirSync(testDir)
    .filter(function(file) {
      // Only keep the .js files
      return file.substr(-3) === '.js';
    })
    .forEach(function(file) {
      mocha.addFile(path.join(testDir, file));
    });

  // Run the tests.
  mocha.grep(test).run(function(failures) {
    process.exitCode = failures ? -1 : 0; // exit with non-zero status if there were failures
  });
}

function strToBytes(s, encoding = 'ascii') {
  return Buffer.from(s, encoding);
}

function bytesToString(b, encoding = 'ascii') {
  return b.toString(encoding);
}

function littleEndianToInt(b) {
  return b.readUIntLE(6, 2) + b.readUIntLE(0, Buffer.byteLength(b) - 2);
}

function intToLittleEndian(n, length) {
  const buf = Buffer.alloc(length);
  buf.writeUInt32LE(n);
  return buf;
}

function mod(a, b) {
  return ((a % b) + b) % b;
}

function pow(b, e, m) {
  let result = 1n;
  b = mod(b, m);
  while (e > 0) {
    if (e & 1n) {
      result = mod(result * b, m);
    }
    e = e >> 1n;
    b = mod(b * b, m);
  }
  return result;
}

function invert(num, prime) {
  //console.log(num % prime, prime);
  //return (num % prime) ** (prime - BigInt(2)) % prime;
  return pow(num, prime - 2n, prime);
}

module.exports.strToBytes = strToBytes;
module.exports.bytesToString = bytesToString;
module.exports.littleEndianToInt = littleEndianToInt;
module.exports.intToLittleEndian = intToLittleEndian;
module.exports.runTest = runTest;
module.exports.mod = mod;
module.exports.pow = pow;
module.exports.invert = invert;
