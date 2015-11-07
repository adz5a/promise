// src/promise.js
"use strict";
var core = require( "./core.js" );

var promise = module.exports = exports = function ( o ) {
    return new core.FullPromise( o );
};

promise.all     = require( "./all.js" ) ;
promise.reject  = core.reject;
promise.resolve = core.resolve;