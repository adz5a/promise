"use strict";

var adapter = require("./../lib/adapter.js");



var promiseModule = window.promise || {};
promiseModule.deferred = adapter.deferred;
promiseModule.resolved = adapter.resolved;
promiseModule.rejected = adapter.rejected;

window.promise = promiseModule;