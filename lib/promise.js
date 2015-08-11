/**
 * Created by obiwankenobi on 11/08/2015.
 */

"use strict";

var then = require("./then.js" ),
    reject = require("./reject.js" ),
    resolve = require("./resolve.js" ),
    accept = require("./accept.js" ),
    VALID_STATES = require("./VALID_STATES.js" ),
    utils = require("./utils/utils.js");


/**
 *
 * @constructor
 */
function Promise () {
    this.state = VALID_STATES.PENDING;
    this.onResolvedHandler = utils.unit;
    this.value = undefined;
}

Promise.prototype.then = function ( onSuccess, onError ) {
    return then( this, onSuccess, onError );
};

Promise.prototype.reject = function ( reason ) {
    return reject( this, reason );
};

Promise.prototype.accept = function ( value ) {
    return accept( this, value );
};

Promise.prototype.resolve = function ( x ) {
    resolvePromise( this, x );
    return this;
};


var p = new Promise ();
