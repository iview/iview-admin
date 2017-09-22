"use strict";

exports.__esModule = true;
exports.default = undefined;

var _virtualTypes = require("./lib/virtual-types");

var virtualTypes = _interopRequireWildcard(_virtualTypes);

var _debug2 = require("debug");

var _debug3 = _interopRequireDefault(_debug2);

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _index = require("../index");

var _index2 = _interopRequireDefault(_index);

var _scope = require("../scope");

var _scope2 = _interopRequireDefault(_scope);

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

var _cache = require("../cache");

var _ancestry = require("./ancestry");

var NodePath_ancestry = _interopRequireWildcard(_ancestry);

var _inference = require("./inference");

var NodePath_inference = _interopRequireWildcard(_inference);

var _replacement = require("./replacement");

var NodePath_replacement = _interopRequireWildcard(_replacement);

var _evaluation = require("./evaluation");

var NodePath_evaluation = _interopRequireWildcard(_evaluation);

var _conversion = require("./conversion");

var NodePath_conversion = _interopRequireWildcard(_conversion);

var _introspection = require("./introspection");

var NodePath_introspection = _interopRequireWildcard(_introspection);

var _context = require("./context");

var NodePath_context = _interopRequireWildcard(_context);

var _removal = require("./removal");

var NodePath_removal = _interopRequireWildcard(_removal);

var _modification = require("./modification");

var NodePath_modification = _interopRequireWildcard(_modification);

var _family = require("./family");

var NodePath_family = _interopRequireWildcard(_family);

var _comments = require("./comments");

var NodePath_comments = _interopRequireWildcard(_comments);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _debug = (0, _debug3.default)("babel");

var NodePath = function () {
  function NodePath(hub, parent) {
    this.parent = parent;
    this.hub = hub;
    this.contexts = [];
    this.data = {};
    this.shouldSkip = false;
    this.shouldStop = false;
    this.removed = false;
    this.state = null;
    this.opts = null;
    this.skipKeys = null;
    this.parentPath = null;
    this.context = null;
    this.container = null;
    this.listKey = null;
    this.inList = false;
    this.parentKey = null;
    this.key = null;
    this.node = null;
    this.scope = null;
    this.type = null;
    this.typeAnnotation = null;
  }

  NodePath.get = function get(_ref) {
    var hub = _ref.hub,
        parentPath = _ref.parentPath,
        parent = _ref.parent,
        container = _ref.container,
        listKey = _ref.listKey,
        key = _ref.key;

    if (!hub && parentPath) {
      hub = parentPath.hub;
    }

    (0, _invariant2.default)(parent, "To get a node path the parent needs to exist");
    var targetNode = container[key];
    var paths = _cache.path.get(parent) || [];

    if (!_cache.path.has(parent)) {
      _cache.path.set(parent, paths);
    }

    var path = void 0;

    for (var i = 0; i < paths.length; i++) {
      var pathCheck = paths[i];

      if (pathCheck.node === targetNode) {
        path = pathCheck;
        break;
      }
    }

    if (!path) {
      path = new NodePath(hub, parent);
      paths.push(path);
    }

    path.setup(parentPath, container, listKey, key);
    return path;
  };

  NodePath.prototype.getScope = function getScope(scope) {
    return this.isScope() ? new _scope2.default(this) : scope;
  };

  NodePath.prototype.setData = function setData(key, val) {
    return this.data[key] = val;
  };

  NodePath.prototype.getData = function getData(key, def) {
    var val = this.data[key];
    if (!val && def) val = this.data[key] = def;
    return val;
  };

  NodePath.prototype.buildCodeFrameError = function buildCodeFrameError(msg, Error) {
    if (Error === void 0) {
      Error = SyntaxError;
    }

    return this.hub.file.buildCodeFrameError(this.node, msg, Error);
  };

  NodePath.prototype.traverse = function traverse(visitor, state) {
    (0, _index2.default)(this.node, visitor, this.scope, state, this);
  };

  NodePath.prototype.mark = function mark(type, message) {
    this.hub.file.metadata.marked.push({
      type: type,
      message: message,
      loc: this.node.loc
    });
  };

  NodePath.prototype.set = function set(key, node) {
    t.validate(this.node, key, node);
    this.node[key] = node;
  };

  NodePath.prototype.getPathLocation = function getPathLocation() {
    var parts = [];
    var path = this;

    do {
      var key = path.key;
      if (path.inList) key = path.listKey + "[" + key + "]";
      parts.unshift(key);
    } while (path = path.parentPath);

    return parts.join(".");
  };

  NodePath.prototype.debug = function debug(buildMessage) {
    if (!_debug.enabled) return;

    _debug(this.getPathLocation() + " " + this.type + ": " + buildMessage());
  };

  return NodePath;
}();

exports.default = NodePath;
Object.assign(NodePath.prototype, NodePath_ancestry, NodePath_inference, NodePath_replacement, NodePath_evaluation, NodePath_conversion, NodePath_introspection, NodePath_context, NodePath_removal, NodePath_modification, NodePath_family, NodePath_comments);

var _loop = function _loop(type) {
  var typeKey = "is" + type;

  NodePath.prototype[typeKey] = function (opts) {
    return t[typeKey](this.node, opts);
  };

  NodePath.prototype["assert" + type] = function (opts) {
    if (!this[typeKey](opts)) {
      throw new TypeError("Expected node path of type " + type);
    }
  };
};

var _arr = t.TYPES;

for (var _i = 0; _i < _arr.length; _i++) {
  var type = _arr[_i];

  _loop(type);
}

var _loop2 = function _loop2(type) {
  if (type[0] === "_") return "continue";
  if (t.TYPES.indexOf(type) < 0) t.TYPES.push(type);
  var virtualType = virtualTypes[type];

  NodePath.prototype["is" + type] = function (opts) {
    return virtualType.checkPath(this, opts);
  };
};

for (var type in virtualTypes) {
  var _ret = _loop2(type);

  if (_ret === "continue") continue;
}