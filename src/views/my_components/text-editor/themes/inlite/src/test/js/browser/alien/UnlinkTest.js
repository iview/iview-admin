asynctest(
  'browser.alien.UnlinkTest',
  [
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyApis',
    'tinymce.themes.inlite.Theme',
    'tinymce.themes.inlite.alien.Unlink',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.agar.api.GeneralSteps'
  ],
  function (TinyLoader, TinyApis, Theme, Unlink, Pipeline, Step, GeneralSteps) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    Theme();

    var sUnlinkSelection = function (editor) {
      return Step.sync(function () {
        Unlink.unlinkSelection(editor);
      });
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);

      var sAssertUnlink = function (inputHtml, startPath, startOffset, finishPath, finishOffset, expectedHtml) {
        return GeneralSteps.sequence([
          tinyApis.sSetContent(inputHtml),
          tinyApis.sSetSelection(startPath, startOffset, finishPath, finishOffset),
          sUnlinkSelection(editor),
          tinyApis.sAssertContent(expectedHtml, 'Should match expected anchor less html')
        ]);
      };

      Pipeline.async({}, [
        sAssertUnlink('<p><a href="#">a</a></p>', [0, 0, 0], 0, [0, 0, 0], 1, '<p>a</p>'),
        sAssertUnlink('<p><a href="#">a</a>b</p>', [0, 0, 0], 0, [0, 1], 1, '<p>ab</p>'),
        sAssertUnlink('<p><a href="#">a</a><p><a href="#">b</a>', [0, 0, 0], 0, [0, 0, 0], 1, '<p>a</p>\n<p><a href="#">b</a></p>'),
        sAssertUnlink('<p><a href="#">a</a><p><a href="#">b</a>', [0, 0, 0], 0, [1, 0, 0], 1, '<p>a</p>\n<p>b</p>')
      ], onSuccess, onFailure);
    }, {
      inline: true,
      theme: 'inlite',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
