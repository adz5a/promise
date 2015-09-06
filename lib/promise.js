(function () {
	
    function unit (x) {
        return x;
    }
	
	function deferFunction (func, onError, onComplete) {
		return function () {
			var args = Array.prototype.slice.call(arguments, 0);
			setTimeout(function() {
				try {
					result = !!func.apply(void(0), args);
				} catch (e) {
					onError.call(void(0), e);
				} finally {
                    if (result !== void(0)) onComplete();
                } 
			}, 0);
		};
	}
	
	function resolve (value, deferred) {
        
        
    }
    
    
    function dequeuePromise (queue, value, state) {
        var i, l;
        for (i = 0, l = queue.length; i < l; i = i + 1) {
            queue[i].handler(value);
        }
        return void(0);
    }
    
    
	
	var PENDING = "PENDING",
		FULFILLED = "FULFILLED",
		REJECTED = "REJECTED";
        
        
	function Thenable (onFulfill, onReject) {
        
        onFulfill = (typeof onFulfill === "function" ? onFulfill : unit);
        onReject = (typeof onFulfill === "function" ? onReject : unit);
        
        this.handlers = [onFulfill, onReject];
        this.queue = [];
        this.state = PENDING;
    }
     
    Thenable.prototype.reject = function (reason) {
        var thenable = this;
        
        if (thenable.state !== PENDING) return thenable;
        
        thenable.state = REJECTED;
        dequeuePromise(thenable.queue, thenable.value, thenable.state);
        return thenable;
    };
    
    Thenable.prototype.then = function (a, b) {
        var thenable = this,
            then = new Thenable(a, b);
        
        
        if (thenable.state !== PENDING) {
            then.resolve(thenable.value);
        } else {
            thenable.queue.push(then);
        }
        
        return then;
    };
     
    function Deferred () {
        this.queue = [];
        this.state = PENDING;
    }
    
    Deferred.prototype = new Thenable();
    
    Deferred.prototype.resolve = function (value) {
        var deferred = this;
        
        if (deferred.state !== PENDING) {
            dequeuePromise(deferred.state, deferred.value, deferred.state);
            return deferred;
        }
        
        if ( (typeof value === "object" || typeof value === "function") && value !== null) {
            try {
                if (typeof value.then === "function") {
                    var executed = false;
                    value.then(function (v) {
                        if (executed) return void(0);
                        executed = true;
                        deferred.resolve(v);
                    }, function (e) {
                        executed = true;
                        deferred.reject(v);
                    });
                } else {
                    deferred.fulfill(value);
                }
            } catch (e) {
                return deferred.reject(e);
            } 
        } else {
            deferred.state = FULFILLED;
            deferred.value = value;
            dequeuePromise(deferred.state, deferred.value, deferred.state);
        }
        return deferred;
    };
    
	
	module.export = {
        "defer": function () {
            
            
            
        }
    };
} ());