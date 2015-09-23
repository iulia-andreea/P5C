/**
 * Created by Iulia on 9/23/2015.
 */
project.currentStyle = {
    fillColor: 'turquoise'
};

var targetX = -1,
    targetY = -1,
    velX, velY,
    thrust = 5,
    radius = 50;


var largeCircle = new Path.Circle({
    center: [400, 200],
    radius: radius
});

function onMouseUp(event) {
    console.log("Mouse up!!");
    targetX = event.point.x;
    targetY = event.point.y;

    //largeCircle.path = path;
    var tx = targetX - largeCircle.position.x,
        ty = targetY - largeCircle.position.y,
        dist = Math.sqrt(tx * tx + ty * ty);

    velX = (tx / dist) * thrust;
    velY = (ty / dist) * thrust;
}

function onFrame(event) {
    if (targetX > -1 && targetY > -1) {
        largeCircle.position.x += velX;
        largeCircle.position.y += velY;

        if( Math.abs(largeCircle.position.x - targetX) <= Math.abs(velX) &&
            Math.abs(largeCircle.position.y - targetY) <= Math.abs(velY) ) {
            targetX = -1; targetY = -1;
        }
    }
}


//function onMouseDrag(event) {
//    largeCircle.position = event.point;
//    console.log("Mouse dragged!!");
//}