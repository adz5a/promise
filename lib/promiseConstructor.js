"use strict";
var VALID_STATES = require( "./VALID_STATES.js" ),
    utils = require( "./utils/utils.js" );
function Promise () {
    this.state = VALID_STATES.PENDING;
    this.onResolvedHandler = utils.unit;
    this.value = undefined;
}

module.exports.promiseConstructor = Promise;