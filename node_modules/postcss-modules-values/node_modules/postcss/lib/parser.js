'use strict';

exports.__esModule = true;

var _declaration = require('./declaration');

var _declaration2 = _interopRequireDefault(_declaration);

var _tokenize = require('./tokenize');

var _tokenize2 = _interopRequireDefault(_tokenize);

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

var _atRule = require('./at-rule');

var _atRule2 = _interopRequireDefault(_atRule);

var _root = require('./root');

var _root2 = _interopRequireDefault(_root);

var _rule = require('./rule');

var _rule2 = _interopRequireDefault(_rule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = function () {
    function Parser(input) {
        _classCallCheck(this, Parser);

        this.input = input;

        this.root = new _root2.default();
        this.current = this.root;
        this.spaces = '';
        this.semicolon = false;

        this.createTokenizer();
        this.root.source = { input: input, start: { line: 1, column: 1 } };
    }

    Parser.prototype.createTokenizer = function createTokenizer() {
        this.tokenizer = (0, _tokenize2.default)(this.input);
    };

    Parser.prototype.parse = function parse() {
        var token = void 0;
        while (!this.tokenizer.endOfFile()) {
            token = this.tokenizer.nextToken();

            switch (token[0]) {

                case 'space':
                    this.spaces += token[1];
                    break;

                case ';':
                    this.freeSemicolon(token);
                    break;

                case '}':
                    this.end(token);
                    break;

                case 'comment':
                    this.comment(token);
                    break;

                case 'at-word':
                    this.atrule(token);
                    break;

                case '{':
                    this.emptyRule(token);
                    break;

                default:
                    this.other(token);
                    break;
            }
        }
        this.endFile();
    };

    Parser.prototype.comment = function comment(token) {
        var node = new _comment2.default();
        this.init(node, token[2], token[3]);
        node.source.end = { line: token[4], column: token[5] };

        var text = token[1].slice(2, -2);
        if (/^\s*$/.test(text)) {
            node.text = '';
            node.raws.left = text;
            node.raws.right = '';
        } else {
            var match = text.match(/^(\s*)([^]*[^\s])(\s*)$/);
            node.text = match[2];
            node.raws.left = match[1];
            node.raws.right = match[3];
        }
    };

    Parser.prototype.emptyRule = function emptyRule(token) {
        var node = new _rule2.default();
        this.init(node, token[2], token[3]);
        node.selector = '';
        node.raws.between = '';
        this.current = node;
    };

    Parser.prototype.other = function other(start) {
        var end = false;
        var type = null;
        var colon = false;
        var bracket = null;
        var brackets = [];

        var tokens = [];
        var token = start;
        while (token) {
            type = token[0];
            tokens.push(token);

            if (type === '(' || type === '[') {
                if (!bracket) bracket = token;
                brackets.push(type === '(' ? ')' : ']');
            } else if (brackets.length === 0) {
                if (type === ';') {
                    if (colon) {
                        this.decl(tokens);
                        return;
                    } else {
                        break;
                    }
                } else if (type === '{') {
                    this.rule(tokens);
                    return;
                } else if (type === '}') {
                    this.tokenizer.back(tokens.pop());
                    end = true;
                    break;
                } else if (type === ':') {
                    colon = true;
                }
            } else if (type === brackets[brackets.length - 1]) {
                brackets.pop();
                if (brackets.length === 0) bracket = null;
            }

            token = this.tokenizer.nextToken();
        }

        if (this.tokenizer.endOfFile()) end = true;
        if (brackets.length > 0) this.unclosedBracket(bracket);

        if (end && colon) {
            while (tokens.length) {
                token = tokens[tokens.length - 1][0];
                if (token !== 'space' && token !== 'comment') break;
                this.tokenizer.back(tokens.pop());
            }
            this.decl(tokens);
            return;
        } else {
            this.unknownWord(tokens);
        }
    };

    Parser.prototype.rule = function rule(tokens) {
        tokens.pop();

        var node = new _rule2.default();
        this.init(node, tokens[0][2], tokens[0][3]);

        node.raws.between = this.spacesAndCommentsFromEnd(tokens);
        this.raw(node, 'selector', tokens);
        this.current = node;
    };

    Parser.prototype.decl = function decl(tokens) {
        var node = new _declaration2.default();
        this.init(node);

        var last = tokens[tokens.length - 1];
        if (last[0] === ';') {
            this.semicolon = true;
            tokens.pop();
        }
        if (last[4]) {
            node.source.end = { line: last[4], column: last[5] };
        } else {
            node.source.end = { line: last[2], column: last[3] };
        }

        while (tokens[0][0] !== 'word') {
            if (tokens.length === 1) this.unknownWord(tokens);
            node.raws.before += tokens.shift()[1];
        }
        node.source.start = { line: tokens[0][2], column: tokens[0][3] };

        node.prop = '';
        while (tokens.length) {
            var type = tokens[0][0];
            if (type === ':' || type === 'space' || type === 'comment') {
                break;
            }
            node.prop += tokens.shift()[1];
        }

        node.raws.between = '';

        var token = void 0;
        while (tokens.length) {
            token = tokens.shift();

            if (token[0] === ':') {
                node.raws.between += token[1];
                break;
            } else {
                node.raws.between += token[1];
            }
        }

        if (node.prop[0] === '_' || node.prop[0] === '*') {
            node.raws.before += node.prop[0];
            node.prop = node.prop.slice(1);
        }
        node.raws.between += this.spacesAndCommentsFromStart(tokens);
        this.precheckMissedSemicolon(tokens);

        for (var i = tokens.length - 1; i > 0; i--) {
            token = tokens[i];
            if (token[1].toLowerCase() === '!important') {
                node.important = true;
                var string = this.stringFrom(tokens, i);
                string = this.spacesFromEnd(tokens) + string;
                if (string !== ' !important') node.raws.important = string;
                break;
            } else if (token[1].toLowerCase() === 'important') {
                var cache = tokens.slice(0);
                var str = '';
                for (var j = i; j > 0; j--) {
                    var _type = cache[j][0];
                    if (str.trim().indexOf('!') === 0 && _type !== 'space') {
                        break;
                    }
                    str = cache.pop()[1] + str;
                }
                if (str.trim().indexOf('!') === 0) {
                    node.important = true;
                    node.raws.important = str;
                    tokens = cache;
                }
            }

            if (token[0] !== 'space' && token[0] !== 'comment') {
                break;
            }
        }

        this.raw(node, 'value', tokens);

        if (node.value.indexOf(':') !== -1) this.checkMissedSemicolon(tokens);
    };

    Parser.prototype.atrule = function atrule(token) {
        var node = new _atRule2.default();
        node.name = token[1].slice(1);
        if (node.name === '') {
            this.unnamedAtrule(node, token);
        }
        this.init(node, token[2], token[3]);

        var prev = void 0;
        var shift = void 0;
        var last = false;
        var open = false;
        var params = [];

        while (!this.tokenizer.endOfFile()) {
            token = this.tokenizer.nextToken();

            if (token[0] === ';') {
                node.source.end = { line: token[2], column: token[3] };
                this.semicolon = true;
                break;
            } else if (token[0] === '{') {
                open = true;
                break;
            } else if (token[0] === '}') {
                if (params.length > 0) {
                    shift = params.length - 1;
                    prev = params[shift];
                    while (prev && prev[0] === 'space') {
                        prev = params[--shift];
                    }
                    if (prev) {
                        node.source.end = { line: prev[4], column: prev[5] };
                    }
                }
                this.end(token);
                break;
            } else {
                params.push(token);
            }

            if (this.tokenizer.endOfFile()) {
                last = true;
                break;
            }
        }

        node.raws.between = this.spacesAndCommentsFromEnd(params);
        if (params.length) {
            node.raws.afterName = this.spacesAndCommentsFromStart(params);
            this.raw(node, 'params', params);
            if (last) {
                token = params[params.length - 1];
                node.source.end = { line: token[4], column: token[5] };
                this.spaces = node.raws.between;
                node.raws.between = '';
            }
        } else {
            node.raws.afterName = '';
            node.params = '';
        }

        if (open) {
            node.nodes = [];
            this.current = node;
        }
    };

    Parser.prototype.end = function end(token) {
        if (this.current.nodes && this.current.nodes.length) {
            this.current.raws.semicolon = this.semicolon;
        }
        this.semicolon = false;

        this.current.raws.after = (this.current.raws.after || '') + this.spaces;
        this.spaces = '';

        if (this.current.parent) {
            this.current.source.end = { line: token[2], column: token[3] };
            this.current = this.current.parent;
        } else {
            this.unexpectedClose(token);
        }
    };

    Parser.prototype.endFile = function endFile() {
        if (this.current.parent) this.unclosedBlock();
        if (this.current.nodes && this.current.nodes.length) {
            this.current.raws.semicolon = this.semicolon;
        }
        this.current.raws.after = (this.current.raws.after || '') + this.spaces;
    };

    Parser.prototype.freeSemicolon = function freeSemicolon(token) {
        this.spaces += token[1];
        if (this.current.nodes) {
            var prev = this.current.nodes[this.current.nodes.length - 1];
            if (prev && prev.type === 'rule' && !prev.raws.ownSemicolon) {
                prev.raws.ownSemicolon = this.spaces;
                this.spaces = '';
            }
        }
    };

    // Helpers

    Parser.prototype.init = function init(node, line, column) {
        this.current.push(node);

        node.source = { start: { line: line, column: column }, input: this.input };
        node.raws.before = this.spaces;
        this.spaces = '';
        if (node.type !== 'comment') this.semicolon = false;
    };

    Parser.prototype.raw = function raw(node, prop, tokens) {
        var token = void 0,
            type = void 0;
        var length = tokens.length;
        var value = '';
        var clean = true;
        for (var i = 0; i < length; i += 1) {
            token = tokens[i];
            type = token[0];
            if (type === 'comment' || type === 'space' && i === length - 1) {
                clean = false;
            } else {
                value += token[1];
            }
        }
        if (!clean) {
            var raw = tokens.reduce(function (all, i) {
                return all + i[1];
            }, '');
            node.raws[prop] = { value: value, raw: raw };
        }
        node[prop] = value;
    };

    Parser.prototype.spacesAndCommentsFromEnd = function spacesAndCommentsFromEnd(tokens) {
        var lastTokenType = void 0;
        var spaces = '';
        while (tokens.length) {
            lastTokenType = tokens[tokens.length - 1][0];
            if (lastTokenType !== 'space' && lastTokenType !== 'comment') break;
            spaces = tokens.pop()[1] + spaces;
        }
        return spaces;
    };

    Parser.prototype.spacesAndCommentsFromStart = function spacesAndCommentsFromStart(tokens) {
        var next = void 0;
        var spaces = '';
        while (tokens.length) {
            next = tokens[0][0];
            if (next !== 'space' && next !== 'comment') break;
            spaces += tokens.shift()[1];
        }
        return spaces;
    };

    Parser.prototype.spacesFromEnd = function spacesFromEnd(tokens) {
        var lastTokenType = void 0;
        var spaces = '';
        while (tokens.length) {
            lastTokenType = tokens[tokens.length - 1][0];
            if (lastTokenType !== 'space') break;
            spaces = tokens.pop()[1] + spaces;
        }
        return spaces;
    };

    Parser.prototype.stringFrom = function stringFrom(tokens, from) {
        var result = '';
        for (var i = from; i < tokens.length; i++) {
            result += tokens[i][1];
        }
        tokens.splice(from, tokens.length - from);
        return result;
    };

    Parser.prototype.colon = function colon(tokens) {
        var brackets = 0;
        var token = void 0,
            type = void 0,
            prev = void 0;
        for (var i = 0; i < tokens.length; i++) {
            token = tokens[i];
            type = token[0];

            if (type === '(') {
                brackets += 1;
            } else if (type === ')') {
                brackets -= 1;
            } else if (brackets === 0 && type === ':') {
                if (!prev) {
                    this.doubleColon(token);
                } else if (prev[0] === 'word' && prev[1] === 'progid') {
                    continue;
                } else {
                    return i;
                }
            }

            prev = token;
        }
        return false;
    };

    // Errors

    Parser.prototype.unclosedBracket = function unclosedBracket(bracket) {
        throw this.input.error('Unclosed bracket', bracket[2], bracket[3]);
    };

    Parser.prototype.unknownWord = function unknownWord(tokens) {
        throw this.input.error('Unknown word', tokens[0][2], tokens[0][3]);
    };

    Parser.prototype.unexpectedClose = function unexpectedClose(token) {
        throw this.input.error('Unexpected }', token[2], token[3]);
    };

    Parser.prototype.unclosedBlock = function unclosedBlock() {
        var pos = this.current.source.start;
        throw this.input.error('Unclosed block', pos.line, pos.column);
    };

    Parser.prototype.doubleColon = function doubleColon(token) {
        throw this.input.error('Double colon', token[2], token[3]);
    };

    Parser.prototype.unnamedAtrule = function unnamedAtrule(node, token) {
        throw this.input.error('At-rule without name', token[2], token[3]);
    };

    Parser.prototype.precheckMissedSemicolon = function precheckMissedSemicolon(tokens) {
        // Hook for Safe Parser
        tokens;
    };

    Parser.prototype.checkMissedSemicolon = function checkMissedSemicolon(tokens) {
        var colon = this.colon(tokens);
        if (colon === false) return;

        var founded = 0;
        var token = void 0;
        for (var j = colon - 1; j >= 0; j--) {
            token = tokens[j];
            if (token[0] !== 'space') {
                founded += 1;
                if (founded === 2) break;
            }
        }
        throw this.input.error('Missed semicolon', token[2], token[3]);
    };

    return Parser;
}();

exports.default = Parser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlci5lczYiXSwibmFtZXMiOlsiUGFyc2VyIiwiaW5wdXQiLCJyb290IiwiY3VycmVudCIsInNwYWNlcyIsInNlbWljb2xvbiIsImNyZWF0ZVRva2VuaXplciIsInNvdXJjZSIsInN0YXJ0IiwibGluZSIsImNvbHVtbiIsInRva2VuaXplciIsInBhcnNlIiwidG9rZW4iLCJlbmRPZkZpbGUiLCJuZXh0VG9rZW4iLCJmcmVlU2VtaWNvbG9uIiwiZW5kIiwiY29tbWVudCIsImF0cnVsZSIsImVtcHR5UnVsZSIsIm90aGVyIiwiZW5kRmlsZSIsIm5vZGUiLCJpbml0IiwidGV4dCIsInNsaWNlIiwidGVzdCIsInJhd3MiLCJsZWZ0IiwicmlnaHQiLCJtYXRjaCIsInNlbGVjdG9yIiwiYmV0d2VlbiIsInR5cGUiLCJjb2xvbiIsImJyYWNrZXQiLCJicmFja2V0cyIsInRva2VucyIsInB1c2giLCJsZW5ndGgiLCJkZWNsIiwicnVsZSIsImJhY2siLCJwb3AiLCJ1bmNsb3NlZEJyYWNrZXQiLCJ1bmtub3duV29yZCIsInNwYWNlc0FuZENvbW1lbnRzRnJvbUVuZCIsInJhdyIsImxhc3QiLCJiZWZvcmUiLCJzaGlmdCIsInByb3AiLCJzcGFjZXNBbmRDb21tZW50c0Zyb21TdGFydCIsInByZWNoZWNrTWlzc2VkU2VtaWNvbG9uIiwiaSIsInRvTG93ZXJDYXNlIiwiaW1wb3J0YW50Iiwic3RyaW5nIiwic3RyaW5nRnJvbSIsInNwYWNlc0Zyb21FbmQiLCJjYWNoZSIsInN0ciIsImoiLCJ0cmltIiwiaW5kZXhPZiIsInZhbHVlIiwiY2hlY2tNaXNzZWRTZW1pY29sb24iLCJuYW1lIiwidW5uYW1lZEF0cnVsZSIsInByZXYiLCJvcGVuIiwicGFyYW1zIiwiYWZ0ZXJOYW1lIiwibm9kZXMiLCJhZnRlciIsInBhcmVudCIsInVuZXhwZWN0ZWRDbG9zZSIsInVuY2xvc2VkQmxvY2siLCJvd25TZW1pY29sb24iLCJjbGVhbiIsInJlZHVjZSIsImFsbCIsImxhc3RUb2tlblR5cGUiLCJuZXh0IiwiZnJvbSIsInJlc3VsdCIsInNwbGljZSIsImRvdWJsZUNvbG9uIiwiZXJyb3IiLCJwb3MiLCJmb3VuZGVkIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztJQUVxQkEsTTtBQUVqQixvQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUNmLGFBQUtBLEtBQUwsR0FBYUEsS0FBYjs7QUFFQSxhQUFLQyxJQUFMLEdBQWlCLG9CQUFqQjtBQUNBLGFBQUtDLE9BQUwsR0FBaUIsS0FBS0QsSUFBdEI7QUFDQSxhQUFLRSxNQUFMLEdBQWlCLEVBQWpCO0FBQ0EsYUFBS0MsU0FBTCxHQUFpQixLQUFqQjs7QUFFQSxhQUFLQyxlQUFMO0FBQ0EsYUFBS0osSUFBTCxDQUFVSyxNQUFWLEdBQW1CLEVBQUVOLFlBQUYsRUFBU08sT0FBTyxFQUFFQyxNQUFNLENBQVIsRUFBV0MsUUFBUSxDQUFuQixFQUFoQixFQUFuQjtBQUNIOztxQkFFREosZSw4QkFBa0I7QUFDZCxhQUFLSyxTQUFMLEdBQWlCLHdCQUFVLEtBQUtWLEtBQWYsQ0FBakI7QUFDSCxLOztxQkFFRFcsSyxvQkFBUTtBQUNKLFlBQUlDLGNBQUo7QUFDQSxlQUFRLENBQUMsS0FBS0YsU0FBTCxDQUFlRyxTQUFmLEVBQVQsRUFBc0M7QUFDbENELG9CQUFRLEtBQUtGLFNBQUwsQ0FBZUksU0FBZixFQUFSOztBQUVBLG9CQUFTRixNQUFNLENBQU4sQ0FBVDs7QUFFQSxxQkFBSyxPQUFMO0FBQ0kseUJBQUtULE1BQUwsSUFBZVMsTUFBTSxDQUFOLENBQWY7QUFDQTs7QUFFSixxQkFBSyxHQUFMO0FBQ0kseUJBQUtHLGFBQUwsQ0FBbUJILEtBQW5CO0FBQ0E7O0FBRUoscUJBQUssR0FBTDtBQUNJLHlCQUFLSSxHQUFMLENBQVNKLEtBQVQ7QUFDQTs7QUFFSixxQkFBSyxTQUFMO0FBQ0kseUJBQUtLLE9BQUwsQ0FBYUwsS0FBYjtBQUNBOztBQUVKLHFCQUFLLFNBQUw7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Q0FBV0csTUFBWCxDQUFaO0FBQ0EsWUFBS0gsVUFBVSxLQUFmLEVBQXVCOztBQUV2QixZQUFJd0QsVUFBVSxDQUFkO0FBQ0EsWUFBSTlFLGNBQUo7QUFDQSxhQUFNLElBQUlrRCxJQUFJNUIsUUFBUSxDQUF0QixFQUF5QjRCLEtBQUssQ0FBOUIsRUFBaUNBLEdBQWpDLEVBQXVDO0FBQ25DbEQsb0JBQVF5QixPQUFPeUIsQ0FBUCxDQUFSO0FBQ0EsZ0JBQUtsRCxNQUFNLENBQU4sTUFBYSxPQUFsQixFQUE0QjtBQUN4QjhFLDJCQUFXLENBQVg7QUFDQSxvQkFBS0EsWUFBWSxDQUFqQixFQUFxQjtBQUN4QjtBQUNKO0FBQ0QsY0FBTSxLQUFLMUYsS0FBTCxDQUFXd0YsS0FBWCxDQUFpQixrQkFBakIsRUFBcUM1RSxNQUFNLENBQU4sQ0FBckMsRUFBK0NBLE1BQU0sQ0FBTixDQUEvQyxDQUFOO0FBQ0gsSzs7Ozs7a0JBL2VnQmIsTSIsImZpbGUiOiJwYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGVjbGFyYXRpb24gZnJvbSAnLi9kZWNsYXJhdGlvbic7XG5pbXBvcnQgdG9rZW5pemVyICAgZnJvbSAnLi90b2tlbml6ZSc7XG5pbXBvcnQgQ29tbWVudCAgICAgZnJvbSAnLi9jb21tZW50JztcbmltcG9ydCBBdFJ1bGUgICAgICBmcm9tICcuL2F0LXJ1bGUnO1xuaW1wb3J0IFJvb3QgICAgICAgIGZyb20gJy4vcm9vdCc7XG5pbXBvcnQgUnVsZSAgICAgICAgZnJvbSAnLi9ydWxlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKGlucHV0KSB7XG4gICAgICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcblxuICAgICAgICB0aGlzLnJvb3QgICAgICA9IG5ldyBSb290KCk7XG4gICAgICAgIHRoaXMuY3VycmVudCAgID0gdGhpcy5yb290O1xuICAgICAgICB0aGlzLnNwYWNlcyAgICA9ICcnO1xuICAgICAgICB0aGlzLnNlbWljb2xvbiA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlVG9rZW5pemVyKCk7XG4gICAgICAgIHRoaXMucm9vdC5zb3VyY2UgPSB7IGlucHV0LCBzdGFydDogeyBsaW5lOiAxLCBjb2x1bW46IDEgfSB9O1xuICAgIH1cblxuICAgIGNyZWF0ZVRva2VuaXplcigpIHtcbiAgICAgICAgdGhpcy50b2tlbml6ZXIgPSB0b2tlbml6ZXIodGhpcy5pbnB1dCk7XG4gICAgfVxuXG4gICAgcGFyc2UoKSB7XG4gICAgICAgIGxldCB0b2tlbjtcbiAgICAgICAgd2hpbGUgKCAhdGhpcy50b2tlbml6ZXIuZW5kT2ZGaWxlKCkgKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRoaXMudG9rZW5pemVyLm5leHRUb2tlbigpO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKCB0b2tlblswXSApIHtcblxuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgICAgIHRoaXMuc3BhY2VzICs9IHRva2VuWzFdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICc7JzpcbiAgICAgICAgICAgICAgICB0aGlzLmZyZWVTZW1pY29sb24odG9rZW4pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd9JzpcbiAgICAgICAgICAgICAgICB0aGlzLmVuZCh0b2tlbik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgICAgIHRoaXMuY29tbWVudCh0b2tlbik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2F0LXdvcmQnOlxuICAgICAgICAgICAgICAgIHRoaXMuYXRydWxlKHRva2VuKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAneyc6XG4gICAgICAgICAgICAgICAgdGhpcy5lbXB0eVJ1bGUodG9rZW4pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMub3RoZXIodG9rZW4pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW5kRmlsZSgpO1xuICAgIH1cblxuICAgIGNvbW1lbnQodG9rZW4pIHtcbiAgICAgICAgbGV0IG5vZGUgPSBuZXcgQ29tbWVudCgpO1xuICAgICAgICB0aGlzLmluaXQobm9kZSwgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICAgICAgbm9kZS5zb3VyY2UuZW5kID0geyBsaW5lOiB0b2tlbls0XSwgY29sdW1uOiB0b2tlbls1XSB9O1xuXG4gICAgICAgIGxldCB0ZXh0ID0gdG9rZW5bMV0uc2xpY2UoMiwgLTIpO1xuICAgICAgICBpZiAoIC9eXFxzKiQvLnRlc3QodGV4dCkgKSB7XG4gICAgICAgICAgICBub2RlLnRleHQgICAgICAgPSAnJztcbiAgICAgICAgICAgIG5vZGUucmF3cy5sZWZ0ICA9IHRleHQ7XG4gICAgICAgICAgICBub2RlLnJhd3MucmlnaHQgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtYXRjaCA9IHRleHQubWF0Y2goL14oXFxzKikoW15dKlteXFxzXSkoXFxzKikkLyk7XG4gICAgICAgICAgICBub2RlLnRleHQgICAgICAgPSBtYXRjaFsyXTtcbiAgICAgICAgICAgIG5vZGUucmF3cy5sZWZ0ICA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgbm9kZS5yYXdzLnJpZ2h0ID0gbWF0Y2hbM107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbXB0eVJ1bGUodG9rZW4pIHtcbiAgICAgICAgbGV0IG5vZGUgPSBuZXcgUnVsZSgpO1xuICAgICAgICB0aGlzLmluaXQobm9kZSwgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICAgICAgbm9kZS5zZWxlY3RvciA9ICcnO1xuICAgICAgICBub2RlLnJhd3MuYmV0d2VlbiA9ICcnO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBub2RlO1xuICAgIH1cblxuICAgIG90aGVyKHN0YXJ0KSB7XG4gICAgICAgIGxldCBlbmQgICAgICA9IGZhbHNlO1xuICAgICAgICBsZXQgdHlwZSAgICAgPSBudWxsO1xuICAgICAgICBsZXQgY29sb24gICAgPSBmYWxzZTtcbiAgICAgICAgbGV0IGJyYWNrZXQgID0gbnVsbDtcbiAgICAgICAgbGV0IGJyYWNrZXRzID0gW107XG5cbiAgICAgICAgbGV0IHRva2VucyA9IFtdO1xuICAgICAgICBsZXQgdG9rZW4gPSBzdGFydDtcbiAgICAgICAgd2hpbGUgKCB0b2tlbiApIHtcbiAgICAgICAgICAgIHR5cGUgPSB0b2tlblswXTtcbiAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcblxuICAgICAgICAgICAgaWYgKCB0eXBlID09PSAnKCcgfHwgdHlwZSA9PT0gJ1snICkge1xuICAgICAgICAgICAgICAgIGlmICggIWJyYWNrZXQgKSBicmFja2V0ID0gdG9rZW47XG4gICAgICAgICAgICAgICAgYnJhY2tldHMucHVzaCh0eXBlID09PSAnKCcgPyAnKScgOiAnXScpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBicmFja2V0cy5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlID09PSAnOycgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggY29sb24gKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlY2wodG9rZW5zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAneycgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucnVsZSh0b2tlbnMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnfScgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9rZW5pemVyLmJhY2sodG9rZW5zLnBvcCgpKTtcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnOicgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09IGJyYWNrZXRzW2JyYWNrZXRzLmxlbmd0aCAtIDFdICkge1xuICAgICAgICAgICAgICAgIGJyYWNrZXRzLnBvcCgpO1xuICAgICAgICAgICAgICAgIGlmICggYnJhY2tldHMubGVuZ3RoID09PSAwICkgYnJhY2tldCA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRva2VuID0gdGhpcy50b2tlbml6ZXIubmV4dFRva2VuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHRoaXMudG9rZW5pemVyLmVuZE9mRmlsZSgpICkgZW5kID0gdHJ1ZTtcbiAgICAgICAgaWYgKCBicmFja2V0cy5sZW5ndGggPiAwICkgdGhpcy51bmNsb3NlZEJyYWNrZXQoYnJhY2tldCk7XG5cbiAgICAgICAgaWYgKCBlbmQgJiYgY29sb24gKSB7XG4gICAgICAgICAgICB3aGlsZSAoIHRva2Vucy5sZW5ndGggKSB7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdWzBdO1xuICAgICAgICAgICAgICAgIGlmICggdG9rZW4gIT09ICdzcGFjZScgJiYgdG9rZW4gIT09ICdjb21tZW50JyApIGJyZWFrO1xuICAgICAgICAgICAgICAgIHRoaXMudG9rZW5pemVyLmJhY2sodG9rZW5zLnBvcCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGVjbCh0b2tlbnMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51bmtub3duV29yZCh0b2tlbnMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcnVsZSh0b2tlbnMpIHtcbiAgICAgICAgdG9rZW5zLnBvcCgpO1xuXG4gICAgICAgIGxldCBub2RlID0gbmV3IFJ1bGUoKTtcbiAgICAgICAgdGhpcy5pbml0KG5vZGUsIHRva2Vuc1swXVsyXSwgdG9rZW5zWzBdWzNdKTtcblxuICAgICAgICBub2RlLnJhd3MuYmV0d2VlbiA9IHRoaXMuc3BhY2VzQW5kQ29tbWVudHNGcm9tRW5kKHRva2Vucyk7XG4gICAgICAgIHRoaXMucmF3KG5vZGUsICdzZWxlY3RvcicsIHRva2Vucyk7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IG5vZGU7XG4gICAgfVxuXG4gICAgZGVjbCh0b2tlbnMpIHtcbiAgICAgICAgbGV0IG5vZGUgPSBuZXcgRGVjbGFyYXRpb24oKTtcbiAgICAgICAgdGhpcy5pbml0KG5vZGUpO1xuXG4gICAgICAgIGxldCBsYXN0ID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKCBsYXN0WzBdID09PSAnOycgKSB7XG4gICAgICAgICAgICB0aGlzLnNlbWljb2xvbiA9IHRydWU7XG4gICAgICAgICAgICB0b2tlbnMucG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBsYXN0WzRdICkge1xuICAgICAgICAgICAgbm9kZS5zb3VyY2UuZW5kID0geyBsaW5lOiBsYXN0WzRdLCBjb2x1bW46IGxhc3RbNV0gfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc291cmNlLmVuZCA9IHsgbGluZTogbGFzdFsyXSwgY29sdW1uOiBsYXN0WzNdIH07XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoIHRva2Vuc1swXVswXSAhPT0gJ3dvcmQnICkge1xuICAgICAgICAgICAgaWYgKCB0b2tlbnMubGVuZ3RoID09PSAxICkgdGhpcy51bmtub3duV29yZCh0b2tlbnMpO1xuICAgICAgICAgICAgbm9kZS5yYXdzLmJlZm9yZSArPSB0b2tlbnMuc2hpZnQoKVsxXTtcbiAgICAgICAgfVxuICAgICAgICBub2RlLnNvdXJjZS5zdGFydCA9IHsgbGluZTogdG9rZW5zWzBdWzJdLCBjb2x1bW46IHRva2Vuc1swXVszXSB9O1xuXG4gICAgICAgIG5vZGUucHJvcCA9ICcnO1xuICAgICAgICB3aGlsZSAoIHRva2Vucy5sZW5ndGggKSB7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IHRva2Vuc1swXVswXTtcbiAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJzonIHx8IHR5cGUgPT09ICdzcGFjZScgfHwgdHlwZSA9PT0gJ2NvbW1lbnQnICkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZS5wcm9wICs9IHRva2Vucy5zaGlmdCgpWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgbm9kZS5yYXdzLmJldHdlZW4gPSAnJztcblxuICAgICAgICBsZXQgdG9rZW47XG4gICAgICAgIHdoaWxlICggdG9rZW5zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5zLnNoaWZ0KCk7XG5cbiAgICAgICAgICAgIGlmICggdG9rZW5bMF0gPT09ICc6JyApIHtcbiAgICAgICAgICAgICAgICBub2RlLnJhd3MuYmV0d2VlbiArPSB0b2tlblsxXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbm9kZS5yYXdzLmJldHdlZW4gKz0gdG9rZW5bMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIG5vZGUucHJvcFswXSA9PT0gJ18nIHx8IG5vZGUucHJvcFswXSA9PT0gJyonICkge1xuICAgICAgICAgICAgbm9kZS5yYXdzLmJlZm9yZSArPSBub2RlLnByb3BbMF07XG4gICAgICAgICAgICBub2RlLnByb3AgPSBub2RlLnByb3Auc2xpY2UoMSk7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZS5yYXdzLmJldHdlZW4gKz0gdGhpcy5zcGFjZXNBbmRDb21tZW50c0Zyb21TdGFydCh0b2tlbnMpO1xuICAgICAgICB0aGlzLnByZWNoZWNrTWlzc2VkU2VtaWNvbG9uKHRva2Vucyk7XG5cbiAgICAgICAgZm9yICggbGV0IGkgPSB0b2tlbnMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSApIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgaWYgKCB0b2tlblsxXS50b0xvd2VyQ2FzZSgpID09PSAnIWltcG9ydGFudCcgKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5pbXBvcnRhbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGxldCBzdHJpbmcgPSB0aGlzLnN0cmluZ0Zyb20odG9rZW5zLCBpKTtcbiAgICAgICAgICAgICAgICBzdHJpbmcgPSB0aGlzLnNwYWNlc0Zyb21FbmQodG9rZW5zKSArIHN0cmluZztcbiAgICAgICAgICAgICAgICBpZiAoIHN0cmluZyAhPT0gJyAhaW1wb3J0YW50JyApIG5vZGUucmF3cy5pbXBvcnRhbnQgPSBzdHJpbmc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW5bMV0udG9Mb3dlckNhc2UoKSA9PT0gJ2ltcG9ydGFudCcpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2FjaGUgPSB0b2tlbnMuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgbGV0IHN0ciAgID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yICggbGV0IGogPSBpOyBqID4gMDsgai0tICkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IGNhY2hlW2pdWzBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHN0ci50cmltKCkuaW5kZXhPZignIScpID09PSAwICYmIHR5cGUgIT09ICdzcGFjZScgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdHIgPSBjYWNoZS5wb3AoKVsxXSArIHN0cjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCBzdHIudHJpbSgpLmluZGV4T2YoJyEnKSA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5pbXBvcnRhbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBub2RlLnJhd3MuaW1wb3J0YW50ID0gc3RyO1xuICAgICAgICAgICAgICAgICAgICB0b2tlbnMgPSBjYWNoZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggdG9rZW5bMF0gIT09ICdzcGFjZScgJiYgdG9rZW5bMF0gIT09ICdjb21tZW50JyApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmF3KG5vZGUsICd2YWx1ZScsIHRva2Vucyk7XG5cbiAgICAgICAgaWYgKCBub2RlLnZhbHVlLmluZGV4T2YoJzonKSAhPT0gLTEgKSB0aGlzLmNoZWNrTWlzc2VkU2VtaWNvbG9uKHRva2Vucyk7XG4gICAgfVxuXG4gICAgYXRydWxlKHRva2VuKSB7XG4gICAgICAgIGxldCBub2RlICA9IG5ldyBBdFJ1bGUoKTtcbiAgICAgICAgbm9kZS5uYW1lID0gdG9rZW5bMV0uc2xpY2UoMSk7XG4gICAgICAgIGlmICggbm9kZS5uYW1lID09PSAnJyApIHtcbiAgICAgICAgICAgIHRoaXMudW5uYW1lZEF0cnVsZShub2RlLCB0b2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0KG5vZGUsIHRva2VuWzJdLCB0b2tlblszXSk7XG5cbiAgICAgICAgbGV0IHByZXY7XG4gICAgICAgIGxldCBzaGlmdDtcbiAgICAgICAgbGV0IGxhc3QgICA9IGZhbHNlO1xuICAgICAgICBsZXQgb3BlbiAgID0gZmFsc2U7XG4gICAgICAgIGxldCBwYXJhbXMgPSBbXTtcblxuICAgICAgICB3aGlsZSAoICF0aGlzLnRva2VuaXplci5lbmRPZkZpbGUoKSApIHtcbiAgICAgICAgICAgIHRva2VuID0gdGhpcy50b2tlbml6ZXIubmV4dFRva2VuKCk7XG5cbiAgICAgICAgICAgIGlmICggdG9rZW5bMF0gPT09ICc7JyApIHtcbiAgICAgICAgICAgICAgICBub2RlLnNvdXJjZS5lbmQgPSB7IGxpbmU6IHRva2VuWzJdLCBjb2x1bW46IHRva2VuWzNdIH07XG4gICAgICAgICAgICAgICAgdGhpcy5zZW1pY29sb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggdG9rZW5bMF0gPT09ICd7JyApIHtcbiAgICAgICAgICAgICAgICBvcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRva2VuWzBdID09PSAnfScpIHtcbiAgICAgICAgICAgICAgICBpZiAoIHBhcmFtcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBzaGlmdCA9IHBhcmFtcy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgICAgICBwcmV2ID0gcGFyYW1zW3NoaWZ0XTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCBwcmV2ICYmIHByZXZbMF0gPT09ICdzcGFjZScgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2ID0gcGFyYW1zWy0tc2hpZnRdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICggcHJldiApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuc291cmNlLmVuZCA9IHsgbGluZTogcHJldls0XSwgY29sdW1uOiBwcmV2WzVdIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5lbmQodG9rZW4pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggdGhpcy50b2tlbml6ZXIuZW5kT2ZGaWxlKCkgKSB7XG4gICAgICAgICAgICAgICAgbGFzdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBub2RlLnJhd3MuYmV0d2VlbiA9IHRoaXMuc3BhY2VzQW5kQ29tbWVudHNGcm9tRW5kKHBhcmFtcyk7XG4gICAgICAgIGlmICggcGFyYW1zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIG5vZGUucmF3cy5hZnRlck5hbWUgPSB0aGlzLnNwYWNlc0FuZENvbW1lbnRzRnJvbVN0YXJ0KHBhcmFtcyk7XG4gICAgICAgICAgICB0aGlzLnJhdyhub2RlLCAncGFyYW1zJywgcGFyYW1zKTtcbiAgICAgICAgICAgIGlmICggbGFzdCApIHtcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHBhcmFtc1twYXJhbXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgbm9kZS5zb3VyY2UuZW5kICAgPSB7IGxpbmU6IHRva2VuWzRdLCBjb2x1bW46IHRva2VuWzVdIH07XG4gICAgICAgICAgICAgICAgdGhpcy5zcGFjZXMgICAgICAgPSBub2RlLnJhd3MuYmV0d2VlbjtcbiAgICAgICAgICAgICAgICBub2RlLnJhd3MuYmV0d2VlbiA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5yYXdzLmFmdGVyTmFtZSA9ICcnO1xuICAgICAgICAgICAgbm9kZS5wYXJhbXMgICAgICAgICA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBvcGVuICkge1xuICAgICAgICAgICAgbm9kZS5ub2RlcyAgID0gW107XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSBub2RlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZW5kKHRva2VuKSB7XG4gICAgICAgIGlmICggdGhpcy5jdXJyZW50Lm5vZGVzICYmIHRoaXMuY3VycmVudC5ub2Rlcy5sZW5ndGggKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQucmF3cy5zZW1pY29sb24gPSB0aGlzLnNlbWljb2xvbjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbWljb2xvbiA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuY3VycmVudC5yYXdzLmFmdGVyID0gKHRoaXMuY3VycmVudC5yYXdzLmFmdGVyIHx8ICcnKSArIHRoaXMuc3BhY2VzO1xuICAgICAgICB0aGlzLnNwYWNlcyA9ICcnO1xuXG4gICAgICAgIGlmICggdGhpcy5jdXJyZW50LnBhcmVudCApIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5zb3VyY2UuZW5kID0geyBsaW5lOiB0b2tlblsyXSwgY29sdW1uOiB0b2tlblszXSB9O1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5jdXJyZW50LnBhcmVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudW5leHBlY3RlZENsb3NlKHRva2VuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVuZEZpbGUoKSB7XG4gICAgICAgIGlmICggdGhpcy5jdXJyZW50LnBhcmVudCApIHRoaXMudW5jbG9zZWRCbG9jaygpO1xuICAgICAgICBpZiAoIHRoaXMuY3VycmVudC5ub2RlcyAmJiB0aGlzLmN1cnJlbnQubm9kZXMubGVuZ3RoICkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50LnJhd3Muc2VtaWNvbG9uID0gdGhpcy5zZW1pY29sb247XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50LnJhd3MuYWZ0ZXIgPSAodGhpcy5jdXJyZW50LnJhd3MuYWZ0ZXIgfHwgJycpICsgdGhpcy5zcGFjZXM7XG4gICAgfVxuXG4gICAgZnJlZVNlbWljb2xvbih0b2tlbikge1xuICAgICAgICB0aGlzLnNwYWNlcyArPSB0b2tlblsxXTtcbiAgICAgICAgaWYgKCB0aGlzLmN1cnJlbnQubm9kZXMgKSB7XG4gICAgICAgICAgICBsZXQgcHJldiA9IHRoaXMuY3VycmVudC5ub2Rlc1t0aGlzLmN1cnJlbnQubm9kZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBpZiAoIHByZXYgJiYgcHJldi50eXBlID09PSAncnVsZScgJiYgIXByZXYucmF3cy5vd25TZW1pY29sb24gKSB7XG4gICAgICAgICAgICAgICAgcHJldi5yYXdzLm93blNlbWljb2xvbiA9IHRoaXMuc3BhY2VzO1xuICAgICAgICAgICAgICAgIHRoaXMuc3BhY2VzID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIZWxwZXJzXG5cbiAgICBpbml0KG5vZGUsIGxpbmUsIGNvbHVtbikge1xuICAgICAgICB0aGlzLmN1cnJlbnQucHVzaChub2RlKTtcblxuICAgICAgICBub2RlLnNvdXJjZSA9IHsgc3RhcnQ6IHsgbGluZSwgY29sdW1uIH0sIGlucHV0OiB0aGlzLmlucHV0IH07XG4gICAgICAgIG5vZGUucmF3cy5iZWZvcmUgPSB0aGlzLnNwYWNlcztcbiAgICAgICAgdGhpcy5zcGFjZXMgPSAnJztcbiAgICAgICAgaWYgKCBub2RlLnR5cGUgIT09ICdjb21tZW50JyApIHRoaXMuc2VtaWNvbG9uID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmF3KG5vZGUsIHByb3AsIHRva2Vucykge1xuICAgICAgICBsZXQgdG9rZW4sIHR5cGU7XG4gICAgICAgIGxldCBsZW5ndGggPSB0b2tlbnMubGVuZ3RoO1xuICAgICAgICBsZXQgdmFsdWUgID0gJyc7XG4gICAgICAgIGxldCBjbGVhbiAgPSB0cnVlO1xuICAgICAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSApIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgdHlwZSAgPSB0b2tlblswXTtcbiAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJ2NvbW1lbnQnIHx8IHR5cGUgPT09ICdzcGFjZScgJiYgaSA9PT0gbGVuZ3RoIC0gMSApIHtcbiAgICAgICAgICAgICAgICBjbGVhbiA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSB0b2tlblsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoICFjbGVhbiApIHtcbiAgICAgICAgICAgIGxldCByYXcgPSB0b2tlbnMucmVkdWNlKCAoYWxsLCBpKSA9PiBhbGwgKyBpWzFdLCAnJyk7XG4gICAgICAgICAgICBub2RlLnJhd3NbcHJvcF0gPSB7IHZhbHVlLCByYXcgfTtcbiAgICAgICAgfVxuICAgICAgICBub2RlW3Byb3BdID0gdmFsdWU7XG4gICAgfVxuXG4gICAgc3BhY2VzQW5kQ29tbWVudHNGcm9tRW5kKHRva2Vucykge1xuICAgICAgICBsZXQgbGFzdFRva2VuVHlwZTtcbiAgICAgICAgbGV0IHNwYWNlcyA9ICcnO1xuICAgICAgICB3aGlsZSAoIHRva2Vucy5sZW5ndGggKSB7XG4gICAgICAgICAgICBsYXN0VG9rZW5UeXBlID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXVswXTtcbiAgICAgICAgICAgIGlmICggbGFzdFRva2VuVHlwZSAhPT0gJ3NwYWNlJyAmJlxuICAgICAgICAgICAgICAgIGxhc3RUb2tlblR5cGUgIT09ICdjb21tZW50JyApIGJyZWFrO1xuICAgICAgICAgICAgc3BhY2VzID0gdG9rZW5zLnBvcCgpWzFdICsgc3BhY2VzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzcGFjZXM7XG4gICAgfVxuXG4gICAgc3BhY2VzQW5kQ29tbWVudHNGcm9tU3RhcnQodG9rZW5zKSB7XG4gICAgICAgIGxldCBuZXh0O1xuICAgICAgICBsZXQgc3BhY2VzID0gJyc7XG4gICAgICAgIHdoaWxlICggdG9rZW5zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIG5leHQgPSB0b2tlbnNbMF1bMF07XG4gICAgICAgICAgICBpZiAoIG5leHQgIT09ICdzcGFjZScgJiYgbmV4dCAhPT0gJ2NvbW1lbnQnICkgYnJlYWs7XG4gICAgICAgICAgICBzcGFjZXMgKz0gdG9rZW5zLnNoaWZ0KClbMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwYWNlcztcbiAgICB9XG5cbiAgICBzcGFjZXNGcm9tRW5kKHRva2Vucykge1xuICAgICAgICBsZXQgbGFzdFRva2VuVHlwZTtcbiAgICAgICAgbGV0IHNwYWNlcyA9ICcnO1xuICAgICAgICB3aGlsZSAoIHRva2Vucy5sZW5ndGggKSB7XG4gICAgICAgICAgICBsYXN0VG9rZW5UeXBlID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXVswXTtcbiAgICAgICAgICAgIGlmICggbGFzdFRva2VuVHlwZSAhPT0gJ3NwYWNlJyApIGJyZWFrO1xuICAgICAgICAgICAgc3BhY2VzID0gdG9rZW5zLnBvcCgpWzFdICsgc3BhY2VzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzcGFjZXM7XG4gICAgfVxuXG4gICAgc3RyaW5nRnJvbSh0b2tlbnMsIGZyb20pIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICBmb3IgKCBsZXQgaSA9IGZyb207IGkgPCB0b2tlbnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gdG9rZW5zW2ldWzFdO1xuICAgICAgICB9XG4gICAgICAgIHRva2Vucy5zcGxpY2UoZnJvbSwgdG9rZW5zLmxlbmd0aCAtIGZyb20pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGNvbG9uKHRva2Vucykge1xuICAgICAgICBsZXQgYnJhY2tldHMgPSAwO1xuICAgICAgICBsZXQgdG9rZW4sIHR5cGUsIHByZXY7XG4gICAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgdHlwZSAgPSB0b2tlblswXTtcblxuICAgICAgICAgICAgaWYgKCB0eXBlID09PSAnKCcgKSB7XG4gICAgICAgICAgICAgICAgYnJhY2tldHMgKz0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICcpJyApIHtcbiAgICAgICAgICAgICAgICBicmFja2V0cyAtPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggYnJhY2tldHMgPT09IDAgJiYgdHlwZSA9PT0gJzonICkge1xuICAgICAgICAgICAgICAgIGlmICggIXByZXYgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG91YmxlQ29sb24odG9rZW4pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHByZXZbMF0gPT09ICd3b3JkJyAmJiBwcmV2WzFdID09PSAncHJvZ2lkJyApIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcmV2ID0gdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEVycm9yc1xuXG4gICAgdW5jbG9zZWRCcmFja2V0KGJyYWNrZXQpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5pbnB1dC5lcnJvcignVW5jbG9zZWQgYnJhY2tldCcsIGJyYWNrZXRbMl0sIGJyYWNrZXRbM10pO1xuICAgIH1cblxuICAgIHVua25vd25Xb3JkKHRva2Vucykge1xuICAgICAgICB0aHJvdyB0aGlzLmlucHV0LmVycm9yKCdVbmtub3duIHdvcmQnLCB0b2tlbnNbMF1bMl0sIHRva2Vuc1swXVszXSk7XG4gICAgfVxuXG4gICAgdW5leHBlY3RlZENsb3NlKHRva2VuKSB7XG4gICAgICAgIHRocm93IHRoaXMuaW5wdXQuZXJyb3IoJ1VuZXhwZWN0ZWQgfScsIHRva2VuWzJdLCB0b2tlblszXSk7XG4gICAgfVxuXG4gICAgdW5jbG9zZWRCbG9jaygpIHtcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY3VycmVudC5zb3VyY2Uuc3RhcnQ7XG4gICAgICAgIHRocm93IHRoaXMuaW5wdXQuZXJyb3IoJ1VuY2xvc2VkIGJsb2NrJywgcG9zLmxpbmUsIHBvcy5jb2x1bW4pO1xuICAgIH1cblxuICAgIGRvdWJsZUNvbG9uKHRva2VuKSB7XG4gICAgICAgIHRocm93IHRoaXMuaW5wdXQuZXJyb3IoJ0RvdWJsZSBjb2xvbicsIHRva2VuWzJdLCB0b2tlblszXSk7XG4gICAgfVxuXG4gICAgdW5uYW1lZEF0cnVsZShub2RlLCB0b2tlbikge1xuICAgICAgICB0aHJvdyB0aGlzLmlucHV0LmVycm9yKCdBdC1ydWxlIHdpdGhvdXQgbmFtZScsIHRva2VuWzJdLCB0b2tlblszXSk7XG4gICAgfVxuXG4gICAgcHJlY2hlY2tNaXNzZWRTZW1pY29sb24odG9rZW5zKSB7XG4gICAgICAgIC8vIEhvb2sgZm9yIFNhZmUgUGFyc2VyXG4gICAgICAgIHRva2VucztcbiAgICB9XG5cbiAgICBjaGVja01pc3NlZFNlbWljb2xvbih0b2tlbnMpIHtcbiAgICAgICAgbGV0IGNvbG9uID0gdGhpcy5jb2xvbih0b2tlbnMpO1xuICAgICAgICBpZiAoIGNvbG9uID09PSBmYWxzZSApIHJldHVybjtcblxuICAgICAgICBsZXQgZm91bmRlZCA9IDA7XG4gICAgICAgIGxldCB0b2tlbjtcbiAgICAgICAgZm9yICggbGV0IGogPSBjb2xvbiAtIDE7IGogPj0gMDsgai0tICkge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbal07XG4gICAgICAgICAgICBpZiAoIHRva2VuWzBdICE9PSAnc3BhY2UnICkge1xuICAgICAgICAgICAgICAgIGZvdW5kZWQgKz0gMTtcbiAgICAgICAgICAgICAgICBpZiAoIGZvdW5kZWQgPT09IDIgKSBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aHJvdyB0aGlzLmlucHV0LmVycm9yKCdNaXNzZWQgc2VtaWNvbG9uJywgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICB9XG5cbn1cbiJdfQ==
