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
        executeHandlers( promise.onResolvedHandler, function () {
            promise.onResolvedHandler = unit;
        } );
    }

    return promise;
}

module.exports = accept;