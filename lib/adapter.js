"use strict";

var Promise = require( "./promise.js" );

var promiseModule = window.promise || {};

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

promiseModule.deferred = exports.deferred;
promiseModule.resolved = exports.resolved;
promiseModule.rejected = exports.rejected;


module.exports = exports;

window.promise = promiseModule;