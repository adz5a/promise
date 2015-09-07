(function () {

    function unit ( x ) {
        return x;
    }

    var
        PENDING = -1,
        FULFILLED = 0,
        REJECTED = 1;


    function transitionTo ( promise, state, value ) {
        if ( promise.state !== PENDING ) return promise;

        promise.state = state;
        promise.value = value;

        return executeNextPromises( promise );
    }

    function thenCallbacks ( promise ) {
        var executed = { "true": false };

        return [function ( y ) {
            if ( !executed.true ) {
                executed.true = true;
                resolvePromise( promise, y );
            }
        }, function ( reason ) {
            if ( !executed.true ) {
                executed.true = true;
                transitionTo( promise, REJECTED, reason );
            }
        }, executed];
    }


    function resolvePromise ( promise, value ) {

        if ( promise === value ) transitionTo( promise, REJECTED, TypeError( "Error : trying to resolve a promise with itself" ) );
        if ( promise.state !== PENDING ) return promise;

        var
            valType = typeof value,
            then,
            cb;

        if ( (valType === "object" || valType === "function") && value !== null ) {

            cb = thenCallbacks( promise );

            try {

                then = value.then;

                if ( typeof then === "function" ) {



                    then.call( value, cb[0], cb[1] );
                    return promise;
                }

            } catch ( err ) {
                if ( !cb[2].true ) return transitionTo( promise, REJECTED, err );//reject
            }

        }
        return transitionTo( promise, FULFILLED, value ); //accept
    }

    function executeNextPromises ( promise ) {

        if ( promise.state === PENDING ) return promise;

        if ( promise.next ) {
            var i, l;

            for ( i = 0, l = promise.next.length; i < l; i = i + 1 ) {
                executeHandlers( promise.next[i], promise.value, promise.state );
            }
            if ( l ) promise.next = [];

        }

        return promise;
    }

    function executeHandlers ( promise, value, state ) {

        setTimeout( function () {
            try {
                var nextVal = promise.handlers[state].call( void(0), value ); //
            } catch ( err ) {
                return transitionTo( promise, REJECTED, err );
            }
            return resolvePromise( promise, nextVal );
        }, 0 );

        return promise;
    }


    function Promise ( onFulfill, onRejection ) {
        var self = this;

        //if an handler was passed, it is used, else the handler upon fulfillment will be according to the promise a+ specs 2.2.1
        onFulfill = (typeof onFulfill === "function" ?
            onFulfill :
            function ( value ) {
                transitionTo( self, FULFILLED, value );
            });
        onRejection = (typeof onRejection === "function" ?
            onRejection :
            function ( reason ) {
                transitionTo( self, REJECTED, reason );
            });

        this.handlers = [onFulfill, onRejection];
        this.next = [];
        this.state = PENDING;
        this.value = void(0);
    }

    Promise.prototype.then = function ( a, b ) {
        var nextPromise = new Promise( a, b );

        if ( this.state !== PENDING ) return executeHandlers( nextPromise, this.value, this.state );

        this.next.push( nextPromise );
        return nextPromise;
    };


    module.exports = exports = {
        "defer": function () {
            var promise = new Promise();

            return {
                "reject": function ( reason ) {
                    return transitionTo( promise, REJECTED, reason );
                },
                "resolve": function ( value ) {
                    return resolvePromise( promise, value );
                },
                "promise": promise
            };
        }
    };
}());
