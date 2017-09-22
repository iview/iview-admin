(function (definition) {
    if (typeof module !== 'undefined') {
        module.exports = definition();
    } else {
        this.helpers = definition();
    }
})(function () {
    var helpers = {},
        subject,
        timeout = 20;

    var alreadyResolved = function (testName, value, test) {
        var done = jasmine.createSpy("done");

        it(testName + " (already resolved)", function () {
            var defer = subject.defer();
            defer.resolve(value);
            test(defer.promise, done);

            waitsFor(function () {
                return done.wasCalled;
            }, timeout);
        });
    };

    var deferredResolve = function (testName, value, test) {
        var done = jasmine.createSpy("done");

        it(testName + " (deferred resolve)", function () {
            var defer = subject.defer();
            test(defer.promise, done);
            defer.resolve(value);

            waitsFor(function () {
                return done.wasCalled;
            }, timeout);
        });
    };

    var alreadyRejected = function (testName, value, test) {
        var done = jasmine.createSpy("done");

        it(testName + " (already rejected)", function () {
            var defer = subject.defer();
            defer.reject(value);
            test(defer.promise, done);

            waitsFor(function () {
                return done.wasCalled;
            }, timeout);
        });
    };

    var deferredRejected = function (testName, value, test) {
        var done = jasmine.createSpy("done");

        it(testName + " (deferred rejected)", function () {
            var defer = subject.defer();
            test(defer.promise, done);
            defer.reject(value);

            waitsFor(function () {
                return done.wasCalled;
            }, timeout);
        });
    };

    helpers.testFulfilled = function (testName, value, test) {
        alreadyResolved(testName, value, test);
        deferredResolve(testName, value, test);
    };

    helpers.testRejected = function (testName, value, test) {
        alreadyRejected(testName, value, test);
        deferredRejected(testName, value, test);
    };

    helpers.setSubject = function (theSubject) {
        subject = theSubject;
    };

    helpers.testFulfilledIfNotQ = function (testName, libraryName, value, test) {
        if (libraryName !== 'q') {
            helpers.testFulfilled(testName, value, test);
        } else {
            console.log('Warning: "' + testName + '" is disabled for library ' + libraryName);
        }
    };

    helpers.ifNotQIt = function (testName, libraryName, test) {
        if (libraryName !== 'q') {
            it(testName, test);
        } else {
            console.log('Warning: "' + testName + '" is disabled for library ' + libraryName);
        }
    };

    return helpers;
});
