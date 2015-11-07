"use strict";

var core = require( "./core.js" );

function addValueToStack ( promise, stack ) {
    return function ( value ) {
        return promise.then( function () {
            stack.push( value );
        } );
    };
}

module.exports = exports = function () {
    /*
     * promise = require("./promise")
     */
    return function ( promises ) {
        /*
         * promises = [promise]
         */
        var p       = new core.FullPromise().resolve( {} );
        var promise = new core.FullPromise();
        var stack   = [];
        var i, l;
        for ( i = 0, l = promises.length; i < l; i = i + 1 ) {
            p = p
                .then( addValueToStack( promises[i], stack ) )
                .fail( function ( err ) {
                    promise.reject( err );
                } );
        }
        return promise.then();
    };
};

