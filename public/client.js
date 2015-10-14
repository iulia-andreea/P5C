/**
 * Created by Iulia on 10/14/2015.
 */
function client (id) { // 'x' et 'y' sont les coordinees du centre de la tete du snake
    this._id = id;
    //console.log(this._id + "\t" + id);
    this._click = null;
    this._snake = [];
};

module.exports = client;