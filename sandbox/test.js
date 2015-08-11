"use strict";

var Promise = require( "../lib/promise.js" );

var p1 = new Promise();

var rejected = new Promise().reject( "ma raison" ),
    accepted = new Promise().accept( "ma valeur" ),
    deferred = new Promise();

rejected.then( undefined, function () {
    return "une valeur";
} ).then( function ( x ) {
    console.log( x );
} );

p1.resolve( rejected );

deferred.resolve( "une valeur" );