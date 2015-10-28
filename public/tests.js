/**
 * Created by Iulia on 10/14/2015.
 */

    //      ----    TEST CLIENT CLASS   ----
var client = require("./client");

var path = require("path");

var test_client = new client(1);
test_client._snake = generateRandomSnake(test_client._id);
//console.log(test_client);

function generateRandomSnake(number) {
    var serpent = [],
        xS,
        yS,
        i;

    switch (number % 4){
        case 0: // 1st corner = UP - LEFT
            xS = number * Math.random();
            yS = number * Math.random();
            break;
        case 1: // 2nd corner = UP - RIGHT
            xS = 1325 - number * Math.random();
            yS = number * Math.random();
            break;
        case 2: // 3rd corner = DOWN - RIGHT
            xS = 1325 - number * Math.random();
            yS = 545 - number * Math.random();
            break;
        case 3: // 4th corner = DOWN - LEFT
            xS = number * Math.random();
            yS = 545 - number * Math.random();
            break;
    }

    for (i = 0; i < 50; i ++) {
        var si = [];
        if( (xS + 30) > 1325 ) {
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

//  --- TEST IDS ---


//console.log("isInt(345) = " + isInt("345"));
//console.log("isInt(3dsa) = " + isInt("3dsa"));

function isInt(string) {
    return !isNaN(parseInt(string)) && isFinite(string);
}

//      --- TEST SPLIT ---

var xey = "123,213".split(",", 2);
//console.log(xey);

//      ----- TESTING COLLISIONS ----
function testCollision(circle1, circle2) {
    var result = false;

    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle1.radius + circle2.radius) {
        result = true;
    }
    return result;
}

var c1 = new Object({
    x : 25,
    y : 25,
    radius: 30
    }),
    c2 = new Object({
        x : 25,
        y : 85,
        radius: 30
    }),
    c3 = new Object({
        x : 25,
        y : 84,
        radius: 30
    });

console.log("Collision : " + testCollision(c1, c2));
console.log("Collision : " + testCollision(c1, c3));


//      ----- TESTING SELF COLLISIONS ----
var self = generateSimpleCatterpillar(),
    velocity = 7,
    RADIUS = 30;

function testCollisionWithSelf(self) {
    var result = false;
    for ( i = 2 ; i < self.length ; i++) {
        var dx = Math.abs(self[0][0] - self[i][0]),
            dy = Math.abs(self[0][1] - self[i][1]),
            distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < RADIUS * 2) {
            result = true;
            console.log("SELF Collision!!!");
        }
    }
    return result;
}

function moveSnake(self, random) {
    switch (random % 4) {
        case 0 : //UP y--
            move(self, 0, -1);
            break;
        case 1 : //DOWN y++
            move(self, 0, 1);
            break;
        case 3 : //RIGHT x++
            move(self, 1, 0);
            break;
        default : //LEFT x--
            move(self, -1, 0);
            break;
    }
}

function move(self, velX, velY) {
    for (i = 0 ; i < self.length ; i++) {
        if(i == 0){
            self[i][0] += velocity * velX;
            self[i][1] += velocity * velY;
            testCollisionWithSelf(self);
        } else {
            self[i][0] = self[i-1][0];
            self[i][1] = self[i-1][1];
        }
    }
}

function generateSimpleCatterpillar(){
    var catterPil = [];
    var x = getRandomInt(0, 200),
        y = getRandomInt(0, 200),
        point = [];
    for (i = 0 ; i < 7 ; i++) {
        point.push(x += (RADIUS - 2));
        point.push(y += (RADIUS - 2));
        catterPil.push(point);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
while (1) {
    var random = getRandomInt(0, 500);
    for (i = 0 ; i < 3 ; i ++) {
        moveSnake(self, random);
    }
}


