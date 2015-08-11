/**
 * Created by obiwankenobi on 11/08/2015.
 */
"use strict";

/**
 *
 * @param {function} handler
 * @param {function} callback
 * @returns {*}
 */
function executeHandlers ( handler, callback ) {

    if ( typeof callback !== "function" ) {
        callback = unit;
    }

    var a = compose( handler, callback );
    return a();

}

function unit ( x ) {
    return x;
}


/**
 *
 * @param {function} f
 * @param {function} g
 * @returns {function}
 */
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



module.exports = {
    "runAsync": runAsync,
    "executeHandlers": executeHandlers,
    "compose": compose,
    "unit": unit
};