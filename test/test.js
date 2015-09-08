var promise = require( "./adapter.js" );

var adapter = promise;
var resolved = adapter.resolved;
var rejected = adapter.rejected;
var deferred = adapter.deferred;

var other = { other: "other" }; // a value we don't want to be strict equal to

var thenables = {};

thenables.fulfilled = {
    "a synchronously-fulfilled custom thenable": function ( value ) {
        return {
            then: function ( onFulfilled ) {
                onFulfilled( value );
            }
        };
    },

    "an asynchronously-fulfilled custom thenable": function ( value ) {
        return {
            then: function ( onFulfilled ) {
                setTimeout( function () {
                    onFulfilled( value );
                }, 0 );
            }
        };
    },

    "a synchronously-fulfilled one-time thenable": function ( value ) {
        var numberOfTimesThenRetrieved = 0;
        return Object.create( null, {
            then: {
                get: function () {
                    if ( numberOfTimesThenRetrieved === 0 ) {
                        ++numberOfTimesThenRetrieved;
                        return function ( onFulfilled ) {
                            onFulfilled( value );
                        };
                    }
                    return null;
                }
            }
        } );
    },

    "a thenable that tries to fulfill twice": function ( value ) {
        return {
            then: function ( onFulfilled ) {
                onFulfilled( value );
                onFulfilled( other );
            }
        };
    },

    "a thenable that fulfills but then throws": function ( value ) {
        return {
            then: function ( onFulfilled ) {
                onFulfilled( value );
                throw other;
            }
        };
    },

    "an already-fulfilled promise": function ( value ) {
        return resolved( value );
    },

    "an eventually-fulfilled promise": function ( value ) {
        var d = deferred();
        setTimeout( function () {
            d.resolve( value );
        }, 50 );
        return d.promise;
    }
};

thenables.rejected = {
    "a synchronously-rejected custom thenable": function ( reason ) {
        return {
            then: function ( onFulfilled, onRejected ) {
                onRejected( reason );
            }
        };
    },

    "an asynchronously-rejected custom thenable": function ( reason ) {
        return {
            then: function ( onFulfilled, onRejected ) {
                setTimeout( function () {
                    onRejected( reason );
                }, 0 );
            }
        };
    },

    "a synchronously-rejected one-time thenable": function ( reason ) {
        var numberOfTimesThenRetrieved = 0;
        return Object.create( null, {
            then: {
                get: function () {
                    if ( numberOfTimesThenRetrieved === 0 ) {
                        ++numberOfTimesThenRetrieved;
                        return function ( onFulfilled, onRejected ) {
                            onRejected( reason );
                        };
                    }
                    return null;
                }
            }
        } );
    },

    "a thenable that immediately throws in `then`": function ( reason ) {
        return {
            then: function () {
                throw reason;
            }
        };
    },

    "an object with a throwing `then` accessor": function ( reason ) {
        return Object.create( null, {
            then: {
                get: function () {
                    throw reason;
                }
            }
        } );
    },

    "an already-rejected promise": function ( reason ) {
        return rejected( reason );
    },

    "an eventually-rejected promise": function ( reason ) {
        var d = deferred();
        setTimeout( function () {
            d.reject( reason );
        }, 50 );
        return d.promise;
    }
};

//
var sentinel = "sentinel";


function testPromiseResolution ( xFactory, test ) {
    //"via return from a fulfilled promise"
    var promise1 = resolved( "dummy" ).then( function onBasePromiseFulfilled () {
        return xFactory();
    } );

    test( promise1 );


    //"via return from a rejected promise"
    var promise2 = rejected( "dummy" ).then( null, function onBasePromiseRejected () {
        return xFactory();
    } );

    test( promise2 );

}

function testCallingResolvePromise ( yFactory, stringRepresentation, test ) {
    //"`then` calls `resolvePromise` synchronously"
    function xFactory1 () {
        return {
            then: function ( resolvePromise ) {
                resolvePromise( yFactory() );
            }
        };
    }

    testPromiseResolution( xFactory1, test );

    //"`then` calls `resolvePromise` asynchronously"
    function xFactory2 () {
        return {
            then: function ( resolvePromise ) {
                setTimeout( function () {
                    resolvePromise( yFactory() );
                }, 0 );
            }
        };
    }

    testPromiseResolution( xFactory2, test );
}


function testCallingResolvePromiseFulfillsWith ( yFactory, stringRepresentation, fulfillmentValue ) {
    testCallingResolvePromise( yFactory, stringRepresentation, function ( promise ) {
        promise.then( function onPromiseFulfilled ( value ) {
            if (value !== "sentinel") console.log(stringRepresentation);
        } );
    } );
}
Object.keys( thenables.fulfilled ).forEach( function ( outerStringRepresentation ) {
    var outerThenableFactory = thenables.fulfilled[outerStringRepresentation];

    Object.keys( thenables.fulfilled ).forEach( function ( innerStringRepresentation ) {
        var innerThenableFactory = thenables.fulfilled[innerStringRepresentation];

        var stringRepresentation = outerStringRepresentation + " for " + innerStringRepresentation;

        function yFactory () {
            return outerThenableFactory( innerThenableFactory( sentinel ) );
        }

        testCallingResolvePromiseFulfillsWith( yFactory, stringRepresentation, "sentinel" );
    } );
} );