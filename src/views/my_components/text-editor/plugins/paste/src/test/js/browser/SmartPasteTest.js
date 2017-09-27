asynctest(
  'tinymce.plugins.paste.browser.ImagePasteTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.paste.core.SmartPaste',
    'tinymce.plugins.paste.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, LegacyUnit, TinyLoader, SmartPaste, Plugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    Plugin();
    Theme();

    suite.test('isAbsoluteUrl', function () {
      LegacyUnit.equal(SmartPaste.isAbsoluteUrl('http://www.site.com'), true);
      LegacyUnit.equal(SmartPaste.isAbsoluteUrl('https://www.site.com'), true);
      LegacyUnit.equal(SmartPaste.isAbsoluteUrl('http://www.site.com/dir-name/file.gif?query=%42'), true);
      LegacyUnit.equal(SmartPaste.isAbsoluteUrl('https://www.site.com/dir-name/file.gif?query=%42'), true);
      LegacyUnit.equal(SmartPaste.isAbsoluteUrl('https://www.site.com/dir-name/file.gif?query=%42#a'), true);
      LegacyUnit.equal(SmartPaste.isAbsoluteUrl('https://www.site.com/~abc'), true);
      LegacyUnit.equal(SmartPaste.isAbsoluteUrl('file.gif'), false);
      LegacyUnit.equal(SmartPaste.isAbsoluteUrl(''), false);
    });

    suite.test('isImageUrl', function () {
      LegacyUnit.equal(SmartPaste.isImageUrl('http://www.site.com'), false);
      LegacyUnit.equal(SmartPaste.isImageUrl('https://www.site.com'), false);
      LegacyUnit.equal(SmartPaste.isImageUrl('http://www.site.com/dir-name/file.jpeg'), true);
      LegacyUnit.equal(SmartPaste.isImageUrl('http://www.site.com/dir-name/file.jpg'), true);
      LegacyUnit.equal(SmartPaste.isImageUrl('http://www.site.com/dir-name/file.png'), true);
      LegacyUnit.equal(SmartPaste.isImageUrl('http://www.site.com/dir-name/file.gif'), true);
      LegacyUnit.equal(SmartPaste.isImageUrl('https://www.site.com/dir-name/file.gif'), true);
      LegacyUnit.equal(SmartPaste.isImageUrl('https://www.site.com/~dir-name/file.gif'), true);
      LegacyUnit.equal(SmartPaste.isImageUrl('https://www.site.com/dir-name/file.gif?query=%42'), false);
      LegacyUnit.equal(SmartPaste.isImageUrl('https://www.site.com/dir-name/file.html?query=%42'), false);
      LegacyUnit.equal(SmartPaste.isImageUrl('file.gif'), false);
      LegacyUnit.equal(SmartPaste.isImageUrl(''), false);
    });

    suite.test('smart paste url on selection', function (editor) {
      editor.focus();
      editor.undoManager.clear();
      editor.setContent('<p>abc</p>');
      LegacyUnit.setSelection(editor, 'p', 0, 'p', 3);
      editor.undoManager.add();

      editor.execCommand('mceInsertClipboardContent', false, { content: 'http://www.site.com' });
      LegacyUnit.equal(editor.getContent(), '<p><a href="http://www.site.com">abc</a></p>');
      LegacyUnit.equal(editor.undoManager.data.length, 3);
    });

    suite.test('smart paste image url', function (editor) {
      editor.focus();
      editor.undoManager.clear();
      editor.setContent('<p>abc</p>');
      LegacyUnit.setSelection(editor, 'p', 1);
      editor.undoManager.add();

      editor.execCommand('mceInsertClipboardContent', false, { content: 'http://www.site.com/my.jpg' });
      LegacyUnit.equal(editor.getContent(), '<p>a<img src="http://www.site.com/my.jpg" />bc</p>');
      LegacyUnit.equal(editor.undoManager.data.length, 3);
    });

    suite.test('smart paste option disabled', function (editor) {
      editor.focus();
      editor.undoManager.clear();
      editor.setContent('<p>abc</p>');
      LegacyUnit.setSelection(editor, 'p', 1);
      editor.undoManager.add();
      editor.settings.smart_paste = false;

      editor.execCommand('mceInsertClipboardContent', false, { content: 'http://www.site.com/my.jpg' });
      LegacyUnit.equal(editor.getContent(), '<p>ahttp://www.site.com/my.jpgbc</p>');
      LegacyUnit.equal(editor.undoManager.data.length, 2);
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, suite.toSteps(editor), onSuccess, onFailure);
    }, {
      add_unload_trigger: false,
      indent: false,
      plugins: 'paste',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
