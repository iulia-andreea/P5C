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
    i;

    //      --- WebSocket Functions ---
ws.onopen = function () {
    //console.log("Socket opened!");
    //addLog("Socket opened!");
    ws.send("start");
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
};

ws.onerror = function (event) {
    if( window.alert("ERROR occured!") ) {
        document.reload();
    }
};

function onMouseUp(event) {
    var point = [];
    point.push(event.point.x);
    point.push(event.point.y);
    ws.send(JSON.stringify(point));
}

function onFrame(event) {
    project.clear();

    if (rec_data.length === 0) return;
    rec_data.forEach(function (attr) { // iterare serpi
        for (i = 0; i < attr.length; i++) { // iterare segmente
            snake[i] = new Path.Circle({
                center: [attr[i][0], attr[i][1]],
                radius: 30
            });
            snake[i].fillColor = "turquoise";
        }

        var head = new Path.Circle({
            center: [attr[0][0], attr[0][1]],
            radius: 30
        });

        head.fillColor = "#24cc";
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

//function onMouseDrag(event) {
//    largeCircle.position = event.point;
//    console.log("Mouse dragged!!");
//}