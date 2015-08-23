(function ( root ) {
    "use strict";

    var Promise = require( "./../lib/promise.js" );

    var defer = root.defer || {};

    defer.promise = function () {
        return new Promise();
    };

    if ( module ) {
        module.exports = defer;
    }


}( this ));