'use strict';

exports.__esModule = true;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _tokenize = require('./tokenize');

var _tokenize2 = _interopRequireDefault(_tokenize);

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HIGHLIGHT_THEME = {
    'brackets': _chalk2.default.cyan,
    'at-word': _chalk2.default.cyan,
    'call': _chalk2.default.cyan,
    'comment': _chalk2.default.gray,
    'string': _chalk2.default.green,
    'class': _chalk2.default.yellow,
    'hash': _chalk2.default.magenta,
    '(': _chalk2.default.cyan,
    ')': _chalk2.default.cyan,
    '{': _chalk2.default.yellow,
    '}': _chalk2.default.yellow,
    '[': _chalk2.default.yellow,
    ']': _chalk2.default.yellow,
    ':': _chalk2.default.yellow,
    ';': _chalk2.default.yellow
};

function getTokenType(_ref, processor) {
    var type = _ref[0],
        value = _ref[1];

    if (type === 'word') {
        if (value[0] === '.') {
            return 'class';
        }
        if (value[0] === '#') {
            return 'hash';
        }
    }

    if (!processor.endOfFile()) {
        var next = processor.nextToken();
        processor.back(next);
        if (next[0] === 'brackets' || next[0] === '(') return 'call';
    }

    return type;
}

function terminalHighlight(css) {
    var processor = (0, _tokenize2.default)(new _input2.default(css), { ignoreErrors: true });
    var result = '';

    var _loop = function _loop() {
        var token = processor.nextToken();
        var color = HIGHLIGHT_THEME[getTokenType(token, processor)];
        if (color) {
            result += token[1].split(/\r?\n/).map(function (i) {
                return color(i);
            }).join('\n');
        } else {
            result += token[1];
        }
    };

    while (!processor.endOfFile()) {
        _loop();
    }
    return result;
}

