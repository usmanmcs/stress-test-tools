const https = require('https');


var afterSeconds = 1;
var total_connections = 1000;
var chunk_size = 500;
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

function createChunk(chunk) {
    console.log("creating " + chunk + " connections");
    for (var i = 0; i < chunk; i++)
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

for (var j = 0; j < total_connections / chunk_size; j++) {
    let chunk = (total_connections - j * chunk_size) > chunk_size ? chunk_size : (total_connections - j * chunk_size);
    setTimeout(function () {
        createChunk(chunk)
    }, afterSeconds * j * 1000);
}



