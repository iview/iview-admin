"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _es = require("./es2015");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index2.default)("TypeAnnotation", {
  aliases: ["Flow"],
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: {
      validate: (0, _index.assertNodeType)("TSType", "Flow")
    }
  }
});
(0, _index2.default)("TypeParameterInstantiation", {
  visitor: ["params"],
  aliases: ["Flow"],
  fields: {
    params: {
      validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("TSType", "Flow")))
    }
  }
});
(0, _index2.default)("TypeParameterDeclaration", {
  aliases: ["Flow"],
  visitor: ["params"],
  fields: {
    params: {
      validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("TypeParameter")))
    }
  }
});
(0, _index2.default)("TypeParameter", {
  aliases: ["Flow"],
  visitor: ["bound", "constraint", "default"],
  fields: {
    name: {
      validate: (0, _index.assertValueType)("string")
    },
    bound: {
      validate: (0, _index.assertNodeType)("TypeAnnotation"),
      optional: true
    },
    constraint: {
      validate: (0, _index.assertNodeType)("TSType"),
      optional: true
    },
    default: {
      validate: (0, _index.assertNodeType)("TSType", "Flow"),
      optional: true
    }
  }
});
(0, _index2.default)("ClassProperty", {
  visitor: ["key", "value", "typeAnnotation", "decorators"],
  builder: ["key", "value", "typeAnnotation", "decorators", "computed"],
  aliases: ["Property"],
  fields: _extends({}, _es.classMethodOrPropertyCommon, {
    value: {
      validate: (0, _index.assertNodeType)("Expression"),
      optional: true
    },
    typeAnnotation: {
      validate: (0, _index.assertNodeType)("TypeAnnotation", "Noop"),
      optional: true
    },
    decorators: {
      validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("Decorator"))),
      optional: true
    },
    readonly: {
      validate: (0, _index.assertValueType)("boolean"),
      optional: true
    }
  })
});