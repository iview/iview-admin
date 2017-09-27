asynctest(
  'tinymce.lists.browser.BackspaceDeleteTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.core.Env',
    'tinymce.plugins.lists.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, LegacyUnit, TinyLoader, Env, Plugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    Plugin();
    Theme();

    suite.test('Backspace at beginning of single LI in UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<p>a</p>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'P');
    });

    suite.test('Backspace at beginning of first LI in UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<p>a</p>' +
        '<ul>' +
        '<li>b</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'P');
    });

    suite.test('Backspace at beginning of middle LI in UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(2)', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>ab</li>' +
        '<li>c</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Backspace at beginning of start LI in UL inside UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li li', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>ab' +
        '<ul>' +
        '<li>c</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Backspace at beginning of middle LI in UL inside UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '<li>d</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li li:nth-child(2)', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>bc</li>' +
        '<li>d</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Backspace at beginning of single LI in UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<p>a</p>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'P');
    });

    suite.test('Backspace at beginning of first LI in UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<p>a</p>' +
        '<ul>' +
        '<li>b</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'P');
    });

    suite.test('Backspace at beginning of middle LI in UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(2)', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>ab</li>' +
        '<li>c</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Backspace at beginning of start LI in UL inside UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li li', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>ab' +
        '<ul>' +
        '<li>c</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Backspace at beginning of middle LI in UL inside UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '<li>d</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li li:nth-child(2)', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>bc</li>' +
        '<li>d</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Backspace at beginning of LI with empty LI above in UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li></li>' +
        '<li>b</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(3)', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().innerHTML, 'b');
    });

    suite.test('Backspace at beginning of LI with BR padded empty LI above in UL', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
        '<li>a</li>' +
        '<li><br></li>' +
        '<li>b</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(3)', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().innerHTML, 'b');
    });

    suite.test('Backspace at empty LI (IE)', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
        '<li>a</li>' +
        '<li></li>' +
        '<li>b</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(2)', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().innerHTML, 'a');
    });

    suite.test('Backspace at beginning of LI with empty LI with STRING and BR above in UL', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
        '<li>a</li>' +
        '<li><strong><br></strong></li>' +
        '<li>b</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(3)', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().innerHTML, 'b');
    });

    suite.test('Backspace at nested LI with adjacent BR', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
        '<li>1' +
        '<ul>' +
        '<li>' +
        '<br>' +
        '<ul>' +
        '<li>2</li>' +
        '</ul>' +
        '</li>' +
        '</ul>' +
        '</li>' +
        '<li>3</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'ul ul ul li', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(), '<ul><li>1<ul><li>2</li></ul></li><li>3</li></ul>');
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Backspace at LI selected with triple-click in UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b' +
        '<ul>' +
        '<li>c</li>' +
        '<li>d</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(1)', 0, 'li:nth-child(2)', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(LegacyUnit.trimBrs(editor.getContent()),
        '<ul>' +
        '<li>b' +
        '<ul>' +
        '<li>c</li>' +
        '<li>d</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Backspace at partially selected list', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<p>abc</p>' +
        '<ul>' +
        '<li>a</li>' +
        '<li>b' +
        '<ul>' +
        '<li>c</li>' +
        '<li>d</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'p', 1, 'li:nth-child(2)', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(LegacyUnit.trimBrs(editor.getContent()),
        '<p>ab</p>' +
        '<ul>' +
        '<li style="list-style-type: none;">' +
        '<ul>' +
        '<li>c</li>' +
        '<li>d</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'P');
    });

    // Delete

    suite.test('Delete at end of single LI in UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li', 1);
      editor.plugins.lists.backspaceDelete(true);

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Delete at end of first LI in UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li', 1);
      editor.plugins.lists.backspaceDelete(true);

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>ab</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Delete at end of middle LI in UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(2)', 1);
      editor.plugins.lists.backspaceDelete(true);

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '<li>bc</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Delete at end of start LI in UL inside UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li li', 1);
      editor.plugins.lists.backspaceDelete(true);

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>bc</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Delete at end of middle LI in UL inside UL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '<li>d</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li li:nth-child(2)', 1);
      editor.plugins.lists.backspaceDelete(true);

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '<li>cd</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Delete at end of LI before empty LI', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
        '<li>a</li>' +
        '<li></li>' +
        '<li>b</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li', 1);
      editor.plugins.lists.backspaceDelete(true);

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().innerHTML, 'a');
    });

    suite.test('Delete at end of LI before BR padded empty LI', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
        '<li>a</li>' +
        '<li><br></li>' +
        '<li>b</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li', 1);
      editor.plugins.lists.backspaceDelete(true);

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().innerHTML, 'a');
    });

    suite.test('Delete at end of LI before empty LI with STRONG', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
        '<li>a</li>' +
        '<li><strong><br></strong></li>' +
        '<li>b</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li', 1);
      editor.plugins.lists.backspaceDelete(true);

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().innerHTML, 'a');
    });

    suite.test('Delete at nested LI with adjacent BR', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
        '<li>1' +
        '<ul>' +
        '<li>' +
        '<br>' +
        '<ul>' +
        '<li>2</li>' +
        '</ul>' +
        '</li>' +
        '</ul>' +
        '</li>' +
        '<li>3</li>' +
        '</ul>'
      );

      editor.focus();
      editor.selection.setCursorLocation(editor.$('ul ul li')[0], 0);
      editor.plugins.lists.backspaceDelete(true);

      LegacyUnit.equal(editor.getContent(), '<ul><li>1<ul><li>2</li></ul></li><li>3</li></ul>');
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Delete at BR before text in LI', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
        '<li>1</li>' +
        '<li>2<br></li>' +
        '<li>3</li>' +
        '</ul>'
      );

      editor.focus();
      editor.selection.setCursorLocation(editor.$('li')[1], 1);
      editor.plugins.lists.backspaceDelete(false);

      LegacyUnit.equal(editor.getContent(), '<ul><li>1</li><li>2</li><li>3</li></ul>');
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Backspace merge li elements', function (editor) {
      // IE allows you to place the caret inside a LI without children
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li></li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(2)', 0);

      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
      LegacyUnit.equal(editor.selection.getRng(true).startContainer.nodeType, 3, 'Should be a text node');
    });

    suite.test('Backspace at block inside li element into li without block element', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
          '<li>1</li>' +
          '<li><p>2</p></li>' +
          '<li>3</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'p', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(
        editor.getContent(),
        '<ul>' +
          '<li>12</li>' +
          '<li>3</li>' +
        '</ul>'
      );
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Backspace at block inside li element into li with block element', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
          '<li><p>1</p></li>' +
          '<li><p>2</p></li>' +
          '<li>3</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(2) p', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(
        editor.getContent(),
        '<ul>' +
          '<li><p>12</p></li>' +
          '<li>3</li>' +
        '</ul>'
      );
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'P');
    });

    suite.test('Backspace at block inside li element into li with multiple block elements', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
          '<li><p>1</p><p>2</p></li>' +
          '<li><p>3</p></li>' +
          '<li>4</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(2) p', 0);
      editor.plugins.lists.backspaceDelete();

      LegacyUnit.equal(
        editor.getContent(),
        '<ul>' +
          '<li><p>1</p><p>2</p>3</li>' +
          '<li>4</li>' +
        '</ul>'
      );
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Delete at block inside li element into li without block element', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
          '<li><p>1</p></li>' +
          '<li>2</li>' +
          '<li>3</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'p', 1);
      editor.plugins.lists.backspaceDelete(true);

      LegacyUnit.equal(
        editor.getContent(),
        '<ul>' +
          '<li><p>12</p></li>' +
          '<li>3</li>' +
        '</ul>'
      );
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'P');
    });

    suite.test('Delete at block inside li element into li with block element', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
          '<li><p>1</p></li>' +
          '<li><p>2</p></li>' +
          '<li>3</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(1) p', 1);
      editor.plugins.lists.backspaceDelete(true);

      LegacyUnit.equal(
        editor.getContent(),
        '<ul>' +
          '<li><p>12</p></li>' +
          '<li>3</li>' +
        '</ul>'
      );
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'P');
    });

    suite.test('Delete at block inside li element into li with multiple block elements', function (editor) {
      editor.getBody().innerHTML = (
        '<ul>' +
          '<li>1</li>' +
          '<li><p>2</p><p>3</p></li>' +
          '<li>4</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(1)', 1);
      editor.plugins.lists.backspaceDelete(true);

      LegacyUnit.equal(
        editor.getContent(),
        '<ul>' +
          '<li>1<p>2</p><p>3</p></li>' +
          '<li>4</li>' +
        '</ul>'
      );
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
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
      content_style: '.mce-content-body { line-height: normal; }', // Breaks tests in phantomjs unless we have this
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);