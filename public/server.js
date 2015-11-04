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

var express = require('express');

var app = express();
app.use(express.static('public'));
app.use(express.static('resources'));

//Defining the ports we want to listen to
var PORT_S = 8081;

//Create circle1 secured server
var secureServer = https.createServer(options, app);

var WebSocketServer = require('ws').Server,
     wsServer = new WebSocketServer({server:secureServer});

secureServer.listen(PORT_S, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log('Secure server listening on: https://localhost:%s', PORT_S);
});

app.get('/', function(request, response) {
    fs.readFile('./public/index.html', function(err, html) {
        if(err) {
            console.error('Error while reading from index.html!');
            response.end('Server error!');
        } else {
            response.writeHeader(200, {'Content-Type': 'text/html'});
            response.write(html);
            response.end();
        }
    });
});

app.post('/post1', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Got Post Data');
});

var client = require('./client');

    //   *** VARIABLES PROPRES **
var clients = [],
    clientIndex = 0,
    obstacles = [],
    i;

const CANVAS_HEIGHT = 540,
      CANVAS_LENGTH = 1000,
      RADIUS = 20,
      SNAKE_LENGTH = 50;

var ID_CODE = 'ID',
    SNAKES_CODE = "SNAKES",
    OBSTACLES_CODE = "OBSTACLES";

function generateRandomSnake(number){
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

// WebSocket server
wsServer.on('connection', function(ws) {
    console.log('connection:');

	//wsServer.clients.forEach(function(x) {
	//	x.send('New client connected: id=' + wsServer.clients.indexOf(ws.client));
	//});

    ws.on('message', function(message) {
        if (message.indexOf('start') > -1 && message.split(',', 2)[1].length > 0) {
            var id = clientIndex++,
                genNO = 0,
                clientName = message.split(',', 2)[1],
                newClient = new client(id, clientName);
            newClient._snake = generateRandomSnake(id);
            if (testCollisions(newClient._snake)) {
                genNO++;
                if (genNO < 100) {
                    newClient._snake = generateRandomSnake(id);
                } else {
                    console.log('There is no more space for another client on the game board!');
                }
            }
            clients[id] = newClient;
            ws.id = id;
            try {
                ws.send(ID_CODE + '_' + JSON.stringify(id));
            } catch (e) {
                console.error(e);
            }
            console.log('New client: id=' + newClient._id + ', name=' + newClient._name);
        } else {
            var xey  = JSON.parse(message);
            console.log('New click : ' + xey + ' for client: ' + ws.id);
            if (xey !== null && xey.length > 1) {
                clients[ws.id]._click[0] = xey[0];
                clients[ws.id]._click[1] = xey[1]
                calculateVelocity(clients[ws.id]);
            }
            //console.log(xey);
        }
    });
    ws.on('error', function(message) {
        console.log('error ' + message);
        delete clients[ws.id];
    });
    ws.on('close', function(message) {
        console.log('close :' + message);
        delete clients[ws.id];
    });
});

function calculateVelocity(client) {
    var thrust = 5;

    var tx = client._click[0] - client._snake[0][0],
        ty = client._click[1] - client._snake[0][1],
        dist = Math.sqrt(tx * tx + ty * ty);

    client._velocity[0] = (tx / dist) * thrust;
    client._velocity[1] = (ty / dist) * thrust;
}

function testCollisionWithSelf(self) {
    var result = false;
    for ( i = 40 ; i < self._snake.length ; i++) {
        var dx = Math.abs(self._snake[0][0] - self._snake[i][0]),
            dy = Math.abs(self._snake[0][1] - self._snake[i][1]),
            distance = Math.sqrt(dx * dx + dy * dy);

        if (distance - RADIUS * 2 < -1) {
            result = true;
            console.log('SELF Collision!!!');
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
                     console.log('Collision!!!');
                 }
             });
         });
     }
     return result;
 }

 function testCollisionBetweenSnakeAndObstacles(movingClient) {
     var result = false;
     if (obstacles != null && movingClient._snake != null) {
         obstacles.forEach(function (oCircle) {
             movingClient._snake.forEach(function (mCircle) {
                 var dx = mCircle[0] - oCircle[0];
                 var dy = mCircle[1] - oCircle[1];
                 var distance = Math.sqrt(dx * dx + dy * dy);

                 if (distance < RADIUS * 2) {
                     obstacles.slice(obstacles.indexOf(oCircle), 1);
                     result = true;
                     console.log('Collision!!!');
                 }
             });
         });
     }
     return result;
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
                client.send(data);
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
            wsServer.broadcast(SNAKES_CODE + '_' + JSON.stringify(snakes));
        }
        if (obstacles.length > 0) {
            wsServer.broadcast(OBSTACLES_CODE + '_' + JSON.stringify(obstacles));
        }
    }
}, 1000 / 30);

setInterval(function(){
    obstacles = generateObstacles();
}, 10000);

function moveSnakes(){
    var snakes = [];
    if (clients.length > 0) {
        clients.forEach(function(curClient) {
            //console.log(curClient);
            if (curClient != null && curClient._snake.length > 0) {

                if (curClient._click.length !== 0) {
                    moveSnake(curClient._snake, curClient._velocity[0], curClient._velocity[1]);

                    if (testCollisions(curClient)) {
                        curClient._snake = generateRandomSnake(getRandomInt(clientIndex % 10, 10));
                        curClient._click = [];
                        curClient._velocity = [];
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
        if (testCollisionBetweenSnakeAndObstacles(movingClient, obstacles)) {
            result = true;

        }
        var clientSnake = client._snake;
        if (clientSnake[0][0] - RADIUS < 0 || clientSnake[0][1] - RADIUS < 0 ||
            clientSnake[0][0] + RADIUS > CANVAS_LENGTH || clientSnake[0][1] + RADIUS > CANVAS_HEIGHT) {
            result = true;
        }
    });
    return result;
}

function moveSnake(snake, velX, velY) {
    //console.log('moveSnake()');

    snake[0][0] += velX;
    snake[0][1] += velY;
    for (i = snake.length - 1 ; i > 0 ; i --) {
        snake[i][0] = snake[i - 1][0];
        snake[i][1] = snake[i - 1][1];
    }

    //if (Math.abs(snake[0][0] - ix) < 5 && Math.abs(snake [0][1] - iy) < 5) {
    //    client._click = [];
    //}
}

function generateObstacles(){
    var sqareObstacles = [];
    var xl,
        yh;
    for (xl = 0 ; xl <= 360 ; xl += 180 ) {
        for (yh = 200 ; yh <= 700 ; yh += 200) {
            var obstacle = [];
            obstacle.push(getRandomInt(yh, yh + 200 - RADIUS));
            obstacle.push(getRandomInt(xl, xl + 180 - RADIUS));
            obstacle.push(RADIUS); //width && height
            sqareObstacles.push(obstacle);
        }
    }
    return sqareObstacles;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}