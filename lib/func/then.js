/**
 * Created by obiwankenobi on 11/08/2015.
 */
/**
 *
 * @param {Promise} promise
 * @param {function} onSuccess
 * @param {function} onError
 */


var utils = require( "../utils/utils.js" ),
    unit = utils.unit,
    compose = utils.compose,
    runAsync = utils.runAsync,
    executeHandlers = utils.executeHandlers,
    VALID_STATES = require( "../VALID_STATES.js" ),
    Promise = require( "../promiseConstructor.js" ).promiseConstructor;


function then ( promise, onSuccess, onError ) {

    var returnedPromise = new Promise(),
        wasError = false;

    if ( typeof onSuccess !== "function" ) {
        onSuccess = false;
    }

    if ( typeof onError !== "function" ) {
        onError = false;
    }


    var asyncResolution = runAsync(
        function ( value ) { //initial call

            var handler = unit;
            if ( promise.state === VALID_STATES.ACCEPTED ) {
                handler = onSuccess;
            } else {
                handler = onError;
            }

            if ( !handler ) {

                if ( promise.state === VALID_STATES.ACCEPTED ) {
                    returnedPromise.accept( value );
                } else {
                    returnedPromise.reject( value );
                }
            } else {
                var newValue = handler( value );
            }


            return (typeof newValue === "undefined" ? value : newValue);

        }, function ( err ) {//errorFallback
            wasError = true;
            returnedPromise.reject( err );

        }, function ( value ) { //complete

            if ( wasError === false ) {
                returnedPromise.resolve( value );
            }

        }
    );

    promise.onResolvedHandler = compose( promise.onResolvedHandler, function ( val ) {
        asyncResolution.execute( val );
        return val;
    } );

    if ( promise.state !== VALID_STATES.PENDING ) {
        executeHandlers( promise.onResolvedHandler, promise.value, function () {
            promise.onResolvedHandler = unit;
        } );
    }

    return returnedPromise;
}

module.exports.then = then;