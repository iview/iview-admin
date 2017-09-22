'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _sourceMap = require('source-map');

var _sourceMap2 = _interopRequireDefault(_sourceMap);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function fromBase64(str) {
    if (Buffer) {
        if (Buffer.from && Buffer.from !== Uint8Array.from) {
            return Buffer.from(str, 'base64').toString();
        } else {
            return new Buffer(str, 'base64').toString();
        }
    } else {
        return window.atob(str);
    }
}

/**
 * Source map information from input CSS.
 * For example, source map after Sass compiler.
 *
 * This class will automatically find source map in input CSS or in file system
 * near input file (according `from` option).
 *
 * @example
 * const root = postcss.parse(css, { from: 'a.sass.css' });
 * root.input.map //=> PreviousMap
 */

var PreviousMap = function () {

    /**
     * @param {string}         css    - input CSS source
     * @param {processOptions} [opts] - {@link Processor#process} options
     */
    function PreviousMap(css, opts) {
        _classCallCheck(this, PreviousMap);

        this.loadAnnotation(css);
        /**
         * @member {boolean} - Was source map inlined by data-uri to input CSS.
         */
        this.inline = this.startWith(this.annotation, 'data:');

        var prev = opts.map ? opts.map.prev : undefined;
        var text = this.loadMap(opts.from, prev);
        if (text) this.text = text;
    }

    /**
     * Create a instance of `SourceMapGenerator` class
     * from the `source-map` library to work with source map information.
     *
     * It is lazy method, so it will create object only on first call
     * and then it will use cache.
     *
     * @return {SourceMapGenerator} object with source map information
     */


    PreviousMap.prototype.consumer = function consumer() {
        if (!this.consumerCache) {
            this.consumerCache = new _sourceMap2.default.SourceMapConsumer(this.text);
        }
        return this.consumerCache;
    };

    /**
     * Does source map contains `sourcesContent` with input source text.
     *
     * @return {boolean} Is `sourcesContent` present
     */


    PreviousMap.prototype.withContent = function withContent() {
        return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
    };

    PreviousMap.prototype.startWith = function startWith(string, start) {
        if (!string) return false;
        return string.substr(0, start.length) === start;
    };

    PreviousMap.prototype.loadAnnotation = function loadAnnotation(css) {
        var match = css.match(/\/\*\s*# sourceMappingURL=(.*)\s*\*\//);
        if (match) this.annotation = match[1].trim();
    };

    PreviousMap.prototype.decodeInline = function decodeInline(text) {
        // data:application/json;charset=utf-8;base64,
        // data:application/json;charset=utf8;base64,
        // data:application/json;base64,
        var baseUri = /^data:application\/json;(?:charset=utf-?8;)?base64,/;
        var uri = 'data:application/json,';

        if (this.startWith(text, uri)) {
            return decodeURIComponent(text.substr(uri.length));
        } else if (baseUri.test(text)) {
            return fromBase64(text.substr(RegExp.lastMatch.length));
        } else {
            var encoding = text.match(/data:application\/json;([^,]+),/)[1];
            throw new Error('Unsupported source map encoding ' + encoding);
        }
    };

    PreviousMap.prototype.loadMap = function loadMap(file, prev) {
        if (prev === false) return false;

        if (prev) {
            if (typeof prev === 'string') {
                return prev;
            } else if (typeof prev === 'function') {
                var prevPath = prev(file);
                if (prevPath && _fs2.default.existsSync && _fs2.default.existsSync(prevPath)) {
                    return _fs2.default.readFileSync(prevPath, 'utf-8').toString().trim();
                } else {
                    throw new Error('Unable to load previous source map: ' + prevPath.toString());
                }
            } else if (prev instanceof _sourceMap2.default.SourceMapConsumer) {
                return _sourceMap2.default.SourceMapGenerator.fromSourceMap(prev).toString();
            } else if (prev instanceof _sourceMap2.default.SourceMapGenerator) {
                return prev.toString();
            } else if (this.isMap(prev)) {
                return JSON.stringify(prev);
            } else {
                throw new Error('Unsupported previous source map format: ' + prev.toString());
            }
        } else if (this.inline) {
            return this.decodeInline(this.annotation);
        } else if (this.annotation) {
            var map = this.annotation;
            if (file) map = _path2.default.join(_path2.default.dirname(file), map);

            this.root = _path2.default.dirname(map);
            if (_fs2.default.existsSync && _fs2.default.existsSync(map)) {
                return _fs2.default.readFileSync(map, 'utf-8').toString().trim();
            } else {
                return false;
            }
        }
    };

    PreviousMap.prototype.isMap = function isMap(map) {
        if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object') return false;
        return typeof map.mappings === 'string' || typeof map._mappings === 'string';
    };

    return PreviousMap;
}();

exports.default = PreviousMap;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByZXZpb3VzLW1hcC5lczYiXSwibmFtZXMiOlsiZnJvbUJhc2U2NCIsInN0ciIsIkJ1ZmZlciIsImZyb20iLCJVaW50OEFycmF5IiwidG9TdHJpbmciLCJ3aW5kb3ciLCJhdG9iIiwiUHJldmlvdXNNYXAiLCJjc3MiLCJvcHRzIiwibG9hZEFubm90YXRpb24iLCJpbmxpbmUiLCJzdGFydFdpdGgiLCJhbm5vdGF0aW9uIiwicHJldiIsIm1hcCIsInVuZGVmaW5lZCIsInRleHQiLCJsb2FkTWFwIiwiY29uc3VtZXIiLCJjb25zdW1lckNhY2hlIiwiU291cmNlTWFwQ29uc3VtZXIiLCJ3aXRoQ29udGVudCIsInNvdXJjZXNDb250ZW50IiwibGVuZ3RoIiwic3RyaW5nIiwic3RhcnQiLCJzdWJzdHIiLCJtYXRjaCIsInRyaW0iLCJkZWNvZGVJbmxpbmUiLCJiYXNlVXJpIiwidXJpIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwidGVzdCIsIlJlZ0V4cCIsImxhc3RNYXRjaCIsImVuY29kaW5nIiwiRXJyb3IiLCJmaWxlIiwicHJldlBhdGgiLCJleGlzdHNTeW5jIiwicmVhZEZpbGVTeW5jIiwiU291cmNlTWFwR2VuZXJhdG9yIiwiZnJvbVNvdXJjZU1hcCIsImlzTWFwIiwiSlNPTiIsInN0cmluZ2lmeSIsImpvaW4iLCJkaXJuYW1lIiwicm9vdCIsIm1hcHBpbmdzIiwiX21hcHBpbmdzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsU0FBU0EsVUFBVCxDQUFvQkMsR0FBcEIsRUFBeUI7QUFDckIsUUFBS0MsTUFBTCxFQUFjO0FBQ1YsWUFBS0EsT0FBT0MsSUFBUCxJQUFlRCxPQUFPQyxJQUFQLEtBQWdCQyxXQUFXRCxJQUEvQyxFQUFzRDtBQUNsRCxtQkFBT0QsT0FBT0MsSUFBUCxDQUFZRixHQUFaLEVBQWlCLFFBQWpCLEVBQTJCSSxRQUEzQixFQUFQO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsbUJBQU8sSUFBSUgsTUFB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R0FBZCxDQUF0QixFQUEyQztBQUN2Qyx1QkFBTyxhQUFHMkIsWUFBSCxDQUFnQjNCLEdBQWhCLEVBQXFCLE9BQXJCLEVBQThCWCxRQUE5QixHQUF5Q3lCLElBQXpDLEVBQVA7QUFDSCxhQUZELE1BRU87QUFDSCx1QkFBTyxLQUFQO0FBQ0g7QUFDSjtBQUNKLEs7OzBCQUVEZ0IsSyxrQkFBTTlCLEcsRUFBSztBQUNQLFlBQUssUUFBT0EsR0FBUCx5Q0FBT0EsR0FBUCxPQUFlLFFBQXBCLEVBQStCLE9BQU8sS0FBUDtBQUMvQixlQUFPLE9BQU9BLElBQUlvQyxRQUFYLEtBQXdCLFFBQXhCLElBQ0EsT0FBT3BDLElBQUlxQyxTQUFYLEtBQXlCLFFBRGhDO0FBRUgsSzs7Ozs7a0JBR1U3QyxXIiwiZmlsZSI6InByZXZpb3VzLW1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb3ppbGxhICBmcm9tICdzb3VyY2UtbWFwJztcbmltcG9ydCBwYXRoICAgICBmcm9tICdwYXRoJztcbmltcG9ydCBmcyAgICAgICBmcm9tICdmcyc7XG5cbmZ1bmN0aW9uIGZyb21CYXNlNjQoc3RyKSB7XG4gICAgaWYgKCBCdWZmZXIgKSB7XG4gICAgICAgIGlmICggQnVmZmVyLmZyb20gJiYgQnVmZmVyLmZyb20gIT09IFVpbnQ4QXJyYXkuZnJvbSApIHtcbiAgICAgICAgICAgIHJldHVybiBCdWZmZXIuZnJvbShzdHIsICdiYXNlNjQnKS50b1N0cmluZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIoc3RyLCAnYmFzZTY0JykudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuYXRvYihzdHIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTb3VyY2UgbWFwIGluZm9ybWF0aW9uIGZyb20gaW5wdXQgQ1NTLlxuICogRm9yIGV4YW1wbGUsIHNvdXJjZSBtYXAgYWZ0ZXIgU2FzcyBjb21waWxlci5cbiAqXG4gKiBUaGlzIGNsYXNzIHdpbGwgYXV0b21hdGljYWxseSBmaW5kIHNvdXJjZSBtYXAgaW4gaW5wdXQgQ1NTIG9yIGluIGZpbGUgc3lzdGVtXG4gKiBuZWFyIGlucHV0IGZpbGUgKGFjY29yZGluZyBgZnJvbWAgb3B0aW9uKS5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2UoY3NzLCB7IGZyb206ICdhLnNhc3MuY3NzJyB9KTtcbiAqIHJvb3QuaW5wdXQubWFwIC8vPT4gUHJldmlvdXNNYXBcbiAqL1xuY2xhc3MgUHJldmlvdXNNYXAge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgY3NzICAgIC0gaW5wdXQgQ1NTIHNvdXJjZVxuICAgICAqIEBwYXJhbSB7cHJvY2Vzc09wdGlvbnN9IFtvcHRzXSAtIHtAbGluayBQcm9jZXNzb3IjcHJvY2Vzc30gb3B0aW9uc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNzcywgb3B0cykge1xuICAgICAgICB0aGlzLmxvYWRBbm5vdGF0aW9uKGNzcyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtib29sZWFufSAtIFdhcyBzb3VyY2UgbWFwIGlubGluZWQgYnkgZGF0YS11cmkgdG8gaW5wdXQgQ1NTLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5pbmxpbmUgPSB0aGlzLnN0YXJ0V2l0aCh0aGlzLmFubm90YXRpb24sICdkYXRhOicpO1xuXG4gICAgICAgIGxldCBwcmV2ID0gb3B0cy5tYXAgPyBvcHRzLm1hcC5wcmV2IDogdW5kZWZpbmVkO1xuICAgICAgICBsZXQgdGV4dCA9IHRoaXMubG9hZE1hcChvcHRzLmZyb20sIHByZXYpO1xuICAgICAgICBpZiAoIHRleHQgKSB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIGluc3RhbmNlIG9mIGBTb3VyY2VNYXBHZW5lcmF0b3JgIGNsYXNzXG4gICAgICogZnJvbSB0aGUgYHNvdXJjZS1tYXBgIGxpYnJhcnkgdG8gd29yayB3aXRoIHNvdXJjZSBtYXAgaW5mb3JtYXRpb24uXG4gICAgICpcbiAgICAgKiBJdCBpcyBsYXp5IG1ldGhvZCwgc28gaXQgd2lsbCBjcmVhdGUgb2JqZWN0IG9ubHkgb24gZmlyc3QgY2FsbFxuICAgICAqIGFuZCB0aGVuIGl0IHdpbGwgdXNlIGNhY2hlLlxuICAgICAqXG4gICAgICogQHJldHVybiB7U291cmNlTWFwR2VuZXJhdG9yfSBvYmplY3Qgd2l0aCBzb3VyY2UgbWFwIGluZm9ybWF0aW9uXG4gICAgICovXG4gICAgY29uc3VtZXIoKSB7XG4gICAgICAgIGlmICggIXRoaXMuY29uc3VtZXJDYWNoZSApIHtcbiAgICAgICAgICAgIHRoaXMuY29uc3VtZXJDYWNoZSA9IG5ldyBtb3ppbGxhLlNvdXJjZU1hcENvbnN1bWVyKHRoaXMudGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZXJDYWNoZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb2VzIHNvdXJjZSBtYXAgY29udGFpbnMgYHNvdXJjZXNDb250ZW50YCB3aXRoIGlucHV0IHNvdXJjZSB0ZXh0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gSXMgYHNvdXJjZXNDb250ZW50YCBwcmVzZW50XG4gICAgICovXG4gICAgd2l0aENvbnRlbnQoKSB7XG4gICAgICAgIHJldHVybiAhISh0aGlzLmNvbnN1bWVyKCkuc291cmNlc0NvbnRlbnQgJiZcbiAgICAgICAgICAgICAgICAgIHRoaXMuY29uc3VtZXIoKS5zb3VyY2VzQ29udGVudC5sZW5ndGggPiAwKTtcbiAgICB9XG5cbiAgICBzdGFydFdpdGgoc3RyaW5nLCBzdGFydCkge1xuICAgICAgICBpZiAoICFzdHJpbmcgKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBzdHJpbmcuc3Vic3RyKDAsIHN0YXJ0Lmxlbmd0aCkgPT09IHN0YXJ0O1xuICAgIH1cblxuICAgIGxvYWRBbm5vdGF0aW9uKGNzcykge1xuICAgICAgICBsZXQgbWF0Y2ggPSBjc3MubWF0Y2goL1xcL1xcKlxccyojIHNvdXJjZU1hcHBpbmdVUkw9KC4qKVxccypcXCpcXC8vKTtcbiAgICAgICAgaWYgKCBtYXRjaCApIHRoaXMuYW5ub3RhdGlvbiA9IG1hdGNoWzFdLnRyaW0oKTtcbiAgICB9XG5cbiAgICBkZWNvZGVJbmxpbmUodGV4dCkge1xuICAgICAgICAvLyBkYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXG4gICAgICAgIC8vIGRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zjg7YmFzZTY0LFxuICAgICAgICAvLyBkYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFxuICAgICAgICBsZXQgYmFzZVVyaSA9IC9eZGF0YTphcHBsaWNhdGlvblxcL2pzb247KD86Y2hhcnNldD11dGYtPzg7KT9iYXNlNjQsLztcbiAgICAgICAgbGV0IHVyaSAgICAgPSAnZGF0YTphcHBsaWNhdGlvbi9qc29uLCc7XG5cbiAgICAgICAgaWYgKCB0aGlzLnN0YXJ0V2l0aCh0ZXh0LCB1cmkpICkge1xuICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudCggdGV4dC5zdWJzdHIodXJpLmxlbmd0aCkgKTtcblxuICAgICAgICB9IGVsc2UgaWYgKCBiYXNlVXJpLnRlc3QodGV4dCkgKSB7XG4gICAgICAgICAgICByZXR1cm4gZnJvbUJhc2U2NCh0ZXh0LnN1YnN0cihSZWdFeHAubGFzdE1hdGNoLmxlbmd0aCkpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZW5jb2RpbmcgPSB0ZXh0Lm1hdGNoKC9kYXRhOmFwcGxpY2F0aW9uXFwvanNvbjsoW14sXSspLC8pWzFdO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBzb3VyY2UgbWFwIGVuY29kaW5nICcgKyBlbmNvZGluZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2FkTWFwKGZpbGUsIHByZXYpIHtcbiAgICAgICAgaWYgKCBwcmV2ID09PSBmYWxzZSApIHJldHVybiBmYWxzZTtcblxuICAgICAgICBpZiAoIHByZXYgKSB7XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBwcmV2ID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGVvZiBwcmV2ID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgICAgICAgICAgIGxldCBwcmV2UGF0aCA9IHByZXYoZmlsZSk7XG4gICAgICAgICAgICAgICAgaWYgKCBwcmV2UGF0aCAmJiBmcy5leGlzdHNTeW5jICYmIGZzLmV4aXN0c1N5bmMocHJldlBhdGgpICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKHByZXZQYXRoLCAndXRmLTgnKS50b1N0cmluZygpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBsb2FkIHByZXZpb3VzIHNvdXJjZSBtYXA6ICcgK1xuICAgICAgICAgICAgICAgICAgICBwcmV2UGF0aC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBwcmV2IGluc3RhbmNlb2YgbW96aWxsYS5Tb3VyY2VNYXBDb25zdW1lciApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW96aWxsYS5Tb3VyY2VNYXBHZW5lcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgLmZyb21Tb3VyY2VNYXAocHJldikudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHByZXYgaW5zdGFuY2VvZiBtb3ppbGxhLlNvdXJjZU1hcEdlbmVyYXRvciApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldi50b1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggdGhpcy5pc01hcChwcmV2KSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocHJldik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgcHJldmlvdXMgc291cmNlIG1hcCBmb3JtYXQ6ICcgK1xuICAgICAgICAgICAgICAgICAgICBwcmV2LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAoIHRoaXMuaW5saW5lICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVjb2RlSW5saW5lKHRoaXMuYW5ub3RhdGlvbik7XG5cbiAgICAgICAgfSBlbHNlIGlmICggdGhpcy5hbm5vdGF0aW9uICkge1xuICAgICAgICAgICAgbGV0IG1hcCA9IHRoaXMuYW5ub3RhdGlvbjtcbiAgICAgICAgICAgIGlmICggZmlsZSApIG1hcCA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUoZmlsZSksIG1hcCk7XG5cbiAgICAgICAgICAgIHRoaXMucm9vdCA9IHBhdGguZGlybmFtZShtYXApO1xuICAgICAgICAgICAgaWYgKCBmcy5leGlzdHNTeW5jICYmIGZzLmV4aXN0c1N5bmMobWFwKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKG1hcCwgJ3V0Zi04JykudG9TdHJpbmcoKS50cmltKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzTWFwKG1hcCkge1xuICAgICAgICBpZiAoIHR5cGVvZiBtYXAgIT09ICdvYmplY3QnICkgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gdHlwZW9mIG1hcC5tYXBwaW5ncyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgICAgICAgIHR5cGVvZiBtYXAuX21hcHBpbmdzID09PSAnc3RyaW5nJztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByZXZpb3VzTWFwO1xuIl19
