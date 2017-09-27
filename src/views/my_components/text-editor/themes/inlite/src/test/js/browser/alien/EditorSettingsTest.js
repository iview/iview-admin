asynctest(
  'browser.alien.EditorSettingsTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'tinymce.core.Editor',
    'tinymce.core.EditorManager',
    'tinymce.themes.inlite.alien.EditorSettings'
  ],
  function (Assertions, Pipeline, Step, Editor, EditorManager, EditorSettings) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    var handler = function () {
    };

    var defaultHandler = function () {
    };

    var createEditor = function () {
      var editor = new Editor('id', {
        string: 'value',
        bool: true,
        number: 3,
        handler: handler,
        toolbar_string1: 'a b',
        toolbar_string2: 'a,b',
        toolbar_string_empty1: '',
        toolbar_string_empty2: ',,,',
        toolbar_empty_array: [],
        toolbar_bool_false: false,
        toolbar_array: ['a', 'b']
      }, EditorManager);

      return editor;
    };

    /*eslint max-len:0*/

    var sTestGetStringOr = Step.sync(function () {
      var editor = createEditor();
      Assertions.assertEq('Should be a specified settings string value', 'value', EditorSettings.getStringOr(editor, 'string', 'default'));
      Assertions.assertEq('Should be default string value', 'default', EditorSettings.getStringOr(editor, 'non_existing', 'default'));
      Assertions.assertEq('Should be default string value on a bool', 'default', EditorSettings.getStringOr(editor, 'bool', 'default'));
    });

    var sTestGetBoolOr = Step.sync(function () {
      var editor = createEditor();
      Assertions.assertEq('Should be a specified settings bool value', true, EditorSettings.getBoolOr(editor, 'bool', false));
      Assertions.assertEq('Should be default bool value', false, EditorSettings.getBoolOr(editor, 'non_existing', false));
      Assertions.assertEq('Should be default bool value on a string', false, EditorSettings.getBoolOr(editor, 'string', false));
    });

    var sTestGetNumberOr = Step.sync(function () {
      var editor = createEditor();
      Assertions.assertEq('Should be a specified settings number value', 3, EditorSettings.getNumberOr(editor, 'number', 3));
      Assertions.assertEq('Should be default number value', 5, EditorSettings.getNumberOr(editor, 'non_existing', 5));
      Assertions.assertEq('Should be default number value on a string', 5, EditorSettings.getNumberOr(editor, 'string', 5));
    });

    var sTestGetHandlerOr = Step.sync(function () {
      var editor = createEditor();
      Assertions.assertEq('Should be a specified settings handler value', handler, EditorSettings.getHandlerOr(editor, 'handler', defaultHandler));
      Assertions.assertEq('Should be default handler value', defaultHandler, EditorSettings.getHandlerOr(editor, 'non_existing', defaultHandler));
      Assertions.assertEq('Should be default handler value on a string', defaultHandler, EditorSettings.getHandlerOr(editor, 'string', defaultHandler));
    });

    var sTestToolbarItemsOr = Step.sync(function () {
      var editor = createEditor();
      Assertions.assertEq('Should be a specified toolbar items string value 1', ['a', 'b'], EditorSettings.getToolbarItemsOr(editor, 'toolbar_string1', ['c', 'd']));
      Assertions.assertEq('Should be a specified toolbar items string value 2', ['a', 'b'], EditorSettings.getToolbarItemsOr(editor, 'toolbar_string2', ['c', 'd']));
      Assertions.assertEq('Should be a specified toolbar items array value', ['a', 'b'], EditorSettings.getToolbarItemsOr(editor, 'toolbar_array', ['c', 'd']));
      Assertions.assertEq('Should be an empty toolbar items array', [], EditorSettings.getToolbarItemsOr(editor, 'toolbar_string_empty1', ['c', 'd']));
      Assertions.assertEq('Should be an empty toolbar items array', [], EditorSettings.getToolbarItemsOr(editor, 'toolbar_string_empty2', ['c', 'd']));
      Assertions.assertEq('Should be an empty toolbar items array', [], EditorSettings.getToolbarItemsOr(editor, 'toolbar_bool_false', ['c', 'd']));
      Assertions.assertEq('Should be an empty toolbar items array', [], EditorSettings.getToolbarItemsOr(editor, 'toolbar_empty_array', ['c', 'd']));
      Assertions.assertEq('Should be default toolbar items value', ['c', 'd'], EditorSettings.getToolbarItemsOr(editor, 'non_existing', ['c', 'd']));
      Assertions.assertEq('Should be default toolbar items value on a bool', ['c', 'd'], EditorSettings.getToolbarItemsOr(editor, 'bool', ['c', 'd']));
    });

    Pipeline.async({}, [
      sTestGetStringOr,
      sTestGetBoolOr,
      sTestGetNumberOr,
      sTestGetHandlerOr,
      sTestToolbarItemsOr
    ], function () {
      success();
    }, failure);
  }
);