exports.default = terminalHighlight;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlcm1pbmFsLWhpZ2hsaWdodC5lczYiXSwibmFtZXMiOlsiSElHSExJR0hUX1RIRU1FIiwiY3lhbiIsImdyYXkiLCJncmVlbiIsInllbGxvdyIsIm1hZ2VudGEiLCJnZXRUb2tlblR5cGUiLCJwcm9jZXNzb3IiLCJ0eXBlIiwidmFsdWUiLCJlbmRPZkZpbGUiLCJuZXh0IiwibmV4dFRva2VuIiwiYmFjayIsInRlcm1pbmFsSGlnaGxpZ2h0IiwiY3NzIiwiaWdub3JlRXJyb3JzIiwicmVzdWx0IiwidG9rZW4iLCJjb2xvciIsInNwbGl0IiwibWFwIiwiaSIsImpvaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUVBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGtCQUFrQjtBQUNwQixnQkFBWSxnQkFBTUMsSUFERTtBQUVwQixlQUFZLGdCQUFNQSxJQUZFO0FBR3BCLFlBQVksZ0JBQU1BLElBSEU7QUFJcEIsZUFBWSxnQkFBTUMsSUFKRTtBQUtwQixjQUFZLGdCQUFNQyxLQUxFO0FBTXBCLGFBQVksZ0JBQU1DLE1BTkU7QUFPcEIsWUFBWSxnQkFBTUMsT0FQRTtBQVFwQixTQUFZLGdCQUFNSixJQVJFO0FBU3BCLFNBQVksZ0JBQU1BLElBVEU7QUFVcEIsU0FBWSxnQkFBTUcsTUFWRTtBQVdwQixTQUFZLGdCQUFNQSxNQVhFO0FBWXBCLFNBQVksZ0JBQU1BLE1BWkU7QUFhcEIsU0FBWSxnQkFBTUEsTUFiRTtBQWNwQixTQUFZLGdCQUFNQSxNQWRFO0FBZXBCLFNBQVksZ0JBQU1BO0FBZkUsQ0FBeEI7O0FBa0JBLFNBQVNFLFlBQVQsT0FBcUNDLFNBQXJDLEVBQWdEO0FBQUEsUUFBekJDLElBQXlCO0FBQUEsUUFBbkJDLEtBQW1COztBQUM1QyxRQUFLRCxTQUFTLE1BQWQsRUFBdUI7QUFDbkIsWUFBS0MsTUFBTSxDQUFOLE1BQWEsR0FBbEIsRUFBd0I7QUFDcEIsbUJBQU8sT0FBUDtBQUNIO0FBQ0QsWUFBS0EsTUFBTSxDQUFOLE1BQWEsR0FBbEIsRUFBd0I7QUFDcEIsbUJBQU8sTUFBUDtBQUNIO0FBQ0o7O0FBRUQsUUFBSyxDQUFDRixVQUFVRyxTQUFWLEVBQU4sRUFBOEI7QUFDMUIsWUFBSUMsT0FBT0osVUFBVUssU0FBVixFQUFYO0FBQ0FMLGtCQUFVTSxJQUFWLENBQWVGLElBQWY7QUFDQSxZQUFLQSxLQUFLLENBQUwsTUFBWSxVQUFaLElBQTBCQSxLQUFLLENBQUwsTUFBWSxHQUEzQyxFQUFpRCxPQUFPLE1BQVA7QUFDcEQ7O0FBRUQsV0FBT0gsSUFBUDtBQUNIOztBQUVELFNBQVNNLGlCQUFULENBQTJCQyxHQUEzQixFQUFnQztBQUM1QixRQUFJUixZQUFZLHdCQUFVLG9CQUFVUSxHQUFWLENBQVYsRUFBMEIsRUFBRUMsY0FBYyxJQUFoQixFQUExQixDQUFoQjtBQUNBLFFBQUlDLFNBQVMsRUFBYjs7QUFGNEI7QUFJeEIsWUFBSUMsUUFBUVgsVUFBVUssU0FBVixFQUFaO0FBQ0EsWUFBSU8sUUFBUW5CLGdCQUFnQk0sYUFBYVksS0FBYixFQUFvQlgsU0FBcEIsQ0FBaEIsQ0FBWjtBQUNBLFlBQUtZLEtBQUwsRUFBYTtBQUNURixzQkFBVUMsTUFBTSxDQUFOLEVBQVNFLEtBQVQsQ0FBZSxPQUFmLEVBQ0xDLEdBREssQ0FDQTtBQUFBLHVCQUFLRixNQUFNRyxDQUFOLENBQUw7QUFBQSxhQURBLEVBRUxDLElBRkssQ0FFQSxJQUZBLENBQVY7QUFHSCxTQUpELE1BSU87QUFDSE4sc0JBQVVDLE1BQU0sQ0FBTixDQUFWO0FBQ0g7QUFadUI7O0FBRzVCLFdBQVEsQ0FBQ1gsVUFBVUcsU0FBVixFQUFULEVBQWlDO0FBQUE7QUFVaEM7QUFDRCxXQUFPTyxNQUFQO0FBQ0g7O2tCQUVjSCxpQiIsImZpbGUiOiJ0ZXJtaW5hbC1oaWdobGlnaHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuXG5pbXBvcnQgdG9rZW5pemVyIGZyb20gJy4vdG9rZW5pemUnO1xuaW1wb3J0IElucHV0ICAgIGZyb20gJy4vaW5wdXQnO1xuXG5jb25zdCBISUdITElHSFRfVEhFTUUgPSB7XG4gICAgJ2JyYWNrZXRzJzogY2hhbGsuY3lhbixcbiAgICAnYXQtd29yZCc6ICBjaGFsay5jeWFuLFxuICAgICdjYWxsJzogICAgIGNoYWxrLmN5YW4sXG4gICAgJ2NvbW1lbnQnOiAgY2hhbGsuZ3JheSxcbiAgICAnc3RyaW5nJzogICBjaGFsay5ncmVlbixcbiAgICAnY2xhc3MnOiAgICBjaGFsay55ZWxsb3csXG4gICAgJ2hhc2gnOiAgICAgY2hhbGsubWFnZW50YSxcbiAgICAnKCc6ICAgICAgICBjaGFsay5jeWFuLFxuICAgICcpJzogICAgICAgIGNoYWxrLmN5YW4sXG4gICAgJ3snOiAgICAgICAgY2hhbGsueWVsbG93LFxuICAgICd9JzogICAgICAgIGNoYWxrLnllbGxvdyxcbiAgICAnWyc6ICAgICAgICBjaGFsay55ZWxsb3csXG4gICAgJ10nOiAgICAgICAgY2hhbGsueWVsbG93LFxuICAgICc6JzogICAgICAgIGNoYWxrLnllbGxvdyxcbiAgICAnOyc6ICAgICAgICBjaGFsay55ZWxsb3dcbn07XG5cbmZ1bmN0aW9uIGdldFRva2VuVHlwZShbdHlwZSwgdmFsdWVdLCBwcm9jZXNzb3IpIHtcbiAgICBpZiAoIHR5cGUgPT09ICd3b3JkJyApIHtcbiAgICAgICAgaWYgKCB2YWx1ZVswXSA9PT0gJy4nICkge1xuICAgICAgICAgICAgcmV0dXJuICdjbGFzcyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB2YWx1ZVswXSA9PT0gJyMnICkge1xuICAgICAgICAgICAgcmV0dXJuICdoYXNoJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICggIXByb2Nlc3Nvci5lbmRPZkZpbGUoKSApIHtcbiAgICAgICAgbGV0IG5leHQgPSBwcm9jZXNzb3IubmV4dFRva2VuKCk7XG4gICAgICAgIHByb2Nlc3Nvci5iYWNrKG5leHQpO1xuICAgICAgICBpZiAoIG5leHRbMF0gPT09ICdicmFja2V0cycgfHwgbmV4dFswXSA9PT0gJygnICkgcmV0dXJuICdjYWxsJztcbiAgICB9XG5cbiAgICByZXR1cm4gdHlwZTtcbn1cblxuZnVuY3Rpb24gdGVybWluYWxIaWdobGlnaHQoY3NzKSB7XG4gICAgbGV0IHByb2Nlc3NvciA9IHRva2VuaXplcihuZXcgSW5wdXQoY3NzKSwgeyBpZ25vcmVFcnJvcnM6IHRydWUgfSk7XG4gICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgIHdoaWxlICggIXByb2Nlc3Nvci5lbmRPZkZpbGUoKSApIHtcbiAgICAgICAgbGV0IHRva2VuID0gcHJvY2Vzc29yLm5leHRUb2tlbigpO1xuICAgICAgICBsZXQgY29sb3IgPSBISUdITElHSFRfVEhFTUVbZ2V0VG9rZW5UeXBlKHRva2VuLCBwcm9jZXNzb3IpXTtcbiAgICAgICAgaWYgKCBjb2xvciApIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSB0b2tlblsxXS5zcGxpdCgvXFxyP1xcbi8pXG4gICAgICAgICAgICAgICAgLm1hcCggaSA9PiBjb2xvcihpKSApXG4gICAgICAgICAgICAgICAgLmpvaW4oJ1xcbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHRva2VuWzFdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRlcm1pbmFsSGlnaGxpZ2h0O1xuIl19
