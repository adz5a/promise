var promise = require( "./adapter.js" );


var rejected = promise.rejected( "dummy" );

rejected.then( function () {
}, undefined ).then( function () {
    console.log( "should not be here" );
}, function ( reason ) {
    console.log( reason )
} );


var resolved = promise.resolved( "resolved" ).then( function () {
    return {
        "then": function ( a, b ) {
            a( "une autre valeur" );
            setTimeout( function () {
                throw Error( "une erreur" );
            }, 0 );
        }
    };
} ).then( function ( v ) {
    console.log( v );
} );