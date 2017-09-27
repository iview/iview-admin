test(
  'atomic.themes.alien.TypeTest',
  [
    'tinymce.themes.inlite.alien.Type'
  ],
  function (Type) {
    var testIsString = function () {
      assert.eq(Type.isString('a'), true);
      assert.eq(Type.isString(null), false);
      assert.eq(Type.isString(undefined), false);
      assert.eq(Type.isString(true), false);
      assert.eq(Type.isString(0), false);
      assert.eq(Type.isString([]), false);
      assert.eq(Type.isString({}), false);
      assert.eq(Type.isString(function () { }), false);
    };

    var testIsNumber = function () {
      assert.eq(Type.isNumber('a'), false);
      assert.eq(Type.isNumber(null), false);
      assert.eq(Type.isNumber(undefined), false);
      assert.eq(Type.isNumber(true), false);
      assert.eq(Type.isNumber(0), true);
      assert.eq(Type.isNumber([]), false);
      assert.eq(Type.isNumber({}), false);
      assert.eq(Type.isNumber(function () { }), false);
    };

    var testIsBoolean = function () {
      assert.eq(Type.isBoolean('a'), false);
      assert.eq(Type.isBoolean(null), false);
      assert.eq(Type.isBoolean(undefined), false);
      assert.eq(Type.isBoolean(true), true);
      assert.eq(Type.isBoolean(0), false);
      assert.eq(Type.isBoolean([]), false);
      assert.eq(Type.isBoolean({}), false);
      assert.eq(Type.isBoolean(function () { }), false);
    };

    var testIsObject = function () {
      assert.eq(Type.isObject('a'), false);
      assert.eq(Type.isObject(null), false);
      assert.eq(Type.isObject(undefined), false);
      assert.eq(Type.isObject(true), false);
      assert.eq(Type.isObject(0), false);
      assert.eq(Type.isObject([]), false);
      assert.eq(Type.isObject({}), true);
      assert.eq(Type.isObject(function () { }), false);
    };

    var testIsNull = function () {
      assert.eq(Type.isNull('a'), false);
      assert.eq(Type.isNull(null), true);
      assert.eq(Type.isNull(undefined), false);
      assert.eq(Type.isNull(true), false);
      assert.eq(Type.isNull(0), false);
      assert.eq(Type.isNull([]), false);
      assert.eq(Type.isNull({}), false);
      assert.eq(Type.isNull(function () { }), false);
    };

    var testIsArray = function () {
      assert.eq(Type.isArray('a'), false);
      assert.eq(Type.isArray(null), false);
      assert.eq(Type.isArray(undefined), false);
      assert.eq(Type.isArray(true), false);
      assert.eq(Type.isArray(0), false);
      assert.eq(Type.isArray([]), true);
      assert.eq(Type.isArray({}), false);
      assert.eq(Type.isArray(function () { }), false);
    };

    var testIsFunction = function () {
      assert.eq(Type.isFunction('a'), false);
      assert.eq(Type.isFunction(null), false);
      assert.eq(Type.isFunction(undefined), false);
      assert.eq(Type.isFunction(true), false);
      assert.eq(Type.isFunction(0), false);
      assert.eq(Type.isFunction([]), false);
      assert.eq(Type.isFunction({}), false);
      assert.eq(Type.isFunction(function () { }), true);
    };

    testIsString();
    testIsNumber();
    testIsBoolean();
    testIsObject();
    testIsNull();
    testIsArray();
    testIsFunction();
  }
);
