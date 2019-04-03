const https = require('https');


var afterSeconds = 0.1;
var iterations = 10;
var connections = [];
var msgCount = 0;
var errCount = 0;

function create_connection() {
    return new Promise((resolve, reject) => {
        https.get('https://google.com', (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                msgCount++;
                resolve(resp.statusCode);
            });
        }).on("error", (err) => {
            //console.log(err);
            errCount++;
            resolve(err.code);
        });
    });

}

function createChunk() {
    connections.push(create_connection());
    Promise.all(connections).then(function(values) {
        let result = { };
        for(var i = 0; i < values.length; ++i) {
            if(!result[values[i]])
                result[values[i]] = 0;
            ++result[values[i]];
        }
        console.log("total:", msgCount+errCount, "success:", msgCount, "error:", errCount, result);
    });
}

for (var j = 0; j < iterations; j++) {
    setTimeout(function () {
        createChunk()
    }, afterSeconds * j * 1000);
}



