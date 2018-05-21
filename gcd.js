function gcd(r0,r1) {
    s0 =1, s1 = 0, t0 = 0, t1 = 1
    console.log(r0,r1, q, s0, t0)
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
        console.log(r0, r1, q, s0, t0)
    }
    return r0
}

console.log(gcd(973,301))

function gcdr(r0,r1) {
    if (r0 % r1 == 0) {
        return r1
    } else {
        return gcdr(r1, r0 % r1)
    }
}

var gcdr = (r0,r1) => r0 % r1 == 0 ? r1 : gcdr(r1, r0 % r1)

console.log(gcdr(27,21))
