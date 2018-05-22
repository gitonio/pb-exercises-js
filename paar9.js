
var ecc = require('./ecc.js')

console.log('9.1')

a = 2
b = 2
console.log( (4*Math.pow(a,3)+27*Math.pow(b,2))%17 == 0)

prime = 17
a = new ecc.FieldElement(2, prime);
b = new ecc.FieldElement(2, prime);
/*
additions =   [
        [ {x:2,y:7}, {x:5,y:2} ],
		[ {x:3,y:6}, {x:3,y:6} ],
        ]
        
pa = additions.map(obj => {
	x1 = new ecc.FieldElement(obj[0].x, prime);
	y1 = new ecc.FieldElement(obj[0].y, prime);
	p1 = new ecc.Point(x1, y1, a, b);
	x2 = new ecc.FieldElement(obj[1].x, prime);
	y2 = new ecc.FieldElement(obj[1].y, prime);
	p2 = new ecc.Point(x2, y2, a, b);
	// x3 = new ecc.FieldElement(obj[2].x, prime);
	// y3 = new ecc.FieldElement(obj[2].y, prime);
	// p3 = new ecc.Point(x3, y3, a, b);
	pa = p1.add(p2)
	console.log(`${p1.toString()} + ${p2.toString()} = ${pa.toString()}`)
})
*/
//9.3
l = prime+1-2*Math.sqrt(prime)
r = prime+1+2*Math.sqrt(prime)
console.log(`#E is between ${l} and ${r}`)

//9.4 
//?

//9.5
prime = 7
a = new ecc.FieldElement(3, prime);
b = new ecc.FieldElement(2, prime);

rp = Array.from({length: prime}, (x,i) => i)
console.log(rp);
function cartesianProductOf() {
    return Array.prototype.reduce.call(arguments, function(a, b) {
      var ret = [];
      a.forEach(function(a) {
        b.forEach(function(b) {
          ret.push(a.concat([b]));
        });
      });
      return ret;
    }, [[]]);
  }

rp = cartesianProductOf(rp,rp)
rp.map(obj => {
    x1 = new ecc.FieldElement(obj[0], prime);
    y1 = new ecc.FieldElement(obj[1], prime);
    try {
        p1 = new ecc.Point(x1, y1, a, b);
        console.log(obj[0],obj[1])
    } catch (error) {
        
    }
    
})
