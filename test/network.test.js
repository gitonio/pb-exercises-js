var { assert, expect } = require('chai');
var Tx = require('../tx');
var Script = require('../script')
var BN = require('bn.js')
var Readable = require('stream').Readable
var ecc = require('../ecc')
var helper = require('../helper')
var block = require('../block.js').Block
var proof = require('../block.js').Proof
var network = require('../network.js');

describe('NetworkEnvelopeTest', function () {


    it('test_parse_net', function () {
        msg = Buffer.from('f9beb4d976657261636b000000000000000000005df6e0e2', 'hex')

        readable = new Readable()
        readable.push(msg)
        readable.push(null)
        envelope = network.NetworkEnvelope.parse(readable)
        assert.deepEqual(envelope.command.slice(0, 6).toString('hex'), Buffer.from('verack', 'ascii').toString('hex'));
        assert.isNull(envelope.payload)

    })

    it('test_parse_net2', function () {
        msg = Buffer.from('f9beb4d976657273696f6e0000000000650000005f1a69d2721101000100000000000000bc8f5e5400000000010000000000000000000000000000000000ffffc61b6409208d010000000000000000000000000000000000ffffcb0071c0208d128035cbc97953f80f2f5361746f7368693a302e392e332fcf05050001', 'hex')

        readable = new Readable()
        readable.push(msg)
        readable.push(null)
        envelope = network.NetworkEnvelope.parse(readable)
        assert.deepEqual(envelope.command.slice(0, 7), Buffer.from('version', 'ascii'));
        assert.deepEqual(envelope.payload, msg.slice(24, msg.length))

    })
    it('test_serialize_net', function () {
        msg = Buffer.from('f9beb4d976657261636b000000000000000000005df6e0e2', 'hex')

        readable = new Readable()
        readable.push(msg)
        readable.push(null)
        envelope = network.NetworkEnvelope.parse(readable)
        assert.deepEqual(envelope.serialize().toString('hex'), msg.toString('hex'))

    })
    it('test_serialize_net2', function () {
        msg = Buffer.from('f9beb4d976657273696f6e0000000000650000005f1a69d2721101000100000000000000bc8f5e5400000000010000000000000000000000000000000000ffffc61b6409208d010000000000000000000000000000000000ffffcb0071c0208d128035cbc97953f80f2f5361746f7368693a302e392e332fcf05050001', 'hex')

        readable = new Readable()
        readable.push(msg)
        readable.push(null)
        envelope = network.NetworkEnvelope.parse(readable)
        console.log(envelope.toString())
        assert.deepEqual(envelope.serialize().toString('hex'), msg.toString('hex'))

    })

})