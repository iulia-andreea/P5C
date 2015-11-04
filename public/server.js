
    //      ***  VARIABLES UTILS  ***
//Importing the HTTP module
//var http = require('http');

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
app.use(express.static('resources'));

//Defining the ports we want to listen to
const PORT_S = 8081;

//Create circle1 secured server
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

var client = require("./client");

    //   *** VARIABLES PROPRES **
var clients = [],
    clientIndex = 0,
    obstacles = [],
    i;

const CANVAS_HEIGHT = 520,
      CANVAS_LENGTH = 1000,
      RADIUS = 20,
      SNAKE_LENGTH = 50;

// WebSocket server
wsServer.on("connection", function(ws) {
    console.log("connection:");

	//wsServer.clients.forEach(function(x) {
	//	x.send("New client connected: id=" + wsServer.clients.indexOf(ws.client));
	//});

    ws.on('message', function(message) {
        if (message.indexOf("start") > -1 && message.split(",", 2)[1].length > 0) {
            var id = clientIndex++,
                genNO = 0,
                clientName = message.split(",", 2)[1],
                newClient = new client(id, clientName);
            newClient._snake = generateRandomSnake(id);
            if (testCollisions(newClient._snake)) {
                genNO++;
                if (genNO < 100) {
                    newClient._snake = generateRandomSnake(id);
                } else {
                    console.log("There is no more space for another client on the game board!");
                }
            }
            clients[id] = newClient;
            ws.id = id;
            try {
                ws.send(JSON.stringify(id));
                //todo send obstacles
            } catch (e) {
                console.error(e);
            }
            console.log("New client: id=" + newClient._id + ", name=" + newClient._name);
        } else {
            var xey = [];
            xey = JSON.parse(message);
            if (xey !== null && xey.length > 0) {
                clients[ws.id]._click = xey;
            }
            //console.log(xey);
        }
    });
    ws.on('error', function(message) {
        console.log("error " + message);
        delete clients[ws.id];
    });
    ws.on('close', function(message) {
        console.log("close :" + message);
        delete clients[ws.id];
    });
});

function testCollisionWithSelf(self) {
    var result = false;
    for ( i = 40 ; i < self._snake.length ; i++) {
        var dx = Math.abs(self._snake[0][0] - self._snake[i][0]),
            dy = Math.abs(self._snake[0][1] - self._snake[i][1]),
            distance = Math.sqrt(dx * dx + dy * dy);

        if (distance - RADIUS * 2 < -1) {
            result = true;
            console.log("SELF Collision!!!");
        }
    }
    return result;
}

function testCollisionBetweenSnakes(movingClient, client) {
    var result = false;
    if (client._snake != null && movingClient._snake != null) {
        client._snake.forEach(function (circle) {
            movingClient._snake.forEach(function (mCircle) {
                var dx = mCircle[0] - circle[0];
                var dy = mCircle[1] - circle[1];
                var distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < RADIUS * 2) {
                    result = true;
                    console.log("Collision!!!");
                }
            });
        });
    }
    return result;
}

function testCollisionWithObstacle(circle, obstacle) { //obstacle {x, y, width, height}
    var cX = Math.abs(circle[0] - obstacle[0]),
        cY = Math.abs(circle[1] - obstacle[1]);

    if (cX > (obstacle[2] / 2 + RADIUS)) { return false; }
    if (cY > (obstacle[3] / 2 + RADIUS)) { return false; }

    if (cX <= (obstacle[2] / 2)) { return true; }
    if (cY <= (obstacle[3] / 2)) { return true; }

    var cornerDistance_sq = (cX - obstacle[2]/2)^2 +
        (cY - obstacle[3] / 2) ^ 2;

    return (cornerDistance_sq <= (RADIUS^2));
}

wsServer.broadcast = function broadcast(data) {
    wsServer.clients.forEach(function each(client) {
        /*
            readyState:
                0 - connection not yet established
                1 - conncetion established
                2 - in closing handshake
                3 - connection closed or could not open

         */
        if (client.readyState === 1) {
            try {
                client.send(JSON.stringify(data));
            } catch (e) {
                console.error(e);
            }
        }
    });
};

setInterval(function() {
    if (clients.length > 0) {
        var snakes = moveSnakes();

        if (snakes.length !== 0) {
            wsServer.broadcast(snakes)
        }
    }
}, 1000 / 30);

function moveSnakes(){
    var snakes = [];
    if (clients.length > 0) {
        clients.forEach(function(curClient) {
            //console.log(curClient);
            if (curClient != null && curClient._snake.length > 0) {

                if (curClient._click.length !== 0) {
                    moveSnake(curClient, curClient._snake, curClient._click[0], curClient._click[1]);

                    if (testCollisions(curClient)) {
                        curClient._snake = generateRandomSnake(getRandomInt(clientIndex % 10, 10));
                        curClient._click = [];
                    }
                }
                snakes.push(curClient._snake);
            }
        });
    }
    return snakes;
}

function testCollisions(movingClient) {
    var result = false;
    clients.forEach(function (client) {
        if (client._id === movingClient._id) {
            if (testCollisionWithSelf(client)) {
                result = true;
            }
        } else if (testCollisionBetweenSnakes(movingClient, client)) {
            result = true;
        }
    });
    return result;
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
    //todo check collisions
    var serpent = [],
        xS,
        yS;
    switch (number % 4){
        case 0: // 1st corner = UP - LEFT
            xS = (number + RADIUS) * getRandomInt(1, 10);
            yS = (number + RADIUS) * getRandomInt(1, 10);
            break;
        case 1: // 2nd corner = UP - RIGHT
            xS = CANVAS_LENGTH - (number + RADIUS) * getRandomInt(1, 10);
            yS = (number + RADIUS) * getRandomInt(1, 10);
            break;
        case 2: // 3rd corner = DOWN - RIGHT
            xS = CANVAS_LENGTH - (number + RADIUS) * getRandomInt(1, 10);
            yS = CANVAS_HEIGHT - (number + RADIUS) * getRandomInt(1, 10);
            break;
        default: // 4th corner = DOWN - LEFT
            xS = (number + RADIUS) * getRandomInt(1, 10);
            yS = CANVAS_HEIGHT - (number + RADIUS) * getRandomInt(1, 10);
            break;
    }

    for (i = 0 ; i < SNAKE_LENGTH ; i ++) {
        var si = [];
        if ((xS + RADIUS) < 1000) {
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