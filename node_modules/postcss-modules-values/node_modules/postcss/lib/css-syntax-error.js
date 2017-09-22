'use strict';

exports.__esModule = true;

var _supportsColor = require('supports-color');

var _supportsColor2 = _interopRequireDefault(_supportsColor);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _terminalHighlight = require('./terminal-highlight');

var _terminalHighlight2 = _interopRequireDefault(_terminalHighlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The CSS parser throws this error for broken CSS.
 *
 * Custom parsers can throw this error for broken custom syntax using
 * the {@link Node#error} method.
 *
 * PostCSS will use the input source map to detect the original error location.
 * If you wrote a Sass file, compiled it to CSS and then parsed it with PostCSS,
 * PostCSS will show the original position in the Sass file.
 *
 * If you need the position in the PostCSS input
 * (e.g., to debug the previous compiler), use `error.input.file`.
 *
 * @example
 * // Catching and checking syntax error
 * try {
 *   postcss.parse('a{')
 * } catch (error) {
 *   if ( error.name === 'CssSyntaxError' ) {
 *     error //=> CssSyntaxError
 *   }
 * }
 *
 * @example
 * // Raising error from plugin
 * throw node.error('Unknown variable', { plugin: 'postcss-vars' });
 */
var CssSyntaxError = function () {

    /**
     * @param {string} message  - error message
     * @param {number} [line]   - source line of the error
     * @param {number} [column] - source column of the error
     * @param {string} [source] - source code of the broken file
     * @param {string} [file]   - absolute path to the broken file
     * @param {string} [plugin] - PostCSS plugin name, if error came from plugin
     */
    function CssSyntaxError(message, line, column, source, file, plugin) {
        _classCallCheck(this, CssSyntaxError);

        /**
         * @member {string} - Always equal to `'CssSyntaxError'`. You should
         *                    always check error type
         *                    by `error.name === 'CssSyntaxError'` instead of
         *                    `error instanceof CssSyntaxError`, because
         *                    npm could have several PostCSS versions.
         *
         * @example
         * if ( error.name === 'CssSyntaxError' ) {
         *   error //=> CssSyntaxError
         * }
         */
        this.name = 'CssSyntaxError';
        /**
         * @member {string} - Error message.
         *
         * @example
         * error.message //=> 'Unclosed block'
         */
        this.reason = message;

        if (file) {
            /**
             * @member {string} - Absolute path to the broken file.
             *
             * @example
             * error.file       //=> 'a.sass'
             * error.input.file //=> 'a.css'
             */
            this.file = file;
        }
        if (source) {
            /**
             * @member {string} - Source code of the broken file.
             *
             * @example
             * error.source       //=> 'a { b {} }'
             * error.input.column //=> 'a b { }'
             */
            this.source = source;
        }
        if (plugin) {
            /**
             * @member {string} - Plugin name, if error came from plugin.
             *
             * @example
             * error.plugin //=> 'postcss-vars'
             */
            this.plugin = plugin;
        }
        if (typeof line !== 'undefined' && typeof column !== 'undefined') {
            /**
             * @member {number} - Source line of the error.
             *
             * @example
             * error.line       //=> 2
             * error.input.line //=> 4
             */
            this.line = line;
            /**
             * @member {number} - Source column of the error.
             *
             * @example
             * error.column       //=> 1
             * error.input.column //=> 4
             */
            this.column = column;
        }

        this.setMessage();

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CssSyntaxError);
        }
    }

    CssSyntaxError.prototype.setMessage = function setMessage() {
        /**
         * @member {string} - Full error text in the GNU error format
         *                    with plugin, file, line and column.
         *
         * @example
         * error.message //=> 'a.css:1:1: Unclosed block'
         */
        this.message = this.plugin ? this.plugin + ': ' : '';
        this.message += this.file ? this.file : '<css input>';
        if (typeof this.line !== 'undefined') {
            this.message += ':' + this.line + ':' + this.column;
        }
        this.message += ': ' + this.reason;
    };

    /**
     * Returns a few lines of CSS source that caused the error.
     *
     * If the CSS has an input source map without `sourceContent`,
     * this method will return an empty string.
     *
     * @param {boolean} [color] whether arrow will be colored red by terminal
     *                          color codes. By default, PostCSS will detect
     *                          color support by `process.stdout.isTTY`
     *                          and `process.env.NODE_DISABLE_COLORS`.
     *
     * @example
     * error.showSourceCode() //=> "  4 | }
     *                        //      5 | a {
     *                        //    > 6 |   bad
     *                        //        |   ^
     *                        //      7 | }
     *                        //      8 | b {"
     *
     * @return {string} few lines of CSS source that caused the error
     */


    CssSyntaxError.prototype.showSourceCode = function showSourceCode(color) {
        var _this = this;

        if (!this.source) return '';

        var css = this.source;
        if (typeof color === 'undefined') color = _supportsColor2.default;
        if (color) css = (0, _terminalHighlight2.default)(css);

        var lines = css.split(/\r?\n/);
        var start = Math.max(this.line - 3, 0);
        var end = Math.min(this.line + 2, lines.length);

        var maxWidth = String(end).length;

        function mark(text) {
            if (color && _chalk2.default.red) {
                return _chalk2.default.red.bold(text);
            } else {
                return text;
            }
        }
        function aside(text) {
            if (color && _chalk2.default.gray) {
                return _chalk2.default.gray(text);
            } else {
                return text;
            }
        }

        return lines.slice(start, end).map(function (line, index) {
            var number = start + 1 + index;
            var gutter = ' ' + (' ' + number).slice(-maxWidth) + ' | ';
            if (number === _this.line) {
                var spacing = aside(gutter.replace(/\d/g, ' ')) + line.slice(0, _this.column - 1).replace(/[^\t]/g, ' ');
                return mark('>') + aside(gutter) + line + '\n ' + spacing + mark('^');
            } else {
                return ' ' + aside(gutter) + line;
            }
        }).join('\n');
    };

    /**
     * Returns error position, message and source code of the broken part.
     *
     * @example
     * error.toString() //=> "CssSyntaxError: app.css:1:1: Unclosed block
     *                  //    > 1 | a {
     *                  //        | ^"
     *
     * @return {string} error position, message and source code
     */


    CssSyntaxError.prototype.toString = function toString() {
        var code = this.showSourceCode();
        if (code) {
            code = '\n\n' + code + '\n';
        }
        return this.name + ': ' + this.message + code;
    };

    /**
     * @memberof CssSyntaxError#
     * @member {Input} input - Input object with PostCSS internal information
     *                         about input file. If input has source map
     *                         from previous tool, PostCSS will use origin
     *                         (for example, Sass) source. You can use this
     *                         object to get PostCSS input source.
     *
     * @example
     * error.input.file //=> 'a.css'
     * error.file       //=> 'a.sass'
     */

    return CssSyntaxError;
}();

