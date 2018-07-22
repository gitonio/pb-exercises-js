var gcd = require('./gcd')
var BN = require('bn.js')

function dec2bin(number) {
    let bin = '';
    while(number > 0) {
          bin = number%2 + bin;
          number = Math.floor(number/2);
          }
    return bin;
}

function bin2dec(bstr) { 
    return parseInt((bstr + '')
    .replace(/[^01]/gi, ''), 2);
}

console.log(dec2bin(26))

x = dec2bin(26)

map = Array.prototype.map;
reduce = Array.prototype.reduce;
let  y  = 0;
var a = map.call(dec2bin(26), (x,i) => {
    console.log(x,i)
    //y = y + x
    //console.log(y)
    if (i==0) {
        y = x
        return null
    }
    y = dec2bin(bin2dec(y)*2)
    console.log('y',y)
    if (x=='0') {
        return 'SQ'
    } else {
        console.log('yy', dec2bin(bin2dec(y) + 1))
        y = dec2bin(bin2dec(y) + 1)
        return ['SQ', 'MUL']
    }
})

//console.log(a.split())

/*
p = 41
q = 17
e = 32
e = 49
Kpr = (p,q,d)
phi = 40 * 16


*/

//console.log()
gcd.gcd(640,49)

console.log(41*17)
console.log(209 % 49)
gcd.phi(697)

x = new BN(2)
e = new BN(79)
m = new BN(101)

console.log(x.pow(e).mod(m).toNumber(10))

x = new BN(3)
e = new BN(197)
m = new BN(101)

console.log(x.pow(e).mod(m).toNumber(10))

exp = 26
var a = map.call(dec2bin(exp), (x,i) => {
    //console.log(x,i)
    //y = y + x
    //console.log(y)
    
    if (i==0) {
        y = new BN(2)
        e = x
        return y
    }

    y = y.pow(new BN(2))
    e = dec2bin(bin2dec(e) * 2)
    console.log(i, 'y',y.toNumber(10), 'sq', e)
    if (x=='0') {
        //y = y.pow(new BN())
        //return 'SQ'
        
        return y
    } else {
        e = dec2bin(bin2dec(e) + 1)
        y = y.muln(2)
        console.log(i, 'y',y.toNumber(10), 'mul', e)
        return y
    }
})

//console.log(a[6].toNumber(10))
exp = 79
var a = map.call(dec2bin(exp), (x,i) => {
    
    if (i==0) {
        y = new BN(2)
        e = x
        return y
    }

    y = y.pow(new BN(2)).mod(new BN(101))
    e = dec2bin(bin2dec(e) * 2)
    console.log(i, 'y',y.toNumber(10), 'sq', e)
    if (x=='0') {
        return y
    } else {
        e = dec2bin(bin2dec(e) + 1)
        y = y.muln(2).mod(new BN(101))
        console.log(i, 'y',y.toNumber(10), 'mul', e)
        return y
    }
})

exp = 197
var a = map.call(dec2bin(exp), (x,i) => {
    
    if (i==0) {
        y = new BN(3)
        e = x
        return y
    }

    y = y.pow(new BN(2)).mod(new BN(101))
    e = dec2bin(bin2dec(e) * 2)
    console.log(i, 'y',y.toNumber(10), 'sq', e)
    if (x=='0') {
        return y
    } else {
        e = dec2bin(bin2dec(e) + 1)
        y = y.muln(3).mod(new BN(101))
        console.log(i, 'y',y.toNumber(10), 'mul', e)
        return y
    }
})

function mod(n, m) {
	return ((n % m) +m) % m;
}

p = 3
q = 11
n = p*q
ph = (p-1)*(q-1)
e = 3
//d = 7 
d = gcd.gcd(ph,e)
console.log('d',d)
x = 4
y = Math.pow(x, e)%(n)
console.log(y)
console.log(Math.pow(y,d)%(n))


p = 3
q = 11
n = p*q
ph = (p-1)*(q-1)
d = 7 
e = gcd.gcd(ph,d)
console.log('e',e)
x = 5
y = Math.pow(x, e)%(n)
console.log('y', y)
console.log(Math.pow(y,d)%(n))


p = 5
q = 11
n = p*q
ph = (p-1)*(q-1)
e = 3 
x = 9
d = mod(gcd.gcd(ph,e),ph)
console.log('d',d)
y = Math.pow(x, e)%(n)
console.log('y',y)
y = new BN(y)
console.log(y.pow(new BN(d)).mod(new BN(n)).toNumber(10))
