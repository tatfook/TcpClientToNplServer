const Net = require('net');
const port = 60001;
const host = 'localhost';


function writeFullPathNplMsg() {
    const buff = Buffer.from('A (worker1)script/test/network/CustomDataServer.lua\n\n16: {TestCase="TP"}', 'utf8');
    return buff;
}
function writeNplMsg() {
    const buff = Buffer.from('A (worker1)2\n\n16: {TestCase="TP"}', 'utf8');
    return buff;
}
const client = new Net.Socket();
client.connect({ port: port, host: host }, function () {
    console.log('TCP connection established with the server.');

    client.write(writeFullPathNplMsg());
    client.write(writeNplMsg());
});

client.on('data', function (chunk) {
    console.log(`Data received from the server: ${chunk.toString()}.`);

    //client.end();
});

client.on('end', function () {
    console.log('Requested an end to the TCP connection');
});