AttackerSuccessProbability = function( q, z ) {
    p = 1 - q
    l = z * (q / p)
    sum = 1
    //console.log(p,l)
    for (let k = 0; k <= z; k++) {
        poisson = Math.exp(-l)
        //console.log(-l, poisson)
        for (let i = 1; i <= k ; i++) {
            poisson =  poisson * l / i
            
        }
        //console.log(poisson, Math.pow(q/p, z-k))
        sum = sum - poisson * ( 1 - Math.pow(q/p, z-k))      
    }
    //console.log(sum)
    return sum
}

console.log(AttackerSuccessProbability(.1,5))

rp = Array.from({length: 11}, (x,i) => i)
rp.map(obj=>{
    console.log('z=',obj.toString().padStart(2), AttackerSuccessProbability(.1,obj).toFixed(7).padStart(10))
})

rp = Array.from({length: 11}, (x,i) => i*5)
rp.map(obj=>{
    console.log('z=',obj.toString().padStart(2), AttackerSuccessProbability(.3,obj).toFixed(7).padStart(10))
})


