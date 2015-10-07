/**
 * Created by Iulia on 10/7/2015.
 */
var method = Snake.prototype;
const RADIUS = 30, LENGTH = 50, THRUST = 5;

function Snake() {
    this._form = [];
}

function Snake(x, y) { // 'x' et 'y' sont les coordinees du centre de la tete du snake
    this._form = [];
    var i;
    for (i = 0; i < LENGTH; i++) {
        this._form.push(new Path.Circle({
            center: [x + i * THRUST, y],
            radius: RADIUS
        }));
    }
}

method.getForm = function() {
    return this._form;
};

method.setForm = function(form) {
    this._form = form;
}

Snake.prototype.move = function(x, y) {
    //todo shit here
    //if (Math.abs(this._form[0].position.x - x) <= Math.abs(velX) &&
    //    Math.abs(this._form[0].position.y - y) <= Math.abs(velY)) {
    //    return null;
    //}
    var i;
    if (x >= 0 && y >= 0) {
        this._form[0].position.x += velX;
        this._form[0].position.y += velY;
        for (i = this._form.length - 1 ; i > 0 ; i -= 1) {
            this._form[i].position.x = this._form[i-1].position.x;
            this._form[i].position.y = this._form[i-1].position.y;
        }
    }
};
module.exports = Snake;