asynctest(
  'browser.core.SelectionMatcherTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.themes.inlite.core.PredicateId',
    'tinymce.themes.inlite.core.SelectionMatcher',
    'tinymce.themes.inlite.Theme'
  ],
  function (Assertions, GeneralSteps, Pipeline, Step, TinyApis, TinyLoader, PredicateId, SelectionMatcher, InliteTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    InliteTheme();

    var assertResult = function (expectedResultState, result) {
      Assertions.assertEq('Should not be null', result !== null, expectedResultState);

      if (expectedResultState === true) {
        Assertions.assertEq('Should be matching a', result.id, 'a');
        Assertions.assertEq('Should be have width', result.rect.w > 0, true);
      }
    };

    var sTextSelectionTest = function (tinyApis, editor, inputHtml, spath, soffset, fpath, foffset, expectedResultState) {
      var sAssertTextSelectionResult = Step.sync(function () {
        var result = SelectionMatcher.textSelection('a')(editor);
        assertResult(expectedResultState, result);
      });

      return GeneralSteps.sequence([
        tinyApis.sSetContent(inputHtml),
        tinyApis.sSetSelection(spath, soffset, fpath, foffset),
        sAssertTextSelectionResult
      ]);
    };

    var sTextSelectionTests = function (tinyApis, editor) {
      return GeneralSteps.sequence([
        sTextSelectionTest(tinyApis, editor, '<p>a<.p>', [0], 0, [0], 1, true),
        sTextSelectionTest(tinyApis, editor, '<p>a</p>', [0], 0, [0], 0, false)
      ]);
    };

    var sEmptyTextBlockTest = function (tinyApis, editor, inputHtml, spath, soffset, fpath, foffset, expectedResultState) {
      var sAssertTextSelectionResult = Step.sync(function () {
        var elements = editor.dom.getParents(editor.selection.getStart());
        var result = SelectionMatcher.emptyTextBlock(elements, 'a')(editor);
        assertResult(expectedResultState, result);
      });

      return GeneralSteps.sequence([
        tinyApis.sSetContent(inputHtml),
        tinyApis.sSetSelection(spath, soffset, fpath, foffset),
        sAssertTextSelectionResult
      ]);
    };

    var sEmptyTextBlockTests = function (tinyApis, editor) {
      return GeneralSteps.sequence([
        sEmptyTextBlockTest(tinyApis, editor, '<p>a</p>', [0], 0, [0], 0, false),
        sEmptyTextBlockTest(tinyApis, editor, '<p>a</p>', [0], 0, [0], 1, false),
        sEmptyTextBlockTest(tinyApis, editor, '<p><br></p>', [0], 0, [0], 0, true),
        sEmptyTextBlockTest(tinyApis, editor, '<p><em><br></em></p>', [0, 0], 0, [0, 0], 0, true)
      ]);
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        tinyApis.sFocus,
        sTextSelectionTests(tinyApis, editor),
        sEmptyTextBlockTests(tinyApis, editor)
      ], onSuccess, onFailure);
    }, {
      inline: true,
      theme: 'inlite',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
