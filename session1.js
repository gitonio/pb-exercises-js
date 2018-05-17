BN = require('bn.js')
//Exercise 1.1
console.log('Exercise 1.1')
prime = 31
console.log((2+15)%prime)
console.log((17 + 21)%prime)
console.log((29 - 4)%prime)
//console.log((15-30)%prime)
//https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
//console.log(((15-30)%prime+prime)%prime)
function mod(n, m) {
	return ((n % m) +m) % m;
}
console.log(mod(15-30,prime))

//Exercise 2.1
console.log('Exercise 2.1')
console.log(24 * 19 % prime)
console.log(Math.pow(17,3) % prime)
console.log(Math.pow(5,5)*18 % prime)



//Exercise 2.2
console.log('Exercise 2.2')
rp = Array.from({length: prime}, (x,i) => i)
k = Math.floor(Math.random()*prime+1)
rp = rp.map((x,i) => (i*k%prime)).sort(function(a,b) {return a - b;})
console.log(rp)


//Exercise 2.3
console.log('Exercise 2.3')
rp = Array.from({length: prime-1}, (x,i) => i+1)
prime = new BN(31)
exp = new BN(30)
rp = rp.map((x,i) => (new BN(x).pow(exp).mod(prime).toNumber(10) ))
console.log(rp)

//Exercise 3.1
console.log('Exercise 3.1')
prime = new BN(31)
console.log(new BN(3).mul(new BN(24).pow(prime.subn(2)).mod(prime)).mod(prime).toNumber(10))
console.log(new BN(17).pow(prime.subn(4)).mod(prime).toNumber(10))
console.log(new BN(4).pow(prime.subn(5).mod(prime)).muln(11).mod(prime).toNumber(10))

//Exercise 3.2
console.log('Exercise 3.2')
rp = Array.from({length: prime}, (x,i) => i)
k = Math.floor(Math.random()*prime+1)
rp = rp.map((x,i) => (new BN(i).pow(prime.subn(2)).mod(prime)).muln(k).mod(prime).toNumber(10)).sort(function(a,b) {return a - b;})
console.log(rp)

//Exercise 4.1
console.log('Exercise 4.2')
points = [{x:-2,y:4},{x:3,y:7},{x:18,y:77}]
pointstf = points.map(o => {
	if(Math.pow(o.y,2) == Math.pow(o.x, 3) + o.x * 5 + 7) {
		console.log(o, ' is on the curve.')
	} else {
		console.log(o, ' is not on the curve.')
	}

})

//Exercise 6.1
console.log('Exercise 6.1')
x1 = 2; y1 =5; x2 = -1; y2 = -1;
s = (y2 - y1)/(x2 - x1)
x3 = Math.pow(s,2) - x2 - x1
y3 = s * (x1 - x3) - y1
console.log(x3,y3)

//Exercise 7.1
console.log('Exercise 7.1')
a =  5; b = 7; x1 = -1; y1 = -1
s = (3 * Math.pow(x1,2) + a)/(2 * y1)
x3 = Math.pow(s,2) - 2 * x1
y3 = s * (x1 - x3) - y1
console.log(x3,y3)




