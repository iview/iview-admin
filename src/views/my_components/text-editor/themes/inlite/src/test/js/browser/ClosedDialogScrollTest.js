asynctest(
  'browser.ClosedDialogScrollTest',
  [
    'ephox.agar.api.Chain',
    'ephox.agar.api.Keys',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.RawAssertions',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.link.Plugin',
    'tinymce.themes.inlite.test.Toolbar',
    'tinymce.themes.inlite.Theme'
  ],
  function (Chain, Keys, Pipeline, RawAssertions, Step, TinyActions, TinyApis, TinyLoader, LinkPlugin, Toolbar, InliteTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    InliteTheme();
    LinkPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyActions = TinyActions(editor);
      Pipeline.async({}, [
        tinyApis.sFocus,
        tinyApis.sSetContent('<p style="height: 5000px">a</p><p>b</p>'),
        tinyApis.sSetSelection([1], 0, [1], 1),
        Chain.asStep({}, [
          Toolbar.cWaitForToolbar,
          Toolbar.cClickButton('Insert/Edit link')
        ]),
        tinyActions.sUiKeydown(Keys.enter(), {}),
        Step.sync(function () {
          var offset = window.pageYOffset;

          RawAssertions.assertEq('Should not be at top', offset > 0, true);
        })
      ], onSuccess, onFailure);
    }, {
      theme: 'inlite',
      plugins: 'link',
      insert_toolbar: 'quickimage media quicktable',
      selection_toolbar: 'bold italic | quicklink h1 h2 blockquote',
      inline: true,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);