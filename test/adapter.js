(function () {
    "use strict";

    var p = require.resolve( "./../src/core.js" );
    if ( p ) delete require.cache[p];

    var promise = require( "../src/promise.js" );

    module.exports = {
        "deferred": function () {
            var p = promise();

            p.promise = p;

            return p;
        },
        "resolved": function ( value ) {
            return promise().resolve( value );
        },
        "rejected": function ( reason ) {
            return promise().reject( reason );
        }
    };
}());
