asynctest(
  'browser.core.ThemeTest',
  [
    'ephox.agar.api.Chain',
    'ephox.agar.api.FocusTools',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Mouse',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.UiControls',
    'ephox.agar.api.UiFinder',
    'ephox.agar.api.Waiter',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyDom',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.contextmenu.Plugin',
    'tinymce.plugins.image.Plugin',
    'tinymce.plugins.link.Plugin',
    'tinymce.plugins.paste.Plugin',
    'tinymce.plugins.table.Plugin',
    'tinymce.plugins.textpattern.Plugin',
    'tinymce.themes.inlite.test.Toolbar',
    'tinymce.themes.inlite.Theme'
  ], function (
    Chain, FocusTools, GeneralSteps, Mouse, Pipeline, UiControls, UiFinder, Waiter, TinyActions, TinyApis, TinyDom, TinyLoader, ContextMenuPlugin, ImagePlugin,
    LinkPlugin, PastePlugin, TablePlugin, TextPatternPlugin, Toolbar, InliteTheme
  ) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var dialogRoot = TinyDom.fromDom(document.body);

    InliteTheme();
    ImagePlugin();
    TablePlugin();
    LinkPlugin();
    PastePlugin();
    ContextMenuPlugin();
    TextPatternPlugin();

    var sClickFocusedButton = function (selector) {
      return GeneralSteps.sequence([
        Waiter.sTryUntil(
          'Focus was not moved to the expected element',
          FocusTools.sIsOnSelector('Is not on the right element', TinyDom.fromDom(document), selector),
          10,
          1000
        ),
        Chain.asStep(TinyDom.fromDom(document), [
          FocusTools.cGetFocused,
          Mouse.cTrueClick
        ])
      ]);
    };

    var sBoldTests = function (tinyApis) {
      return GeneralSteps.sequence([
        tinyApis.sSetContent('<p>a</p>'),
        tinyApis.sSetSelection([0, 0], 0, [0, 0], 1),
        Toolbar.sClickButton('Bold'),
        tinyApis.sAssertContent('<p><strong>a</strong></p>')
      ]);
    };

    var sH2Tests = function (tinyApis) {
      return GeneralSteps.sequence([
        tinyApis.sSetContent('<p>a</p>'),
        tinyApis.sSetSelection([0, 0], 0, [0, 0], 1),
        Toolbar.sClickButton('Heading 2'),
        tinyApis.sAssertContent('<h2>a</h2>')
      ]);
    };

    var sInsertLink = function (url) {
      return Chain.asStep({}, [
        Toolbar.cWaitForToolbar,
        Toolbar.cClickButton('Insert/Edit link'),
        Toolbar.cWaitForToolbar,
        UiFinder.cFindIn('input'),
        UiControls.cSetValue(url),
        Toolbar.cWaitForToolbar,
        Toolbar.cClickButton('Ok')
      ]);
    };

    var cWaitForConfirmDialog = Chain.fromChainsWith(dialogRoot, [
      UiFinder.cWaitForState('window element', '.mce-window', function () {
        return true;
      })
    ]);

    var cClickButton = function (btnText) {
      return Chain.fromChains([
        UiFinder.cFindIn('button:contains("' + btnText + '")'),
        Mouse.cTrueClick
      ]);
    };

    var sClickConfirmButton = function (btnText) {
      return Chain.asStep({}, [
        cWaitForConfirmDialog,
        cClickButton(btnText)
      ]);
    };

    var sInsertLinkConfirmPrefix = function (url, btnText) {
      return GeneralSteps.sequence([
        sInsertLink(url),
        sClickConfirmButton(btnText)
      ]);
    };

    var sUnlink = Chain.asStep({}, [
      Toolbar.cWaitForToolbar,
      Toolbar.cClickButton('Insert/Edit link'),
      Toolbar.cWaitForToolbar,
      Toolbar.cClickButton('Remove link')
    ]);

    var sLinkTests = function (tinyApis) {
      var sContentActionTest = function (inputHtml, spath, soffset, fpath, foffset, expectedHtml, sAction) {
        return GeneralSteps.sequence([
          tinyApis.sSetContent(inputHtml),
          tinyApis.sSetSelection(spath, soffset, fpath, foffset),
          sAction,
          tinyApis.sAssertContent(expectedHtml)
        ]);
      };

      var sLinkTest = function (inputHtml, spath, soffset, fpath, foffset, url, expectedHtml) {
        return sContentActionTest(inputHtml, spath, soffset, fpath, foffset, expectedHtml, sInsertLink(url));
      };

      var sUnlinkTest = function (inputHtml, spath, soffset, fpath, foffset, expectedHtml) {
        return sContentActionTest(inputHtml, spath, soffset, fpath, foffset, expectedHtml, sUnlink);
      };

      var sLinkWithConfirmOkTest = function (inputHtml, spath, soffset, fpath, foffset, url, expectedHtml) {
        return sContentActionTest(inputHtml, spath, soffset, fpath, foffset, expectedHtml, sInsertLinkConfirmPrefix(url, 'Ok'));
      };

      var sLinkWithConfirmCancelTest = function (inputHtml, spath, soffset, fpath, foffset, url, expectedHtml) {
        return sContentActionTest(inputHtml, spath, soffset, fpath, foffset, expectedHtml, sInsertLinkConfirmPrefix(url, 'Cancel'));
      };

      return GeneralSteps.sequence([
        sLinkWithConfirmOkTest('<p>a</p>', [0, 0], 0, [0, 0], 1, 'www.site.com', '<p><a href="http://www.site.com">a</a></p>'),
        sLinkWithConfirmCancelTest('<p>a</p>', [0, 0], 0, [0, 0], 1, 'www.site.com', '<p><a href="www.site.com">a</a></p>'),
        sLinkTest('<p>a</p>', [0, 0], 0, [0, 0], 1, '#1', '<p><a href="#1">a</a></p>'),
        sLinkTest('<p><a id="x" href="#1">a</a></p>', [0, 0, 0], 0, [0, 0, 0], 1, '#2', '<p><a id="x" href="#2">a</a></p>'),
        sLinkTest('<p><a href="#3">a</a></p>', [0, 0, 0], 0, [0, 0, 0], 1, '', '<p>a</p>'),
        sUnlinkTest('<p><a id="x" href="#1">a</a></p>', [0, 0, 0], 0, [0, 0, 0], 1, '<p>a</p>')
      ]);
    };

    var sInsertTableTests = function (tinyApis) {
      return GeneralSteps.sequence([
        tinyApis.sSetContent('<p><br></p><p>b</p>'),
        tinyApis.sSetCursor([0], 0),
        Toolbar.sClickButton('Insert table'),
        tinyApis.sAssertContent([
          '<table style="width: 100%;">',
          '<tbody>',
          '<tr>',
          '<td>&nbsp;</td>',
          '<td>&nbsp;</td>',
          '</tr>',
          '<tr>',
          '<td>&nbsp;</td>',
          '<td>&nbsp;</td>',
          '</tr>',
          '</tbody>',
          '</table>',
          '<p>b</p>'
        ].join('\n')
        )
      ]);
    };

    var sAriaTests = function (tinyApis, tinyActions) {
      return GeneralSteps.sequence([
        tinyApis.sSetContent('<p>a</p>'),
        tinyApis.sSetSelection([0, 0], 0, [0, 0], 1),
        Toolbar.sWaitForToolbar(),
        tinyActions.sContentKeydown(121, { alt: true }),
        sClickFocusedButton('*[aria-label="Bold"]'),
        tinyApis.sAssertContent('<p><strong>a</strong></p>')
      ]);
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor), tinyActions = TinyActions(editor);

      Pipeline.async({}, [
        tinyApis.sFocus,
        sBoldTests(tinyApis),
        sH2Tests(tinyApis),
        sLinkTests(tinyApis),
        sInsertTableTests(tinyApis),
        sAriaTests(tinyApis, tinyActions)
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
