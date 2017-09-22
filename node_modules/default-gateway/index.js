"use strict";

const platform = require("os").platform();

if ([
  "android",
  "darwin",
  "freebsd",
  "linux",
  "openbsd",
  "sunos",
  "win32"
].indexOf(platform) !== -1) {
  module.exports.v4 = () => require(`./${platform}`).v4();
  module.exports.v6 = () => require(`./${platform}`).v6();
} else {
  module.exports.v4 = () => { throw new Error(`Unsupported Platform: ${platform}`); };
  module.exports.v6 = () => { throw new Error(`Unsupported Platform: ${platform}`); };
}
