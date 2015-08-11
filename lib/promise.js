/**
 * Created by obiwankenobi on 11/08/2015.
 */

"use strict";

var VALID_STATES = {
    "PENDING": "__PENDING__",
    "ACCEPTED": "__ACCEPTED__",
    "REJECTED": "__REJECTED__"
};

/**
 *
 * @param {Promise} promise
 * @param x
 * @returns {boolean}
 */
function resolvePromise ( promise, x ) {
    var wasResolved = false;

    return wasResolved;
}

/**
 *
 * @param {Promise} promise
 * @param onSuccess
 * @param onError
 */
function then ( promise, onSuccess, onError ) {
}

/**
 *
 * @param {Promise} promise
 * @param reason
 */
function reject ( promise, reason ) {
}

/**
 *
 * @param {Promise} promise
 * @param value
 */
function accept ( promise, value ) {
}

/**
 *
 * @param {Function} handler
 * @param {Function=} fallback
 * @param {Function=} complete
 */
function runAsync ( handler, fallback, complete ) {
    var val;
    setTimeout(function () {
        try {
            if ( typeof handler === "function" ) {
                val = handler.call( undefined );
            }
        } catch ( err ) {
            if ( typeof fallback === "function" ) {
                fallback.call( undefined, err );
            }
        } finally {
            if ( typeof complete === "function" ) {
                complete.call( undefined, val );
            }
        }
    }, 0);
}

function Promise () {
    this.state = VALID_STATES.PENDING;
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

