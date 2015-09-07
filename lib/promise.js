(function () {
	
    function unit (x) {
        return x;
    }

    var 
        PENDING = -1,
        FULFILLED = 0,
        REJECTED = 1;
    
   

    function transitionTo (promise, state, value) {
        if (promise.state !== PENDING) return promise;
        
        promise.state = state;
        promise.value = value;

        return executeNextPromises(promise);
    }

    function resolvePromise(promise, value) {

        if (promise === value) transitionTo(promise, REJECTED, TypeError("Error : trying to resolve a promise with itself"));
        if (promise.state !== PENDING) return promise;
        
        var valType = typeof value;
        if (valType === "object" || valType === "function") {
            var then;
            try {
                then = value.then;

                if (typeof then === "function") {
                    var executed = false;
                    then.call(value, function (v) {
                        if (executed) return value;
                        executed = true;

                        return resolvePromise(promise, v);
                    }, function (reason) {
                        if (executed) return reason;
                        executed = true;
                        
                        return transitionTo(promise, REJECTED, reason);
                    });
                    return promise;
                }
            

            } catch (err) {
                return transitionTo(promise, REJECTED, err);
            }
            
        } 
        return transitionTo(promise, FULFILLED, value);
    }

    function executeNextPromises(promise) {
        
        if (promise.state === PENDING) return promise;

        if (promise.next) {
            var i, l;

            for (i = 0, l = promise.next.length; i < l; i = i + 1) {
                executeHandlers(promise.next[i], promise.value, promise.state);
            }
            if (l) promise.next = [];
        
        }

        return promise;
    }

    function executeHandlers(promise, value, state) {

        setTimeout(function () {
            try {
                var nextVal =promise.handlers[state].call(void(0), value); //
            } catch(err) {
                return transitionTo(promise, REJECTED, err); 
            }
            return resolvePromise(promise, nextVal);
        }, 0);

        return promise;
    }


    function Promise(onFulfill, onRejection) {
        var self = this;
        
        //if an handler was passed, it is used, else the handler upon fulfillment will be according to the promise a+ specs 2.2.1

        onFulfill = (typeof onFulfill === "function" ? 
                onFulfill : 
                function (value) {
                    transitionTo(self, FULFILLED, value);
                }); 
        onRejection = (typeof onRejection === "function" ?
                onRejection :
                function (reason) {
                    transitionTo(self, REJECTED, reason);
                }); 

        this.handlers = [onFulfill, onRejection];
        this.next = [];
        this.state = PENDING;    
        this.value = void(0);
    }

    Promise.prototype.then = function (a, b) {
        var nextPromise = new Promise(a, b);
            
        if (this.state !== PENDING) return executeHandlers(nextPromise, this.value, this.state);
        
        this.next.push(nextPromise);
        return nextPromise;
    } 


	
	module.exports = exports = {
        "defer": function () {
            var promise = new Promise();

            return {
                "reject": function ( reason ) {
                    return transitionTo(promise, REJECTED, reason); 
                },
                "resolve": function ( value ) {
                    return resolvePromise(promise, value);
                },
                "promise": promise
            };
        } 
    };
} ());
