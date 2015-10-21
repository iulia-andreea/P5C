
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

const CONSOLE_HEIGHT = 520,
      CONSOLE_LENGTH = 1250;

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
        switch (message) {
            case "start":
                var id = clientIndex++;
                var newClient = new client(id);
                newClient._snake = generateRandomSnake(id);
                clients[id] = newClient;
                ws.id = id;
                ws.send(id);
                console.log(newClient);
                break;
            default :
                var xey = [];
                xey = JSON.parse(message);
                clients[ws.id]._click = xey;
                console.log(xey);
        }
    });
    ws.on('error', function(message) {
        delete clients[ws.id];
    });
    ws.on('close', function(message) {
        delete clients[ws.id];
    });
});

function testCollisions() {
    //todo the test for the collisions here
}
setInterval(function() {
    var snakes = moveSnakes();
    if(snakes.length !== 0) {
        wsServer.clients.forEach(function (client) {
            client.send(JSON.stringify(snakes));
        });
    }
}, 1000 / 30);

function moveSnakes(){
    var snakes = [];
    if (clients.length > 0) {
        wsServer.clients.forEach(function (x) {
            var curClient = clients[x.id];
            if (curClient._snake.length > 0 ) {
                if (curClient._click.length !== 0) {
                    moveSnake(curClient, curClient._snake, curClient._click[0], curClient._click[1]);
                    testCollisions();
                }
            }
            snakes.push(curClient._snake);
        });
    }
    return snakes;
}

function moveSnake(client, snake, ix, iy) {
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
        snake[i][0] = snake[i - 1][0];
        snake[i][1] = snake[i - 1][1];
    }

    if (Math.abs(snake[0][0] - ix) < 5 && Math.abs(snake [0][1] - iy) < 5) {
        client._click = [];
    }
}

function generateRandomSnake(number) {
    var serpent = [],
        xS,
        yS;
    switch (number % 4){
        case 0: // 1st corner = UP - LEFT
            xS = ( number + 30 ) * getRandomInt(1, 10);
            yS = ( number + 30 ) * getRandomInt(1, 10);
            break;
        case 1: // 2nd corner = UP - RIGHT
            xS = CONSOLE_LENGTH - ( number + 30 ) * getRandomInt(1, 10);
            yS = ( number + 30 ) * getRandomInt(1, 10);
            break;
        case 2: // 3rd corner = DOWN - RIGHT
            xS = CONSOLE_LENGTH - ( number + 30 ) * getRandomInt(1, 10);
            yS = CONSOLE_HEIGHT - ( number + 30 ) * getRandomInt(1, 10);
            break;
        case 3: // 4th corner = DOWN - LEFT
            xS = ( number + 30 ) * getRandomInt(1, 10);
            yS = CONSOLE_HEIGHT - ( number + 30 ) * getRandomInt(1, 10);
            break;
    }

    for (i = 0; i < 50; i ++) {
        var si = [];
        if( (xS + 30) < 1200 ) {
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}