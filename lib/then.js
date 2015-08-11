/**
 * Created by obiwankenobi on 11/08/2015.
 */
/**
 *
 * @param {Promise} promise
 * @param {function} onSuccess
 * @param {function} onError
 */
function then ( promise, onSuccess, onError ) {
    var returnedPromise = new Promise(),
        wasError = false;

    if ( typeof onSuccess !== "function" ) {
        onSuccess = unit;
    }

    if ( typeof onError !== "function" ) {
        onError = unit;
    }

    if ( typeof onError !== "function" ) {
    }

    var asyncResolution = runAsync(
        function ( value ) { //initial call

            var handler = unit;
            if ( promise.state === VALID_STATES.ACCEPTED ) {
                handler = onSuccess;
            } else {
                handler = onError;
            }

            var newValue = handler( value );

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

    promise.onResolvedHandler = compose( promise.onResolvedHandler, function () {

        asyncResolution.execute( promise.value );

    } );

    if ( promise.state !== VALID_STATES.ACCEPTED ) {
        executeHandlers( promise.onResolvedHandler, function () {
            promise.onResolvedHandler = unit;
        } );
    }

    return returnedPromise;
}