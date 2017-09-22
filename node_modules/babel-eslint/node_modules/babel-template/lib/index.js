"use strict";

exports.__esModule = true;

exports.default = function (code, opts) {
  var stack = void 0;

  try {
    throw new Error();
  } catch (error) {
    if (error.stack) {
      stack = error.stack.split("\n").slice(1).join("\n");
    }
  }

  opts = Object.assign({
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    preserveComments: false
  }, opts);

  var _getAst = function getAst() {
    var ast = void 0;

    try {
      ast = babylon.parse(code, opts);
      ast = _babelTraverse2.default.removeProperties(ast, {
        preserveComments: opts.preserveComments
      });
    } catch (err) {
      err.stack = err.stack + "from\n" + stack;
      throw err;
    }

    _getAst = function getAst() {
      return ast;
    };

    return ast;
  };

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return useTemplate(_getAst(), args);
  };
};

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _has = require("lodash/has");

var _has2 = _interopRequireDefault(_has);

var _babelTraverse = require("babel-traverse");

var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

var _babylon = require("babylon");

var babylon = _interopRequireWildcard(_babylon);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FROM_TEMPLATE = new Set();

function useTemplate(ast, nodes) {
  ast = (0, _cloneDeep2.default)(ast);
  var _ast = ast,
      program = _ast.program;

  if (nodes.length) {
    _babelTraverse2.default.cheap(ast, function (node) {
      FROM_TEMPLATE.add(node);
    });

    (0, _babelTraverse2.default)(ast, templateVisitor, null, nodes);
    FROM_TEMPLATE.clear();
  }

  if (program.body.length > 1) {
    return program.body;
  } else {
    return program.body[0];
  }
}

var templateVisitor = {
  noScope: true,
  Identifier: function Identifier(path, args) {
    var _path = path,
        node = _path.node,
        parentPath = _path.parentPath;
    if (!FROM_TEMPLATE.has(node)) return path.skip();
    var replacement = void 0;

    if ((0, _has2.default)(args[0], node.name)) {
      replacement = args[0][node.name];
    } else if (node.name[0] === "$") {
      var i = +node.name.slice(1);
      if (args[i]) replacement = args[i];
    }

    if (parentPath.isExpressionStatement()) {
      path = parentPath;
    }

    if (replacement === null) {
      path.remove();
    } else if (replacement) {
      path.replaceInline(replacement);
      path.skip();
    }
  },
  exit: function exit(_ref) {
    var node = _ref.node;

    if (!node.loc) {
      _babelTraverse2.default.clearNode(node);
    }
  }
};