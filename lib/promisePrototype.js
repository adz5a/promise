/**
 * Created by obiwankenobi on 11/08/2015.
 */

"use strict";

var then = require( "./func/then.js" ).then,
    resolve = require( "./func/resolve.js" ).resolve,
    accept = require( "./func/accept_reject.js" ).accept,
    reject = require( "./func/accept_reject.js" ).reject,
    Promise = require("./promiseConstructor.js" ).promiseConstructor;

/**
 *
 * @param onSuccess
 * @param onError
 * @returns {*}
 */
Promise.prototype.then = function ( onSuccess, onError ) {
    return then( this, onSuccess, onError );
};

/**
 *
 * @param reason
 * @returns {*}
 */
Promise.prototype.reject = function ( reason ) {
    return reject( this, reason );
};

/**
 *
 * @param value
 * @returns {*}
 */
Promise.prototype.accept = function ( value ) {
    return accept( this, value );
};

/**
 *
 * @param x
 * @returns {Promise}
 */
Promise.prototype.resolve = function ( x ) {
    resolve( this, x );
    return this;
};
