(function ( root ) {
    "use strict";

    var Promise = require( "./../lib/promise.js" );

    function getPromise () {
        return new Promise();
    }

    global.promise = getPromise;

    if ( module ) {
        module.exports = getPromise;
    }


}( this ));