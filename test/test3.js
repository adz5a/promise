"use strict";
console.log( "test" );
var promise = require( "../lib/promise.js" );

var d1 = promise.defer().resolve( "a" ),
    d2 = promise.defer().reject( "b" ),
    d3 = promise.defer().resolve( "c" );

var a  = promise.all( [d1, d2, d3] ).then( function ( d1, d2, d3 ) {
    console.log("eeeeeeeee");
    console.log( d1 );
    console.log( d2 );
    console.log( d3 );

} );
