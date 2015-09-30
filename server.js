//Importing the HTTP module
var http = require('http');

//Importing the HTTPS module
var https = require('https');

//Importing the File System
var fs = require('fs');

var options = {
	key: fs.readFileSync('./private/server.key'),
	cert: fs.readFileSync('./private/server.cert')
};

// Importing the httpdispatcher module
//var dispatcher = require('httpdispatcher');

var path = require("path");

var express = require('express');

var app = express();
app.use(express.static('public'));

//Defining the ports we want to listen to
const PORT_S=8081;

var ipaddress = "localhost";

//We need a function which handles requests and send response
//function handleRequest(request, response){
//    try {
//        //log the request on console
//        console.log(request.url);
//    } catch(err) {
//        console.log(err);
//    }
//}


//Create a secured server
var secure_server = https.createServer(options, app);

var WebSocketServer = require('ws').Server
    , wsServer = new WebSocketServer({server:secure_server});

secure_server.listen(PORT_S, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Secure server listening on: https://localhost:%s", PORT_S);
});

app.get("/", function(request, response) {
	fs.readFile("./public/index.html", function(err, html) {
		if(err) {
			console.error("Error while reading from index.html!");
			response.end("Server error!");
		} else {
			response.writeHeader(200, {'Content-Type': 'text/html'});
			response.write(html);
			response.end();
		}

        wsServer.clients.forEach(function(x) {
            x.send("Another client connected");
        });
	});
});

app.post("/post1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Got Post Data');
});

// WebSocket server
wsServer.on("connection", function(ws) {

    console.log("connection a");

    ws.on('message', function(message) {
        console.log(message);
    });
});


