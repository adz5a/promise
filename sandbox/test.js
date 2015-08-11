"use strict";

var Promise = require("../lib/promise.js");

var p1 = new Promise();

p1.then(function (x) {
    console.log("fulfilled with " + x);
});

p1.resolve("x");