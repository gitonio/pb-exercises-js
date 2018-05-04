var ecc = require('./ecc.js')
var helper = require('./helper.js')
var tx = require('./tx.js')
var script = require('./script.js')
var BN = require('bn.js')
var Readable = require('stream').Readable


// Exercise 1.1
hexScript = '767695935687'
s = new script.Script(Buffer.from(hexScript,'hex'))
s.toString()

// Exercise 2.1
hexScript = '6e879169a77ca787'
s = new script.Script(Buffer.from(hexScript,'hex'))
s.toString()

// Exercise 3.1
prevTx = Buffer.from('d1c789a9c60383bf715f3f6ad9d14b91fe55f3deb369fe5d9280cb1a01793f81','hex') 
txIn = new tx.TxIn(prevTx, 0, Buffer.from([]), 0xffffffff, {})
/*
tx = txIn.fetchTx(0).then( tx => {
	console.log(tx)
	return tx
})
*/

tx0 = txIn.fetchTx(0)

// Exercise 4.1
prevIndex = 0
prevOutput = tx0.outputs[prevIndex]
prevOutput.amount
prevOutput.scriptPubkey.toString()


// Exercise  5.1

hexTx = '010000000456919960ac691763688d3d3bcea9ad6ecaf875df5339e148a1fc61c6ed7a069e010000006a47304402204585bcdef85e6b1c6af5c2669d4830ff86e42dd205c0e089bc2a821657e951c002201024a10366077f87d6bce1f7100ad8cfa8a064b39d4e8fe4ea13a7b71aa8180f012102f0da57e85eec2934a82a585ea337ce2f4998b50ae699dd79f5880e253dafafb7feffffffeb8f51f4038dc17e6313cf831d4f02281c2a468bde0fafd37f1bf882729e7fd3000000006a47304402207899531a52d59a6de200179928ca900254a36b8dff8bb75f5f5d71b1cdc26125022008b422690b8461cb52c3cc30330b23d574351872b7c361e9aae3649071c1a7160121035d5c93d9ac96881f19ba1f686f15f009ded7c62efe85a872e6a19b43c15a2937feffffff567bf40595119d1bb8a3037c356efd56170b64cbcc160fb028fa10704b45d775000000006a47304402204c7c7818424c7f7911da6cddc59655a70af1cb5eaf17c69dadbfc74ffa0b662f02207599e08bc8023693ad4e9527dc42c34210f7a7d1d1ddfc8492b654a11e7620a0012102158b46fbdff65d0172b7989aec8850aa0dae49abfb84c81ae6e5b251a58ace5cfeffffffd63a5e6c16e620f86f375925b21cabaf736c779f88fd04dcad51d26690f7f345010000006a47304402200633ea0d3314bea0d95b3cd8dadb2ef79ea8331ffe1e61f762c0f6daea0fabde022029f23b3e9c30f080446150b23852028751635dcee2be669c2a1686a4b5edf304012103ffd6f4a67e94aba353a00882e563ff2722eb4cff0ad6006e86ee20dfe7520d55feffffff0251430f00000000001976a914ab0c0b2e98b1ab6dbf67d4750b0a56244948a87988ac005a6202000000001976a9143c82d7df364eb6c75be8c80df2b3eda8db57397088ac46430600'
bytTx = Buffer.from(hexTx, 'hex')
		readable = new Readable()
		readable.push(bytTx)
		readable.push(null)
		
t = tx.Tx.parse(readable)

# initialize input sum
input_sum = 0
output_sum = 0
# iterate over all inputs (t.tx_ins)
		x = t.inputs.map(obj => {
			return obj.value()
		})

		y = t.outputs.map(obj => {
			return obj.amount
		})

		
		const reducer = (ac,cu) => ac + cu;
		
		a = results.then(data => data.reduce(reducer)).then(  xx => resultsy.then(data => {data.reduce(reducer); return xx - data.reduce(reducer)   }))



