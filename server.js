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

var path = require("path");

var express = require('express');

var app = express();
app.use(express.static('public'));

//Defining the ports we want to listen to
const PORT_S=8081;

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
	});
});

app.post("/post1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Got Post Data');
});

// WebSocket server
wsServer.on("connection", function(ws) {

    console.log("connection:");

	wsServer.clients.forEach(function(x) {
		x.send("New client connected: id=" + wsServer.clients.indexOf(ws.client)); // todo fix this
	});

    ws.on('message', function(message) {
        console.log(message);
        //setInterval(function() {
            var snake = [];
            var i;
            for (i = 0; i < 50; i ++) {
                var si = [];
                si.push(400 + i * 5);
                si.push(200);
                snake.push(si);
            }
            ws.send(JSON.stringify(snake));
            moveSnake(ws, snake);
        //}, 1000 / 30);
    });
});

var idx = -1;
function moveSnake(ws, snake) {
    console.log("moveSnake()");

	var velX,
		velY,
		xs = [400, 800, 800, 400],
		ys = [400, 400, 800, 200],
        thrust = 5;

	idx++;
    var tx = xs[idx] - snake[0][0],
        ty = ys[idx] - snake[0][1],
        dist = Math.sqrt(tx * tx + ty * ty),
        i;

    velX = (tx / dist) * thrust;
    velY = (ty / dist) * thrust;

    if (xs[idx] >= 0 && ys[idx] >= 0) {
        snake[0][0] += velX;
        snake[0][1] += velY;
        for (i = snake.length - 1 ; i > 0 ; i --) {
            snake[i][0] = snake[i-1][0];
            snake[i][1] = snake[i-1][1];
        }
    }
    if (idx === 3) idx = 0;
}


