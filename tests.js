/**
 * Created by Iulia on 10/14/2015.
 */

    //      ----    TEST CLIENT CLASS   ----
var client = require('./public/client');

var path = require('path');

var test = require('tape');

var RADIUS = 30;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function isInt(string) {
    return !isNaN(parseInt(string)) && isFinite(string);
}

test('Test 1 - Random Integer Generator', function(t) {
    t.plan(3);
    var min = 0,
        max = 10,
        randomInt = getRandomInt(min, max);
    t.ok(isInt(randomInt), '# ' + randomInt + ' is an integer!');
    t.ok(randomInt > min, '# ' + randomInt + ' < ' + min);
    t.ok(randomInt < max, '# ' + randomInt + ' > ' + max);
    console.log('\n');
    t.end();
});

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
var clientID1 = 12,
    clientID2 = 1,
    test_client1 = new client(clientID1, 'Name12'),
    test_client2 = new client(clientID2, 'Name1');
test_client1._snake = generateRandomSnake(test_client1._id);
test_client2._snake = generateRandomSnake(test_client2._id);

test('Test 2 - New Client', function(t) {
    t.plan(6); //how many test I am going to make
    //1
    t.ok(test_client1 != null, '# Object Client created!');
    //2
    t.ok(test_client1._id === clientID1 , '# His id is: ' + test_client1._id);
    //3
    t.ok(test_client1._name != null && test_client1._name.length > 0, '# His name seems ok : ' + test_client1._name);
    //4
    t.ok(test_client1._click != null, '# His click also seems ok : ' + test_client1._click);
    //5
    t.ok(test_client1._snake != null, '# His snake seems ok too ! ');
    //6
    t.ok(test_client1._snake.length === 50,'# Snake content : '+ test_client1._snake.length + ' cicles found!');
    console.log('\n');
    t.end();
});

test('Test 3 - Client Click Message Split', function(t) {
    t.plan(4); //how many test I am going to make
    var xey = '123,213'.split(',', 2);

    //1
    t.ok(xey !== null, '# Split worked : ' + xey);
    //2
    t.ok(xey.length === 2, '# Array has the right number of elements(' + xey.length + ')');
    //3
    t.ok(isInt(xey[0]), '# First element is OK : ' + xey[0] + ' is an Integer');
    //4
    t.ok(isInt(xey[0]), '# Second element is OK : ' + xey[1] + ' is an Integer');
    console.log('\n');
    t.end();
});

function testCollision(circle1, circle2) {
    var result = false,
        dx = circle1.x - circle2.x,
        dy = circle1.y - circle2.y,
        distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle1.radius + circle2.radius) {
        result = true;
    }
    return result;
}

test('Test 4 - Collisions between circles', function(t) {
    t.plan(3); //how many test I am going to make
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

    t.ok(testCollision(c1,c2) === false, '# No Collision! : ( c1 = [' + c1.x + ',' + c1.y + '] ; c2 = [' + c2.x + ',' + c2.y + '] )');
    t.ok(testCollision(c1,c3) === true, '# Collision! : ( c1 = [' + c1.x + ',' + c1.y + '] ; c3 = [' + c3.x + ',' + c3.y + '] )');
    t.ok(testCollision(c2,c3) === true , '# Collision! : ( c2 = [' + c2.x + ',' + c2.y + '] ; c3 = [' + c3.x + ',' + c3.y + '] )');
    console.log('\n');
    t.end();
});

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
                    //console.log('Collision!!!');
                }
            });
        });
    }
    return result;
}

test('Test 5 - Clients collisions before movement', function(t) {
    t.plan(1); //how many test I am going to make
    var result = testCollisionBetweenSnakes(test_client1, test_client2);
    if( result === true ){
        t.ok(result === true, '# COLLISION!');
    } else {
        t.ok(result === false, '# NO COLLISION!');
    }
    console.log('\n');
    t.end();
});