exports.default = CssSyntaxError;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNzcy1zeW50YXgtZXJyb3IuZXM2Il0sIm5hbWVzIjpbIkNzc1N5bnRheEVycm9yIiwibWVzc2FnZSIsImxpbmUiLCJjb2x1bW4iLCJzb3VyY2UiLCJmaWxlIiwicGx1Z2luIiwibmFtZSIsInJlYXNvbiIsInNldE1lc3NhZ2UiLCJFcnJvciIsImNhcHR1cmVTdGFja1RyYWNlIiwic2hvd1NvdXJjZUNvZGUiLCJjb2xvciIsImNzcyIsImxpbmVzIiwic3BsaXQiLCJzdGFydCIsIk1hdGgiLCJtYXgiLCJlbmQiLCJtaW4iLCJsZW5ndGgiLCJtYXhXaWR0aCIsIlN0cmluZyIsIm1hcmsiLCJ0ZXh0IiwicmVkIiwiYm9sZCIsImFzaWRlIiwiZ3JheSIsInNsaWNlIiwibWFwIiwiaW5kZXgiLCJudW1iZXIiLCJndXR0ZXIiLCJzcGFjaW5nIiwicmVwbGFjZSIsImpvaW4iLCJ0b1N0cmluZyIsImNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUE7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTJCTUEsYzs7QUFFRjs7Ozs7Ozs7QUFRQSw0QkFBWUMsT0FBWixFQUFxQkMsSUFBckIsRUFBMkJDLE1BQTNCLEVBQW1DQyxNQUFuQyxFQUEyQ0MsSUFBM0MsRUFBaURDLE1BQWpELEVBQXlEO0FBQUE7O0FBQ3JEOzs7Ozs7Ozs7Ozs7QUFZQSxhQUFLQyxJQUFMLEdBQVksZ0JBQVo7QUFDQTs7Ozs7O0FBTUEsYUFBS0MsTUFBTCxHQUFjUCxPQUFkOztBQUVBLFlBQUtJLElBQUwsRUFBWTtBQUNSOzs7Ozs7O0FBT0EsaUJBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUNIO0FBQ0QsWUFBS0QsTUFBTCxFQUFjO0FBQ1Y7Ozs7Ozs7QUFPQSxpQkFBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0g7QUFDRCxZQUFLRSxNQUFMLEVBQWM7QUFDVjs7Ozs7O0FBTUEsaUJBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNIO0FBQ0QsWUFBSyxPQUFP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QUFOLENBQVosR0FBNEJqQyxJQUE1QixHQUFtQyxLQUFuQyxHQUNBa0MsT0FEQSxHQUNVWCxLQUFLLEdBQUwsQ0FEakI7QUFFSCxhQU5ELE1BTU87QUFDSCx1QkFBTyxNQUFNSSxNQUFNTSxNQUFOLENBQU4sR0FBc0JqQyxJQUE3QjtBQUNIO0FBQ0osU0FaTSxFQVlKb0MsSUFaSSxDQVlDLElBWkQsQ0FBUDtBQWFILEs7O0FBRUQ7Ozs7Ozs7Ozs7Ozs2QkFVQUMsUSx1QkFBVztBQUNQLFlBQUlDLE9BQU8sS0FBSzVCLGNBQUwsRUFBWDtBQUNBLFlBQUs0QixJQUFMLEVBQVk7QUFDUkEsbUJBQU8sU0FBU0EsSUFBVCxHQUFnQixJQUF2QjtBQUNIO0FBQ0QsZUFBTyxLQUFLakMsSUFBTCxHQUFZLElBQVosR0FBbUIsS0FBS04sT0FBeEIsR0FBa0N1QyxJQUF6QztBQUNILEs7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBZVd4QyxjIiwiZmlsZSI6ImNzcy1zeW50YXgtZXJyb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3VwcG9ydHNDb2xvciBmcm9tICdzdXBwb3J0cy1jb2xvcic7XG5pbXBvcnQgY2hhbGsgICAgICAgICBmcm9tICdjaGFsayc7XG5cbmltcG9ydCB0ZXJtaW5hbEhpZ2hsaWdodCBmcm9tICcuL3Rlcm1pbmFsLWhpZ2hsaWdodCc7XG5cbi8qKlxuICogVGhlIENTUyBwYXJzZXIgdGhyb3dzIHRoaXMgZXJyb3IgZm9yIGJyb2tlbiBDU1MuXG4gKlxuICogQ3VzdG9tIHBhcnNlcnMgY2FuIHRocm93IHRoaXMgZXJyb3IgZm9yIGJyb2tlbiBjdXN0b20gc3ludGF4IHVzaW5nXG4gKiB0aGUge0BsaW5rIE5vZGUjZXJyb3J9IG1ldGhvZC5cbiAqXG4gKiBQb3N0Q1NTIHdpbGwgdXNlIHRoZSBpbnB1dCBzb3VyY2UgbWFwIHRvIGRldGVjdCB0aGUgb3JpZ2luYWwgZXJyb3IgbG9jYXRpb24uXG4gKiBJZiB5b3Ugd3JvdGUgYSBTYXNzIGZpbGUsIGNvbXBpbGVkIGl0IHRvIENTUyBhbmQgdGhlbiBwYXJzZWQgaXQgd2l0aCBQb3N0Q1NTLFxuICogUG9zdENTUyB3aWxsIHNob3cgdGhlIG9yaWdpbmFsIHBvc2l0aW9uIGluIHRoZSBTYXNzIGZpbGUuXG4gKlxuICogSWYgeW91IG5lZWQgdGhlIHBvc2l0aW9uIGluIHRoZSBQb3N0Q1NTIGlucHV0XG4gKiAoZS5nLiwgdG8gZGVidWcgdGhlIHByZXZpb3VzIGNvbXBpbGVyKSwgdXNlIGBlcnJvci5pbnB1dC5maWxlYC5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQ2F0Y2hpbmcgYW5kIGNoZWNraW5nIHN5bnRheCBlcnJvclxuICogdHJ5IHtcbiAqICAgcG9zdGNzcy5wYXJzZSgnYXsnKVxuICogfSBjYXRjaCAoZXJyb3IpIHtcbiAqICAgaWYgKCBlcnJvci5uYW1lID09PSAnQ3NzU3ludGF4RXJyb3InICkge1xuICogICAgIGVycm9yIC8vPT4gQ3NzU3ludGF4RXJyb3JcbiAqICAgfVxuICogfVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBSYWlzaW5nIGVycm9yIGZyb20gcGx1Z2luXG4gKiB0aHJvdyBub2RlLmVycm9yKCdVbmtub3duIHZhcmlhYmxlJywgeyBwbHVnaW46ICdwb3N0Y3NzLXZhcnMnIH0pO1xuICovXG5jbGFzcyBDc3NTeW50YXhFcnJvciB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAgLSBlcnJvciBtZXNzYWdlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtsaW5lXSAgIC0gc291cmNlIGxpbmUgb2YgdGhlIGVycm9yXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtjb2x1bW5dIC0gc291cmNlIGNvbHVtbiBvZiB0aGUgZXJyb3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3NvdXJjZV0gLSBzb3VyY2UgY29kZSBvZiB0aGUgYnJva2VuIGZpbGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2ZpbGVdICAgLSBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBicm9rZW4gZmlsZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbcGx1Z2luXSAtIFBvc3RDU1MgcGx1Z2luIG5hbWUsIGlmIGVycm9yIGNhbWUgZnJvbSBwbHVnaW5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBsaW5lLCBjb2x1bW4sIHNvdXJjZSwgZmlsZSwgcGx1Z2luKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gQWx3YXlzIGVxdWFsIHRvIGAnQ3NzU3ludGF4RXJyb3InYC4gWW91IHNob3VsZFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgYWx3YXlzIGNoZWNrIGVycm9yIHR5cGVcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgIGJ5IGBlcnJvci5uYW1lID09PSAnQ3NzU3ludGF4RXJyb3InYCBpbnN0ZWFkIG9mXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICBgZXJyb3IgaW5zdGFuY2VvZiBDc3NTeW50YXhFcnJvcmAsIGJlY2F1c2VcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgIG5wbSBjb3VsZCBoYXZlIHNldmVyYWwgUG9zdENTUyB2ZXJzaW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogaWYgKCBlcnJvci5uYW1lID09PSAnQ3NzU3ludGF4RXJyb3InICkge1xuICAgICAgICAgKiAgIGVycm9yIC8vPT4gQ3NzU3ludGF4RXJyb3JcbiAgICAgICAgICogfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uYW1lID0gJ0Nzc1N5bnRheEVycm9yJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSBFcnJvciBtZXNzYWdlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBlcnJvci5tZXNzYWdlIC8vPT4gJ1VuY2xvc2VkIGJsb2NrJ1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZWFzb24gPSBtZXNzYWdlO1xuXG4gICAgICAgIGlmICggZmlsZSApIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIEFic29sdXRlIHBhdGggdG8gdGhlIGJyb2tlbiBmaWxlLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgICAgKiBlcnJvci5maWxlICAgICAgIC8vPT4gJ2Euc2FzcydcbiAgICAgICAgICAgICAqIGVycm9yLmlucHV0LmZpbGUgLy89PiAnYS5jc3MnXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuZmlsZSA9IGZpbGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBzb3VyY2UgKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSBTb3VyY2UgY29kZSBvZiB0aGUgYnJva2VuIGZpbGUuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIGVycm9yLnNvdXJjZSAgICAgICAvLz0+ICdhIHsgYiB7fSB9J1xuICAgICAgICAgICAgICogZXJyb3IuaW5wdXQuY29sdW1uIC8vPT4gJ2EgYiB7IH0nXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICggcGx1Z2luICkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gUGx1Z2luIG5hbWUsIGlmIGVycm9yIGNhbWUgZnJvbSBwbHVnaW4uXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIGVycm9yLnBsdWdpbiAvLz0+ICdwb3N0Y3NzLXZhcnMnXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgICAgICB9XG4gICAgICAgIGlmICggdHlwZW9mIGxpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBjb2x1bW4gIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IC0gU291cmNlIGxpbmUgb2YgdGhlIGVycm9yLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgICAgKiBlcnJvci5saW5lICAgICAgIC8vPT4gMlxuICAgICAgICAgICAgICogZXJyb3IuaW5wdXQubGluZSAvLz0+IDRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5saW5lICAgPSBsaW5lO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IC0gU291cmNlIGNvbHVtbiBvZiB0aGUgZXJyb3IuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIGVycm9yLmNvbHVtbiAgICAgICAvLz0+IDFcbiAgICAgICAgICAgICAqIGVycm9yLmlucHV0LmNvbHVtbiAvLz0+IDRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldE1lc3NhZ2UoKTtcblxuICAgICAgICBpZiAoIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlICkge1xuICAgICAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgQ3NzU3ludGF4RXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TWVzc2FnZSgpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSBGdWxsIGVycm9yIHRleHQgaW4gdGhlIEdOVSBlcnJvciBmb3JtYXRcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgIHdpdGggcGx1Z2luLCBmaWxlLCBsaW5lIGFuZCBjb2x1bW4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGVycm9yLm1lc3NhZ2UgLy89PiAnYS5jc3M6MToxOiBVbmNsb3NlZCBibG9jaydcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubWVzc2FnZSAgPSB0aGlzLnBsdWdpbiA/IHRoaXMucGx1Z2luICsgJzogJyA6ICcnO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgKz0gdGhpcy5maWxlID8gdGhpcy5maWxlIDogJzxjc3MgaW5wdXQ+JztcbiAgICAgICAgaWYgKCB0eXBlb2YgdGhpcy5saW5lICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZSArPSAnOicgKyB0aGlzLmxpbmUgKyAnOicgKyB0aGlzLmNvbHVtbjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1lc3NhZ2UgKz0gJzogJyArIHRoaXMucmVhc29uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmZXcgbGluZXMgb2YgQ1NTIHNvdXJjZSB0aGF0IGNhdXNlZCB0aGUgZXJyb3IuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgQ1NTIGhhcyBhbiBpbnB1dCBzb3VyY2UgbWFwIHdpdGhvdXQgYHNvdXJjZUNvbnRlbnRgLFxuICAgICAqIHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIGFuIGVtcHR5IHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NvbG9yXSB3aGV0aGVyIGFycm93IHdpbGwgYmUgY29sb3JlZCByZWQgYnkgdGVybWluYWxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgY29kZXMuIEJ5IGRlZmF1bHQsIFBvc3RDU1Mgd2lsbCBkZXRlY3RcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3Igc3VwcG9ydCBieSBgcHJvY2Vzcy5zdGRvdXQuaXNUVFlgXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBgcHJvY2Vzcy5lbnYuTk9ERV9ESVNBQkxFX0NPTE9SU2AuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGVycm9yLnNob3dTb3VyY2VDb2RlKCkgLy89PiBcIiAgNCB8IH1cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgNSB8IGEge1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgPiA2IHwgICBiYWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICB8ICAgXlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICA3IHwgfVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICA4IHwgYiB7XCJcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gZmV3IGxpbmVzIG9mIENTUyBzb3VyY2UgdGhhdCBjYXVzZWQgdGhlIGVycm9yXG4gICAgICovXG4gICAgc2hvd1NvdXJjZUNvZGUoY29sb3IpIHtcbiAgICAgICAgaWYgKCAhdGhpcy5zb3VyY2UgKSByZXR1cm4gJyc7XG5cbiAgICAgICAgbGV0IGNzcyA9IHRoaXMuc291cmNlO1xuICAgICAgICBpZiAoIHR5cGVvZiBjb2xvciA9PT0gJ3VuZGVmaW5lZCcgKSBjb2xvciA9IHN1cHBvcnRzQ29sb3I7XG4gICAgICAgIGlmICggY29sb3IgKSBjc3MgPSB0ZXJtaW5hbEhpZ2hsaWdodChjc3MpO1xuXG4gICAgICAgIGxldCBsaW5lcyA9IGNzcy5zcGxpdCgvXFxyP1xcbi8pO1xuICAgICAgICBsZXQgc3RhcnQgPSBNYXRoLm1heCh0aGlzLmxpbmUgLSAzLCAwKTtcbiAgICAgICAgbGV0IGVuZCAgID0gTWF0aC5taW4odGhpcy5saW5lICsgMiwgbGluZXMubGVuZ3RoKTtcblxuICAgICAgICBsZXQgbWF4V2lkdGggPSBTdHJpbmcoZW5kKS5sZW5ndGg7XG5cbiAgICAgICAgZnVuY3Rpb24gbWFyayh0ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIGNvbG9yICYmIGNoYWxrLnJlZCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hhbGsucmVkLmJvbGQodGV4dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFzaWRlKHRleHQpIHtcbiAgICAgICAgICAgIGlmICggY29sb3IgJiYgY2hhbGsuZ3JheSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hhbGsuZ3JheSh0ZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKCAobGluZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGxldCBudW1iZXIgPSBzdGFydCArIDEgKyBpbmRleDtcbiAgICAgICAgICAgIGxldCBndXR0ZXIgPSAnICcgKyAoJyAnICsgbnVtYmVyKS5zbGljZSgtbWF4V2lkdGgpICsgJyB8ICc7XG4gICAgICAgICAgICBpZiAoIG51bWJlciA9PT0gdGhpcy5saW5lICkge1xuICAgICAgICAgICAgICAgIGxldCBzcGFjaW5nID1cbiAgICAgICAgICAgICAgICAgICAgYXNpZGUoZ3V0dGVyLnJlcGxhY2UoL1xcZC9nLCAnICcpKSArXG4gICAgICAgICAgICAgICAgICAgIGxpbmUuc2xpY2UoMCwgdGhpcy5jb2x1bW4gLSAxKS5yZXBsYWNlKC9bXlxcdF0vZywgJyAnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFyaygnPicpICsgYXNpZGUoZ3V0dGVyKSArIGxpbmUgKyAnXFxuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICBzcGFjaW5nICsgbWFyaygnXicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyAnICsgYXNpZGUoZ3V0dGVyKSArIGxpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZXJyb3IgcG9zaXRpb24sIG1lc3NhZ2UgYW5kIHNvdXJjZSBjb2RlIG9mIHRoZSBicm9rZW4gcGFydC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogZXJyb3IudG9TdHJpbmcoKSAvLz0+IFwiQ3NzU3ludGF4RXJyb3I6IGFwcC5jc3M6MToxOiBVbmNsb3NlZCBibG9ja1xuICAgICAqICAgICAgICAgICAgICAgICAgLy8gICAgPiAxIHwgYSB7XG4gICAgICogICAgICAgICAgICAgICAgICAvLyAgICAgICAgfCBeXCJcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gZXJyb3IgcG9zaXRpb24sIG1lc3NhZ2UgYW5kIHNvdXJjZSBjb2RlXG4gICAgICovXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGxldCBjb2RlID0gdGhpcy5zaG93U291cmNlQ29kZSgpO1xuICAgICAgICBpZiAoIGNvZGUgKSB7XG4gICAgICAgICAgICBjb2RlID0gJ1xcblxcbicgKyBjb2RlICsgJ1xcbic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZSArICc6ICcgKyB0aGlzLm1lc3NhZ2UgKyBjb2RlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBDc3NTeW50YXhFcnJvciNcbiAgICAgKiBAbWVtYmVyIHtJbnB1dH0gaW5wdXQgLSBJbnB1dCBvYmplY3Qgd2l0aCBQb3N0Q1NTIGludGVybmFsIGluZm9ybWF0aW9uXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgYWJvdXQgaW5wdXQgZmlsZS4gSWYgaW5wdXQgaGFzIHNvdXJjZSBtYXBcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIHByZXZpb3VzIHRvb2wsIFBvc3RDU1Mgd2lsbCB1c2Ugb3JpZ2luXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgKGZvciBleGFtcGxlLCBTYXNzKSBzb3VyY2UuIFlvdSBjYW4gdXNlIHRoaXNcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QgdG8gZ2V0IFBvc3RDU1MgaW5wdXQgc291cmNlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBlcnJvci5pbnB1dC5maWxlIC8vPT4gJ2EuY3NzJ1xuICAgICAqIGVycm9yLmZpbGUgICAgICAgLy89PiAnYS5zYXNzJ1xuICAgICAqL1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENzc1N5bnRheEVycm9yO1xuIl19
