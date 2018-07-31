var io = require('socket.io-client')
var socket = io(('http://104.236.248.132:8333'))
socket.on('connect', function(){console.log('connect')});
msg = Buffer.from('f9beb4d976657273696f6e0000000000650000005f1a69d2721101000100000000000000bc8f5e5400000000010000000000000000000000000000000000ffffc61b6409208d010000000000000000000000000000000000ffffcb0071c0208d128035cbc97953f80f2f5361746f7368693a302e392e332fcf05050001','hex')
socket.on('connect_error',(error) => {console.log('error',error)})
socket.send(msg)
socket.on('event', function(data){});
socket.on('disconnect', function(){console.log('disconnect')});