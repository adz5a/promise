(function () {
    "use strict";

    var p = require.resolve( "./../lib/promise.js" );
    if ( p ) delete require.cache[p];

    var promise = require( "./../lib/promise.js" );


    module.exports = {
        "deferred": function () {
            return promise();
        },
        "resolved": function ( value ) {
            return promise().resolve( value );
        },
        "rejected": function ( reason ) {
            return promise().reject( reason );
        }
    };
}());
