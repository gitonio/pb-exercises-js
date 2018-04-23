//Exercise 1.1

prime = 31
(2+15)%prime
(17 + 21)%prime
(29 - 4)%prime
(15-30)%prime
//https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
((15-30)%prime+prime)%prime
function mod(n, m) {
	return ((n % m) +m) % m;
}
mod(15-30,prime)

//Exercise 2.1

24 * 19 % prime
Math.pow(17,3) % prime
Math.pow(5,5)*18 % prime



//Exercise 2.2

rp = Array.from({length: prime}, (x,i) => i)
k = Math.floor(Math.random()*prime+1)
rp.map((x,i) => (i*k%prime)).sort(function(a,b) {return a - b;})

//Exercise 2.3
BN = require('bn.js')
rp = Array.from({length: prime}, (x,i) => i+1)
prime = new BN(31)
exp = new BN(30)
rp.map((x,i) => (new BN(i).pow(exp).mod(prime).toNumber(10)))

//Exercise 3.1
prime = new BN(31)
new BN(3).mul(new BN(24).pow(prime.subn(2)).mod(prime)).mod(prime).toNumber(10)
new BN(17).pow(prime.subn(4)).mod(prime).toNumber(10)
new BN(4).pow(prime.subn(5).mod(prime)).muln(11).mod(prime).toNumber(10)

//Exercise 3.2
rp = Array.from({length: prime}, (x,i) => i)
k = Math.floor(Math.random()*prime+1)
rp.map((x,i) => (new BN(i).pow(prime.subn(2)).mod(prime)).muln(k).mod(prime).toNumber(10)).sort(function(a,b) {return a - b;})

//Exercise 4.1
points = [{x:-2,y:4},{x:3,y:7},{x:18,y:77}]
points.map(o => Math.pow(o.y,2) == Math.pow(o.x, 3) + o.x * 5 + 7)
//points.map(o => new BN(o.y).pow(new BN(2)).eq(new BN(o.x).pow(new BN(3)).add(new BN(o.x).muln(5)).addn(7)))

//Exercise 6.1

x1 = 2; y1 =5; x2 = -1; y2 = -1;
s = (y2 - y1)/(x2 - x1)
x3 = Math.pow(s,2) - x2 - x1
y3 = s * (x1 - x3) - y1

//Exercise 7.1
a =  5; b = 7; x1 = -1; y1 = -1
s = (3 * Math.pow(x1,2) + a)/(2 * y1)
x3 = Math.pow(s,2) - 2 * x1
y3 = s * (x1 - x3) - y1




