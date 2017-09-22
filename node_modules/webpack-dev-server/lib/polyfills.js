'use strict';

/* polyfills for Node 4.8.x users */
/* eslint no-extend-native: off, global-require: off */

// internal-ip@2.x uses [].includes
if (!Array.prototype.includes) {
  Array.prototype.includes = require('array-includes');
}
