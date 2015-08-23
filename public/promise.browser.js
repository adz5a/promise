(function e ( t, n, r ) {
    function s ( o, u ) {
        if ( !n[o] ) {
            if ( !t[o] ) {
                var a = typeof require == "function" && require;
                if ( !u && a )return a( o, !0 );
                if ( i )return i( o, !0 );
                var f = new Error( "Cannot find module '" + o + "'" );
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = { exports: {} };
            t[o][0].call( l.exports, function ( e ) {
                var n = t[o][1][e];
                return s( n ? n : e )
            }, l, l.exports, e, t, n, r )
        }
        return n[o].exports
    }

    var i = typeof require == "function" && require;
    for ( var o = 0; o < r.length; o++ )s( r[o] );
    return s
})( {
    1: [function ( require, module, exports ) {
        /**
         * Created by obiwankenobi on 11/08/2015.
         */
        "use strict";

        var VALID_STATES = {
            "PENDING": "__PENDING__",
            "ACCEPTED": "__ACCEPTED__",
            "REJECTED": "__REJECTED__"
        };

        module.exports = VALID_STATES;
    }, {}],
    2: [function ( require, module, exports ) {
        "use strict";

        var executeHandlers = require( "../utils/utils.js" ).executeHandlers,
            unit = require( "../utils/utils.js" ).unit,
            VALID_STATES = require( "../VALID_STATES.js" );

        /**
         *
         * @param {Promise} promise
         * @param value
         */
        function accept ( promise, value ) {
            if ( promise.state === VALID_STATES.PENDING ) {
                promise.state = VALID_STATES.ACCEPTED;
                promise.value = value;
                executeHandlers( promise.onResolvedHandler, promise.value, function () {
                    promise.onResolvedHandler = unit;
                } );
            }

            return promise;
        }

        /**
         *
         * @param {Promise} promise
         * @param reason
         */
        function reject ( promise, reason ) {

            if ( promise.state === VALID_STATES.PENDING ) {

                promise.state = VALID_STATES.REJECTED;
                promise.value = reason;
                executeHandlers( promise.onResolvedHandler, promise.value, function () {
                    promise.onResolvedHandler = unit;
                } );
            }

            return promise;
        }

        module.exports = {
            "accept": accept,
            "reject": reject
        };
    }, { "../VALID_STATES.js": 1, "../utils/utils.js": 8 }],
    3: [function ( require, module, exports ) {
        "use strict";
        var accept = require( "./accept_reject.js" ).accept,
            reject = require( "./accept_reject.js" ).reject,
            VALID_STATES = require( "../VALID_STATES.js" );

        /**
         *
         * @param {Promise} promise
         * @param x
         * @returns {boolean}
         */
        function resolvePromise ( promise, x ) {


            var wasResolved = false;
            var typeX = typeof x;

            if ( x === promise ) {
                var reason = TypeError( "Promise.resolve : trying to resolve with itself" );
                promise.reject( reason );
                wasResolved = true;
                return wasResolved;
            }

            if ( promise.state !== VALID_STATES.PENDING ) {
                return wasResolved;
            }

            if ( (typeX !== "object" && typeX !== "function") || x === null ) {

                wasResolved = true;
                accept( promise, x );

                return wasResolved; //stop execution and say it was resolved
            }

            //check if x is then able

            var thenMethod,
                thenAble;

            try {
                thenMethod = x.then;
            } catch ( err ) {
                reject( promise, err ); // rejected with reason
                wasResolved = true;
            } finally {
                thenAble = (typeof thenMethod === "function");
            }

            if ( wasResolved === true ) {
                return wasResolved; //stop execution and say it was resolved
            }

            if ( thenAble === true ) { // if x has been thenable
                var handlerCalled = false;
                try { // then is called synchronously
                    thenMethod.call( x, function ( y ) { //onSuccess

                        if ( handlerCalled === true ) {
                            return;
                        }

                        handlerCalled = true;
                        resolvePromise( promise, y );
                    }, function ( reason ) {//onError

                        if ( handlerCalled === true ) {
                            return;
                        }
                        handlerCalled = true;
                        reject( promise, reason );
                    } );

                } catch ( err ) {
                    if ( handlerCalled === true ) { // has throw an error but handler was called before and proceeded
                        wasResolved = true;
                    } else { //none of the handlers were called and it thrown
                        reject( promise, err );
                    }
                }

                //then may call handlers asynchronously
            } else {
                accept( promise, x );
            }


            return wasResolved;
        }

        module.exports.resolve = resolvePromise;
    }, { "../VALID_STATES.js": 1, "./accept_reject.js": 2 }],
    4: [function ( require, module, exports ) {
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


                    return newValue;

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
    }, { "../VALID_STATES.js": 1, "../promiseConstructor.js": 6, "../utils/utils.js": 8 }],
    5: [function ( require, module, exports ) {
        "use strict";
        var Promise = require( "./promiseConstructor.js" ).promiseConstructor;
        require( "./promisePrototype.js" );

        module.exports = Promise;
    }, { "./promiseConstructor.js": 6, "./promisePrototype.js": 7 }],
    6: [function ( require, module, exports ) {
        "use strict";
        var VALID_STATES = require( "./VALID_STATES.js" ),
            utils = require( "./utils/utils.js" );

        function Promise () {
            this.state = VALID_STATES.PENDING;
            this.onResolvedHandler = utils.unit;
            this.value = undefined;
        }

        module.exports.promiseConstructor = Promise;
    }, { "./VALID_STATES.js": 1, "./utils/utils.js": 8 }],
    7: [function ( require, module, exports ) {
        /**
         * Created by obiwankenobi on 11/08/2015.
         */

        "use strict";

        var then = require( "./methods/then.js" ).then,
            resolve = require( "./methods/resolve.js" ).resolve,
            accept = require( "./methods/accept_reject.js" ).accept,
            reject = require( "./methods/accept_reject.js" ).reject,
            Promise = require( "./promiseConstructor.js" ).promiseConstructor;

        /**
         *
         * @param onSuccess
         * @param onError
         * @returns {*}
         */
        Promise.prototype.then = function ( onSuccess, onError ) {
            return then( this, onSuccess, onError );
        };

        /**
         *
         * @param reason
         * @returns {*}
         */
        Promise.prototype.reject = function ( reason ) {
            return reject( this, reason );
        };

        /**
         *
         * @param value
         * @returns {*}
         */
        Promise.prototype.accept = function ( value ) {
            return accept( this, value );
        };

        /**
         *
         * @param x
         * @returns {Promise}
         */
        Promise.prototype.resolve = function ( x ) {
            resolve( this, x );
            return this;
        };


    }, {
        "./methods/accept_reject.js": 2,
        "./methods/resolve.js": 3,
        "./methods/then.js": 4,
        "./promiseConstructor.js": 6
    }],
    8: [function ( require, module, exports ) {
        /**
         * Created by obiwankenobi on 11/08/2015.
         */
        "use strict";

        /**
         *
         * @param {function} handler
         * @param {function} callback
         * @returns {*}
         */
        function executeHandlers ( handler, value, callback ) {

            if ( typeof callback !== "function" ) {
                callback = unit;
            }

            var a = compose( handler, callback );
            return a( value );

        }

        function unit ( x ) {
            return x;
        }


        /**
         *
         * @param {function} f
         * @param {function} g
         * @returns {function}
         */
        function compose ( f, g ) { //return g o f with a maybe pattern
            return function ( val ) {
                var a = f.call( undefined, val );
                if ( typeof a === "undefined" ) {
                    a = val;
                }
                return g.call( undefined, a );
            };
        }

        /**
         *
         * @param {Function} handler
         * @param {Function=} fallback
         * @param {Function=} complete
         */
        function runAsync ( handler, fallback, complete ) {
            var val;

            var _privateHandler = function ( value ) {
                try {
                    if ( typeof handler === "function" ) {
                        val = handler.call( undefined, value );
                    }
                } catch ( err ) {
                    if ( typeof fallback === "function" ) {
                        fallback.call( undefined, err );
                    }
                } finally {
                    if ( typeof complete === "function" ) {
                        complete.call( undefined, val );
                    }
                }
            };

            return {
                "execute": function ( initValue, callback ) {
                    setTimeout( function ( handler ) {
                        return function () {
                            handler.call( undefined, initValue );
                        };
                    }( _privateHandler ), 0 );
                    _privateHandler = null;
                }
            };
        }


        module.exports = {
            "runAsync": runAsync,
            "executeHandlers": executeHandlers,
            "compose": compose,
            "unit": unit
        };
    }, {}],
    9: [function ( require, module, exports ) {
        "use strict";

        var Promise = require( "./../lib/promise.js" );


        var api = {
            "deferred": function () {
                return new Promise;
            },
            "rejected": function ( reason ) {
                return new Promise().reject( reason );
            },
            "resolved": function () {
                return new Promise().resolve( value );
            }
        };


        var promiseModule = window.promise || {};

        promiseModule.deferred = api.deferred;
        promiseModule.rejected = api.rejected;
        promiseModule.resolved = api.resolved;

        window.promise = promiseModule;
    }, { "./../lib/promise.js": 5 }]
}, {}, [9] );
