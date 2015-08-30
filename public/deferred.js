(function () {
    "use strict";
    var Promise = require( "./../lib/promise.js" );
    var utils = require( "utils" );

    function wrapThen ( promise ) {
        return function ( a, b ) {
            return deferred( promise.then( a, b ) ).deferred;
        };
    }

    function deferred ( promise ) {
        var promise = (typeof promise === "undefined" ? new Promise : promise);

        var deferred = {
            "then": wrapThen( promise ),
            "always": function () {
                return wrapThen( promise.then( function ( value ) {
                    callback.call( undefined, null, value );
                }, function ( err ) {
                    callback.call( undefined, err, null );
                } ) );
            }
        };

        return {
            "deferred": deferred,
            "promise": promise
        };
    }

    module.exports = deferred;
}());
