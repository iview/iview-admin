asynctest(
  'browser.tinymce.plugins.toc.TocPluginTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.core.util.Tools',
    'tinymce.plugins.toc.Plugin',
    'tinymce.plugins.toc.test.HtmlUtils',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, LegacyUnit, TinyLoader, Tools, Plugin, HtmlUtils, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    Plugin();
    Theme();

    var stripAttribs = function ($el, attr) {
      if (Tools.isArray(attr)) {
        Tools.each(attr, function (attr) {
          stripAttribs($el, attr);
        });
        return;
      }

      $el.removeAttr(attr);
      $el.find('[' + attr + ']').removeAttr(attr);
    };

    var trimBr = function (html) {
      return html.replace(/<br data-mce-bogus="1" \/>/g, '');
    };

    suite.test("mceInsertToc", function (editor) {
      editor.getBody().innerHTML =
        '<h1 id="h1">H1</h1>' +
        '<p>This is some text.</p><br />' +
        '<h2 id="h2">H2</h2>' +
        '<p>This is some text.</p><hr />' +
        '<h1 id="h3">H1</h1>' +
        '<p>This is some text.</p>' +
        '<h3 id="h4">H3</h3>' +
        '<p>This is some text.</p>'
        ;

      LegacyUnit.setSelection(editor, 'h1', 0);
      editor.execCommand('mceInsertToc');

      var $toc = editor.$('.tst-toc');

      LegacyUnit.equal($toc.length, 2, "ToC inserted");
      LegacyUnit.equal($toc.attr('contentEditable'), "false", "cE=false");

      LegacyUnit.equal($toc.find('ul ul ul').length, 0, "no levels beyond 2 are included");

      stripAttribs($toc, ['data-mce-href', 'data-mce-selected']);

      LegacyUnit.equal(trimBr(HtmlUtils.normalizeHtml($toc[0].outerHTML)),
        '<div class="tst-toc" contenteditable="false">' +
        '<h3 contenteditable="true">Table of Contents</h3>' +
        '<ul>' +
        '<li>' +
        '<a href="#h1">H1</a>' +
        '<ul>' +
        '<li><a href="#h2">H2</a></li>' +
        '</ul>' +
        '</li>' +
        '<li>' +
        '<a href="#h3">H1</a>' +
        '</li>' +
        '</ul>' +
        '</div>',
        "no surprises in ToC structure"
      );
    });

    suite.test("mceInsertToc - flat structure", function (editor) {
      editor.getBody().innerHTML =
        '<h1 id="h1">H1</h1>' +
        '<p>This is some text.</p><br />' +
        '<h1 id="h2">H1</h1>' +
        '<p>This is some text.</p><hr />' +
        '<h1 id="h3">H1</h1>' +
        '<p>This is some text.</p>' +
        '<h2 id="h4">H2</h2>' +
        '<p>This is some text.</p>'
        ;

      LegacyUnit.setSelection(editor, 'h1', 0);
      editor.execCommand('mceInsertToc');

      var $toc = editor.$('.tst-toc');

      stripAttribs($toc, ['data-mce-href', 'data-mce-selected']);

      LegacyUnit.equal(trimBr(HtmlUtils.normalizeHtml($toc[0].innerHTML)),
        '<h3 contenteditable="true">Table of Contents</h3>' +
        '<ul>' +
        '<li>' +
        '<a href="#h1">H1</a>' +
        '</li>' +
        '<li>' +
        '<a href="#h2">H1</a>' +
        '</li>' +
        '<li>' +
        '<a href="#h3">H1</a>' +
        '<ul>' +
        '<li><a href="#h4">H2</a></li>' +
        '</ul>' +
        '</li>' +
        '</ul>',
        "no surprises in ToC structure"
      );
    });

    suite.test("mceUpdateToc", function (editor) {
      editor.getBody().innerHTML =
        '<h1 id="h1">H1</h1>' +
        '<p>This is some text.</p><br />' +
        '<h2 id="h2">H2</h2>' +
        '<p>This is some text.</p><hr />' +
        '<h1 id="h3">H1</h1>' +
        '<p>This is some text.</p>' +
        '<h3 id="h4">H3</h3>' +
        '<p>This is some text.</p>'
        ;

      LegacyUnit.setSelection(editor, 'h1', 0);
      editor.execCommand('mceInsertToc');

      // add one more heading
      editor.$().append('<h1 id="h5">H1</h1><p>This is some text.</p>');

      LegacyUnit.setSelection(editor, 'li', 0);
      editor.execCommand('mceUpdateToc');

      LegacyUnit.equal(editor.$('.tst-toc > ul a[href="#h5"]').length, 1,
        "ToC has been successfully updated");
    });

    suite.test("Misc.", function (editor) {
      var contents, $toc;

      editor.getBody().innerHTML =
        '<h2 id="h1">H2</h2>' +
        '<p>This is some text.</p><br />' +
        '<h2 id="h2">H2</h2>' +
        '<p>This is some text.</p>' +
        '<h3 id="h4">H3</h3>' +
        '<p>This is some text.</p>'
        ;

      LegacyUnit.setSelection(editor, 'h2', 0);
      editor.execCommand('mceInsertToc');

      contents = editor.getContent();
      LegacyUnit.equal(/contenteditable/i.test(contents), false, "cE stripped for getContent()");

      editor.setContent(contents);

      $toc = editor.$('.tst-toc');
      LegacyUnit.deepEqual($toc.attr('contentEditable'), "false", "cE added back after setContent()");
      LegacyUnit.deepEqual($toc.find(':first-child').attr('contentEditable'), "true",
        "cE added back to title after setContent()");

      stripAttribs($toc, ['data-mce-href', 'data-mce-selected']);

      LegacyUnit.equal(trimBr(HtmlUtils.normalizeHtml($toc[0].innerHTML)),
        '<h3 contenteditable="true">Table of Contents</h3>' +
        '<ul>' +
        '<li>' +
        '<a href="#h1">H2</a>' +
        '</li>' +
        '<li>' +
        '<a href="#h2">H2</a>' +
        '</li>' +
        '</ul>',
        "the largest available header becomes first ToC level"
      );
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, suite.toSteps(editor), onSuccess, onFailure);
    }, {
      plugins: 'toc',
      add_unload_trigger: false,
      indent: false,
      toc_class: 'tst-toc',
      toc_depth: 2,
      toc_header: 'h3',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
