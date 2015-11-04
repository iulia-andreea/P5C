/**
 * Created by Iulia on 10/14/2015.
 */
function client (id, clientName) { // 'x' et 'y' sont les coordinees du centre de la tete du snake
    this._id = id;
    //console.log(this._id + "\t" + id);
    this._click = [];
    this._snake = [];
    this._name = clientName;
    this._velocity = [];
};

module.exports = client;