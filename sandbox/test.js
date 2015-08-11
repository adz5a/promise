"use strict";

var Promise = require( "../lib/promise.js" );

var p1 = new Promise();

var rejected = new Promise().reject( "ma raison" ),
    accepted = new Promise().accept( "ma valeur" ),
    deferred = new Promise();



rejected.then(function () { }, undefined).then(null, function () {
    console.log("success");
});