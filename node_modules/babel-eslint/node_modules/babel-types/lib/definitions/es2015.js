"use strict";

exports.__esModule = true;
exports.classMethodOrDeclareMethodCommon = exports.classMethodOrPropertyCommon = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _core = require("./core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index2.default)("AssignmentPattern", {
  visitor: ["left", "right"],
  builder: ["left", "right"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: _extends({}, _core.patternLikeCommon, {
    left: {
      validate: (0, _index.assertNodeType)("Identifier", "ObjectPattern", "ArrayPattern")
    },
    right: {
      validate: (0, _index.assertNodeType)("Expression")
    },
    decorators: {
      validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("Decorator")))
    }
  })
});
(0, _index2.default)("ArrayPattern", {
  visitor: ["elements", "typeAnnotation"],
  builder: ["elements"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: _extends({}, _core.patternLikeCommon, {
    elements: {
      validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("PatternLike")))
    },
    decorators: {
      validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("Decorator")))
    }
  })
});
(0, _index2.default)("ArrowFunctionExpression", {
  builder: ["params", "body", "async"],
  visitor: ["params", "body", "returnType", "typeParameters"],
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Expression", "Pureish"],
  fields: _extends({}, _core.functionCommon, {
    expression: {
      validate: (0, _index.assertValueType)("boolean")
    },
    body: {
      validate: (0, _index.assertNodeType)("BlockStatement", "Expression")
    }
  })
});
(0, _index2.default)("ClassBody", {
  visitor: ["body"],
  fields: {
    body: {
      validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("ClassMethod", "ClassProperty", "TSDeclareMethod", "TSIndexSignature")))
    }
  }
});
var classCommon = {
  typeParameters: {
    validate: (0, _index.assertNodeType)("TypeParameterDeclaration", "Noop"),
    optional: true
  },
  body: {
    validate: (0, _index.assertNodeType)("ClassBody")
  },
  superClass: {
    optional: true,
    validate: (0, _index.assertNodeType)("Expression")
  },
  superTypeParameters: {
    validate: (0, _index.assertNodeType)("TypeParameterInstantiation"),
    optional: true
  },
  implements: {
    validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("TSExpressionWithTypeArguments", "FlowClassImplements"))),
    optional: true
  }
};
(0, _index2.default)("ClassDeclaration", {
  builder: ["id", "superClass", "body", "decorators"],
  visitor: ["id", "body", "superClass", "mixins", "typeParameters", "superTypeParameters", "implements", "decorators"],
  aliases: ["Scopable", "Class", "Statement", "Declaration", "Pureish"],
  fields: _extends({}, classCommon, {
    declare: {
      validate: (0, _index.assertValueType)("boolean"),
      optional: true
    },
    abstract: {
      validate: (0, _index.assertValueType)("boolean"),
      optional: true
    },
    id: {
      validate: (0, _index.assertNodeType)("Identifier"),
      optional: true
    },
    decorators: {
      validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("Decorator"))),
      optional: true
    }
  })
});
(0, _index2.default)("ClassExpression", {
  inherits: "ClassDeclaration",
  aliases: ["Scopable", "Class", "Expression", "Pureish"],
  fields: _extends({}, classCommon, {
    id: {
      optional: true,
      validate: (0, _index.assertNodeType)("Identifier")
    },
    body: {
      validate: (0, _index.assertNodeType)("ClassBody")
    },
    superClass: {
      optional: true,
      validate: (0, _index.assertNodeType)("Expression")
    },
    decorators: {
      validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("Decorator"))),
      optional: true
    }
  })
});
(0, _index2.default)("ExportAllDeclaration", {
  visitor: ["source"],
  aliases: ["Statement", "Declaration", "ModuleDeclaration", "ExportDeclaration"],
  fields: {
    source: {
      validate: (0, _index.assertNodeType)("StringLiteral")
    }
  }
});
(0, _index2.default)("ExportDefaultDeclaration", {
  visitor: ["declaration"],
  aliases: ["Statement", "Declaration", "ModuleDeclaration", "ExportDeclaration"],
  fields: {
    declaration: {
      validate: (0, _index.assertNodeType)("FunctionDeclaration", "TSDeclareFunction", "ClassDeclaration", "Expression")
    }
  }
});
(0, _index2.default)("ExportNamedDeclaration", {
  visitor: ["declaration", "specifiers", "source"],
  aliases: ["Statement", "Declaration", "ModuleDeclaration", "ExportDeclaration"],
  fields: {
    declaration: {
      validate: (0, _index.assertNodeType)("Declaration"),
      optional: true
    },
    specifiers: {
      validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("ExportSpecifier", "ExportDefaultSpecifier", "ExportNamespaceSpecifier")))
    },
    source: {
      validate: (0, _index.assertNodeType)("StringLiteral"),
      optional: true
    }
  }
});
(0, _index2.default)("ExportSpecifier", {
  visitor: ["local", "exported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: (0, _index.assertNodeType)("Identifier")
    },
    exported: {
      validate: (0, _index.assertNodeType)("Identifier")
    }
  }
});
(0, _index2.default)("ForOfStatement", {
  visitor: ["left", "right", "body"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop", "ForXStatement"],
  fields: {
    left: {
      validate: (0, _index.assertNodeType)("VariableDeclaration", "LVal")
    },
    right: {
      validate: (0, _index.assertNodeType)("Expression")
    },
    body: {
      validate: (0, _index.assertNodeType)("Statement")
    },
    await: {
      default: false,
      validate: (0, _index.assertValueType)("boolean")
    }
  }
});
(0, _index2.default)("ImportDeclaration", {
  visitor: ["specifiers", "source"],
  aliases: ["Statement", "Declaration", "ModuleDeclaration"],
  fields: {
    specifiers: {
      validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("ImportSpecifier", "ImportDefaultSpecifier", "ImportNamespaceSpecifier")))
    },
    source: {
      validate: (0, _index.assertNodeType)("StringLiteral")
    }
  }
});
(0, _index2.default)("ImportDefaultSpecifier", {
  visitor: ["local"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: (0, _index.assertNodeType)("Identifier")
    }
  }
});
(0, _index2.default)("ImportNamespaceSpecifier", {
  visitor: ["local"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: (0, _index.assertNodeType)("Identifier")
    }
  }
});
(0, _index2.default)("ImportSpecifier", {
  visitor: ["local", "imported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: (0, _index.assertNodeType)("Identifier")
    },
    imported: {
      validate: (0, _index.assertNodeType)("Identifier")
    },
    importKind: {
      validate: (0, _index.assertOneOf)(null, "type", "typeof")
    }
  }
});
(0, _index2.default)("MetaProperty", {
  visitor: ["meta", "property"],
  aliases: ["Expression"],
  fields: {
    meta: {
      validate: (0, _index.assertNodeType)("Identifier")
    },
    property: {
      validate: (0, _index.assertNodeType)("Identifier")
    }
  }
});
var classMethodOrPropertyCommon = exports.classMethodOrPropertyCommon = {
  abstract: {
    validate: (0, _index.assertValueType)("boolean"),
    optional: true
  },
  accessibility: {
    validate: (0, _index.chain)((0, _index.assertValueType)("string"), (0, _index.assertOneOf)("public", "private", "protected")),
    optional: true
  },
  static: {
    validate: (0, _index.assertValueType)("boolean"),
    optional: true
  },
  computed: {
    default: false,
    validate: (0, _index.assertValueType)("boolean")
  },
  optional: {
    validate: (0, _index.assertValueType)("boolean"),
    optional: true
  },
  key: {
    validate: function () {
      var normal = (0, _index.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral");
      var computed = (0, _index.assertNodeType)("Expression");
      return function (node, key, val) {
        var validator = node.computed ? computed : normal;
        validator(node, key, val);
      };
    }()
  }
};

var classMethodOrDeclareMethodCommon = exports.classMethodOrDeclareMethodCommon = _extends({}, _core.functionCommon, classMethodOrPropertyCommon, {
  kind: {
    validate: (0, _index.chain)((0, _index.assertValueType)("string"), (0, _index.assertOneOf)("get", "set", "method", "constructor")),
    default: "method"
  },
  access: {
    validate: (0, _index.chain)((0, _index.assertValueType)("string"), (0, _index.assertOneOf)("public", "private", "protected")),
    optional: true
  },
  decorators: {
    validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("Decorator"))),
    optional: true
  }
});

