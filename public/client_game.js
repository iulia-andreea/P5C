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
    i,
    RADIUS = 20,
    isConnected = false;

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
    var point = [];
    point.push(event.point.x);
    point.push(event.point.y);
    ws.send(JSON.stringify(point));
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
        ws.send("start");

        username.disabled = true;
        document.getElementById("start_btn").style.display = "none";
    }
}

//function onMouseDrag(event) {
//    largeCircle.position = event.point;
//    console.log("Mouse dragged!!");
//}