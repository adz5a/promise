/**
 * Created by obiwankenobi on 11/08/2015.
 */

"use strict";

var then = require( "./func/then.js" ).then,
    resolve = require( "./func/resolve.js" ).resolve,
    accept = require( "./func/accept_reject.js" ).accept,
    reject = require( "./func/accept_reject.js" ).reject,
    Promise = require("./promiseConstructor.js" ).promiseConstructor;

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
    resolve( this, x );
    return this;
};

