var BN = require('bn.js');

/*
    dec ascii   hex
h	104	1101000	68
e	101	1100101	65
l	108	1101100	6C
l	108	1101100	6C
o	111	1101111	6F
	32	100000	20
w	119	1110111	77
o	111	1101111	6F
r	114	1110010	72
l	108	1101100	6C
d	100	1100100	64

*/



//Basic char to bytes in javascript

str = 'hello world'
str.charAt(0)
str.charCodeAt(0) // 104
str.charCodeAt(0).toString(16) //# "68"
parseInt(str.charCodeAt(0).toString(16)) //#68

var map = Array.prototype.map;
var helloWorldBytes = map.call(str, function(x) { 
  return x.charCodeAt(0); 
});

helloWorldBytes //#[104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]



helloWorldBytes.map(obj=>String.fromCharCode(obj)) //#["h", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d"]
helloWorldBytes.map(obj=>String.fromCharCode(obj)).join('') //#"hello world"




//Buffer provides functionality closer to python

var buffer = new Buffer([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100])
buffer.toString() //#'hello world'
buffer.toString("utf-8") //#'hello world'
buffer.toString("hex") //#'68656c6c6f20776f726c64'
buffer.readUInt16LE(9).toString(16) //#'646c'
buffer.readUInt16BE(9).toString(16) //#'6c64'
buffer.readUInt16BE(9).toString(10) //#'27748' 6C64 = (6 × 16³) + (12 × 16²) + (6 × 16¹) + (4 ×  16⁰) = 27748

Buffer.from('68656c6c6f20776f726c64') //#<Buffer 36 38 36 35 36 63 36 63 36 66 32 30 37 37 36 66 37 32 36 63 36 34>
Buffer.from('68656c6c6f20776f726c64','ascii') //#<Buffer 36 38 36 35 36 63 36 63 36 66 32 30 37 37 36 66 37 32 36 63 36 34>

Buffer.from('68656c6c6f20776f726c64','hex') //#<Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>

var nn = new BN('68656c6c6f20776f726c64', 16);
console.log(nn)	//<BN: 68656c6c6f20776f726c64>


console.log(nn.toString(10))  //126207244316550804821666916
console.log(nn.toString(16)) //68656c6c6f20776f726c64
var nb = nn.toBuffer('be');
var prefix = Buffer.from([0])
console.log(nb);
console.log(prefix);
console.log(nb.toString());
var arr = [prefix, nb];
console.log(arr);
console.log(Buffer.concat(arr));

console.log(new BN('002259c9cc3016e4ec0109b15b09e752ae5a08a51fe924106f', 16))
console.log(new BN('2259c9cc3016e4ec0109b15b09e752ae5a08a51fe924106f', 16))






