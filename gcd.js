//Extended Euclidean Algorithm 
//for GCD

function gcd(r0,r1) {
    s0 =1, s1 = 0, t0 = 0, t1 = 1
    console.log('r0'.padStart(5), 'r1'.padStart(5), 'q'.padStart(5), 's0'.padStart(5), 't0'.padStart(5))
    while (r1 != 0) {

        temp1 = r1
        temp0 = r0
        r1 = r0 % r1
        r0 = temp1
        q = (temp0 - r1) / temp1

        temps1 = s1
        temps0 = s0
        s1 = s0 - q * temps1
        s0 = temps1

        tempt = t1
        t1 = t0 - q * tempt
        t0 = tempt
        console.log(r0.toString().padStart(5), r1.toString().padStart(5), q.toString().padStart(5), s0.toString().padStart(5), t0.toString().padStart(5))
    }
    return t0
}

console.log(gcd(973,301))

//Recursive version of Euclidean Algorithm for GCD
function gcdr(r0,r1) {
    if (r0 % r1 == 0) {
        return r1
    } else {
        return gcdr(r1, r0 % r1)
    }
}

//Recursive version of Euclidean Algorithm for GCD short version
var gcdr = (r0,r1) => r0 % r1 == 0 ? r1 : gcdr(r1, r0 % r1)

console.log(gcdr(27,21))
prime = 11
//Display Phi function
Array.from({length: prime}, (x,i) => console.log(`gcd(${i},26)=${gcdr(i,26)}`))

var phi = prime => {
    rp = Array.from({length: prime}, (x,i) => i)
    
    console.log(rp.reduce((acc,iter)=>(gcdr(iter,prime)===1?acc+1:acc)))
}


/*

a = 4; n = 7;
Math.pow(4,5) % 7 = 2
4 * 2  % 7 = 1

//12 = 2.2.3
(Math.pow(2,2)-Math.pow(2,1))*(Math.pow(3,1)-Math.pow(3,0)) // 4
Math.pow(5 ,4) % 12 = 1 % 12

a = 6; n = 13;
a.invm(n).toNumber(10) //3
Math.pow(a,n - 2) % n // 11
11 * 6  % 13 // 1

a = new BN(6)
n = new BN(13)
a.invm(n).toNumber(10) //

6.12

6.12. For the affine cipher in Chapter 1 the multiplicative inverse of an element
modulo 26 can be found as
a−1 ≡ a^11 mod 26.
Derive this relationship by using Euler’s Theorem.

Definition 1.4.4 Affine Cipher
Let x,y,a,b ∈ Z26
Encryption: ek(x) = y ≡ a · x+b mod 26.
Decryption: dk(y) = x ≡ a−1 · (y−b) mod 26.
with the key: k = (a,b), which has the restriction: gcd(a,26) = 1.

*/

module.exports.gcd = gcd;
module.exports.phi = phi;