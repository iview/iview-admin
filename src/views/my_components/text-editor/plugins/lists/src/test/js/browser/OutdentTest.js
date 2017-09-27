asynctest(
  'tinymce.lists.browser.OutdentTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.lists.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, LegacyUnit, TinyLoader, Plugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    Plugin();
    Theme();

    suite.test('Outdent inside LI in beginning of OL in LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a' +
        '<ol>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ol>' +
        '</li>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li li', 1);
      LegacyUnit.execCommand(editor, 'Outdent');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a</li>' +
        '<li>b' +
        '<ol>' +
        '<li>c</li>' +
        '</ol>' +
        '</li>' +
        '</ol>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Outdent inside LI in middle of OL in LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a' +
        '<ol>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '<li>d</li>' +
        '</ol>' +
        '</li>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li li:nth-child(2)', 1);
      LegacyUnit.execCommand(editor, 'Outdent');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a' +
        '<ol>' +
        '<li>b</li>' +
        '</ol>' +
        '</li>' +
        '<li>c' +
        '<ol>' +
        '<li>d</li>' +
        '</ol>' +
        '</li>' +
        '</ol>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Outdent inside LI in end of OL in LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a' +
        '<ol>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ol>' +
        '</li>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li li:last', 1);
      LegacyUnit.execCommand(editor, 'Outdent');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a' +
        '<ol>' +
        '<li>b</li>' +
        '</ol>' +
        '</li>' +
        '<li>c</li>' +
        '</ol>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    // Nested lists in OL elements

    suite.test('Outdent inside LI in beginning of OL in OL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a</li>' +
        '<ol>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ol>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'ol ol li', 1);
      LegacyUnit.execCommand(editor, 'Outdent');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '<ol>' +
        '<li>c</li>' +
        '</ol>' +
        '</ol>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Outdent inside LI in middle of OL in OL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a</li>' +
        '<ol>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '<li>d</li>' +
        '</ol>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'ol ol li:nth-child(2)', 1);
      LegacyUnit.execCommand(editor, 'Outdent');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a</li>' +
        '<ol>' +
        '<li>b</li>' +
        '</ol>' +
        '<li>c</li>' +
        '<ol>' +
        '<li>d</li>' +
        '</ol>' +
        '</ol>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Outdent inside first/last LI in inner OL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>1' +
        '<ol>' +
        '<li>2</li>' +
        '<li>3</li>' +
        '</ol>' +
        '</li>' +
        '<li>4</li>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'ol ol li:nth-child(1)', 0, 'ol ol li:nth-child(2)', 1);
      LegacyUnit.execCommand(editor, 'Outdent');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>1</li>' +
        '<li>2</li>' +
        '<li>3</li>' +
        '<li>4</li>' +
        '</ol>'
      );

      LegacyUnit.equal(editor.selection.getRng(true).startContainer.nodeValue, '2');
      LegacyUnit.equal(editor.selection.getRng(true).endContainer.nodeValue, '3');
    });

    suite.test('Outdent inside first LI in inner OL where OL is single child of parent LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a</li>' +
        '<li>' +
        '<ol>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ol>' +
        '</li>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'ol ol li:first', 0);
      LegacyUnit.execCommand(editor, 'Outdent');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a</li>' +
        '<li>b' +
        '<ol>' +
        '<li>c</li>' +
        '</ol>' +
        '</li>' +
        '</ol>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Outdent inside LI in end of OL in OL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a</li>' +
        '<ol>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ol>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'ol ol li:last', 1);
      LegacyUnit.execCommand(editor, 'Outdent');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a</li>' +
        '<ol>' +
        '<li>b</li>' +
        '</ol>' +
        '<li>c</li>' +
        '</ol>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Outdent inside only child LI in OL in OL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a' +
        '<ol>' +
        '<li>b</li>' +
        '</ol>' +
        '</li>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'ol ol li', 0);
      LegacyUnit.execCommand(editor, 'Outdent');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ol>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Outdent multiple LI in OL and nested OL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a' +
        '<ol>' +
        '<li>b</li>' +
        '</ol>' +
        '</li>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li', 0, 'li li', 1);
      LegacyUnit.execCommand(editor, 'Outdent');

      LegacyUnit.equal(editor.getContent(),
        '<p>a</p>' +
        '<ol>' +
        '<li>b</li>' +
        '</ol>'
      );
    });

    suite.test('Outdent on li with inner block element', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li><p>a</p></li>' +
        '<li><p>b</p></li>' +
        '<li><p>c</p></li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'ul li:nth-child(2) p', 0);
      LegacyUnit.execCommand(editor, 'Outdent');

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
          '<li><p>a</p></li>' +
        '</ul>' +
        '<p>b</p>' +
        '<ul>' +
          '<li><p>c</p></li>' +
        '</ul>'
      );
    });

    suite.test('Outdent on nested li with inner block element', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
          '<li>' +
            '<p>a</p>' +
            '<ul><li><p>b</p></li></ul>' +
          '</li>' +
          '<li><p>c</p></li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'ul li:nth-child(1) li p', 0);
      LegacyUnit.execCommand(editor, 'Outdent');

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li><p>a</p></li>' +
        '<li><p>b</p></li>' +
        '<li><p>c</p></li>' +
        '</ul>'
      );
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, suite.toSteps(editor), onSuccess, onFailure);
    }, {
      plugins: "lists",
      add_unload_trigger: false,
      disable_nodechange: true,
      indent: false,
      entities: 'raw',
      valid_elements:
        'li[style|class|data-custom],ol[style|class|data-custom],' +
        'ul[style|class|data-custom],dl,dt,dd,em,strong,span,#p,div,br',
      valid_styles: {
        '*': 'color,font-size,font-family,background-color,font-weight,' +
          'font-style,text-decoration,float,margin,margin-top,margin-right,' +
          'margin-bottom,margin-left,display,position,top,left,list-style-type'
      },
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);