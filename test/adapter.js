(function () {
    "use strict";

    var p = require.resolve( "./../lib/promisePrototype.js" );
    if ( p ) delete require.cache[p];

    var promise = require( "./../lib/promisePrototype.js" );


    module.exports = {
        "deferred": function () {
            return promise.defer();
        },
        "resolved": function ( value ) {
            return promise.defer().resolve( value );
        },
        "rejected": function ( reason ) {
            return promise.defer().reject( reason );
        }
    };
}());
