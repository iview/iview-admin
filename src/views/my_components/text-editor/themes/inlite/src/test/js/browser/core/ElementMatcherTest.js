asynctest(
  'browser.core.ElementMatcherTest',
  [
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyApis',
    'ephox.agar.api.Step',
    'ephox.agar.api.Assertions',
    'tinymce.themes.inlite.Theme',
    'tinymce.themes.inlite.core.ElementMatcher',
    'tinymce.themes.inlite.core.PredicateId',
    'ephox.agar.api.Pipeline'
  ],
  function (TinyLoader, TinyApis, Step, Assertions, Theme, ElementMatcher, PredicateId, Pipeline) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    Theme();

    var eq = function (target) {
      return function (elm) {
        return elm === target;
      };
    };

    var constantFalse = function (/*elm*/) {
      return false;
    };

    var sElementTest = function (tinyApis, editor, inputHtml, selector) {
      return Step.sync(function () {
        var target, result;

        editor.setContent(inputHtml);
        target = editor.dom.select(selector)[0];

        result = ElementMatcher.element(target, [
          PredicateId.create('a', constantFalse),
          PredicateId.create('b', eq(target))
        ])(editor);

        Assertions.assertEq('Should be matching B', 'b', result.id);
        Assertions.assertEq('Should be have width', true, result.rect.w > 0, true);
      });
    };

    var sParentTest = function (tinyApis, editor, inputHtml, selector) {
      return Step.sync(function () {
        var target, parents, result;

        editor.setContent(inputHtml);
        target = editor.dom.select(selector)[0];
        parents = editor.dom.getParents(target);

        result = ElementMatcher.parent(parents, [
          PredicateId.create('a', constantFalse),
          PredicateId.create('b', eq(parents[1])),
          PredicateId.create('c', eq(parents[0]))
        ])(editor);

        Assertions.assertEq('Should be matching C the closest one', 'c', result.id);
        Assertions.assertEq('Should be have width', true, result.rect.w > 0);
      });
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        sElementTest(tinyApis, editor, '<p>a</p>', 'p'),
        sParentTest(tinyApis, editor, '<div><p><em>a</em></p></div>', 'em')
      ], onSuccess, onFailure);
    }, {
      inline: true,
      theme: 'inlite',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
