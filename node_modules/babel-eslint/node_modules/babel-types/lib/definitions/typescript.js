"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _core = require("./core");

var _es = require("./es2015");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bool = (0, _index.assertValueType)("boolean");

function validate(validate) {
  return {
    validate: validate
  };
}

function typeIs(typeName) {
  return typeof typeName === "string" ? (0, _index.assertNodeType)(typeName) : _index.assertNodeType.apply(undefined, typeName);
}

function validateType(name) {
  return validate(typeIs(name));
}

function validateOptional(validate) {
  return {
    validate: validate,
    optional: true
  };
}

function validateOptionalType(typeName) {
  return {
    validate: typeIs(typeName),
    optional: true
  };
}

function arrayOf(elementType) {
  return (0, _index.chain)((0, _index.assertValueType)("array"), (0, _index.assertEach)(elementType));
}

function arrayOfType(nodeTypeName) {
  return arrayOf(typeIs(nodeTypeName));
}

function validateArrayOfType(nodeTypeName) {
  return validate(arrayOfType(nodeTypeName));
}

(0, _index2.default)("TSParameterProperty", {
  aliases: ["LVal"],
  visitor: ["parameter"],
  fields: {
    accessibility: {
      validate: (0, _index.assertOneOf)("public", "private", "protected"),
      optional: true
    },
    readonly: {
      validate: (0, _index.assertValueType)("boolean"),
      optional: true
    },
    parameter: {
      validate: (0, _index.assertNodeType)("Identifier", "AssignmentPattern")
    }
  }
});
(0, _index2.default)("TSDeclareFunction", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "params", "returnType"],
  fields: _core.functionDeclarationCommon
});
(0, _index2.default)("TSDeclareMethod", {
  visitor: ["decorators", "key", "typeParameters", "params", "returnType"],
  fields: _es.classMethodOrDeclareMethodCommon
});
(0, _index2.default)("TSQualifiedName", {
  aliases: ["TSEntityName"],
  visitor: ["left", "right"],
  fields: {
    left: validateType("TSEntityName"),
    right: validateType("Identifier")
  }
});
var signatureDeclarationCommon = {
  typeParameters: validateOptionalType("TypeParameterDeclaration"),
  parameters: validateArrayOfType(["Identifier", "RestElement"]),
  typeAnnotation: validateOptionalType("TypeAnnotation")
};
var callConstructSignatureDeclaration = {
  aliases: ["TSTypeElement"],
  visitor: ["typeParameters", "parameters", "typeAnnotation"],
  fields: signatureDeclarationCommon
};
(0, _index2.default)("TSCallSignatureDeclaration", callConstructSignatureDeclaration);
(0, _index2.default)("TSConstructSignatureDeclaration", callConstructSignatureDeclaration);
var namedTypeElementCommon = {
  key: validateType("Expression"),
  computed: validate(bool),
  optional: validateOptional(bool)
};
(0, _index2.default)("TSPropertySignature", {
  aliases: ["TSTypeElement"],
  visitor: ["key", "typeAnnotation", "initializer"],
  fields: _extends({}, namedTypeElementCommon, {
    readonly: validateOptional(bool),
    typeAnnotation: validateOptionalType("TypeAnnotation"),
    initializer: validateOptionalType("Expression")
  })
});
(0, _index2.default)("TSMethodSignature", {
  aliases: ["TSTypeElement"],
  visitor: ["key", "typeParameters", "parameters", "typeAnnotation"],
  fields: _extends({}, signatureDeclarationCommon, namedTypeElementCommon)
});
(0, _index2.default)("TSIndexSignature", {
  aliases: ["TSTypeElement"],
  visitor: ["parameters", "typeAnnotation"],
  fields: {
    readonly: validateOptional(bool),
    parameters: validateArrayOfType("Identifier"),
    typeAnnotation: validateOptionalType("TypeAnnotation")
  }
});
var tsKeywordTypes = ["TSAnyKeyword", "TSNumberKeyword", "TSObjectKeyword", "TSBooleanKeyword", "TSStringKeyword", "TSSymbolKeyword", "TSVoidKeyword", "TSUndefinedKeyword", "TSNullKeyword", "TSNeverKeyword"];

for (var _i = 0; _i < tsKeywordTypes.length; _i++) {
  var type = tsKeywordTypes[_i];
  (0, _index2.default)(type, {
    aliases: ["TSType"],
    visitor: [],
    fields: {}
  });
}

