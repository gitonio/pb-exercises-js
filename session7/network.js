var helper = require('./helper.js')

NETWORK_MAGIC = Buffer.from([0xf9, 0xbe, 0xb4, 0xd9])

class NetworkEnvelope {
    constructor( command, payload) {
        this.command = command;
        this.payload = payload;
    }

    static parse (s) {
        const magic = s.read(4);
        if (magic.toString('hex') != NETWORK_MAGIC.toString('hex')) {
            throw new Error('magic is not right');
        }
        const command = s.read(12);
        const payloadLength = helper.littleEndianToInt(s.read(4));
        const checksum = s.read(4);
        const payload = s.read(payloadLength);
        const calculatedChecksum = helper.doubleSha256(payload).slice(0,8);
        if (calculatedChecksum != checksum.toString('hex')) {
            throw new Error('checksum does not match');
        }
        return new NetworkEnvelope(command, payload);
    }

    serialize() {
         return Buffer.concat([
            NETWORK_MAGIC, 
            this.command, 
            this.payload !== null ?  helper.intToLittleEndian(this.payload.length,4) : Buffer.from([0x00,0x00,0x00,0x00]),
            Buffer.from(helper.doubleSha256(this.payload).slice(0,8),'hex'),
            this.payload !== null ?  this.payload : Buffer.from([]),
            //this.payload ,
            ])

    }
}
NetworkEnvelope.prototype.toString = function(){
    let result = ''
    return `${this.command.toString('ascii')}: ${this.payload.toString('hex')}`
}

module.exports.NETWORK_MAGIC = NETWORK_MAGIC;
module.exports.NetworkEnvelope = NetworkEnvelope;