"use strict";
var promise = require( "./adapter.js" );

var adapter = promise;
var resolved = adapter.resolved;
var rejected = adapter.rejected;
var deferred = adapter.deferred;

var f = resolved( {
    "then": function ( a ) {
        console.log( "eeee" );
        a( "sentinel" );
        console.log("-value de f");
        console.log( f );
    }
} );
console.log("1-value de f");
console.log( f );

resolved( "a" ).then( function () {
    //console.log( f.value );
    console.log( "--this handler" );
    console.log( f );
    return f;
} ).then( function ( v ) {
    console.log( v );
} );

console.log( " a--" + (f === void(0)) );