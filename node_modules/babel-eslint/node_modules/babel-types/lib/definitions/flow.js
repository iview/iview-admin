"use strict";

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index2.default)("AnyTypeAnnotation", {
  aliases: ["Flow", "FlowBaseAnnotation"],
  fields: {}
});
(0, _index2.default)("ArrayTypeAnnotation", {
  visitor: ["elementType"],
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("BooleanTypeAnnotation", {
  aliases: ["Flow", "FlowBaseAnnotation"],
  fields: {}
});
(0, _index2.default)("BooleanLiteralTypeAnnotation", {
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("NullLiteralTypeAnnotation", {
  aliases: ["Flow", "FlowBaseAnnotation"],
  fields: {}
});
(0, _index2.default)("ClassImplements", {
  visitor: ["id", "typeParameters"],
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("DeclareClass", {
  visitor: ["id", "typeParameters", "extends", "body"],
  aliases: ["Flow", "FlowDeclaration", "Statement", "Declaration"],
  fields: {}
});
(0, _index2.default)("DeclareFunction", {
  visitor: ["id"],
  aliases: ["Flow", "FlowDeclaration", "Statement", "Declaration"],
  fields: {}
});
(0, _index2.default)("DeclareInterface", {
  visitor: ["id", "typeParameters", "extends", "body"],
  aliases: ["Flow", "FlowDeclaration", "Statement", "Declaration"],
  fields: {}
});
(0, _index2.default)("DeclareModule", {
  visitor: ["id", "body"],
  aliases: ["Flow", "FlowDeclaration", "Statement", "Declaration"],
  fields: {}
});
(0, _index2.default)("DeclareModuleExports", {
  visitor: ["typeAnnotation"],
  aliases: ["Flow", "FlowDeclaration", "Statement", "Declaration"],
  fields: {}
});
(0, _index2.default)("DeclareTypeAlias", {
  visitor: ["id", "typeParameters", "right"],
  aliases: ["Flow", "FlowDeclaration", "Statement", "Declaration"],
  fields: {}
});
(0, _index2.default)("DeclareOpaqueType", {
  visitor: ["id", "typeParameters", "supertype"],
  aliases: ["Flow", "FlowDeclaration", "Statement", "Declaration"],
  fields: {}
});
(0, _index2.default)("DeclareVariable", {
  visitor: ["id"],
  aliases: ["Flow", "FlowDeclaration", "Statement", "Declaration"],
  fields: {}
});
(0, _index2.default)("DeclareExportDeclaration", {
  visitor: ["declaration", "specifiers", "source"],
  aliases: ["Flow", "FlowDeclaration", "Statement", "Declaration"],
  fields: {}
});
(0, _index2.default)("DeclareExportAllDeclaration", {
  visitor: ["source"],
  aliases: ["Flow", "FlowDeclaration", "Statement", "Declaration"],
  fields: {}
});
(0, _index2.default)("DeclaredPredicate", {
  visitor: ["value"],
  aliases: ["Flow", "FlowPredicate"],
  fields: {}
});
(0, _index2.default)("ExistsTypeAnnotation", {
  aliases: ["Flow"]
});
(0, _index2.default)("FunctionTypeAnnotation", {
  visitor: ["typeParameters", "params", "rest", "returnType"],
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("FunctionTypeParam", {
  visitor: ["name", "typeAnnotation"],
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("GenericTypeAnnotation", {
  visitor: ["id", "typeParameters"],
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("InferredPredicate", {
  aliases: ["Flow", "FlowPredicate"],
  fields: {}
});
(0, _index2.default)("InterfaceExtends", {
  visitor: ["id", "typeParameters"],
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("InterfaceDeclaration", {
  visitor: ["id", "typeParameters", "extends", "body"],
  aliases: ["Flow", "FlowDeclaration", "Statement", "Declaration"],
  fields: {}
});
(0, _index2.default)("IntersectionTypeAnnotation", {
  visitor: ["types"],
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("MixedTypeAnnotation", {
  aliases: ["Flow", "FlowBaseAnnotation"]
});
(0, _index2.default)("EmptyTypeAnnotation", {
  aliases: ["Flow", "FlowBaseAnnotation"]
});
(0, _index2.default)("NullableTypeAnnotation", {
  visitor: ["typeAnnotation"],
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("NumberLiteralTypeAnnotation", {
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("NumberTypeAnnotation", {
  aliases: ["Flow", "FlowBaseAnnotation"],
  fields: {}
});
(0, _index2.default)("StringLiteralTypeAnnotation", {
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("StringTypeAnnotation", {
  aliases: ["Flow", "FlowBaseAnnotation"],
  fields: {}
});
(0, _index2.default)("ThisTypeAnnotation", {
  aliases: ["Flow", "FlowBaseAnnotation"],
  fields: {}
});
(0, _index2.default)("TupleTypeAnnotation", {
  visitor: ["types"],
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("TypeofTypeAnnotation", {
  visitor: ["argument"],
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("TypeAlias", {
  visitor: ["id", "typeParameters", "right"],
  aliases: ["Flow", "FlowDeclaration", "Statement", "Declaration"],
  fields: {}
});
(0, _index2.default)("OpaqueType", {
  visitor: ["id", "typeParameters", "supertype", "impltype"],
  aliases: ["Flow", "FlowDeclaration", "Statement", "Declaration"],
  fields: {}
});
(0, _index2.default)("TypeCastExpression", {
  visitor: ["expression", "typeAnnotation"],
  aliases: ["Flow", "ExpressionWrapper", "Expression"],
  fields: {}
});
(0, _index2.default)("ObjectTypeAnnotation", {
  visitor: ["properties", "indexers", "callProperties"],
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("ObjectTypeCallProperty", {
  visitor: ["value"],
  aliases: ["Flow", "UserWhitespacable"],
  fields: {}
});
(0, _index2.default)("ObjectTypeIndexer", {
  visitor: ["id", "key", "value"],
  aliases: ["Flow", "UserWhitespacable"],
  fields: {}
});
(0, _index2.default)("ObjectTypeProperty", {
  visitor: ["key", "value"],
  aliases: ["Flow", "UserWhitespacable"],
  fields: {}
});
(0, _index2.default)("ObjectTypeSpreadProperty", {
  visitor: ["argument"],
  aliases: ["Flow", "UserWhitespacable"],
  fields: {}
});
(0, _index2.default)("QualifiedTypeIdentifier", {
  visitor: ["id", "qualification"],
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("UnionTypeAnnotation", {
  visitor: ["types"],
  aliases: ["Flow"],
  fields: {}
});
(0, _index2.default)("VoidTypeAnnotation", {
  aliases: ["Flow", "FlowBaseAnnotation"],
  fields: {}
});