"use strict";

var Promise = require( "../lib/promisePrototype.js" );


console.log( typeof Promise );

var p1 = new Promise(),
    p2 = p1.then( function ( x ) {
        console.log( "p1 is a success with " + x );
    } );

p1.resolve( "x" )