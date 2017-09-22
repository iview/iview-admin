var loaderUtils = require('loader-utils');
var autoprefixerCore = require('autoprefixer-core');
var postcss = require('postcss');
var path = require('path');
var safe = require('postcss-safe-parser');

module.exports = function (source, map) {
    if (this.cacheable) {
        this.cacheable();
    }

    var params = loaderUtils.parseQuery(this.query);

    if (params.browsers && !Array.isArray(params.browsers)) {
        params.browsers = params.browsers.split(',');
    }
    if (params.cascade === 'false') {
        params.cascade = false;
    }

    var options = {from: path.relative(this.options.context, this.resource)};
    if (params.safe) {
        delete params.safe;
        options.parser = safe;
    }

    var whitelist = {
        browsers: true,
        cascade: true,
        add: true,
        remove: true,
    };
    var unknownParams = [];
    for (var i in params) {
        if (!whitelist[i]) {
            unknownParams.push(i);
        }
    }
    if (unknownParams.length) {
        var warn = unknownParams.length === 1 ?
            'Autoprefixer-loader got this undocumented option: ' :
            'Autoprefixer-loader got these undocumented options: ';
        warn += unknownParams.join(', ');
        this.emitWarning(warn);
    }

    if (map) {
        options.map = {
            prev: map,
        };
    }

    var autoprefixer = autoprefixerCore(params);
    var processed = postcss([autoprefixer]).process(source, options);
    this.callback(null, processed.css, processed.map);
};
