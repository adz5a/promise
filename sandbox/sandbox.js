/**
 * Created by obiwankenobi on 11/08/2015.
 */
"use strict";

var a = function () {
    setTimeout( function () {
        try {
            throw Error( "UNTIL I SHOWED UP" );
        } catch ( err ) {
            console.log( err );
            console.log( "but i catched you" );
        }
    }, 500 );
};


try {
    a();
    console.log( "everything was fine" )
} catch ( err ) {
    console.log( err );
}