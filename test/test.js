var promise = require("./../lib/promise.js");


var deferred = promise.defer();

console.log(deferred);

deferred.promise.then(function (value) {
    console.log(value);
});
console.log("got here");
deferred.resolve("yolo value");
