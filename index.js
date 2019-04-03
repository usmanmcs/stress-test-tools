var mqtt = require('mqtt');
var afterSeconds = 5;
var total_connections = 5000;
var chunk_size = 500;
var connections = [];
var msgCount = 0;
function create_connection() {
        var client = mqtt.connect('ws://ubmraspi.ddns.net:59911', {
            clean: true,
            keepalive: 10,
            resubscribe: true,
            reconnectPeriod: 1,
            connectTimeout: 30000,
            rejectUnauthorized: false
        })

        client.on('connect', function () {
            client.subscribe('presence', function (err) {

            })
        });

        client.on("message", function (topic, message, packet) {
            console.log("MQTT message received " + msgCount, topic, message.toString());
            msgCount++;
        });

        client.on('close', function (e) {
            console.log("connection closed", e);
        });
        client.on('error', function (err) {
            console.log("error", err);
        });
        connections.push(client);

}

function createChunk(chunk) {
    console.log("creating " + chunk + " connections");
    for(var i = 0; i < chunk; i++)
        create_connection();
}

for(var j=0; j<total_connections/chunk_size; j++) {
    setTimeout(function () {createChunk(chunk_size)}, afterSeconds*j*1000);
}
