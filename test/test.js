var promise = require("./adapter.js");


var rejected = promise.rejected("dummy");

rejected.then(function () {}, undefined).then(function () { console.log("should not be here"); }, function () {console.log("done")});
