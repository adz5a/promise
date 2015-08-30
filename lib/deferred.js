(function () {
    "use strict";
    var Promise = require( "./promise.js" );


    function deferred () {
        var promise = new Promise ();


        return {
            "deferred": {
                "then": function () {
                    return this;
                },
                "catch": function () {
                    return this;
                },
                "always": function () {
                    return this;
                }
            },
            "promise": promise
        }
    }


    module.exports = {

    }
}());