
    //      ***  VARIABLES UTILS  ***
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

    //   *** VARIABLES PROPRES **
var client = require("./client");

var clients = [],
    clientIndex = 0,
    snake = [],
    i;

for (i = 0; i < 50; i ++) {
    var si = [];
    si.push(200 + i * 5);
    si.push(200);
    snake.push(si);
}

// WebSocket server
wsServer.on("connection", function(ws) {
    //console.log("connection:");

	//wsServer.clients.forEach(function(x) {
	//	x.send("New client connected: id=" + wsServer.clients.indexOf(ws.client));
	//});

    ws.on('message', function(message) {
        console.log(message);
        switch (message) {
            case "start":
                var id = clientIndex++;
                var newClient = new client(id);
                newClient._snake = generateRandomSnake(id);
                clients.push(newClient);
                ws.send(id);
                console.log(newClient);
                break;
            default :
                var xey = message.split(",", 2);

        }
    });
});

//var xs = [200, 400, 400, 200],
//    ys = [400, 400, 200, 200],
//    idx = 0;

function testCollisions() {
    //todo the test for the collisions here
}
setInterval(function() {
    var snakes = [];

    if (wsServer.clients.length > 0) {
        wsServer.clients.forEach(function (x) {
            var curClient = clients[x.index];
            if (curClient._snake.length > 0 ) {
                if (curClient._click != null) {
                    moveSnake(curClient._snake, curClient._click[0], curClient._click[1]);
                    testCollisions();
                }
            }
            snakes.push(curClient._snake);
        });
        x.send(JSON.stringify(snakes));
        //
        //
        //if(snake[0][0] == xs[idx] && snake[0][1] == ys[idx]) {
        //    idx++;
        //}
        //if (idx === 4) idx = 0;
    }
}, 1000 / 30);

function moveSnake(snake, ix, iy) {
    //console.log("moveSnake()");
	var velX,
		velY,
        thrust = 5;

    var tx = ix - snake[0][0],
        ty = iy - snake[0][1],
        dist = Math.sqrt(tx * tx + ty * ty),
        i;

    velX = (tx / dist) * thrust;
    velY = (ty / dist) * thrust;

    snake[0][0] += velX;
    snake[0][1] += velY;
    for (i = snake.length - 1 ; i > 0 ; i --) {
        snake[i][0] = snake[i-1][0];
        snake[i][1] = snake[i-1][1];
    }
}

function generateRandomSnake(number) {
    var serpent = [],
        xS,
        yS;
    switch (number){
        case number % 4 === 0: // 1st corner = UP - LEFT
            xS = number * Math.random();
            yS = number * Math.random();
            break;
        case number % 3 === 0: // 2nd corner = UP - RIGHT
            xS = 1325 - number * Math.random();
            yS = number * Math.random();
            break;
        case number % 2 === 0: // 3rd corner = DOWN - RIGHT
            xS = 1325 - number * Math.random();
            yS = 545 - number * Math.random();
            break;
        case number % 1 === 0: // 4th corner = DOWN - LEFT
            xS = number * Math.random();
            yS = 545 - number * Math.random();
            break;
    }

    for (i = 0; i < 50; i ++) {
        var si = [];
        if( (xS + 30) > 1325 ) {
            xS += 5;
        } else {
            yS += 5;
        }
        si.push(xS);
        si.push(yS);
        serpent.push(si);
    }
    return serpent;
}

