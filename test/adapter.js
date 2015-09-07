(function () {
    "use strict";
    var promise = require("./../lib/promise.js");


    module.exports = {
        "deferred": function () {
            return promise.defer();
        },
        "resolved": function ( value ) {
            return promise.defer().resolve(value);
        },
        "rejected": function ( reason ) {
            return promise.defer().reject(reason);
        }
    };
} ());
