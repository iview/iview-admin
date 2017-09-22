# unsupported

[![Build Status](https://travis-ci.org/javiercejudo/unsupported.svg)](https://travis-ci.org/javiercejudo/unsupported)
[![Coverage Status](https://coveralls.io/repos/javiercejudo/unsupported/badge.svg?branch=master)](https://coveralls.io/r/javiercejudo/unsupported?branch=master)
[![Code Climate](https://codeclimate.com/github/javiercejudo/unsupported/badges/gpa.svg)](https://codeclimate.com/github/javiercejudo/unsupported)

Unsupported operation

## Install

    npm i unsupported

## Usage

```js
var unsupported = require('unsupported')('optional custom error message');

unsupported(); // => throws error with message 'optional custom error message'
```

See [spec](test/spec.js).