(0, _index2.default)("ClassMethod", {
  aliases: ["Function", "Scopable", "BlockParent", "FunctionParent", "Method"],
  builder: ["kind", "key", "params", "body", "computed", "static"],
  visitor: ["key", "params", "body", "decorators", "returnType", "typeParameters"],
  fields: _extends({}, classMethodOrDeclareMethodCommon, {
    body: {
      validate: (0, _index.assertNodeType)("BlockStatement")
    }
  })
});
(0, _index2.default)("ObjectPattern", {
  visitor: ["properties", "typeAnnotation"],
  builder: ["properties"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: _extends({}, _core.patternLikeCommon, {
    properties: {
      validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("RestElement", "ObjectProperty")))
    }
  })
});
(0, _index2.default)("SpreadElement", {
  visitor: ["argument"],
  aliases: ["UnaryLike"],
  fields: {
    argument: {
      validate: (0, _index.assertNodeType)("Expression")
    }
  }
});
(0, _index2.default)("Super", {
  aliases: ["Expression"]
});
(0, _index2.default)("TaggedTemplateExpression", {
  visitor: ["tag", "quasi"],
  aliases: ["Expression"],
  fields: {
    tag: {
      validate: (0, _index.assertNodeType)("Expression")
    },
    quasi: {
      validate: (0, _index.assertNodeType)("TemplateLiteral")
    }
  }
});
(0, _index2.default)("TemplateElement", {
  builder: ["value", "tail"],
  fields: {
    value: {},
    tail: {
      validate: (0, _index.assertValueType)("boolean"),
      default: false
    }
  }
});
(0, _index2.default)("TemplateLiteral", {
  visitor: ["quasis", "expressions"],
  aliases: ["Expression", "Literal"],
  fields: {
    quasis: {
      validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("TemplateElement")))
    },
    expressions: {
      validate: (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)((0, _index.assertNodeType)("Expression")))
    }
  }
});
(0, _index2.default)("YieldExpression", {
  builder: ["argument", "delegate"],
  visitor: ["argument"],
  aliases: ["Expression", "Terminatorless"],
  fields: {
    delegate: {
      validate: (0, _index.assertValueType)("boolean"),
      default: false
    },
    argument: {
      optional: true,
      validate: (0, _index.assertNodeType)("Expression")
    }
  }
});