(0, _index2.default)("TSThisType", {
  aliases: ["TSType"],
  visitor: [],
  fields: {}
});
var fnOrCtr = {
  aliases: ["TSType"],
  visitor: ["typeParameters", "typeAnnotation"],
  fields: signatureDeclarationCommon
};
(0, _index2.default)("TSFunctionType", fnOrCtr);
(0, _index2.default)("TSConstructorType", fnOrCtr);
(0, _index2.default)("TSTypeReference", {
  aliases: ["TSType"],
  visitor: ["typeName", "typeParameters"],
  fields: {
    typeName: validateType("TSEntityName"),
    typeParameters: validateOptionalType("TypeParameterInstantiation")
  }
});
(0, _index2.default)("TSTypePredicate", {
  aliases: ["TSType"],
  visitor: ["parameterName", "typeAnnotation"],
  fields: {
    parameterName: validateType(["Identifier", "TSThisType"]),
    typeAnnotation: validateType("TypeAnnotation")
  }
});
(0, _index2.default)("TSTypeQuery", {
  aliases: ["TSType"],
  visitor: ["exprName"],
  fields: {
    exprName: validateType("TSEntityName")
  }
});
(0, _index2.default)("TSTypeLiteral", {
  aliases: ["TSType"],
  visitor: ["members"],
  fields: {
    members: validateArrayOfType("TSTypeElement")
  }
});
(0, _index2.default)("TSArrayType", {
  aliases: ["TSType"],
  visitor: ["elementType"],
  fields: {
    elementType: validateType("TSType")
  }
});
(0, _index2.default)("TSTupleType", {
  aliases: ["TSType"],
  visitor: ["elementTypes"],
  fields: {
    elementTypes: validateArrayOfType("TSType")
  }
});
var unionOrIntersection = {
  aliases: ["TSType"],
  visitor: ["types"],
  fields: {
    types: validateArrayOfType("TSType")
  }
};
(0, _index2.default)("TSUnionType", unionOrIntersection);
(0, _index2.default)("TSIntersectionType", unionOrIntersection);
(0, _index2.default)("TSParenthesizedType", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: validateType("TSType")
  }
});
(0, _index2.default)("TSTypeOperator", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: {
    operator: validate((0, _index.assertValueType)("string")),
    typeAnnotation: validateType("TSType")
  }
});
(0, _index2.default)("TSIndexedAccessType", {
  aliases: ["TSType"],
  visitor: ["objectType", "indexType"],
  fields: {
    objectType: validateType("TSType"),
    indexType: validateType("TSType")
  }
});
(0, _index2.default)("TSMappedType", {
  aliases: ["TSType"],
  visitor: ["typeParameter", "typeAnnotation"],
  fields: {
    readonly: validateOptional(bool),
    typeParameter: validateType("TypeParameter"),
    optional: validateOptional(bool),
    typeAnnotation: validateOptionalType("TSType")
  }
});
(0, _index2.default)("TSLiteralType", {
  aliases: ["TSType"],
  visitor: ["literal"],
  fields: {
    literal: validateType(["NumericLiteral", "StringLiteral", "BooleanLiteral"])
  }
});
(0, _index2.default)("TSExpressionWithTypeArguments", {
  aliases: ["TSType"],
  visitor: ["expression", "typeParameters"],
  fields: {
    expression: validateType("TSEntityName"),
    typeParameters: validateOptionalType("TypeParameterInstantiation")
  }
});
(0, _index2.default)("TSInterfaceDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "extends", "body"],
  fields: {
    declare: validateOptional(bool),
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TypeParameterDeclaration"),
    extends: validateOptional(arrayOfType("TSExpressionWithTypeArguments")),
    body: validateType("TSInterfaceBody")
  }
});
(0, _index2.default)("TSInterfaceBody", {
  visitor: ["body"],
  fields: {
    body: validateArrayOfType("TSTypeElement")
  }
});
(0, _index2.default)("TSTypeAliasDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "typeAnnotation"],
  fields: {
    declare: validateOptional(bool),
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TypeParameterDeclaration"),
    typeAnnotation: validateType("TSType")
  }
});
(0, _index2.default)("TSAsExpression", {
  aliases: ["Expression"],
  visitor: ["expression", "typeAnnotation"],
  fields: {
    expression: validateType("Expression"),
    typeAnnotation: validateType("TSType")
  }
});
(0, _index2.default)("TSTypeAssertion", {
  aliases: ["Expression"],
  visitor: ["typeAnnotation", "expression"],
  fields: {
    typeAnnotation: validateType("TSType"),
    expression: validateType("Expression")
  }
});
(0, _index2.default)("TSEnumDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "members"],
  fields: {
    declare: validateOptional(bool),
    const: validateOptional(bool),
    id: validateType("Identifier"),
    members: validateArrayOfType("TSEnumMember"),
    initializer: validateOptionalType("Expression")
  }
});
(0, _index2.default)("TSEnumMember", {
  visitor: ["id", "initializer"],
  fields: {
    id: validateType(["Identifier", "StringLiteral"]),
    initializer: validateOptionalType("Expression")
  }
});
(0, _index2.default)("TSModuleDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "body"],
  fields: {
    declare: validateOptional(bool),
    global: validateOptional(bool),
    id: validateType(["Identifier", "StringLiteral"]),
    body: validateType(["TSModuleBlock", "TSModuleDeclaration"])
  }
});
(0, _index2.default)("TSModuleBlock", {
  visitor: ["body"],
  fields: {
    body: validateArrayOfType("Statement")
  }
});
(0, _index2.default)("TSImportEqualsDeclaration", {
  aliases: ["Statement"],
  visitor: ["id", "moduleReference"],
  fields: {
    isExport: validate(bool),
    id: validateType("Identifier"),
    moduleReference: validateType(["TSEntityName", "TSExternalModuleReference"])
  }
});
(0, _index2.default)("TSExternalModuleReference", {
  visitor: ["expression"],
  fields: {
    expression: validateType("StringLiteral")
  }
});
(0, _index2.default)("TSNonNullExpression", {
  aliases: ["Expression"],
  visitor: ["expression"],
  fields: {
    expression: validateType("Expression")
  }
});
(0, _index2.default)("TSExportAssignment", {
  aliases: ["Statement"],
  visitor: ["expression"],
  fields: {
    expression: validateType("Expression")
  }
});
(0, _index2.default)("TSNamespaceExportDeclaration", {
  aliases: ["Statement"],
  visitor: ["id"],
  fields: {
    id: validateType("Identifier")
  }
});