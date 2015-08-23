(function ( root ) {
    "use strict";

    var Promise = require( "./../lib/promise.js" );



    global.promise = function getPromise () {
        return new Promise();
    };

    if ( module ) {
        module.exports = getPromise;
    }


}( this ));