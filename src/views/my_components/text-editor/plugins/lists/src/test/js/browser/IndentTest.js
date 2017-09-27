asynctest(
  'tinymce.lists.browser.IndentTest',
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

    suite.test('Indent single LI in OL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a</li>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li', 0);
      LegacyUnit.execCommand(editor, 'Indent');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a</li>' +
        '</ol>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Indent middle LI in OL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(2)', 0);
      LegacyUnit.execCommand(editor, 'Indent');

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


    suite.test('Indent single LI in OL and retain OLs list style in the new OL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol style="list-style-type: lower-alpha;">' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ol>'
      );

      editor.focus();

      LegacyUnit.setSelection(editor, 'li:nth-child(2)', 0);
      LegacyUnit.execCommand(editor, 'Indent');

      LegacyUnit.equal(editor.getContent(),
        '<ol style="list-style-type: lower-alpha;">' +
        '<li>a' +
        '<ol style="list-style-type: lower-alpha;">' +
        '<li>b</li>' +
        '</ol>' +
        '</li>' +
        '</ol>'
      );
    });

    suite.test('Indent last LI in OL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:last', 0);
      LegacyUnit.execCommand(editor, 'Indent');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a' +
        '<ol>' +
        '<li>b</li>' +
        '</ol>' +
        '</li>' +
        '</ol>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Indent last LI to same level as middle LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a' +
        '<ol>' +
        '<li>b</li>' +
        '</ol>' +
        '</li>' +
        '<li>c</li>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:last', 1);
      LegacyUnit.execCommand(editor, 'Indent');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a' +
        '<ol>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ol>' +
        '</li>' +
        '</ol>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Indent first LI and nested LI OL', function (editor) {
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
      LegacyUnit.setSelection(editor, 'li', 0, 'li li', 0);
      LegacyUnit.execCommand(editor, 'Indent');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a' +
        '<ol>' +
        '<li>b</li>' +
        '</ol>' +
        '</li>' +
        '</ol>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Indent second LI to same level as nested LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b' +
        '<ul>' +
        '<li>c</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(2)', 0);
      LegacyUnit.execCommand(editor, 'Indent');

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Indent second LI to same level as nested LI 2', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '</ul>' +
        '</li>' +
        '<li>cd' +
        '<ul>' +
        '<li>e</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(2)', 1);
      LegacyUnit.execCommand(editor, 'Indent');

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '<li>cd</li>' +
        '<li>e</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'LI');
    });

    suite.test('Indent second and third LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(2)', 0, 'li:last', 0);
      LegacyUnit.execCommand(editor, 'Indent');

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>' +
        '</li>' +
        '</ul>'
      );
    });

    suite.test('Indent second second li with next sibling to nested li', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b' +
        '<ul>' +
        '<li>c</li>' +
        '</ul>' +
        '</li>' +
        '<li>d</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'ul > li:nth-child(2)', 1);
      LegacyUnit.execCommand(editor, 'Indent');

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>' +
        '</li>' +
        '<li>d</li>' +
        '</ul>'
      );
    });

    suite.test('Indent on second li with inner block element', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li><p>a</p></li>' +
        '<li><p>b</p></li>' +
        '<li><p>c</p></li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'ul > li:nth-child(2) > p', 0);
      LegacyUnit.execCommand(editor, 'Indent');

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
          '<li>' +
            '<p>a</p>' +
            '<ul><li><p>b</p></li></ul>' +
          '</li>' +
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