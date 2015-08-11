/**
 * Created by obiwankenobi on 11/08/2015.
 */

"use strict";

var VALID_STATES = {
    "PENDING": "__PENDING__",
    "ACCEPTED": "__ACCEPTED__",
    "REJECTED": "__REJECTED__"
};

function unit ( val ) {
    return val;
}

function compose ( f, g ) { //return g o f with a maybe pattern
    return function ( val ) {
        var a = f.call( undefined, val );
        if ( typeof a === "undefined" ) {
            a = val;
        }
        return g.call( undefined, a );
    };
}

/**
 *
 * @param {function} handler
 * @param {function} callback
 * @returns {Promise}
 */
function executeHandlers ( handler, callback ) {

    if ( typeof callback !== "function" ) {
        callback = unit;
    }

    handler = compose( handler, callback );
    handler();

}

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
 * @param {function} onSuccess
 * @param {function} onError
 */
function then ( promise, onSuccess, onError ) {
    var returnedPromise = new Promise(),
        wasError = false;

    if ( typeof onSuccess !== "function" ) {
        onSuccess = unit;
    }

    if ( typeof onError !== "function" ) {
        onError = unit;
    }

    if ( typeof onError !== "function" ) {
    }

    var asyncResolution = runAsync(
        function ( value ) { //initial call

            var handler = unit;
            if ( promise.state === VALID_STATES.ACCEPTED ) {
                handler = onSuccess;
            } else {
                handler = onError;
            }

            var newValue = handler( value );

            return (typeof newValue === "undefined" ? value : newValue);

        }, function ( err ) {//errorFallback

            wasError = true;
            returnedPromise.reject( err );

        }, function ( value ) { //complete

            if ( wasError === false ) {
                returnedPromise.resolve( value );
            }

        }
    );

    promise.onResolvedHandler = compose( promise.onResolvedHandler, function () {

        asyncResolution.execute( promise.value );

    } );

    if ( promise.state !== VALID_STATES.ACCEPTED ) {
        executeHandlers( promise.onResolvedHandler, function () {
            promise.onResolvedHandler = unit;
        } );
    }

    return returnedPromise;
}

/**
 *
 * @param {Promise} promise
 * @param reason
 */
function reject ( promise, reason ) {

    if ( promise.state === VALID_STATES.PENDING ) {
        promise.state = VALID_STATES.REJECTED;

    }

    return promise;
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

    var _privateHandler = function ( value ) {
        try {
            if ( typeof handler === "function" ) {
                val = handler.call( undefined, value );
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
    };

    return {
        "execute": function ( initValue ) {
            setTimeout( function ( handler ) {
                return function () {
                    handler.call( undefined, initValue );
                };
            }( _privateHandler ), 0 );
            _privateHandler = null;
        }
    }
}

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

