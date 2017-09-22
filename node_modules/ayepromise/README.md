<a href="http://promises-aplus.github.com/promises-spec">
    <img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png"
         align="right" alt="Promises/A+ logo" />
</a>

Aye, promise!
-------------

ayepromise is a teeny-tiny promise library. It promises to pass the [Promises/A+](http://promises-aplus.github.io/promises-spec/) 1.1 Compliance Test Suite.

<a href="http://badge.fury.io/js/ayepromise"><img src="https://badge.fury.io/js/ayepromise.svg" alt="NPM version" height="18" align="right"></a>

Supports modern browsers (i.e. IE > 8).

Why yet another promise library?
--------------------------------

ayepromise wants to be as small as possible (~180 LOC, ~1200 bytes minified), staying compatible to Q while fully implementing the spec. It's licensed under WTFPL and/or BSD.

ayepromise tries to be fully compatible with [kriskowal's Q](https://github.com/kriskowal/q) in such a way that you can always replace ```ayepromise``` with ```Q```. (There's a catch: ayepromise tries to strictly follow Promises/A+ 1.1 and will differ where Q does not.) It will not however try to implement anything close to the full feature set. Check ```test/CompatibilitySpecRunner.html``` to see ayepromise's test suite executed against Q.

[![Build Status](https://travis-ci.org/cburgmer/ayepromise.svg?branch=master)](https://travis-ci.org/cburgmer/ayepromise)

Run the test suite
------------------

For the browser, first install dependencies via ```npm install``` and ```bower install``` and then ```open test/SpecRunner.html```.

For NodeJS install dependencies via ```npm install``` and run ```npm test```. This includes the [Promise/A+ Compliance Test Suite](https://github.com/promises-aplus/promises-tests).
