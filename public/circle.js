/**
 * Created by Iulia on 9/23/2015.
 */
project.currentStyle = {
    fillColor: 'turquoise'
};

var ws = new WebSocket('wss://localhost:8081');

ws.onopen = function () {
    console.log("Socket opened!");
};
ws.onmessage = function (event) {
    console.log(event.data);
};

var targetX = -1,
    targetY = -1,
    velX,
    velY,
    thrust = 5,
    radius = 30,
    //radiusEyes = 5
    startCenterX = 400,
    startCenterY = 200;
var snake = [];
//var snakeEyes = [];
var i;

for (i = 0; i < 50; i += 1) {
    snake.push(new Path.Circle({
        center: [startCenterX + i * thrust, startCenterY],
        radius: radius
    }));
}

//snakeEyes.push(new Path.Circle({
//    center: [startCenterX - 15, startCenterY - 15],
//    radius: radiusEyes
//    }));
//
//snakeEyes.push(new Path.Circle({
//    center: [startCenterX - 15, startCenterY + 15],
//    radius: radiusEyes
//}));
//
//snakeEyes[0].fillColor = "black";
//snakeEyes[1].fillColor = "black";

function onMouseUp(event) {
    "use strict";
    console.log("Mouse up!!");

    targetX = event.point.x;
    targetY = event.point.y;
    //if (ws.readyState !== 1) {
        ws.send("Click at: " + event.point);
    //}

    //largeCircle.path = path;
    var tx = targetX - snake[0].position.x,
        ty = targetY - snake[0].position.y,
        dist = Math.sqrt(tx * tx + ty * ty);

    velX = (tx / dist) * thrust;
    velY = (ty / dist) * thrust;
}

function onFrame(event) {
    "use strict";
    if (targetX >= 0 && targetY >= 0) {
        snake[0].position.x += velX;
        snake[0].position.y += velY;
        //snakeEyes[0].position.x += velX;
        //snakeEyes[0].position.y += velY;
        //snakeEyes[1].position.x += velX;
        //snakeEyes[1].position.y += velY;
        for (i = snake.length - 1 ; i > 0 ; i -= 1) {
            snake[i].position.x = snake[i-1].position.x;
            snake[i].position.y = snake[i-1].position.y;
        }
        if (Math.abs(snake[0].position.x - targetX) <= Math.abs(velX) &&
            Math.abs(snake[0].position.y - targetY) <= Math.abs(velY)) {
            targetX = -1;
            targetY = -1;
        }
    }
}

function sendMessage(){
    var message = document.getElementById('message').value;
    ws.send(message);
}

ws.addEventListener("message", function(event) {
    // The data is simply the message that we're sending back
    var msg = event.data;

    // Append the message
    document.getElementById('log_area').innerHTML += '<br>' + msg;
});

//function onMouseDrag(event) {
//    largeCircle.position = event.point;
//    console.log("Mouse dragged!!");
//}