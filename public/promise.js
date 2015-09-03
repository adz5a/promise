(function () {
    "use strict";

    var Promise = require( "./../lib/promise.js" ),
        deferred = require( "./deferred.js" );

    function getPromise () {
        return new Promise();
    }


    if ( module ) {
        module.exports = {
            "promise": getPromise,
            "deferred": deferred
        }
    }


}());