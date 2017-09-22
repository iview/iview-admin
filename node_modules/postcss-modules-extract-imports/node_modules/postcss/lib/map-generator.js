'use strict';

exports.__esModule = true;

var _sourceMap = require('source-map');

var _sourceMap2 = _interopRequireDefault(_sourceMap);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapGenerator = function () {
    function MapGenerator(stringify, root, opts) {
        _classCallCheck(this, MapGenerator);

        this.stringify = stringify;
        this.mapOpts = opts.map || {};
        this.root = root;
        this.opts = opts;
    }

    MapGenerator.prototype.isMap = function isMap() {
        if (typeof this.opts.map !== 'undefined') {
            return !!this.opts.map;
        } else {
            return this.previous().length > 0;
        }
    };

    MapGenerator.prototype.previous = function previous() {
        var _this = this;

        if (!this.previousMaps) {
            this.previousMaps = [];
            this.root.walk(function (node) {
                if (node.source && node.source.input.map) {
                    var map = node.source.input.map;
                    if (_this.previousMaps.indexOf(map) === -1) {
                        _this.previousMaps.push(map);
                    }
                }
            });
        }

        return this.previousMaps;
    };

    MapGenerator.prototype.isInline = function isInline() {
        if (typeof this.mapOpts.inline !== 'undefined') {
            return this.mapOpts.inline;
        }

        var annotation = this.mapOpts.annotation;
        if (typeof annotation !== 'undefined' && annotation !== true) {
            return false;
        }

        if (this.previous().length) {
            return this.previous().some(function (i) {
                return i.inline;
            });
        } else {
            return true;
        }
    };

    MapGenerator.prototype.isSourcesContent = function isSourcesContent() {
        if (typeof this.mapOpts.sourcesContent !== 'undefined') {
            return this.mapOpts.sourcesContent;
        }
        if (this.previous().length) {
            return this.previous().some(function (i) {
                return i.withContent();
            });
        } else {
            return true;
        }
    };

    MapGenerator.prototype.clearAnnotation = function clearAnnotation() {
        if (this.mapOpts.annotation === false) return;

        var node = void 0;
        for (var i = this.root.nodes.length - 1; i >= 0; i--) {
            node = this.root.nodes[i];
            if (node.type !== 'comment') continue;
            if (node.text.indexOf('# sourceMappingURL=') === 0) {
                this.root.removeChild(i);
            }
        }
    };

    MapGenerator.prototype.setSourcesContent = function setSourcesContent() {
        var _this2 = this;

        var already = {};
        this.root.walk(function (node) {
            if (node.source) {
                var from = node.source.input.from;
                if (from && !already[from]) {
                    already[from] = true;
                    var relative = _this2.relative(from);
                    _this2.map.setSourceContent(relative, node.source.input.css);
                }
            }
        });
    };

    MapGenerator.prototype.applyPrevMaps = function applyPrevMaps() {
        for (var _iterator = this.previous(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var prev = _ref;

            var from = this.relative(prev.file);
            var root = prev.root || _path2.default.dirname(prev.file);
            var map = void 0;

            if (this.mapOpts.sourcesContent === false) {
                map = new _sourceMap2.default.SourceMapConsumer(prev.text);
                if (map.sourcesContent) {
                    map.sourcesContent = map.sourcesContent.map(function () {
                        return null;
                    });
                }
            } else {
                map = prev.consumer();
            }

            this.map.applySourceMap(map, from, this.relative(root));
        }
    };

    MapGenerator.prototype.isAnnotation = function isAnnotation() {
        if (this.isInline()) {
            return true;
        } else if (typeof this.mapOpts.annotation !== 'undefined') {
            return this.mapOpts.annotation;
        } else if (this.previous().length) {
            return this.previous().some(function (i) {
                return i.annotation;
            });
        } else {
            return true;
        }
    };

    MapGenerator.prototype.toBase64 = function toBase64(str) {
        if (Buffer) {
            if (Buffer.from && Buffer.from !== Uint8Array.from) {
                return Buffer.from(str).toString('base64');
            } else {
                return new Buffer(str).toString('base64');
            }
        } else {
            return window.btoa(unescape(encodeURIComponent(str)));
        }
    };

    MapGenerator.prototype.addAnnotation = function addAnnotation() {
        var content = void 0;

        if (this.isInline()) {

            content = 'data:application/json;base64,' + this.toBase64(this.map.toString());
        } else if (typeof this.mapOpts.annotation === 'string') {
            content = this.mapOpts.annotation;
        } else {
            content = this.outputFile() + '.map';
        }

        var eol = '\n';
        if (this.css.indexOf('\r\n') !== -1) eol = '\r\n';

        this.css += eol + '/*# sourceMappingURL=' + content + ' */';
    };

    MapGenerator.prototype.outputFile = function outputFile() {
        if (this.opts.to) {
            return this.relative(this.opts.to);
        } else if (this.opts.from) {
            return this.relative(this.opts.from);
        } else {
            return 'to.css';
        }
    };

    MapGenerator.prototype.generateMap = function generateMap() {
        this.generateString();
        if (this.isSourcesContent()) this.setSourcesContent();
        if (this.previous().length > 0) this.applyPrevMaps();
        if (this.isAnnotation()) this.addAnnotation();

        if (this.isInline()) {
            return [this.css];
        } else {
            return [this.css, this.map];
        }
    };

    MapGenerator.prototype.relative = function relative(file) {
        if (file.indexOf('<') === 0) return file;
        if (/^\w+:\/\//.test(file)) return file;

        var from = this.opts.to ? _path2.default.dirname(this.opts.to) : '.';

        if (typeof this.mapOpts.annotation === 'string') {
            from = _path2.default.dirname(_path2.default.resolve(from, this.mapOpts.annotation));
        }

        file = _path2.default.relative(from, file);
        if (_path2.default.sep === '\\') {
            return file.replace(/\\/g, '/');
        } else {
            return file;
        }
    };

    MapGenerator.prototype.sourcePath = function sourcePath(node) {
        if (this.mapOpts.from) {
            return this.mapOpts.from;
        } else {
            return this.relative(node.source.input.from);
        }
    };

    MapGenerator.prototype.generateString = function generateString() {
        var _this3 = this;

        this.css = '';
        this.map = new _sourceMap2.default.SourceMapGenerator({ file: this.outputFile() });

        var line = 1;
        var column = 1;

        var lines = void 0,
            last = void 0;
        this.stringify(this.root, function (str, node, type) {
            _this3.css += str;

            if (node && type !== 'end') {
                if (node.source && node.source.start) {
                    _this3.map.addMapping({
                        source: _this3.sourcePath(node),
                        generated: { line: line, column: column - 1 },
                        original: {
                            line: node.source.start.line,
                            column: node.source.start.column - 1
                        }
                    });
                } else {
                    _this3.map.addMapping({
                        source: '<no source>',
                        original: { line: 1, column: 0 },
                        generated: { line: line, column: column - 1 }
                    });
                }
            }

            lines = str.match(/\n/g);
            if (lines) {
                line += lines.length;
                last = str.lastIndexOf('\n');
                column = str.length - last;
            } else {
                column += str.length;
            }

            if (node && type !== 'start') {
                if (node.source && node.source.end) {
                    _this3.map.addMapping({
                        source: _this3.sourcePath(node),
                        generated: { line: line, column: column - 1 },
                        original: {
                            line: node.source.end.line,
                            column: node.source.end.column
                        }
                    });
                } else {
                    _this3.map.addMapping({
                        source: '<no source>',
                        original: { line: 1, column: 0 },
                        generated: { line: line, column: column - 1 }
                    });
                }
            }
        });
    };

    MapGenerator.prototype.generate = function generate() {
        this.clearAnnotation();

        if (this.isMap()) {
            return this.generateMap();
        } else {
            var result = '';
            this.stringify(this.root, function (i) {
                result += i;
            });
            return [result];
        }
    };

    return MapGenerator;
}();

exports.default = MapGenerator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hcC1nZW5lcmF0b3IuZXM2Il0sIm5hbWVzIjpbIk1hcEdlbmVyYXRvciIsInN0cmluZ2lmeSIsInJvb3QiLCJvcHRzIiwibWFwT3B0cyIsIm1hcCIsImlzTWFwIiwicHJldmlvdXMiLCJsZW5ndGgiLCJwcmV2aW91c01hcHMiLCJ3YWxrIiwibm9kZSIsInNvdXJjZSIsImlucHV0IiwiaW5kZXhPZiIsInB1c2giLCJpc0lubGluZSIsImlubGluZSIsImFubm90YXRpb24iLCJzb21lIiwiaSIsImlzU291cmNlc0NvbnRlbnQiLCJzb3VyY2VzQ29udGVudCIsIndpdGhDb250ZW50IiwiY2xlYXJBbm5vdGF0aW9uIiwibm9kZXMiLCJ0eXBlIiwidGV4dCIsInJlbW92ZUNoaWxkIiwic2V0U291cmNlc0NvbnRlbnQiLCJhbHJlYWR5IiwiZnJvbSIsInJlbGF0aXZlIiwic2V0U291cmNlQ29udGVudCIsImNzcyIsImFwcGx5UHJldk1hcHMiLCJwcmV2IiwiZmlsZSIsImRpcm5hbWUiLCJTb3VyY2VNYXBDb25zdW1lciIsImNvbnN1bWVyIiwiYXBwbHlTb3VyY2VNYXAiLCJpc0Fubm90YXRpb24iLCJ0b0Jhc2U2NCIsInN0ciIsIkJ1ZmZlciIsIlVpbnQ4QXJyYXkiLCJ0b1N0cmluZyIsIndpbmRvdyIsImJ0b2EiLCJ1bmVzY2FwZSIsImVuY29kZVVSSUNvbXBvbmVudCIsImFkZEFubm90YXRpb24iLCJjb250ZW50Iiwib3V0cHV0RmlsZSIsImVvbCIsInRvIiwiZ2VuZXJhdGVNYXAiLCJnZW5lcmF0ZVN0cmluZyIsInRlc3QiLCJyZXNvbHZlIiwic2VwIiwicmVwbGFjZSIsInNvdXJjZVBhdGgiLCJTb3VyY2VNYXBHZW5lcmF0b3IiLCJsaW5lIiwiY29sdW1uIiwibGluZXMiLCJsYXN0Iiwic3RhcnQiLCJhZGRNYXBwaW5nIiwiZ2VuZXJhdGVkIiwib3JpZ2luYWwiLCJtYXRjaCIsImxhc3RJbmRleE9mIiwiZW5kIiwiZ2VuZXJhdGUiLCJyZXN1bHQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7OztJQUVxQkEsWTtBQUVqQiwwQkFBWUMsU0FBWixFQUF1QkMsSUFBdkIsRUFBNkJDLElBQTdCLEVBQW1DO0FBQUE7O0FBQy9CLGFBQUtGLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0EsYUFBS0csT0FBTCxHQUFpQkQsS0FBS0UsR0FBTCxJQUFZLEVBQTdCO0FBQ0EsYUFBS0gsSUFBTCxHQUFpQkEsSUFBakI7QUFDQSxhQUFLQyxJQUFMLEdBQWlCQSxJQUFqQjtBQUNIOzsyQkFFREcsSyxvQkFBUTtBQUNKLFlBQUssT0FBTyxLQUFLSCxJQUFMLENBQVVFLEdBQWpCLEtBQXlCLFdBQTlCLEVBQTRDO0FBQ3hDLG1CQUFPLENBQUMsQ0FBQyxLQUFLRixJQUFMLENBQVVFLEdBQW5CO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsbUJBQU8sS0FBS0UsUUFBTCxHQUFnQkMsTUFBaEIsR0FBeUIsQ0FBaEM7QUFDSDtBQUNKLEs7OzJCQUVERCxRLHVCQUFXO0FBQUE7O0FBQ1AsWUFBSyxDQUFDLEtBQUtFLFlBQVgsRUFBMEI7QUFDdEIsaUJBQUtBLFlBQUwsR0FBb0IsRUFBcEI7QUFDQSxpQkFBS1AsSUFBTCxDQUFVUSxJQUFWLENBQWdCLGdCQUFRO0FBQ3BCLG9CQUFLQyxLQUFLQyxNQUFMLElBQWVELEtBQUtDLE1BQUwsQ0FBWUMsS0FBWixDQUFrQlIsR0FBdEMsRUFBNEM7QUFDeEMsd0JBQUlBLE1BQU1NLEtBQUtDLE1BQUwsQ0FBWUMsS0FBWixDQUFrQlIsR0FBNUI7QUFDQSx3QkFBSyxNQUFLSSxZQUFMLENBQWtCSyxPQUFsQixDQUEwQlQsR0FBMUIsTUFBbUMsQ0FBQyxDQUF6QyxFQUE2QztBQUN6Qyw4QkFBS0ksWUFBTCxDQUFrQk0sSUFBbEIsQ0FBdUJWLEdBQXZCO0FBQ0g7QUFDSjtBQUNKLGFBUEQ7QUFRSDs7QUFFRCxlQUFPLEtBQUtJLFlBQVo7QUFDSCxLOzsyQkFFRE8sUSx1QkFBVztBQUNQLFlBQUssT0FBTyxLQUFLWixPQUFMLENBQWFhLE1BQXBCLEtBQStCLFdBQXBDLEVBQWtEO0FBQzlDLG1CQUFPLEtBQUtiLE9BQUwsQ0FBYWEsTUFBcEI7QUFDSDs7QUFFRCxZQUFJQyxhQUFhLEtBQUtkLE9BQUwsQ0FBYWMsVUFBOUI7QUFDQSxZQUFLLE9BQU9BLFVBQVAsS0FBc0IsV0FBdEIsSUFBcUNBLGVBQWUsSUFBekQsRUFBZ0U7QUFDNUQsbUJBQU8sS0FBUDtBQUNIOztBQUVELFlBQUssS0FBS1gsUUFBTCxHQUFnQkMsTUFBckIsRUFBOEI7QUFDMUIsbUJBQU8sS0FBS0QsUUFBTCxHQUFnQlksSUFBaEIsQ0FBc0I7QUFBQSx1QkFBS0MsRUFBRUgsTUFBUDtBQUFBLGFBQXRCLENBQVA7QUFDSCxTQUZELE1BRU87QUFDSCxtQkFBTyxJQUFQO0FBQ0g7QUFDSixLOzsyQkFFREksZ0IsK0JBQW1CO0FBQ2YsWUFBSyxPQUFPLEtBQUtqQixPQUFMLENBQWFrQixjQUFwQixLQUF1QyxXQUE1QyxFQUEwRDtBQUN0RCxtQkFBTyxLQUFLbEIsT0FBTCxDQUFha0IsY0FBcEI7QUFDSDtBQUNELFlBQUssS0FBS2YsUUFBTCxHQUFnQkMsTUFBckIsRUFBOEI7QUFDMUIsbUJBQU8sS0FBS0QsUUFBTCxHQUFnQlksSUFBaEIsQ0FBc0I7QUFBQSx1QkFBS0MsRUFBRUcsV0FBRixFQUFMO0FBQUEsYUFBdEIsQ0FBUDtBQUNILFNBRkQsTUFFTztBQUNILG1CQUFPLElBQVA7QUFDSDtBQUNKLEs7OzJCQUVEQyxlLDhCQUFrQjtBQUNkLFlBQUssS0FBS3BCLE9BQUwsQ0FBYWMsVUFBYixLQUE0QixLQUFqQyxFQUF5Qzs7QUFFekMsWUFBSVAsYUFBSjtBQUNBLGFBQU0sSUFBSVMsSUFBSSxLQUFLbEIsSUFBTCxDQUFVdUIsS0FBVixDQUFnQmpCLE1BQWhCLEdBQXlCLENBQXZDLEVBQTBDWSxLQUFLLENBQS9DLEVBQWtEQSxHQUFsRCxFQUF3RDtBQUNwRFQsbUJBQU8sS0FBS1QsSUFBTCxDQUFVdUIsS0FBVixDQUFnQkwsQ0FBaEIsQ0FBUDtBQUNBLGdCQUFLVCxLQUFLZSxJQUFMLEtBQWMsU0FBbkIsRUFBK0I7QUFDL0IsZ0JBQUtmLEtBQUtnQixJQUFMLENBQVViLE9BQVYsQ0FBa0IscUJBQWxCLE1BQTZDLENBQWxELEVBQXNEO0FBQ2xELHFCQUFLWixJQUFMLENBQVUwQixXQUFWLENBQXNCUixDQUF0QjtBQUNIO0FBQ0o7QUFDSixLOzsyQkFFRFMsaUIsZ0NBQW9CO0FBQUE7O0FBQ2hCLFlBQUlDLFVBQVUsRUFBZDtBQUNBLGFBQUs1QixJQUFMLENBQVVRLElBQVYsQ0FBZ0IsZ0JBQVE7QUFDcEIsZ0JBQUtDLEtBQUtDLE1BQVYsRUFBbUI7QUFDZixvQkFBSW1CLE9BQU9wQixLQUFLQyxNQUFMLENBQVlDLEtBQVosQ0FBa0JrQixJQUE3QjtBQUNBLG9CQUFLQSxRQUFRLENBQUNELFFBQVFDLElBQVIsQ0FBZCxFQUE4QjtBQUMxQkQsNEJBQVFDLElBQVIsSUFBZ0IsSUFBaEI7QUFDQSx3QkFBSUMsV0FBVyxPQUFLQSxRQUFMLENBQWNELElBQWQsQ0FBZjtBQUNBLDJCQUFLMUIsR0FBTCxDQUFTNEIsZ0JBQVQsQ0FBMEJELFFBQTFCLEVBQW9DckIsS0FBS0MsTUFBTCxDQUFZQyxLQUFaLENBQWtCcUIsR0FBdEQ7QUFDSDtBQUNKO0FBQ0osU0FURDtBQVVILEs7OzJCQUVEQyxhLDRCQUFnQjtBQUNaLDZCQUFrQixLQUFLNUIsUUFBTCxFQUFsQixrSEFBb0M7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBLGdCQUExQjZCLElBQTBCOztBQUNoQyxnQkFBSUwsT0FBTyxLQUFLQyxRQUFMLENBQWNJLEtBQUtDLElBQW5CLENBQVg7QUFDQSxnQkFBSW5DLE9BQU9rQyxLQUFLbEMsSUFBTCxJQUFhLGVBQUtvQyxPQUFMLENBQWFGLEtBQUtDLElBQWxCLENBQXhCO0FBQ0EsZ0JBQUloQyxZQUFKOztBQUVBLGdCQUFLLEtBQUtELE9BQUwsQ0FBYWtCLGNBQWIsS0FBZ0MsS0FBckMsRUFBNkM7QUFDekNqQixzQkFBTSxJQUFJLG9CQUFRa0MsaUJBQVosQ0FBOEJILEtBQUtULElBQW5DLENBQU47QUFDQSxvQkFBS3RCLElBQUlpQixjQUFULEVBQTBCO0FBQ3RCakIsd0JBQUlpQixjQUFKLEdBQXFCakIsSUFBSWlCLGNBQUosQ0FBbUJqQixHQUFuQixDQUF3QjtBQUFBLCtCQUFNLElBQU47QUFBQSxxQkFBeEIsQ0FBckI7QUFDSDtBQUNKLGFBTEQsTUFLTztBQUNIQSxzQkFBTStCLEtBQUtJLFFBQUwsRUFBTjtBQUNIOztBQUVELGlCQUFLbkMsR0FBTCxDQUFTb0MsY0FBVCxDQUF3QnBDLEdBQXhCLEVBQTZCMEIsSUFBN0IsRUFBbUMsS0FBS0MsUUFBTCxDQUFjOUIsSUFBZCxDQUFuQztBQUNIO0FBQ0osSzs7MkJBRUR3QyxZLDJCQUFlO0FBQ1gsWUFBSyxLQUFLMUIsUUFBTCxFQUFMLEVBQXVCO0FBQ25CLG1CQUFPLElBQVA7QUFDSCxTQUZELE1BRU8sSUFBSyxPQUFPLEtBQUtaLE9BQUwsQ0FBYWMsVUFBcEIsS0FBbUMsV0FBeEMsRUFBc0Q7QUFDekQsbUJBQU8sS0FBS2QsT0FBTCxDQUFhYyxVQUFwQjtBQUNILFNBRk0sTUFFQSxJQUFLLEtBQUtYLFFBQUwsR0FBZ0JDLE1BQXJCLEVBQThCO0FBQ2pDLG1CQUFPLEtBQUtELFFBQUwsR0FBZ0JZLElBQWhCLENBQXNCO0FBQUEsdUJBQUtDLEVBQUVGLFVBQVA7QUFBQSxhQUF0QixDQUFQO0FBQ0gsU0FGTSxNQUVBO0FBQ0gsbUJBQU8sSUFBUDtBQUNIO0FBQ0osSzs7MkJBRUR5QixRLHFCQUFTQyxHLEVBQUs7QUFDVixZQUFLQyxNQUFMLEVBQWM7QUFDVixnQkFBS0EsT0FBT2QsSUFBUCxJQUFlYyxPQUFPZCxJQUFQLEtBQWdCZSxXQUFXZixJQUEvQyxFQUFzRDtBQUNsRCx1QkFBT2MsT0FBT2QsSUFBUCxDQUFZYSxHQUFaLEVBQWlCRyxRQUFqQixDQUEwQixRQUExQixDQUFQO0FBQ0gsYUFGRCxNQUVPO0FBQ0gsdUJBQU8sSUFBSUYsTUFBSixDQUFXRCxHQUFYLEVBQWdCRyxRQUFoQixDQUF5QixRQUF6QixDQUFQO0FBQ0g7QUFDSixTQU5ELE1BTU87QUFDSCxtQkFBT0MsT0FBT0MsSUFBUCxDQUFZQyxTQUFTQyxtQkFBbUJQLEdBQW5CLENBQVQsQ0FBWixDQUFQO0FBQ0g7QUFDSixLOzsyQkFFRFEsYSw0QkFBZ0I7QUFDWixZQUFJQyxnQkFBSjs7QUFFQSxZQUFLLEtBQUtyQyxRQUFMLEVBQUwsRUFBdUI7O0FBRW5CcUMsc0JBQVUsa0NBQ04sS0FBS1YsUUFBTCxDQUFjLEtBQUt0QyxHQUFMLENBQVMwQyxRQUFULEVBQWQsQ0FESjtBQUdILFNBTEQsTUFLTyxJQUFLLE9BQU8sS0FBSzNDLE9BQUwsQ0FBYWMsVUFBcEIsS0FBbUMsUUFBeEMsRUFBbUQ7QUFDdERtQyxzQkFBVSxLQUFLakQsT0FBTCxDQUFhYyxVQUF2QjtBQUVILFNBSE0sTUFHQTtBQUNIbUMsc0JBQVUsS0FBS0MsVUFBTCxLQUFvQixNQUE5QjtBQUNIOztBQUVELFlBQUlDLE1BQVEsSUFBWjtBQUNBLFlBQUssS0FBS3JCLEdBQUwsQ0FBU3BCLE9BQVQsQ0FBaUIsTUFBakIsTUFBNkIsQ0FBQyxDQUFuQyxFQUF1Q3lDLE1BQU0sTUFBTjs7QUFFdkMsYUFBS3JCLEdBQUwsSUFBWXFCLE1BQU0sdUJBQU4sR0FBZ0NGLE9BQWhDLEdBQTBDLEtBQXREO0FBQ0gsSzs7MkJBRURDLFUseUJBQWE7QUFDVCxZQUFLLEtBQUtuRCxJQUFMLENBQVVxRCxFQUFmLEVBQW9CO0FBQ2hCLG1CQUFPLEtBQUt4QixRQUFMLENBQWMsS0FBSzdCLElBQUwsQ0FBVXFELEVBQXhCLENBQVA7QUFDSCxTQUZELE1BRU8sSUFBSyxLQUFLckQsSUFBTCxDQUFVNEIsSUFBZixFQUFzQjtBQUN6QixtQkFBTyxLQUFLQyxRQUFMLENBQWMsS0FBSzdCLElBQUwsQ0FBVTRCLElBQXhCLENBQVA7QUFDSCxTQUZNLE1BRUE7QUFDSCxtQkFBTyxRQUFQO0FBQ0g7QUFDSixLOzsyQkFFRDBCLFcsMEJBQWM7QUFDVixhQUFLQyxjQUFMO0FBQ0EsWUFBSyxLQUFLckMsZ0JBQUwsRUFBTCxFQUFrQyxLQUFLUSxpQkFBTDtBQUNsQyxZQUFLLEtBQUt0QixRQUFMLEdBQWdCQyxNQUFoQixHQUF5QixDQUE5QixFQUFrQyxLQUFLMkIsYUFBTDtBQUNsQyxZQUFLLEtBQUtPLFlBQUwsRUFBTCxFQUFrQyxLQUFLVSxhQUFMOztBQUVsQyxZQUFLLEtBQUtwQyxRQUFMLEVBQUwsRUFBdUI7QUFDbkIsbUJBQU8sQ0FBQyxLQUFLa0IsR0FBTixDQUFQO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsbUJBQU8sQ0FBQyxLQUFLQSxHQUFOLEVBQVcsS0FBSzdCLEdBQWhCLENBQVA7QUFDSDtBQUNKLEs7OzJCQUVEMkIsUSxxQkFBU0ssSSxFQUFNO0FBQ1gsWUFBS0EsS0FBS3ZCLE9BQUwsQ0FBYSxHQUFiLE1BQXNCLENBQTNCLEVBQStCLE9BQU91QixJQUFQO0FBQy9CLFlBQUssWUFBWXNCLElBQVosQ0FBaUJ0QixJQUFqQixDQUFMLEVBQThCLE9BQU9BLElBQVA7O0FBRTlCLFlBQUlOLE9BQU8sS0FBSzVCLElBQUwsQ0FBVXFELEVBQVYsR0FBZSxlQUFLbEIsT0FBTCxDQUFhLEtBQUtuQyxJQUFMLENBQVVxRCxFQUF2QixDQUFmLEdBQTRDLEdBQXZEOztBQUVBLFlBQUssT0FBTyxLQUFLcEQsT0FBTCxDQUFhYyxVQUFwQixLQUFtQyxRQUF4QyxFQUFtRDtBQUMvQ2EsbUJBQU8sZUFBS08sT0FBTCxDQUFjLGVBQUtzQixPQUFMLENBQWE3QixJQUFiLEVBQW1CLEtBQUszQixPQUFMLENBQWFjLFVBQWhDLENBQWQsQ0FBUDtBQUNIOztBQUVEbUIsZUFBTyxlQUFLTCxRQUFMLENBQWNELElBQWQsRUFBb0JNLElBQXBCLENBQVA7QUFDQSxZQUFLLGVBQUt3QixHQUFMLEtBQWEsSUFBbEIsRUFBeUI7QUFDckIsbUJBQU94QixLQUFLeUIsT0FBTCxDQUFhLEtBQWIsRUFBb0IsR0FBcEIsQ0FBUDtBQUNILFNBRkQsTUFFTztBQUNILG1CQUFPekIsSUFBUDtBQUNIO0FBQ0osSzs7MkJBRUQwQixVLHVCQUFXcEQsSSxFQUFNO0FBQ2IsWUFBSyxLQUFLUCxPQUFMLENBQWEyQixJQUFsQixFQUF5QjtBQUNyQixtQkFBTyxLQUFLM0IsT0FBTCxDQUFhMkIsSUFBcEI7QUFDSCxTQUZELE1BRU87QUFDSCxtQkFBTyxLQUFLQyxRQUFMLENBQWNyQixLQUFLQyxNQUFMLENBQVlDLEtBQVosQ0FBa0JrQixJQUFoQyxDQUFQO0FBQ0g7QUFDSixLOzsyQkFFRDJCLGMsNkJBQWlCO0FBQUE7O0FBQ2IsYUFBS3hCLEdBQUwsR0FBVyxFQUFYO0FBQ0EsYUFBSzdCLEdBQUwsR0FBVyxJQUFJLG9CQUFRMkQsa0JBQVosQ0FBK0IsRUFBRTNCLE1BQU0sS0FBS2lCLFVBQUwsRUFBUixFQUEvQixDQUFYOztBQUVBLFlBQUlXLE9BQVMsQ0FBYjtBQUNBLFlBQUlDLFNBQVMsQ0FBYjs7QUFFQSxZQUFJQyxjQUFKO0FBQUEsWUFBV0MsYUFBWDtBQUNBLGFBQUtuRSxTQUFMLENBQWUsS0FBS0MsSUFBcEIsRUFBMEIsVUFBQzBDLEdBQUQsRUFBTWpDLElBQU4sRUFBWWUsSUFBWixFQUFxQjtBQUMzQyxtQkFBS1EsR0FBTCxJQUFZVSxHQUFaOztBQUVBLGdCQUFLakMsUUFBUWUsU0FBUyxLQUF0QixFQUE4QjtBQUMxQixvQkFBS2YsS0FBS0MsTUFBTCxJQUFlRCxLQUFLQyxNQUFMLENBQVl5RCxLQUFoQyxFQUF3QztBQUNwQywyQkFBS2hFLEdBQUwsQ0FBU2lFLFVBQVQsQ0FBb0I7QUFDaEIxRCxnQ0FBVyxPQUFLbUQsVUFBTCxDQUFnQnBELElBQWhCLENBREs7QUFFaEI0RCxtQ0FBVyxFQUFFTixVQUFGLEVBQVFDLFFBQVFBLFNBQVMsQ0FBekIsRUFGSztBQUdoQk0sa0NBQVc7QUFDUFAsa0NBQVF0RCxLQUFLQyxNQUFMLENBQVl5RCxLQUFaLENBQWtCSixJQURuQjtBQUVQQyxvQ0FBUXZELEtBQUtDLE1BQUwsQ0FBWXlELEtBQVosQ0FBa0JILE1BQWxCLEdBQTJCO0FBRjVCO0FBSEsscUJBQXBCO0FBUUgsaUJBVEQsTUFTTztBQUNILDJCQUFLN0QsR0FBTCxDQUFTaUUsVUFBVCxDQUFvQjtBQUNoQjFELGdDQUFXLGFBREs7QUFFaEI0RCxrQ0FBVyxFQUFFUCxNQUFNLENBQVIsRUFBV0MsUUFBUSxDQUFuQixFQUZLO0FBR2hCSyxtQ0FBVyxFQUFFTixVQUFGLEVBQVFDLFFBQVFBLFNBQVMsQ0FBekI7QUFISyxxQkFBcEI7QUFLSDtBQUNKOztBQUVEQyxvQkFBUXZCLElBQUk2QixLQUFKLENBQVUsS0FBVixDQUFSO0FBQ0EsZ0JBQUtOLEtBQUwsRUFBYTtBQUNURix3QkFBU0UsTUFBTTNELE1BQWY7QUFDQTRELHVCQUFTeEIsSUFBSThCLFdBQUosQ0FBZ0IsSUFBaEIsQ0FBVDtBQUNBUix5QkFBU3RCLElBQUlwQyxNQUFKLEdBQWE0RCxJQUF0QjtBQUNILGFBSkQsTUFJTztBQUNIRiwwQkFBVXRCLElBQUlwQyxNQUFkO0FBQ0g7O0FBRUQsZ0JBQUtHLFFBQVFlLFNBQVMsT0FBdEIsRUFBZ0M7QUFDNUIsb0JBQUtmLEtBQUtDLE1BQUwsSUFBZUQsS0FBS0MsTUFBTCxDQUFZK0QsR0FBaEMsRUFBc0M7QUFDbEMsMkJBQUt0RSxHQUFMLENBQVNpRSxVQUFULENBQW9CO0FBQ2hCMUQsZ0NBQVcsT0FBS21ELFVBQUwsQ0FBZ0JwRCxJQUFoQixDQURLO0FBRWhCNEQsbUNBQVcsRUFBRU4sVUFBRixFQUFRQyxRQUFRQSxTQUFTLENBQXpCLEVBRks7QUFHaEJNLGtDQUFXO0FBQ1BQLGtDQUFRdEQsS0FBS0MsTUFBTCxDQUFZK0QsR0FBWixDQUFnQlYsSUFEakI7QUFFUEMsb0NBQVF2RCxLQUFLQyxNQUFMLENBQVkrRCxHQUFaLENBQWdCVDtBQUZqQjtBQUhLLHFCQUFwQjtBQVFILGlCQVRELE1BU087QUFDSCwyQkFBSzdELEdBQUwsQ0FBU2lFLFVBQVQsQ0FBb0I7QUFDaEIxRCxnQ0FBVyxhQURLO0FBRWhCNEQsa0NBQVcsRUFBRVAsTUFBTSxDQUFSLEVBQVdDLFFBQVEsQ0FBbkIsRUFGSztBQUdoQkssbUNBQVcsRUFBRU4sVUFBRixFQUFRQyxRQUFRQSxTQUFTLENBQXpCO0FBSEsscUJBQXBCO0FBS0g7QUFDSjtBQUNKLFNBakREO0FBa0RILEs7OzJCQUVEVSxRLHVCQUFXO0FBQ1AsYUFBS3BELGVBQUw7O0FBRUEsWUFBSyxLQUFLbEIsS0FBTCxFQUFMLEVBQW9CO0FBQ2hCLG1CQUFPLEtBQUttRCxXQUFMLEVBQVA7QUFDSCxTQUZELE1BRU87QUFDSCxnQkFBSW9CLFNBQVMsRUFBYjtBQUNBLGlCQUFLNUUsU0FBTCxDQUFlLEtBQUtDLElBQXBCLEVBQTBCLGFBQUs7QUFDM0IyRSwwQkFBVXpELENBQVY7QUFDSCxhQUZEO0FBR0EsbUJBQU8sQ0FBQ3lELE1BQUQsQ0FBUDtBQUNIO0FBQ0osSzs7Ozs7a0JBalJnQjdFLFkiLCJmaWxlIjoibWFwLWdlbmVyYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb3ppbGxhIGZyb20gJ3NvdXJjZS1tYXAnO1xuaW1wb3J0IHBhdGggICAgZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcEdlbmVyYXRvciB7XG5cbiAgICBjb25zdHJ1Y3RvcihzdHJpbmdpZnksIHJvb3QsIG9wdHMpIHtcbiAgICAgICAgdGhpcy5zdHJpbmdpZnkgPSBzdHJpbmdpZnk7XG4gICAgICAgIHRoaXMubWFwT3B0cyAgID0gb3B0cy5tYXAgfHwgeyB9O1xuICAgICAgICB0aGlzLnJvb3QgICAgICA9IHJvb3Q7XG4gICAgICAgIHRoaXMub3B0cyAgICAgID0gb3B0cztcbiAgICB9XG5cbiAgICBpc01hcCgpIHtcbiAgICAgICAgaWYgKCB0eXBlb2YgdGhpcy5vcHRzLm1hcCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gISF0aGlzLm9wdHMubWFwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJldmlvdXMoKS5sZW5ndGggPiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJldmlvdXMoKSB7XG4gICAgICAgIGlmICggIXRoaXMucHJldmlvdXNNYXBzICkge1xuICAgICAgICAgICAgdGhpcy5wcmV2aW91c01hcHMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucm9vdC53YWxrKCBub2RlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIG5vZGUuc291cmNlICYmIG5vZGUuc291cmNlLmlucHV0Lm1hcCApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1hcCA9IG5vZGUuc291cmNlLmlucHV0Lm1hcDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLnByZXZpb3VzTWFwcy5pbmRleE9mKG1hcCkgPT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2aW91c01hcHMucHVzaChtYXApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5wcmV2aW91c01hcHM7XG4gICAgfVxuXG4gICAgaXNJbmxpbmUoKSB7XG4gICAgICAgIGlmICggdHlwZW9mIHRoaXMubWFwT3B0cy5pbmxpbmUgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwT3B0cy5pbmxpbmU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYW5ub3RhdGlvbiA9IHRoaXMubWFwT3B0cy5hbm5vdGF0aW9uO1xuICAgICAgICBpZiAoIHR5cGVvZiBhbm5vdGF0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBhbm5vdGF0aW9uICE9PSB0cnVlICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCB0aGlzLnByZXZpb3VzKCkubGVuZ3RoICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJldmlvdXMoKS5zb21lKCBpID0+IGkuaW5saW5lICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzU291cmNlc0NvbnRlbnQoKSB7XG4gICAgICAgIGlmICggdHlwZW9mIHRoaXMubWFwT3B0cy5zb3VyY2VzQ29udGVudCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXBPcHRzLnNvdXJjZXNDb250ZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmICggdGhpcy5wcmV2aW91cygpLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCkuc29tZSggaSA9PiBpLndpdGhDb250ZW50KCkgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJBbm5vdGF0aW9uKCkge1xuICAgICAgICBpZiAoIHRoaXMubWFwT3B0cy5hbm5vdGF0aW9uID09PSBmYWxzZSApIHJldHVybjtcblxuICAgICAgICBsZXQgbm9kZTtcbiAgICAgICAgZm9yICggbGV0IGkgPSB0aGlzLnJvb3Qubm9kZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0gKSB7XG4gICAgICAgICAgICBub2RlID0gdGhpcy5yb290Lm5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKCBub2RlLnR5cGUgIT09ICdjb21tZW50JyApIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKCBub2RlLnRleHQuaW5kZXhPZignIyBzb3VyY2VNYXBwaW5nVVJMPScpID09PSAwICkge1xuICAgICAgICAgICAgICAgIHRoaXMucm9vdC5yZW1vdmVDaGlsZChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFNvdXJjZXNDb250ZW50KCkge1xuICAgICAgICBsZXQgYWxyZWFkeSA9IHsgfTtcbiAgICAgICAgdGhpcy5yb290LndhbGsoIG5vZGUgPT4ge1xuICAgICAgICAgICAgaWYgKCBub2RlLnNvdXJjZSApIHtcbiAgICAgICAgICAgICAgICBsZXQgZnJvbSA9IG5vZGUuc291cmNlLmlucHV0LmZyb207XG4gICAgICAgICAgICAgICAgaWYgKCBmcm9tICYmICFhbHJlYWR5W2Zyb21dICkge1xuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5W2Zyb21dID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlbGF0aXZlID0gdGhpcy5yZWxhdGl2ZShmcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXAuc2V0U291cmNlQ29udGVudChyZWxhdGl2ZSwgbm9kZS5zb3VyY2UuaW5wdXQuY3NzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFwcGx5UHJldk1hcHMoKSB7XG4gICAgICAgIGZvciAoIGxldCBwcmV2IG9mIHRoaXMucHJldmlvdXMoKSApIHtcbiAgICAgICAgICAgIGxldCBmcm9tID0gdGhpcy5yZWxhdGl2ZShwcmV2LmZpbGUpO1xuICAgICAgICAgICAgbGV0IHJvb3QgPSBwcmV2LnJvb3QgfHwgcGF0aC5kaXJuYW1lKHByZXYuZmlsZSk7XG4gICAgICAgICAgICBsZXQgbWFwO1xuXG4gICAgICAgICAgICBpZiAoIHRoaXMubWFwT3B0cy5zb3VyY2VzQ29udGVudCA9PT0gZmFsc2UgKSB7XG4gICAgICAgICAgICAgICAgbWFwID0gbmV3IG1vemlsbGEuU291cmNlTWFwQ29uc3VtZXIocHJldi50ZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAoIG1hcC5zb3VyY2VzQ29udGVudCApIHtcbiAgICAgICAgICAgICAgICAgICAgbWFwLnNvdXJjZXNDb250ZW50ID0gbWFwLnNvdXJjZXNDb250ZW50Lm1hcCggKCkgPT4gbnVsbCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWFwID0gcHJldi5jb25zdW1lcigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm1hcC5hcHBseVNvdXJjZU1hcChtYXAsIGZyb20sIHRoaXMucmVsYXRpdmUocm9vdCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNBbm5vdGF0aW9uKCkge1xuICAgICAgICBpZiAoIHRoaXMuaXNJbmxpbmUoKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2YgdGhpcy5tYXBPcHRzLmFubm90YXRpb24gIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwT3B0cy5hbm5vdGF0aW9uO1xuICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnByZXZpb3VzKCkubGVuZ3RoICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJldmlvdXMoKS5zb21lKCBpID0+IGkuYW5ub3RhdGlvbiApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b0Jhc2U2NChzdHIpIHtcbiAgICAgICAgaWYgKCBCdWZmZXIgKSB7XG4gICAgICAgICAgICBpZiAoIEJ1ZmZlci5mcm9tICYmIEJ1ZmZlci5mcm9tICE9PSBVaW50OEFycmF5LmZyb20gKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHN0cikudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEJ1ZmZlcihzdHIpLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3RyKSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkQW5ub3RhdGlvbigpIHtcbiAgICAgICAgbGV0IGNvbnRlbnQ7XG5cbiAgICAgICAgaWYgKCB0aGlzLmlzSW5saW5lKCkgKSB7XG5cbiAgICAgICAgICAgIGNvbnRlbnQgPSAnZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCwnICtcbiAgICAgICAgICAgICAgICB0aGlzLnRvQmFzZTY0KHRoaXMubWFwLnRvU3RyaW5nKCkpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIHR5cGVvZiB0aGlzLm1hcE9wdHMuYW5ub3RhdGlvbiA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gdGhpcy5tYXBPcHRzLmFubm90YXRpb247XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLm91dHB1dEZpbGUoKSArICcubWFwJztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlb2wgICA9ICdcXG4nO1xuICAgICAgICBpZiAoIHRoaXMuY3NzLmluZGV4T2YoJ1xcclxcbicpICE9PSAtMSApIGVvbCA9ICdcXHJcXG4nO1xuXG4gICAgICAgIHRoaXMuY3NzICs9IGVvbCArICcvKiMgc291cmNlTWFwcGluZ1VSTD0nICsgY29udGVudCArICcgKi8nO1xuICAgIH1cblxuICAgIG91dHB1dEZpbGUoKSB7XG4gICAgICAgIGlmICggdGhpcy5vcHRzLnRvICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVsYXRpdmUodGhpcy5vcHRzLnRvKTtcbiAgICAgICAgfSBlbHNlIGlmICggdGhpcy5vcHRzLmZyb20gKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWxhdGl2ZSh0aGlzLm9wdHMuZnJvbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RvLmNzcyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZU1hcCgpIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVN0cmluZygpO1xuICAgICAgICBpZiAoIHRoaXMuaXNTb3VyY2VzQ29udGVudCgpICkgICAgdGhpcy5zZXRTb3VyY2VzQ29udGVudCgpO1xuICAgICAgICBpZiAoIHRoaXMucHJldmlvdXMoKS5sZW5ndGggPiAwICkgdGhpcy5hcHBseVByZXZNYXBzKCk7XG4gICAgICAgIGlmICggdGhpcy5pc0Fubm90YXRpb24oKSApICAgICAgICB0aGlzLmFkZEFubm90YXRpb24oKTtcblxuICAgICAgICBpZiAoIHRoaXMuaXNJbmxpbmUoKSApIHtcbiAgICAgICAgICAgIHJldHVybiBbdGhpcy5jc3NdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFt0aGlzLmNzcywgdGhpcy5tYXBdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVsYXRpdmUoZmlsZSkge1xuICAgICAgICBpZiAoIGZpbGUuaW5kZXhPZignPCcpID09PSAwICkgcmV0dXJuIGZpbGU7XG4gICAgICAgIGlmICggL15cXHcrOlxcL1xcLy8udGVzdChmaWxlKSApIHJldHVybiBmaWxlO1xuXG4gICAgICAgIGxldCBmcm9tID0gdGhpcy5vcHRzLnRvID8gcGF0aC5kaXJuYW1lKHRoaXMub3B0cy50bykgOiAnLic7XG5cbiAgICAgICAgaWYgKCB0eXBlb2YgdGhpcy5tYXBPcHRzLmFubm90YXRpb24gPT09ICdzdHJpbmcnICkge1xuICAgICAgICAgICAgZnJvbSA9IHBhdGguZGlybmFtZSggcGF0aC5yZXNvbHZlKGZyb20sIHRoaXMubWFwT3B0cy5hbm5vdGF0aW9uKSApO1xuICAgICAgICB9XG5cbiAgICAgICAgZmlsZSA9IHBhdGgucmVsYXRpdmUoZnJvbSwgZmlsZSk7XG4gICAgICAgIGlmICggcGF0aC5zZXAgPT09ICdcXFxcJyApIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc291cmNlUGF0aChub2RlKSB7XG4gICAgICAgIGlmICggdGhpcy5tYXBPcHRzLmZyb20gKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXBPcHRzLmZyb207XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWxhdGl2ZShub2RlLnNvdXJjZS5pbnB1dC5mcm9tKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlU3RyaW5nKCkge1xuICAgICAgICB0aGlzLmNzcyA9ICcnO1xuICAgICAgICB0aGlzLm1hcCA9IG5ldyBtb3ppbGxhLlNvdXJjZU1hcEdlbmVyYXRvcih7IGZpbGU6IHRoaXMub3V0cHV0RmlsZSgpIH0pO1xuXG4gICAgICAgIGxldCBsaW5lICAgPSAxO1xuICAgICAgICBsZXQgY29sdW1uID0gMTtcblxuICAgICAgICBsZXQgbGluZXMsIGxhc3Q7XG4gICAgICAgIHRoaXMuc3RyaW5naWZ5KHRoaXMucm9vdCwgKHN0ciwgbm9kZSwgdHlwZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jc3MgKz0gc3RyO1xuXG4gICAgICAgICAgICBpZiAoIG5vZGUgJiYgdHlwZSAhPT0gJ2VuZCcgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBub2RlLnNvdXJjZSAmJiBub2RlLnNvdXJjZS5zdGFydCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICAgIHRoaXMuc291cmNlUGF0aChub2RlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lLCBjb2x1bW46IGNvbHVtbiAtIDEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6ICAgbm9kZS5zb3VyY2Uuc3RhcnQubGluZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IG5vZGUuc291cmNlLnN0YXJ0LmNvbHVtbiAtIDFcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICAgICc8bm8gc291cmNlPicsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogIHsgbGluZTogMSwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZSwgY29sdW1uOiBjb2x1bW4gLSAxIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5lcyA9IHN0ci5tYXRjaCgvXFxuL2cpO1xuICAgICAgICAgICAgaWYgKCBsaW5lcyApIHtcbiAgICAgICAgICAgICAgICBsaW5lICArPSBsaW5lcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgbGFzdCAgID0gc3RyLmxhc3RJbmRleE9mKCdcXG4nKTtcbiAgICAgICAgICAgICAgICBjb2x1bW4gPSBzdHIubGVuZ3RoIC0gbGFzdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29sdW1uICs9IHN0ci5sZW5ndGg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggbm9kZSAmJiB0eXBlICE9PSAnc3RhcnQnICkge1xuICAgICAgICAgICAgICAgIGlmICggbm9kZS5zb3VyY2UgJiYgbm9kZS5zb3VyY2UuZW5kICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogICAgdGhpcy5zb3VyY2VQYXRoKG5vZGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmUsIGNvbHVtbjogY29sdW1uIC0gMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6ICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogICBub2RlLnNvdXJjZS5lbmQubGluZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IG5vZGUuc291cmNlLmVuZC5jb2x1bW5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICAgICc8bm8gc291cmNlPicsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogIHsgbGluZTogMSwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZSwgY29sdW1uOiBjb2x1bW4gLSAxIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZSgpIHtcbiAgICAgICAgdGhpcy5jbGVhckFubm90YXRpb24oKTtcblxuICAgICAgICBpZiAoIHRoaXMuaXNNYXAoKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlTWFwKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgICAgICB0aGlzLnN0cmluZ2lmeSh0aGlzLnJvb3QsIGkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gW3Jlc3VsdF07XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==
