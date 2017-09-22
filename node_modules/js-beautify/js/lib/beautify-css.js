/*jshint curly:false, eqeqeq:true, laxbreak:true, noempty:false */
/* AUTO-GENERATED. DO NOT MODIFY. */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


 CSS Beautifier
---------------

    Written by Harutyun Amirjanyan, (amirjanyan@gmail.com)

    Based on code initially developed by: Einar Lielmanis, <einar@jsbeautifier.org>
        http://jsbeautifier.org/

    Usage:
        css_beautify(source_text);
        css_beautify(source_text, options);

    The options are (default in brackets):
        indent_size (4)                         — indentation size,
        indent_char (space)                     — character to indent with,
        selector_separator_newline (true)       - separate selectors with newline or
                                                  not (e.g. "a,\nbr" or "a, br")
        end_with_newline (false)                - end with a newline
        newline_between_rules (true)            - add a new line after every css rule
        space_around_selector_separator (false) - ensure space around selector separators:
                                                  '>', '+', '~' (e.g. "a>b" -> "a > b")
    e.g

    css_beautify(css_source_text, {
      'indent_size': 1,
      'indent_char': '\t',
      'selector_separator': ' ',
      'end_with_newline': false,
      'newline_between_rules': true,
      'space_around_selector_separator': true
    });
*/

// http://www.w3.org/TR/CSS21/syndata.html#tokenization
// http://www.w3.org/TR/css3-syntax/

