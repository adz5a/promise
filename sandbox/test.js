"use strict";

var Promise = require( "../lib/promise.js" );

var p1 = new Promise();

var rejected = new Promise().reject( "ma raison" ),
    accepted = new Promise().accept( "ma valeur" ),
    deferred = new Promise();


var p2 = accepted.then( function () {
    return undefined;
} );

p2.then( function ( value ) {
    console.log( value );
} );

