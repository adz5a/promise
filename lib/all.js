"use strict";

var promise = require( "./promise.js" );


module.exports = exports = function ( promises ) {

    var p     = promise().resolve( [] ).then();
    var stack = [];
    var i, l;
    for ( i = 0, l = promises.length; i < l; i = i + 1 ) {
        p = p.then( function ( promise ) {
            return function () {
                return promise.then( function ( v ) {
                    return stack.push( { "value": v, "error": "no" } );
                }, function ( err ) {
                    return stack.push( { "error": err, "value": "no" } );
                } );
            };
        }( promises[i] ) );
    }

    return {
        "then": function ( handler ) {

            return p.then().then( function () {
                return handler.apply( void(0), stack );
            } );
        }
    };
};


