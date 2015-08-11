"use strict";

var Promise = require( "../lib/promise.js" );

var p1 = new Promise();

var rejected = new Promise().reject( "ma raison" ),
    accepted = new Promise().accept( "ma valeur" ),
    deferred = new Promise();


deferred.then( function ( x ) {
    console.log( x );
} );
console.log( "a" );
rejected.then( null, function ( err ) {
    console.log( err );
} );

