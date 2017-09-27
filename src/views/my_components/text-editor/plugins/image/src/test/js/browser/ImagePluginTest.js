asynctest(
  'browser.tinymce.plugins.image.ImagePluginTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'global!document',
    'tinymce.core.Env',
    'tinymce.plugins.image.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, LegacyUnit, TinyLoader, document, Env, Plugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    Theme();
    Plugin();

    var teardown = function (editor) {
      delete editor.settings.image_dimensions;
      delete editor.settings.file_browser_callback;
      delete editor.settings.image_list;
      delete editor.settings.image_class_list;
      delete editor.settings.document_base_url;
      delete editor.settings.image_advtab;
      delete editor.settings.image_caption;
    };

    var cleanHtml = function (html) {
      return html.replace(/<p>(&nbsp;|<br[^>]+>)<\/p>$/, '');
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

    var triggerElementChange = function (element) {
      var evt;

      if ("createEvent" in document) {
        evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        element.dispatchEvent(evt);
      } else {
        element.fireEvent("onchange");
      }
    };

    suite.test('Default image dialog on empty editor', function (editor) {
      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "constrain": true,
        "height": "",
        "src": "",
        "width": ""
      });

      fillAndSubmitWindowForm(editor, {
        "alt": "alt",
        "height": "100",
        "src": "src",
        "width": "200"
      });

      LegacyUnit.equal(
        cleanHtml(editor.getContent()),
        '<p><img src="src" alt="alt" width="200" height="100" /></p>'
      );
    });

    suite.test('Image dialog image_dimensions: false', function (editor) {
      editor.settings.image_dimensions = false;
      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "src": ""
      });

      fillAndSubmitWindowForm(editor, {
        "alt": "alt",
        "src": "src"
      });

      LegacyUnit.equal(
        cleanHtml(editor.getContent()),
        '<p><img src="src" alt="alt" /></p>'
      );

      teardown(editor);
    });

    if (Env.ceFalse) {
      suite.test('All image dialog ui options on empty editor', function (editor) {
        editor.settings.image_caption = true;
        editor.settings.image_list = [
          { title: 'link1', value: 'link1' },
          { title: 'link2', value: 'link2' }
        ];

        editor.settings.image_class_list = [
          { title: 'class1', value: 'class1' },
          { title: 'class2', value: 'class2' }
        ];

        editor.setContent('');
        editor.execCommand('mceImage', true);

        LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
          "alt": "",
          "class": "class1",
          "constrain": true,
          "caption": false,
          "height": "",
          "src": "",
          "width": ""
        });

        fillAndSubmitWindowForm(editor, {
          "alt": "alt",
          "class": "class1",
          "constrain": true,
          "caption": true,
          "height": "200",
          "src": "src",
          "width": "100"
        });

        LegacyUnit.equal(
          cleanHtml(editor.getContent()),
          '<figure class="image">' +
          '<img class="class1" src="src" alt="alt" width="100" height="200" />' +
          '<figcaption>Caption</figcaption>' +
          '</figure>'
        );

        teardown(editor);
      });
    } else {
      suite.test('All image dialog ui options on empty editor (old IE)', function (editor) {
        editor.settings.image_caption = true;
        editor.settings.image_list = [
          { title: 'link1', value: 'link1' },
          { title: 'link2', value: 'link2' }
        ];

        editor.settings.image_class_list = [
          { title: 'class1', value: 'class1' },
          { title: 'class2', value: 'class2' }
        ];

        editor.setContent('');
        editor.execCommand('mceImage', true);

        LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
          "alt": "",
          "class": "class1",
          "constrain": true,
          "height": "",
          "src": "",
          "width": ""
        });

        fillAndSubmitWindowForm(editor, {
          "alt": "alt",
          "class": "class1",
          "constrain": true,
          "caption": true,
          "height": "200",
          "src": "src",
          "width": "100"
        });

        LegacyUnit.equal(
          cleanHtml(editor.getContent()),
          '<p><img class="class1" src="src" alt="alt" width="100" height="200" /></p>'
        );
      });
    }

    suite.test("Image recognizes relative src url and prepends relative image_prepend_url setting.", function (editor) {
      var win, elementId, element;

      editor.settings.image_prepend_url = 'testing/images/';
      editor.setContent('');
      editor.execCommand('mceImage', true);

      var data = {
        "src": "src",
        "alt": "alt"
      };

      win = getFrontmostWindow(editor);
      elementId = win.find('#src')[0]._id;
      element = document.getElementById(elementId).childNodes[0];

      win.fromJSON(data);
      triggerElementChange(element);

      win.find('form')[0].submit();
      win.close();

      LegacyUnit.equal(
        cleanHtml(editor.getContent()),
        '<p><img src="' + editor.settings.image_prepend_url + 'src" alt="alt" /></p>'
      );
    });

    suite.test("Image recognizes relative src url and prepends absolute image_prepend_url setting.", function (editor) {
      var win, elementId, element;

      editor.settings.image_prepend_url = 'http://abc.local/images/';
      editor.setContent('');
      editor.execCommand('mceImage', true);

      var data = {
        "src": "src",
        "alt": "alt"
      };

      win = getFrontmostWindow(editor);
      elementId = win.find('#src')[0]._id;
      element = document.getElementById(elementId).childNodes[0];

      win.fromJSON(data);
      triggerElementChange(element);

      win.find('form')[0].submit();
      win.close();

      LegacyUnit.equal(
        cleanHtml(editor.getContent()),
        '<p><img src="' + editor.settings.image_prepend_url + 'src" alt="alt" /></p>'
      );
    });

    suite.test('Advanced image dialog border option on empty editor', function (editor) {
      editor.settings.image_advtab = true;
      editor.settings.image_dimensions = false;

      editor.setContent('<p>a</p>');
      var rng = editor.dom.createRng();
      rng.setStart(editor.dom.select('p')[0].firstChild, 1);
      rng.setEnd(editor.dom.select('p')[0].firstChild, 1);
      editor.selection.setRng(rng);

      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "",
        "vspace": ""
      });

      fillAndSubmitWindowForm(editor, {
        "alt": "alt",
        "border": "10px",
        "src": "src"
      });

      LegacyUnit.equal(
        cleanHtml(editor.getContent()),
        '<p>a<img style="border-width: 10px;" src="src" alt="alt" /></p>'
      );
    });

    suite.test('Advanced image dialog margin space options on empty editor', function (editor) {
      editor.settings.image_advtab = true;
      editor.settings.image_dimensions = false;

      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "",
        "vspace": ""
      });

      fillAndSubmitWindowForm(editor, {
        "alt": "alt",
        "hspace": "10",
        "src": "src",
        "vspace": "10"
      });

      LegacyUnit.equal(
        cleanHtml(editor.getContent()),
        '<p><img style="margin: 10px;" src="src" alt="alt" /></p>'
      );

    });

    suite.test('Advanced image dialog border style only options on empty editor', function (editor) {
      editor.settings.image_advtab = true;
      editor.settings.image_dimensions = false;

      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "",
        "vspace": ""
      });

      fillAndSubmitWindowForm(editor, {
        "alt": "alt",
        "src": "src",
        "style": "border-width: 10px;"
      });

      LegacyUnit.equal(
        cleanHtml(editor.getContent()),
        '<p><img style="border-width: 10px;" src="src" alt="alt" /></p>'
      );

    });

    suite.test('Advanced image dialog margin style only options on empty editor', function (editor) {
      editor.settings.image_advtab = true;
      editor.settings.image_dimensions = false;

      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "",
        "vspace": ""
      });

      fillAndSubmitWindowForm(editor, {
        "alt": "alt",
        "src": "src",
        "style": "margin: 10px;"
      });

      LegacyUnit.equal(
        cleanHtml(editor.getContent()),
        '<p><img style="margin: 10px;" src="src" alt="alt" /></p>'
      );

    });

    suite.test('Advanced image dialog overriden border style options on empty editor', function (editor) {
      editor.settings.image_advtab = true;
      editor.settings.image_dimensions = false;

      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "",
        "vspace": ""
      });

      fillAndSubmitWindowForm(editor, {
        "alt": "alt",
        "border": "10",
        "src": "src",
        "style": "border-width: 15px;"
      });

      LegacyUnit.equal(
        cleanHtml(editor.getContent()),
        '<p><img style="border-width: 10px;" src="src" alt="alt" /></p>'
      );

    });

    suite.test('Advanced image dialog overriden margin style options on empty editor', function (editor) {
      editor.settings.image_advtab = true;
      editor.settings.image_dimensions = false;

      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "",
        "vspace": ""
      });

      fillAndSubmitWindowForm(editor, {
        "alt": "alt",
        "hspace": "10",
        "src": "src",
        "style": "margin-left: 15px; margin-top: 20px;",
        "vspace": "10"
      });

      LegacyUnit.equal(
        cleanHtml(editor.getContent()),
        '<p><img style="margin: 10px;" src="src" alt="alt" /></p>'
      );

    });

    suite.test('Advanced image dialog non-shorthand horizontal margin style change test', function (editor) {
      editor.settings.image_advtab = true;
      editor.settings.image_dimensions = false;

      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "",
        "vspace": ""
      });

      getFrontmostWindow(editor).find('#style').value('margin-left: 15px; margin-right: 15px;').fire('change');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "15",
        "src": "",
        "style": "margin-left: 15px; margin-right: 15px;",
        "vspace": ""
      });

    });

    suite.test('Advanced image dialog non-shorthand vertical margin style change test', function (editor) {
      editor.settings.image_advtab = true;
      editor.settings.image_dimensions = false;

      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "",
        "vspace": ""
      });

      getFrontmostWindow(editor).find('#style').value('margin-top: 15px; margin-bottom: 15px;').fire('change');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "margin-top: 15px; margin-bottom: 15px;",
        "vspace": "15"
      });

    });

    suite.test('Advanced image dialog shorthand margin 1 value style change test', function (editor) {
      editor.settings.image_advtab = true;
      editor.settings.image_dimensions = false;

      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "",
        "vspace": ""
      });

      getFrontmostWindow(editor).find('#style').value('margin: 5px;').fire('change');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "5",
        "src": "",
        "style": "margin: 5px;",
        "vspace": "5"
      });

    });

    suite.test('Advanced image dialog shorthand margin 2 value style change test', function (editor) {
      editor.settings.image_advtab = true;
      editor.settings.image_dimensions = false;

      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "",
        "vspace": ""
      });

      getFrontmostWindow(editor).find('#style').value('margin: 5px 10px;').fire('change');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "10",
        "src": "",
        "style": "margin: 5px 10px 5px 10px;",
        "vspace": "5"
      });

    });

    suite.test('Advanced image dialog shorthand margin 2 value style change test', function (editor) {
      editor.settings.image_advtab = true;
      editor.settings.image_dimensions = false;

      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "",
        "vspace": ""
      });

      getFrontmostWindow(editor).find('#style').value('margin: 5px 10px;').fire('change');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "10",
        "src": "",
        "style": "margin: 5px 10px 5px 10px;",
        "vspace": "5"
      });

    });

    suite.test('Advanced image dialog shorthand margin 3 value style change test', function (editor) {
      editor.settings.image_advtab = true;
      editor.settings.image_dimensions = false;

      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "",
        "vspace": ""
      });

      getFrontmostWindow(editor).find('#style').value('margin: 5px 10px 15px;').fire('change');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "10",
        "src": "",
        "style": "margin: 5px 10px 15px 10px;",
        "vspace": ""
      });

    });

    suite.test('Advanced image dialog shorthand margin 4 value style change test', function (editor) {
      editor.settings.image_advtab = true;
      editor.settings.image_dimensions = false;

      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "",
        "vspace": ""
      });

      getFrontmostWindow(editor).find('#style').value('margin: 5px 10px 15px 20px;').fire('change');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "margin: 5px 10px 15px 20px;",
        "vspace": ""
      });

    });

    suite.test('Advanced image dialog shorthand margin 4 value style change test', function (editor) {
      editor.settings.image_advtab = true;
      editor.settings.image_dimensions = false;

      editor.setContent('');
      editor.execCommand('mceImage', true);

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "",
        "vspace": ""
      });

      getFrontmostWindow(editor).find('#style').value('margin: 5px 10px 15px 20px; margin-top: 15px;').fire('change');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "alt": "",
        "border": "",
        "hspace": "",
        "src": "",
        "style": "margin: 15px 10px 15px 20px;",
        "vspace": "15"
      });

    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, suite.toSteps(editor), onSuccess, onFailure);
    }, {
      plugins: 'image',
      indent: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);