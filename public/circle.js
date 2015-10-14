/**
 * Created by Iulia on 9/23/2015.
 */
project.currentStyle = {
    fillColor: 'turquoise'
};

var ws = new WebSocket('wss://localhost:8081'),
    clientID;


var snake = [],
    rec_data = [],
    snakeMap = [],
    i;

    //      --- WebSocket Functions ---
ws.onopen = function () {
    //console.log("Socket opened!");
    //addLog("Socket opened!");
    ws.send("start");
};

ws.onmessage = function (event) {
    console.log(event.data);
    //addLog(event.data);

    if(isInt(event.data)) {
        clientID = parseInt(event.data);
        addLog("ClientID = " + clientID);
    } else {
        rec_data =  JSON.parse(event.data);
    }
};


function onMouseUp(event) {
    ws.send(event.point.x + "," + event.point.y);
}


function onFrame(event) {
    project.clear();
    var x,
        y;
    if (rec_data.length <= 0) return;
    rec_data.forEach(function (attr) {
        for (i = 0; i < x.length; i++) {
            x = attr[i][0];
            y = attr[i][1];
            snake[i] = new Path.Circle({
                center: [x, y],
                radius: 30
            });
            snake[i].fillColor = "turquoise";
        }
    });
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


function addLog(text) {
    var obj = document.getElementById("log_area");
    var txt = document.createTextNode("\n" + text);
    obj.appendChild(txt);
}

function isInt(string) {
    return !isNaN(parseInt(string)) && isFinite(string);
}

//function onMouseDrag(event) {
//    largeCircle.position = event.point;
//    console.log("Mouse dragged!!");
//}