function moveSnake(client, snake, ix, iy) {
    //console.log('moveSnake()');
    var velX,
        velY,
        thrust = 5;

    var tx = ix - snake[0][0],
        ty = iy - snake[0][1],
        dist = Math.sqrt(tx * tx + ty * ty),
        i;

    velX = (tx / dist) * thrust;
    velY = (ty / dist) * thrust;

    snake[0][0] += velX;
    snake[0][1] += velY;
    for (i = snake.length - 1 ; i > 0 ; i --) {
        snake[i][0] = snake[i - 1][0];
        snake[i][1] = snake[i - 1][1];
    }

    if (Math.abs(snake[0][0] - ix) < 5 && Math.abs(snake [0][1] - iy) < 5) {
        client._click = [];
    }
}

test('Test 6 - Clients collisions after movement', function(t) {
    t.plan(2);
    test_client1._click = test_client2._snake[40];
    t.ok(test_client1._click != null , '# Moving ' + test_client1._name + ' to :' + test_client1._click);
    while (test_client1._click.length > 0) {
        moveSnake(test_client1, test_client1._snake, test_client2._snake[40][0], test_client2._snake[40][1]);
    }
    var result = testCollisionBetweenSnakes(test_client1, test_client2);
    if( result === true ){
        t.ok(result === true, '# COLLISION!');
    } else {
        t.ok(result === false, '# NO COLLISION!');
    }
    console.log('\n');
    t.end();
});

function testCollisionWithSelf(self) {
    var result = false;
    for ( i = 40 ; i < self._snake.length ; i++) {
        var dx = Math.abs(self._snake[0][0] - self._snake[i][0]),
            dy = Math.abs(self._snake[0][1] - self._snake[i][1]),
            distance = Math.sqrt(dx * dx + dy * dy);

        if (distance - RADIUS * 2 < -1) {
            result = true;
            //console.log('SELF Collision!!!');
        }
    }
    return result;
}

test('Test 7 - Client Self Collision ', function(t) {
    t.plan(3);
    var result = testCollisionWithSelf(test_client1);
    if( result === true ){
        t.ok(result === true, '# COLLISION!');
    } else {
        t.ok(result === false, '# NO COLLISION!');
    }
    test_client1._click = test_client1._snake[49];
    t.ok(test_client1._click != null , '# Moving ' + test_client1._name + ' to :' + test_client1._click + '(his tail)');
    while (test_client1._click.length > 0) {
        moveSnake(test_client1, test_client1._snake, test_client1._snake[49][0], test_client1._snake[49][1]);
    }
    result = testCollisionWithSelf(test_client1);
    if( result === true ){
        t.ok(result === true, '# COLLISION!');
    } else {
        t.ok(result === false, '# NO COLLISION!');
    }
    console.log('\n');
    t.end();
});

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

test('Test 8 - Generating obstacles', function(t) {
    t.plan(1); //how many test I am going to make
    var sqares = generateObstacles();
    t.ok(sqares.length === 9, 'Obstacles were generated with success : ' + sqares);
    t.end();
});

function testCollisionWithObstacle(circle, obstacle) { //obstacle {x, y, length}
    var cX = Math.abs(circle[0] - obstacle[0]),
        cY = Math.abs(circle[1] - obstacle[1]);

    if (cX > (obstacle[2] / 2 + RADIUS)) { return false; }
    if (cY > (obstacle[2] / 2 + RADIUS)) { return false; }

    if (cX <= (obstacle[2] / 2)) { return true; }
    if (cY <= (obstacle[2] / 2)) { return true; }

    var cornerDistance_sq = Math.pow(cX - obstacle[2] / 2, 2) +
        Math.pow(cY - obstacle[2] / 2, 2);

    return (cornerDistance_sq <= Math.pow(RADIUS, 2));
}

test('Test 9 - Verifing collision between a circle and obstacles', function(t) {
    t.plan(1); //how many test I am going to make
    var sqare = [140, 50, 60];
    var circle = [190, 100, 30];
    t.ok(testCollisionWithObstacle(circle, sqare), 'Collision between : \n- ' + sqare + '\n and \n' + circle);
    t.end();
});