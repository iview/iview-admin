asynctest(
  'browser.AutoCompleteTest',
  [
    'ephox.agar.api.Chain',
    'ephox.agar.api.FocusTools',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Keyboard',
    'ephox.agar.api.Keys',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.UiControls',
    'ephox.agar.api.UiFinder',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyDom',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.themes.inlite.test.Toolbar',
    'tinymce.themes.inlite.Theme',
    'tinymce.plugins.image.Plugin',
    'tinymce.plugins.table.Plugin',
    'tinymce.plugins.link.Plugin',
    'tinymce.plugins.paste.Plugin',
    'tinymce.plugins.contextmenu.Plugin',
    'tinymce.plugins.textpattern.Plugin'
  ],
  function (
    Chain, FocusTools, GeneralSteps, Keyboard, Keys, Pipeline, UiControls, UiFinder, TinyActions,
    TinyApis, TinyDom, TinyLoader, Toolbar, Theme, ImagePlugin, LinkPlugin, PastePlugin,
    ContextMenuPlugin, TextpatternPlugin
  ) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ImagePlugin();
    LinkPlugin();
    PastePlugin();
    ContextMenuPlugin();
    TextpatternPlugin();
    Theme();

    var cKeyStroke = function (keyvalue, modifiers) {
      return Chain.op(function (dispatcher) {
        Keyboard.keystroke(keyvalue, modifiers, dispatcher);
      });
    };

    var sSetupLinkableContent = function (tinyApis) {
      return GeneralSteps.sequence([
        tinyApis.sSetContent(
          '<h1 id="a">abc</h1>' +
          '<h2 id="b">abcd</h2>' +
          '<h3 id="c">abce</h3>'
        ),
        tinyApis.sSetSelection([0, 0], 0, [0, 0], 1)
      ]);
    };

    var sSelectAutoCompleteLink = function (tinyApis, url) {
      return Chain.asStep({}, [
        Chain.fromParent(Toolbar.cWaitForToolbar, [
          Toolbar.cClickButton('Insert/Edit link')
        ]),
        Chain.fromParent(UiFinder.cFindIn('input'), [
          UiControls.cSetValue(url),
          cKeyStroke(Keys.space(), {}),
          cKeyStroke(Keys.down(), {})
        ]),
        Chain.inject(TinyDom.fromDom(document)),
        Chain.fromParent(FocusTools.cGetFocused, [
          cKeyStroke(Keys.down(), {}),
          cKeyStroke(Keys.enter(), {})
        ]),
        Chain.fromParent(Toolbar.cWaitForToolbar, [
          Toolbar.cClickButton('Ok')
        ])
      ]);
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        tinyApis.sFocus,
        sSetupLinkableContent(tinyApis),
        sSelectAutoCompleteLink(tinyApis, 'a'),
        tinyApis.sAssertContent(
          '<h1 id="a"><a href="#b">a</a>bc</h1>\n' +
          '<h2 id="b">abcd</h2>\n' +
          '<h3 id="c">abce</h3>'
        )
      ], onSuccess, onFailure);
    }, {
      theme: 'inlite',
      plugins: 'image table link paste contextmenu textpattern',
      insert_toolbar: 'quickimage media quicktable',
      selection_toolbar: 'bold italic | quicklink h1 h2 blockquote',
      inline: true,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
