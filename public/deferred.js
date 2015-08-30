(function () {
    "use strict";
    var Promise = require( "./../lib/promise.js" );
    var utils = require( "utils" );

    function wrapThen ( promise ) {

        var wrappedThen = utils.curry( function ( promise, a, b ) {
            return wrapThen( promise.then( a, b ) );
        }, promise );

        return {
            "then": wrappedThen
        }
    }

    function deferred () {
        var promise = new Promise();


        return {
            "deferred": wrapThen( promise ),
            "always": function ( callback ) {


                return wrapThen( promise.then( function ( value ) {
                    callback.call( undefined, null, value );
                }, function ( err ) {
                    callback.call( undefined, err, null );
                } ) );
            },
            "promise":promise
        };
    }

    module.exports = deferred;
} ());