(function() {
var legacy_beautify_css =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

var mergeOpts = __webpack_require__(2).mergeOpts;
var acorn = __webpack_require__(1);
var Output = __webpack_require__(3).Output;


var lineBreak = acorn.lineBreak;
var allLineBreaks = acorn.allLineBreaks;

function Beautifier(source_text, options) {
    options = options || {};

    // Allow the setting of language/file-type specific options
    // with inheritance of overall settings
    options = mergeOpts(options, 'css');

    source_text = source_text || '';

    var newlinesFromLastWSEat = 0;
    var indentSize = options.indent_size ? parseInt(options.indent_size, 10) : 4;
    var indentCharacter = options.indent_char || ' ';
    var preserve_newlines = (options.preserve_newlines === undefined) ? false : options.preserve_newlines;
    var selectorSeparatorNewline = (options.selector_separator_newline === undefined) ? true : options.selector_separator_newline;
    var end_with_newline = (options.end_with_newline === undefined) ? false : options.end_with_newline;
    var newline_between_rules = (options.newline_between_rules === undefined) ? true : options.newline_between_rules;
    var space_around_combinator = (options.space_around_combinator === undefined) ? false : options.space_around_combinator;
    space_around_combinator = space_around_combinator || ((options.space_around_selector_separator === undefined) ? false : options.space_around_selector_separator);
    var eol = options.eol ? options.eol : 'auto';

    if (options.indent_with_tabs) {
        indentCharacter = '\t';
        indentSize = 1;
    }

    if (eol === 'auto') {
        eol = '\n';
        if (source_text && lineBreak.test(source_text || '')) {
            eol = source_text.match(lineBreak)[0];
        }
    }

    eol = eol.replace(/\\r/, '\r').replace(/\\n/, '\n');

    // HACK: newline parsing inconsistent. This brute force normalizes the input.
    source_text = source_text.replace(allLineBreaks, '\n');

    // tokenizer
    var whiteRe = /^\s+$/;

    var pos = -1,
        ch;
    var parenLevel = 0;

    function next() {
        ch = source_text.charAt(++pos);
        return ch || '';
    }

    function peek(skipWhitespace) {
        var result = '';
        var prev_pos = pos;
        if (skipWhitespace) {
            eatWhitespace();
        }
        result = source_text.charAt(pos + 1) || '';
        pos = prev_pos - 1;
        next();
        return result;
    }

    function eatString(endChars) {
        var start = pos;
        while (next()) {
            if (ch === "\\") {
                next();
            } else if (endChars.indexOf(ch) !== -1) {
                break;
            } else if (ch === "\n") {
                break;
            }
        }
        return source_text.substring(start, pos + 1);
    }

    function peekString(endChar) {
        var prev_pos = pos;
        var str = eatString(endChar);
        pos = prev_pos - 1;
        next();
        return str;
    }

    function eatWhitespace(preserve_newlines_local) {
        var result = 0;
        while (whiteRe.test(peek())) {
            next();
            if (ch === '\n' && preserve_newlines_local && preserve_newlines) {
                output.add_new_line(true);
                result++;
            }
        }
        newlinesFromLastWSEat = result;
        return result;
    }

    function skipWhitespace() {
        var result = '';
        if (ch && whiteRe.test(ch)) {
            result = ch;
        }
        while (whiteRe.test(next())) {
            result += ch;
        }
        return result;
    }

    function eatComment() {
        var start = pos;
        var singleLine = peek() === "/";
        next();
        while (next()) {
            if (!singleLine && ch === "*" && peek() === "/") {
                next();
                break;
            } else if (singleLine && ch === "\n") {
                return source_text.substring(start, pos);
            }
        }

        return source_text.substring(start, pos) + ch;
    }


    function lookBack(str) {
        return source_text.substring(pos - str.length, pos).toLowerCase() ===
            str;
    }

    // Nested pseudo-class if we are insideRule
    // and the next special character found opens
    // a new block
    function foundNestedPseudoClass() {
        var openParen = 0;
        for (var i = pos + 1; i < source_text.length; i++) {
            var ch = source_text.charAt(i);
            if (ch === "{") {
                return true;
            } else if (ch === '(') {
                // pseudoclasses can contain ()
                openParen += 1;
            } else if (ch === ')') {
                if (openParen === 0) {
                    return false;
                }
                openParen -= 1;
            } else if (ch === ";" || ch === "}") {
                return false;
            }
        }
        return false;
    }

    // printer
    var baseIndentString = '';
    var preindent_index = 0;
    if (source_text && source_text.length) {
        while ((source_text.charAt(preindent_index) === ' ' ||
                source_text.charAt(preindent_index) === '\t')) {
            preindent_index += 1;
        }
        baseIndentString = source_text.substring(0, preindent_index);
        js_source_text = source_text.substring(preindent_index);
    }


    var singleIndent = new Array(indentSize + 1).join(indentCharacter);
    var indentLevel;
    var nestedLevel;
    var output;

    function print_string(output_string) {
        if (output.just_added_newline()) {
            output.set_indent(indentLevel);
        }
        output.add_token(output_string);
    }

    function preserveSingleSpace(isAfterSpace) {
        if (isAfterSpace) {
            output.space_before_token = true;
        }
    }

    function indent() {
        indentLevel++;
    }

    function outdent() {
        if (indentLevel > 0) {
            indentLevel--;
        }
    }

    /*_____________________--------------------_____________________*/

    this.beautify = function() {
        // reset
        output = new Output(singleIndent, baseIndentString);
        indentLevel = 0;
        nestedLevel = 0;

        pos = -1;
        ch = null;
        parenLevel = 0;

        var insideRule = false;
        var insidePropertyValue = false;
        var enteringConditionalGroup = false;
        var top_ch = '';
        var last_top_ch = '';

        while (true) {
            var whitespace = skipWhitespace();
            var isAfterSpace = whitespace !== '';
            var isAfterNewline = whitespace.indexOf('\n') !== -1;
            last_top_ch = top_ch;
            top_ch = ch;

            if (!ch) {
                break;
            } else if (ch === '/' && peek() === '*') { /* css comment */
                var header = indentLevel === 0;

                if (isAfterNewline || header) {
                    output.add_new_line();
                }

                print_string(eatComment());
                output.add_new_line();
                if (header) {
                    output.add_new_line(true);
                }
            } else if (ch === '/' && peek() === '/') { // single line comment
                if (!isAfterNewline && last_top_ch !== '{') {
                    output.trim(true);
                }
                output.space_before_token = true;
                print_string(eatComment());
                output.add_new_line();
            } else if (ch === '@') {
                preserveSingleSpace(isAfterSpace);

                // deal with less propery mixins @{...}
                if (peek() === '{') {
                    print_string(eatString('}'));
                } else {
                    print_string(ch);

                    // strip trailing space, if present, for hash property checks
                    var variableOrRule = peekString(": ,;{}()[]/='\"");

                    if (variableOrRule.match(/[ :]$/)) {
                        // we have a variable or pseudo-class, add it and insert one space before continuing
                        next();
                        variableOrRule = eatString(": ").replace(/\s$/, '');
                        print_string(variableOrRule);
                        output.space_before_token = true;
                    }

                    variableOrRule = variableOrRule.replace(/\s$/, '');

                    // might be a nesting at-rule
                    if (variableOrRule in this.NESTED_AT_RULE) {
                        nestedLevel += 1;
                        if (variableOrRule in this.CONDITIONAL_GROUP_RULE) {
                            enteringConditionalGroup = true;
                        }
                    }
                }
            } else if (ch === '#' && peek() === '{') {
                preserveSingleSpace(isAfterSpace);
                print_string(eatString('}'));
            } else if (ch === '{') {
                if (peek(true) === '}') {
                    eatWhitespace();
                    next();
                    output.space_before_token = true;
                    print_string("{}");
                    if (!eatWhitespace(true)) {
                        output.add_new_line();
                    }

                    if (newlinesFromLastWSEat < 2 && newline_between_rules && indentLevel === 0) {
                        output.add_new_line(true);
                    }
                } else {
                    indent();
                    output.space_before_token = true;
                    print_string(ch);
                    if (!eatWhitespace(true)) {
                        output.add_new_line();
                    }

                    // when entering conditional groups, only rulesets are allowed
                    if (enteringConditionalGroup) {
                        enteringConditionalGroup = false;
                        insideRule = (indentLevel > nestedLevel);
                    } else {
                        // otherwise, declarations are also allowed
                        insideRule = (indentLevel >= nestedLevel);
                    }
                }
            } else if (ch === '}') {
                outdent();
                output.add_new_line();
                print_string(ch);
                insideRule = false;
                insidePropertyValue = false;
                if (nestedLevel) {
                    nestedLevel--;
                }

                if (!eatWhitespace(true)) {
                    output.add_new_line();
                }

                if (newlinesFromLastWSEat < 2 && newline_between_rules && indentLevel === 0) {
                    output.add_new_line(true);
                }
            } else if (ch === ":") {
                eatWhitespace();
                if ((insideRule || enteringConditionalGroup) &&
                    !(lookBack("&") || foundNestedPseudoClass()) &&
                    !lookBack("(")) {
                    // 'property: value' delimiter
                    // which could be in a conditional group query
                    print_string(':');
                    if (!insidePropertyValue) {
                        insidePropertyValue = true;
                        output.space_before_token = true;
                    }
                } else {
                    // sass/less parent reference don't use a space
                    // sass nested pseudo-class don't use a space

                    // preserve space before pseudoclasses/pseudoelements, as it means "in any child"
                    if (lookBack(" ")) {
                        output.space_before_token = true;
                    }
                    if (peek() === ":") {
                        // pseudo-element
                        next();
                        print_string("::");
                    } else {
                        // pseudo-class
                        print_string(':');
                    }
                }
            } else if (ch === '"' || ch === '\'') {
                preserveSingleSpace(isAfterSpace);
                print_string(eatString(ch));
            } else if (ch === ';') {
                insidePropertyValue = false;
                print_string(ch);
                if (!eatWhitespace(true)) {
                    output.add_new_line();
                }
            } else if (ch === '(') { // may be a url
                if (lookBack("url")) {
                    print_string(ch);
                    eatWhitespace();
                    if (next()) {
                        if (ch !== ')' && ch !== '"' && ch !== '\'') {
                            print_string(eatString(')'));
                        } else {
                            pos--;
                        }
                    }
                } else {
                    parenLevel++;
                    preserveSingleSpace(isAfterSpace);
                    print_string(ch);
                    eatWhitespace();
                }
            } else if (ch === ')') {
                print_string(ch);
                parenLevel--;
            } else if (ch === ',') {
                print_string(ch);
                if (!eatWhitespace(true) && selectorSeparatorNewline && !insidePropertyValue && parenLevel < 1) {
                    output.add_new_line();
                } else {
                    output.space_before_token = true;
                }
            } else if ((ch === '>' || ch === '+' || ch === '~') &&
                !insidePropertyValue && parenLevel < 1) {
                //handle combinator spacing
                if (space_around_combinator) {
                    output.space_before_token = true;
                    print_string(ch);
                    output.space_before_token = true;
                } else {
                    print_string(ch);
                    eatWhitespace();
                    // squash extra whitespace
                    if (ch && whiteRe.test(ch)) {
                        ch = '';
                    }
                }
            } else if (ch === ']') {
                print_string(ch);
            } else if (ch === '[') {
                preserveSingleSpace(isAfterSpace);
                print_string(ch);
            } else if (ch === '=') { // no whitespace before or after
                eatWhitespace();
                print_string('=');
                if (whiteRe.test(ch)) {
                    ch = '';
                }

            } else {
                preserveSingleSpace(isAfterSpace);
                print_string(ch);
            }
        }

        var sweetCode = output.get_code(end_with_newline, eol);

        return sweetCode;
    };

    // https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
    this.NESTED_AT_RULE = {
        "@page": true,
        "@font-face": true,
        "@keyframes": true,
        // also in CONDITIONAL_GROUP_RULE below
        "@media": true,
        "@supports": true,
        "@document": true
    };
    this.CONDITIONAL_GROUP_RULE = {
        "@media": true,
        "@supports": true,
        "@document": true
    };
}

module.exports.Beautifier = Beautifier;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/* jshint curly: false */
// This section of code is taken from acorn.
//
// Acorn was written by Marijn Haverbeke and released under an MIT
// license. The Unicode regexps (for identifiers and whitespace) were
// taken from [Esprima](http://esprima.org) by Ariya Hidayat.
//
// Git repositories for Acorn are available at
//
//     http://marijnhaverbeke.nl/git/acorn
//     https://github.com/marijnh/acorn.git

// ## Character categories

// Big ugly regular expressions that match characters in the
// whitespace, identifier, and identifier-start categories. These
// are only applied when a character is found to actually have a
// code point above 128.

var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/; // jshint ignore:line
var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
var nonASCIIidentifierChars = "\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

// Whether a single character denotes a newline.

exports.newline = /[\n\r\u2028\u2029]/;

// Matches a whole line break (where CRLF is considered a single
// line break). Used to count lines.

// in javascript, these two differ
// in python they are the same, different methods are called on them
exports.lineBreak = new RegExp('\r\n|' + exports.newline.source);
exports.allLineBreaks = new RegExp(exports.lineBreak.source, 'g');


// Test whether a given character code starts an identifier.

exports.isIdentifierStart = function(code) {
    // permit $ (36) and @ (64). @ is used in ES7 decorators.
    if (code < 65) return code === 36 || code === 64;
    // 65 through 91 are uppercase letters.
    if (code < 91) return true;
    // permit _ (95).
    if (code < 97) return code === 95;
    // 97 through 123 are lowercase letters.
    if (code < 123) return true;
    return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
};

// Test whether a given character is part of an identifier.

exports.isIdentifierChar = function(code) {
    if (code < 48) return code === 36;
    if (code < 58) return true;
    if (code < 65) return false;
    if (code < 91) return true;
    if (code < 97) return code === 95;
    if (code < 123) return true;
    return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

    The MIT License (MIT)

    Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation files
    (the "Software"), to deal in the Software without restriction,
    including without limitation the rights to use, copy, modify, merge,
    publish, distribute, sublicense, and/or sell copies of the Software,
    and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

function mergeOpts(allOptions, targetType) {
    var finalOpts = {};
    var name;

    for (name in allOptions) {
        if (name !== targetType) {
            finalOpts[name] = allOptions[name];
        }
    }

    //merge in the per type settings for the targetType
    if (targetType in allOptions) {
        for (name in allOptions[targetType]) {
            finalOpts[name] = allOptions[targetType][name];
        }
    }
    return finalOpts;
}

module.exports.mergeOpts = mergeOpts;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

function OutputLine(parent) {
    var _character_count = 0;
    // use indent_count as a marker for lines that have preserved indentation
    var _indent_count = -1;

    var _items = [];
    var _empty = true;

    this.set_indent = function(level) {
        _character_count = parent.baseIndentLength + level * parent.indent_length;
        _indent_count = level;
    };

    this.get_character_count = function() {
        return _character_count;
    };

    this.is_empty = function() {
        return _empty;
    };

    this.last = function() {
        if (!this._empty) {
            return _items[_items.length - 1];
        } else {
            return null;
        }
    };

    this.push = function(input) {
        _items.push(input);
        _character_count += input.length;
        _empty = false;
    };

    this.pop = function() {
        var item = null;
        if (!_empty) {
            item = _items.pop();
            _character_count -= item.length;
            _empty = _items.length === 0;
        }
        return item;
    };

    this.remove_indent = function() {
        if (_indent_count > 0) {
            _indent_count -= 1;
            _character_count -= parent.indent_length;
        }
    };

    this.trim = function() {
        while (this.last() === ' ') {
            _items.pop();
            _character_count -= 1;
        }
        _empty = _items.length === 0;
    };

    this.toString = function() {
        var result = '';
        if (!this._empty) {
            if (_indent_count >= 0) {
                result = parent.indent_cache[_indent_count];
            }
            result += _items.join('');
        }
        return result;
    };
}

function Output(indent_string, baseIndentString) {
    baseIndentString = baseIndentString || '';
    this.indent_cache = [baseIndentString];
    this.baseIndentLength = baseIndentString.length;
    this.indent_length = indent_string.length;
    this.raw = false;

    var lines = [];
    this.baseIndentString = baseIndentString;
    this.indent_string = indent_string;
    this.previous_line = null;
    this.current_line = null;
    this.space_before_token = false;

    this.add_outputline = function() {
        this.previous_line = this.current_line;
        this.current_line = new OutputLine(this);
        lines.push(this.current_line);
    };

    // initialize
    this.add_outputline();


    this.get_line_number = function() {
        return lines.length;
    };

    // Using object instead of string to allow for later expansion of info about each line
    this.add_new_line = function(force_newline) {
        if (this.get_line_number() === 1 && this.just_added_newline()) {
            return false; // no newline on start of file
        }

        if (force_newline || !this.just_added_newline()) {
            if (!this.raw) {
                this.add_outputline();
            }
            return true;
        }

        return false;
    };

    this.get_code = function(end_with_newline, eol) {
        var sweet_code = lines.join('\n').replace(/[\r\n\t ]+$/, '');

        if (end_with_newline) {
            sweet_code += '\n';
        }

        if (eol !== '\n') {
            sweet_code = sweet_code.replace(/[\n]/g, eol);
        }

        return sweet_code;
    };

    this.set_indent = function(level) {
        // Never indent your first output indent at the start of the file
        if (lines.length > 1) {
            while (level >= this.indent_cache.length) {
                this.indent_cache.push(this.indent_cache[this.indent_cache.length - 1] + this.indent_string);
            }

            this.current_line.set_indent(level);
            return true;
        }
        this.current_line.set_indent(0);
        return false;
    };

    this.add_raw_token = function(token) {
        for (var x = 0; x < token.newlines; x++) {
            this.add_outputline();
        }
        this.current_line.push(token.whitespace_before);
        this.current_line.push(token.text);
        this.space_before_token = false;
    };

    this.add_token = function(printable_token) {
        this.add_space_before_token();
        this.current_line.push(printable_token);
    };

    this.add_space_before_token = function() {
        if (this.space_before_token && !this.just_added_newline()) {
            this.current_line.push(' ');
        }
        this.space_before_token = false;
    };

    this.remove_indent = function(index) {
        var output_length = lines.length;
        while (index < output_length) {
            lines[index].remove_indent();
            index++;
        }
    };

    this.trim = function(eat_newlines) {
        eat_newlines = (eat_newlines === undefined) ? false : eat_newlines;

        this.current_line.trim(indent_string, baseIndentString);

        while (eat_newlines && lines.length > 1 &&
            this.current_line.is_empty()) {
            lines.pop();
            this.current_line = lines[lines.length - 1];
            this.current_line.trim();
        }

        this.previous_line = lines.length > 1 ? lines[lines.length - 2] : null;
    };

    this.just_added_newline = function() {
        return this.current_line.is_empty();
    };

    this.just_added_blankline = function() {
        if (this.just_added_newline()) {
            if (lines.length === 1) {
                return true; // start of the file and newline = blank
            }

            var line = lines[lines.length - 2];
            return line.is_empty();
        }
        return false;
    };
}

module.exports.Output = Output;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

    The MIT License (MIT)

    Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation files
    (the "Software"), to deal in the Software without restriction,
    including without limitation the rights to use, copy, modify, merge,
    publish, distribute, sublicense, and/or sell copies of the Software,
    and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

var Beautifier = __webpack_require__(0).Beautifier;

function css_beautify(source_text, options) {
    var beautifier = new Beautifier(source_text, options);
    return beautifier.beautify();
}

module.exports = css_beautify;

/***/ })
/******/ ]);
var css_beautify = legacy_beautify_css;
/* Footer */
if (typeof define === "function" && define.amd) {
    // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
    define([], function() {
        return {
            css_beautify: css_beautify
        };
    });
} else if (typeof exports !== "undefined") {
    // Add support for CommonJS. Just put this file somewhere on your require.paths
    // and you will be able to `var html_beautify = require("beautify").html_beautify`.
    exports.css_beautify = css_beautify;
} else if (typeof window !== "undefined") {
    // If we're running a web page and don't have either of the above, add our one global
    window.css_beautify = css_beautify;
} else if (typeof global !== "undefined") {
    // If we don't even have window, try global.
    global.css_beautify = css_beautify;
}

}());
