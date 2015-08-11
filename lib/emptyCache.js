"use strict";

var dep = require( "./dependencies.json" );

console.log( dep );

var keys = Object.keys( dep );
var key;
console.log( keys );

var i, l;

for ( i = 0, l = keys.length; i < l; i = i + 1 ) {
    key = keys[i];
    console.log( dep[key] );
    var path = require.resolve( dep[key] );
    if ( path ) {
        delete require.cache[path];
    }
}