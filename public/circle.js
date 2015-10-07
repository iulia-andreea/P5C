/**
 * Created by Iulia on 9/23/2015.
 */
project.currentStyle = {
    fillColor: 'turquoise'
};

var ws = new WebSocket('wss://localhost:8081');
var snake = [];
var snakeMap = [];
var i;

function init(){
    snake.push(new Path.Circle());
    snakeMap[0] = [];
}

ws.onopen = function () {
    //console.log("Socket opened!");
    addLog("Socket opened!");
    ws.send("Start!");
};
ws.onmessage = function (event) {
    console.log(event.data);
    snakeMap =  JSON.parse(event.data);
};

function onMouseUp(event) {
    ws.send([event.point.x, event.point.y]);
//    "use strict";
//    addLog("Mouse up at: " + event.point + " !!!");

    //targetX = event.point.x;
    //targetY = event.point.y;
    //if (ws.readyState !== 1) {
    //    ws.send(event.point);
    //}
    //
    //var tx = targetX - snake[0].position.x,
    //    ty = targetY - snake[0].position.y,
    //    dist = Math.sqrt(tx * tx + ty * ty);
    //
    //velX = (tx / dist) * thrust;
    //velY = (ty / dist) * thrust;
}
//
function onFrame(event) {
    var xey;
    for(i = 0 ; i < snakeMap.length ; i++) {
        xey = snakeMap[i];
        snake[i] = new Path.Circle({
            center : [xey[0], xey[1]],
            radius : 30
        });
        snake[i].fillColor = "turquoise";
    }

    //addLog("Head at : {" + snakeMap[0][0] + ", " + snakeMap[0][1] + "} ");

//    if (targetX >= 0 && targetY >= 0) {
//        snake[0].position.x += velX;
//        snake[0].position.y += velY;
//        //snakeEyes[0].position.x += velX;
//        //snakeEyes[0].position.y += velY;
//        //snakeEyes[1].position.x += velX;
//        //snakeEyes[1].position.y += velY;
//        for (i = snake.length - 1 ; i > 0 ; i -= 1) {
//            snake[i].position.x = snake[i-1].position.x;
//            snake[i].position.y = snake[i-1].position.y;
//        }
//        if (Math.abs(snake[0].position.x - targetX) <= Math.abs(velX) &&
//            Math.abs(snake[0].position.y - targetY) <= Math.abs(velY)) {
//            targetX = -1;
//            targetY = -1;
//        }
//    }
}

function addLog(text) {
    var obj = document.getElementById("log_area");
    var txt = document.createTextNode("\n" + text);
    obj.appendChild(txt);
}

function update(){
    project.clear();
}

//function onMouseDrag(event) {
//    largeCircle.position = event.point;
//    console.log("Mouse dragged!!");
//}