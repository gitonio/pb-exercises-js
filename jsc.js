rp = Array.from({length: 10},    (x,i) => i   )

x = rp.map(obj => ( {"date": obj, "amount": Math.floor(Math.random()*10)}) )
x = [ { date: 0, amount: 9 },
    { date: 1, amount: 3 },
    { date: 2, amount: 2 },
    { date: 3, amount: 7 },
    { date: 4, amount: 1 },
    { date: 5, amount: 5 },
    { date: 6, amount: 1 },
    { date: 7, amount: 4 },
    { date: 8, amount: 5 },
    { date: 9, amount: 1 } ]
console.log(x)


function batch(x, target) {
    optimum = {"start":0, "end":0, "rem":target}
    for (let i = 0; i < x.length; i++) {
        sum = x[i].amount
        if(sum>=target) {
            if(sum-target<optimum.rem) {
                optimum = {"start":i, "end":i, "rem":sum-target}
            }
        } else {
         for (let j = i+1; j < x.length; j++) {
            sum += x[j].amount
            //console.log(x[index].date,x[index2].date, sum)
            if(sum>=target) {
                if(sum-target<optimum.rem) {
                    optimum = {"start":i, "end":j, "rem":sum-target}
                }
                break 
            }
        }
           
        }
        //console.log(optimum,sum)
   
    }
    return optimum
}

res = batch(x,4)
console.log(res)