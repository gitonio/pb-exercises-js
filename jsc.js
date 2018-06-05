rp = Array.from({length: prime}, (x,i) => i)
rp = Array.from({length: 10},    (x,i) => i   )

x = rp.map(obj => ( {"date": obj, "amount": Math.random()}) )


function batch(x, target) {
    optimum = {"start":0, "end":0, "rem":target}
    for (let index = 0; index < x.length; index++) {
    sum = x[index].amount
        for (let index2 = index+1; index2 < x.length; index2++) {
            sum += x[index2].amount
            //console.log(x[index].date,x[index2].date, sum)
            if(sum>target) {
                if(sum-target<optimum.rem) {
                    optimum = {"start":index, "end":index2, "rem":sum-target}
                }
                break 
            }
        }
        //console.log(optimum,sum)
   
    }
    return optimum
}

res = batch(x,3)