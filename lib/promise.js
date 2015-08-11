/**
 * Created by obiwankenobi on 11/08/2015.
 */

"use strict";

var VALID_STATES = {
    "PENDING": "__PENDING__",
    "ACCEPTED": "__ACCEPTED__",
    "REJECTED": "__REJECTED__"
};

function resolvePromise ( promise, x ) {
    var wasResolved = false;

    return wasResolved;
}

function then ( promise, onSuccess, onError ) {
}

function reject ( promise, reason ) {
}

function accept ( promise, value ) {
}

function runAsync(handler, fallback, complete) {
    try {} catch (err) {} finally {}
}

function Promise () {}

Promise.prototype.then = function ( onSuccess, onError ) {

    return then( this, onSuccess, onError );
};

Promise.prototype.reject = function ( reason ) {

    return reject( this, reason );
};

Promise.prototype.accept = function ( value ) {

    return accept( this, value );
};

Promise.prototype.resolve = function (x) {
    resolvePromise(this, x);
    return this;
};

