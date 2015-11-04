/**
 * Created by Iulia on 9/23/2015.
 */

document.getElementById('canvas').style.width=window.innerWidth * 70 / 100;

var ID_CODE = 'ID',
    SNAKES_CODE = 'SNAKES',
    OBSTACLES_CODE = 'OBSTACLES';

var ws = new WebSocket('wss://localhost:8081'),
    clientID = -1;

var snake = [],
    obstacle = [],
    recSnakes = [],
    recObst = [],
    i,
    RADIUS = 20,
    isConnected = false,
    CANVAS_HEIGHT = 540,
    CANVAS_LENGTH = 1000;

function addLog(text) {
    var obj = document.getElementById('log_area'),
        txt = document.createTextNode('\n' + text);
    obj.appendChild(txt);
}

function isInt(string) {
    return !isNaN(parseInt(string)) && isFinite(string);
}

function startGame(){
    var username = document.getElementById('user');
    if (username.value.length > 0) {
        ws.send('start,' + username.value);

        username.disabled = true;
        document.getElementById('start_btn').style.display = 'none';
    }
}

    //      --- WebSocket Functions ---
ws.onopen = function () {
    //console.log('Socket opened!');
    //addLog('Socket opened!');
    isConnected = true;
    var start_button = document.getElementById('start_btn');
    start_button.addEventListener('click', startGame);
};

ws.onmessage = function (event) {
    //console.log(event.data);
    //addLog(event.data);
    var splittedData = event.data.split('_', 2);
    switch (splittedData[0]) {
        case ID_CODE:
            if(isInt(parseInt(splittedData[1]))) {
                clientID = parseInt(splittedData[1]);
                addLog('ClientID = ' + clientID);
            }
            break;
        case SNAKES_CODE:
            recSnakes = JSON.parse(splittedData[1]);
            break;
        case OBSTACLES_CODE:
            addLog("Obstacles received!")
            recObst = JSON.parse(splittedData[1]);
            break;
    }
};

ws.onclose = function () {
    if (window.alert('Connection LOST!')) {
        document.reload();
    }
    isConnected = false;
};

ws.onerror = function (event) {
    if( window.alert('ERROR occured!') ) {
        document.reload();
    }
    isConnected = false;
};

function onMouseUp(event) {
    var x = event.point.x,
        y = event.point.y;

    if (clientID !== -1) {
        var point = [];
        point.push(x);
        point.push(y);
        ws.send(JSON.stringify(point));
    }
}

function onFrame(event) {
    project.clear();
    var j = 0;

    if (recSnakes.length === 0) return;
    recSnakes.forEach(function (attr) { // iterare serpi
        for (i = 0; i < attr.length; i++) { // iterare segmente
            snake[i] = new Path.Circle({
                center: [attr[i][0], attr[i][1]],
                radius: RADIUS
            });
            snake[i].fillColor = '#4DFF4D';
        }

        var head = new Path.Circle({
            center: [attr[0][0], attr[0][1]],
            radius: RADIUS
        });
        head.fillColor = '#99FF99';


        if (j === clientID) {
            var clientIndicator = new Path.Circle({
                center: [attr[0][0], attr[0][1]],
                radius: 5
            });
            clientIndicator.fillColor = '#0000';
        }

        j++;
    });

    recObst.forEach(function(obstacle){
        obstacle = new Path.Circle({
            center: [obstacle[0],  obstacle[1]],
            radius:  obstacle[2],
        });
        obstacle.fillColor = '#0000';
    });
}

//function onMouseDrag(event) {
//    largeCircle.position = event.point;
//    console.log('Mouse dragged!!');
//}