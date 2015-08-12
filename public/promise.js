"use strict";

var Promise = require( "./../lib/promise.js" );


var api = {
    "deferred": function () {
        return new Promise;
    },
    "rejected": function ( reason ) {
        return new Promise().reject( reason );
    },
    "resolved": function () {
        return new Promise().resolve( value );
    }
};


var promiseModule = window.promise || {};

promiseModule.deferred = api.deferred;
promiseModule.rejected = api.rejected;
promiseModule.resolved = api.resolved;

window.promise = promiseModule;