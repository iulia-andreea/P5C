/**
 * Created by Iulia on 9/23/2015.
 */

project.currentStyle = {
    fillColor: 'turquoise'
};

document.getElementById("canvas").style.width=window.innerWidth * 70 / 100;

var ws = new WebSocket('wss://localhost:8081'),
    clientID = -1;

var snake = [],
    rec_data = [],
    i,
    RADIUS = 20,
    isConnected = false,
    CANVAS_HEIGHT = 545,
    CANVAS_LENGTH = 1000;

    //      --- WebSocket Functions ---
ws.onopen = function () {
    //console.log("Socket opened!");
    //addLog("Socket opened!");
    isConnected = true;
    var start_button = document.getElementById("start_btn");
    start_button.addEventListener("click", startGame);
};

ws.onmessage = function (event) {
    //console.log(event.data);
    //addLog(event.data);

    if(isInt(parseInt(event.data))) {
        clientID = parseInt(event.data);
        addLog("ClientID = " + clientID);
    } else {
        //addLog(event.data);
        rec_data =  JSON.parse(event.data);
    }
};

ws.onclose = function (event) {
    if (window.alert("Connection LOST!")) {
        document.reload();
    }
    isConnected = false;
};

ws.onerror = function (event) {
    if( window.alert("ERROR occured!") ) {
        document.reload();
    }
    isConnected = false;
};

function onMouseUp(event) {
    var x = event.point.x,
        y = event.point.y;

    if (x - RADIUS < 0) x = RADIUS;
    if (y - RADIUS < 0) y = RADIUS;
    if (x + RADIUS > CANVAS_LENGTH) x = CANVAS_LENGTH - RADIUS;
    if (y + RADIUS > CANVAS_HEIGHT) y = CANVAS_HEIGHT - RADIUS;

    if (clientID != -1) {
        var point = [];
        point.push(x);
        point.push(y);
        ws.send(JSON.stringify(point));
    }
}

function onFrame(event) {
    project.clear();
    var j = 0;

    if (rec_data.length === 0) return;
    rec_data.forEach(function (attr) { // iterare serpi
        for (i = 0; i < attr.length; i++) { // iterare segmente
            snake[i] = new Path.Circle({
                center: [attr[i][0], attr[i][1]],
                radius: RADIUS
            });
            snake[i].fillColor = "#4DFF4D";
        }

        var head = new Path.Circle({
            center: [attr[0][0], attr[0][1]],
            radius: RADIUS
        });
        head.fillColor = "#99FF99";


        if (j === clientID) {
            var clientIndicator = new Path.Circle({
                center: [attr[0][0], attr[0][1]],
                radius: 5
            });
            clientIndicator.fillColor = "#0000";
        }

        j++;
    });
}

function addLog(text) {
    var obj = document.getElementById("log_area");
    var txt = document.createTextNode("\n" + text);
    obj.appendChild(txt);
}

function isInt(string) {
    return !isNaN(parseInt(string)) && isFinite(string);
}

function startGame(){
    var username = document.getElementById("user");
    if (username.value.length > 0) {
        ws.send("start," + username.value);

        username.disabled = true;
        document.getElementById("start_btn").style.display = "none";
    }
}

//function onMouseDrag(event) {
//    largeCircle.position = event.point;
//    console.log("Mouse dragged!!");
//}