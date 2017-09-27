asynctest(
  'browser.tinymce.plugins.link.LinkPluginTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.katamari.api.Arr',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.link.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, Step, Arr, LegacyUnit, TinyLoader, LinkPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    ModernTheme();
    LinkPlugin();

    var nonRelativeRegex = /^\w+:/i;

    var _cleanHtml = function (html) {
      html = html.toLowerCase().replace(/[\r\n]+/gi, '');
      html = html.replace(/ (sizcache[0-9]+|sizcache|nodeindex|sizset[0-9]+|sizset|data\-mce\-expando|data\-mce\-selected)="[^"]*"/gi, '');
      html = html.replace(/<span[^>]+data-mce-bogus[^>]+>[\u200B\uFEFF]+<\/span>|<div[^>]+data-mce-bogus[^>]+><\/div>/gi, '');
      html = html.replace(/ style="([^"]+)"/gi, function (val1, val2) {
        val2 = val2.replace(/;$/, '');
        return ' style="' + val2.replace(/\:([^ ])/g, ': $1') + ';"';
      });

      return html;
    };

    var cleanHtml = function (html) {
      return _cleanHtml(html).replace(/<p>(&nbsp;|<br[^>]+>)<\/p>$/, '');
    };

    var getFrontmostWindow = function (editor) {
      return editor.windowManager.windows[editor.windowManager.windows.length - 1];
    };

    var fillAndSubmitWindowForm = function (editor, data) {
      var win = getFrontmostWindow(editor);

      win.fromJSON(data);
      win.find('form')[0].submit();
      win.close();
    };

    var sTeardown = function (editor) {
      return Step.sync(function () {
        delete editor.settings.file_browser_callback;
        delete editor.settings.link_list;
        delete editor.settings.link_class_list;
        delete editor.settings.link_target_list;
        delete editor.settings.rel_list;

        var win = getFrontmostWindow(editor);

        if (win) {
          win.close();
        }
      });
    };

    var appendTeardown = function (editor, steps) {
      return Arr.bind(steps, function (step) {
        return [step, sTeardown(editor)];
      });
    };

    suite.test('Default link dialog on empty editor', function (editor) {
      editor.setContent('');
      editor.execCommand('mceLink', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "href": "",
        "target": "",
        "text": "",
        "title": ""
      });

      fillAndSubmitWindowForm(editor, {
        "href": "href",
        "target": "_blank",
        "text": "text",
        "title": "title"
      });

      LegacyUnit.equal(
        cleanHtml(editor.getContent()),
        '<p><a title="title" href="href" target="_blank" rel="noopener">text</a></p>'
      );
    });

    suite.test('Default link dialog on text selection', function (editor) {
      editor.setContent('<p>abc</p>');
      LegacyUnit.setSelection(editor, 'p', 1, 'p', 2);
      editor.execCommand('mceLink', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "href": "",
        "target": "",
        "text": "b",
        "title": ""
      });

      fillAndSubmitWindowForm(editor, {
        "href": "href",
        "target": "_blank",
        "title": "title"
      });

      LegacyUnit.equal(
        cleanHtml(editor.getContent()),
        '<p>a<a title="title" href="href" target="_blank" rel="noopener">b</a>c</p>'
      );
    });

    suite.test('Default link dialog on non pure text selection', function (editor) {
      editor.setContent('<p>a</p><p>bc</p>');
      LegacyUnit.setSelection(editor, 'p:nth-child(1)', 0, 'p:nth-child(2)', 2);
      editor.execCommand('mceLink', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "href": "",
        "target": "",
        "title": ""
      });

      fillAndSubmitWindowForm(editor, {
        "href": "href",
        "target": "_blank",
        "title": "title"
      });

      LegacyUnit.equal(
        cleanHtml(editor.getContent()),
        '<p><a title="title" href="href" target="_blank" rel="noopener">a</a></p>' +
        '<p><a title="title" href="href" target="_blank" rel="noopener">bc</a></p>'
      );
    });

    suite.test('All lists link dialog on empty editor', function (editor) {
      editor.settings.link_list = [
        { title: 'link1', value: 'link1' },
        { title: 'link2', value: 'link2' }
      ];

      editor.settings.link_class_list = [
        { title: 'class1', value: 'class1' },
        { title: 'class2', value: 'class2' }
      ];

      editor.settings.target_list = [
        { title: 'target1', value: 'target1' },
        { title: 'target2', value: 'target2' }
      ];

      editor.settings.rel_list = [
        { title: 'rel1', value: 'rel1' },
        { title: 'rel2', value: 'rel2' }
      ];

      editor.setContent('');
      editor.execCommand('mceLink', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "class": "class1",
        "href": "",
        "rel": "rel1",
        "target": "target1",
        "text": "",
        "title": ""
      });

      fillAndSubmitWindowForm(editor, {
        "href": "href",
        "text": "text",
        "title": "title"
      });

      LegacyUnit.equal(
        cleanHtml(editor.getContent()),
        '<p><a class="class1" title="title" href="href" target="target1" rel="rel1">text</a></p>'
      );
    });

    //Since there's no capability to use the confirm dialog with unit tests, simply test the regex we're using
    suite.test('Test new regex for non relative link setting ftp', function () {
      LegacyUnit.equal(nonRelativeRegex.test('ftp://testftp.com'), true);
    });

    suite.test('Test new regex for non relative link setting http', function () {
      LegacyUnit.equal(nonRelativeRegex.test('http://testhttp.com'), true);
    });

    suite.test('Test new regex for non relative link setting relative', function () {
      LegacyUnit.equal(nonRelativeRegex.test('testhttp.com'), false);
    });

    suite.test('Test new regex for non relative link setting relative base', function () {
      LegacyUnit.equal(nonRelativeRegex.test('/testjpg.jpg'), false);
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, appendTeardown(editor, suite.toSteps(editor)), onSuccess, onFailure);
    }, {
      plugins: 'link',
      add_unload_trigger: false,
      indent: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);