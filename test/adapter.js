"use strict";

var Promise = require( "./../lib/promise.js" );



var exports = {
    "deferred": function () {
        var promise = new Promise();
        return {
            "promise": promise,
            "resolve": function ( x ) {
                promise.resolve( x );
                return this;
            },
            "reject": function ( reason ) {
                promise.reject( reason );
            }
        };
    },
    "resolved": function ( x ) {
        var promise = new Promise();
        promise.resolve( x );
        return promise;
    },
    "rejected": function ( reason ) {
        var promise = new Promise();
        promise.reject( reason );
        return promise;
    }
};



module.exports = exports;

