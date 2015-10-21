/**
 * Created by Iulia on 10/14/2015.
 */

    //      ----    TEST CLIENT CLASS   ----
var client = require("./client");

var test_client = new client(1);
test_client._snake = generateRandomSnake(test_client._id);
console.log(test_client);

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


console.log("isInt(345) = " + isInt("345"));
console.log("isInt(3dsa) = " + isInt("3dsa"));

function isInt(string) {
    return !isNaN(parseInt(string)) && isFinite(string);
}

//      --- TEST SPLIT ---

var xey = "123,213".split(",", 2);
console.log(xey);
