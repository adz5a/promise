"use strict";

var promise = window.promise;

var p1 = promise.deferred().promise,
    p2 = p1.then( function ( val ) {
        console.log( "ma valuer est dans le browser " + val );
    } );

setTimeout(function( ) {
    p1.resolve( "YOLO" );
}, 1000);