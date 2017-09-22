/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Tobias Koppers @sokra
 */
var loaderUtils = require("loader-utils");
var mime = require("mime");

module.exports = function(content) {
    this.cacheable && this.cacheable();

    var options =  loaderUtils.getOptions(this) || {};
    // Options `dataUrlLimit` is backward compatibility with first loader versions
    var limit = options.limit || (this.options && this.options.url && this.options.url.dataUrlLimit);

    if(limit) {
        limit = parseInt(limit, 10);
    }

    var mimetype = options.mimetype || options.minetype || mime.lookup(this.resourcePath);

    // No limits or limit more than content length
    if(!limit || content.length < limit) {
        if(typeof content === "string") {
            content = new Buffer(content);
        }
        return "module.exports = " + JSON.stringify("data:" + (mimetype ? mimetype + ";" : "") + "base64," + content.toString("base64"));
    }

    var fileLoader = require("file-loader");

    return fileLoader.call(this, content);
}

module.exports.raw = true;
