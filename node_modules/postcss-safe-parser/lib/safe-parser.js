'use strict';

exports.__esModule = true;

var _parser = require('postcss/lib/parser');

var _parser2 = _interopRequireDefault(_parser);

var _safeTokenize = require('./safe-tokenize');

var _safeTokenize2 = _interopRequireDefault(_safeTokenize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SafeParser = function (_Parser) {
    _inherits(SafeParser, _Parser);

    function SafeParser() {
        _classCallCheck(this, SafeParser);

        return _possibleConstructorReturn(this, _Parser.apply(this, arguments));
    }

    SafeParser.prototype.tokenize = function tokenize() {
        this.tokens = (0, _safeTokenize2.default)(this.input);
    };

    SafeParser.prototype.unclosedBracket = function unclosedBracket() {};

    SafeParser.prototype.unknownWord = function unknownWord(start) {
        var buffer = this.tokens.slice(start, this.pos + 1);
        this.spaces += buffer.map(function (i) {
            return i[1];
        }).join('');
    };

    SafeParser.prototype.unexpectedClose = function unexpectedClose() {
        this.current.raws.after += '}';
    };

    SafeParser.prototype.doubleColon = function doubleColon() {};

    SafeParser.prototype.unnamedAtrule = function unnamedAtrule(node) {
        node.name = '';
    };

    SafeParser.prototype.precheckMissedSemicolon = function precheckMissedSemicolon(tokens) {
        var colon = this.colon(tokens);
        if (colon === false) return;

        var split = undefined;
        for (split = colon - 1; split >= 0; split--) {
            if (tokens[split][0] === 'word') break;
        }
        for (split -= 1; split >= 0; split--) {
            if (tokens[split][0] !== 'space') {
                split += 1;
                break;
            }
        }
        var other = tokens.splice(split, tokens.length - split);
        this.decl(other);
    };

    SafeParser.prototype.checkMissedSemicolon = function checkMissedSemicolon() {};

    SafeParser.prototype.endFile = function endFile() {
        if (this.current.nodes && this.current.nodes.length) {
            this.current.raws.semicolon = this.semicolon;
        }
        this.current.raws.after = (this.current.raws.after || '') + this.spaces;

        while (this.current.parent) {
            this.current = this.current.parent;
            this.current.raws.after = '';
        }
    };

    return SafeParser;
}(_parser2.default);

exports.default = SafeParser;
module.exports = exports['default'];