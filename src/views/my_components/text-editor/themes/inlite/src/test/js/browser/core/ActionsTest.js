asynctest(
  'browser/core/ActionsTest',
  [
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.sand.api.Uint8Array',
    'ephox.sand.api.Window',
    'tinymce.themes.inlite.core.Actions',
    'tinymce.themes.inlite.Theme'
  ],
  function (GeneralSteps, Pipeline, Step, TinyApis, TinyLoader, Uint8Array, Window, Actions, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    Theme();

    var wrap = function (f, args) {
      return function () {
        var currentArgs = Array.prototype.slice.call(arguments);
        return Step.sync(function () {
          f.apply(null, [].concat(args).concat(currentArgs));
        });
      };
    };

    var sInsertTableTests = function (editor, tinyApis) {
      var sInsertTableTest = function (cols, rows, expectedHtml, message) {
        var sInsertTable = wrap(Actions.insertTable, editor);

        return GeneralSteps.sequence([
          tinyApis.sSetContent(''),
          sInsertTable(cols, rows),
          tinyApis.sAssertContent(expectedHtml, message)
        ]);
      };

      return GeneralSteps.sequence([
        sInsertTableTest(2, 3, [
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
          '<tr>',
          '<td>&nbsp;</td>',
          '<td>&nbsp;</td>',
          '</tr>',
          '</tbody>',
          '</table>'
        ].join('\n'),
          'Should be a 2x3 table'
        ),

        sInsertTableTest(3, 2, [
          '<table style="width: 100%;">',
          '<tbody>',
          '<tr>',
          '<td>&nbsp;</td>',
          '<td>&nbsp;</td>',
          '<td>&nbsp;</td>',
          '</tr>',
          '<tr>',
          '<td>&nbsp;</td>',
          '<td>&nbsp;</td>',
          '<td>&nbsp;</td>',
          '</tr>',
          '</tbody>',
          '</table>'
        ].join('\n'),
          'Should be a 3x2 table'
        )
      ]);
    };

    var sFormatBlockTests = function (editor, tinyApis) {
      var sFormatBlockTest = function (name) {
        var sFormatBlock = wrap(Actions.formatBlock, editor);

        return GeneralSteps.sequence([
          tinyApis.sSetContent('<p>a</p>'),
          tinyApis.sSetCursor([0], 0),
          sFormatBlock(name),
          tinyApis.sAssertContent('<' + name + '>a</' + name + '>', 'Should be a ' + name + ' block')
        ]);
      };

      return GeneralSteps.sequence([
        sFormatBlockTest('h1'),
        sFormatBlockTest('h2'),
        sFormatBlockTest('pre')
      ]);
    };

    var sCreateLinkTests = function (editor, tinyApis) {
      var sCreateLinkTest = function (inputHtml, url, sPath, sOffset, fPath, fOffset, expectedHtml) {
        var sCreateLink = wrap(Actions.createLink, editor);

        return GeneralSteps.sequence([
          tinyApis.sSetContent(inputHtml),
          tinyApis.sSetSelection(sPath, sOffset, fPath, fOffset),
          sCreateLink(url),
          tinyApis.sAssertContent(expectedHtml, 'Should have a link')
        ]);
      };

      return GeneralSteps.sequence([
        sCreateLinkTest('<p>a</p>', '#1', [0, 0], 0, [0, 0], 1, '<p><a href="#1">a</a></p>'),
        sCreateLinkTest('<p><a href="#1">a</a></p>', '#2', [0, 0], 0, [0, 0], 1, '<p><a href="#2">a</a></p>'),
        sCreateLinkTest('<p><a href="#1"><em>a</em></a></p>', '#2', [0, 0, 0], 0, [0, 0, 0], 1, '<p><a href="#2"><em>a</em></a></p>')
      ]);
    };

    var sUnlinkTests = function (editor, tinyApis) {
      var sUnlinkTest = function (inputHtml, sPath, sOffset, fPath, fOffset, expectedHtml) {
        var sUnlink = wrap(Actions.unlink, editor);

        return GeneralSteps.sequence([
          tinyApis.sSetContent(inputHtml),
          tinyApis.sSetSelection(sPath, sOffset, fPath, fOffset),
          sUnlink(),
          tinyApis.sAssertContent(expectedHtml, 'Should not have a link')
        ]);
      };

      return GeneralSteps.sequence([
        sUnlinkTest('<p>a</p>', [0, 0], 0, [0, 0], 1, '<p>a</p>'),
        sUnlinkTest('<p><a href="#">a</a></p>', [0, 0, 0], 0, [0, 0, 0], 1, '<p>a</p>'),
        sUnlinkTest('<p><a href="#"><em>a</em></a></p>', [0, 0, 0], 0, [0, 0, 0], 1, '<p><em>a</em></p>'),
        sUnlinkTest('<p><a href="#">a</a>b</p>', [0, 0, 0], 0, [0, 1], 1, '<p>ab</p>')
      ]);
    };

    var base64ToBlob = function (base64, type) {
      var buff = Window.atob(base64);
      var bytes = new Uint8Array(buff.length);

      for (var i = 0; i < bytes.length; i++) {
        bytes[i] = buff.charCodeAt(i);
      }

      return new Blob([bytes], { type: type });
    };

    var sInsertBlobTests = function (editor, tinyApis) {
      var sInsertBlobTest = function (inputHtml, path, offset, blob, base64, expectedHtml) {
        var sInsertBlob = wrap(Actions.insertBlob, editor);

        return GeneralSteps.sequence([
          tinyApis.sSetContent(inputHtml),
          tinyApis.sSetCursor(path, offset),
          sInsertBlob(blob, base64),
          tinyApis.sAssertContent(expectedHtml, 'Should have a image')
        ]);
      };

      var base64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      var blob = base64ToBlob(base64, 'image/gif');

      return GeneralSteps.sequence([
        sInsertBlobTest('<p>a</p>', [0, 0], 0, base64, blob, '<p><img src="data:image/gif;base64,' + base64 + '" />a</p>')
      ]);
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        sInsertTableTests(editor, tinyApis),
        sFormatBlockTests(editor, tinyApis),
        sInsertBlobTests(editor, tinyApis),
        sCreateLinkTests(editor, tinyApis),
        sUnlinkTests(editor, tinyApis)
      ], onSuccess, onFailure);
    }, {
      inline: true,
      theme: 'inlite',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
