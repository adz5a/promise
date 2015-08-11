/**
 * Created by obiwankenobi on 11/08/2015.
 */

"use strict";



/**
 *
 * @constructor
 */
function Promise () {
    this.state = VALID_STATES.PENDING;
    this.onResolvedHandler = unit;
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

