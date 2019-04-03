const https = require('https');
const request = require('request')

var afterSeconds = 0.2;
var iterations = 10;
var msgCount = 0;
var errCount = 0;

const URL = 'https://google.com';

function requestTiming() {
    return new Promise((resolve, reject) => {
        request({
            uri: URL,
            method: 'GET',
            time: true
        }, (err, resp) => {
            if(err)
                reject(err);
            else
                resolve([resp.timings, resp.timingPhases]);
        })
    });
}

function createChunk() {
    requestTiming().then((resp) => {
        msgCount = msgCount + 1;
        console.log("total:", msgCount+errCount, "success:", msgCount, "error:", errCount, resp);
    }).catch((err) => {
        errCount = errCount + 1;
        console.log("total:", msgCount+errCount, "success:", msgCount, "error:", errCount, values);
    })
}

for (var j = 0; j < iterations; j++) {
    setTimeout(function () {
        createChunk()
    }, afterSeconds * j * 1000);
}