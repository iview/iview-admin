asynctest(
  'tinymce.lists.browser.ApplyTest',
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

    suite.test('Apply DL list to multiple Ps', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<p>a</p>' +
        '<p>b</p>' +
        '<p>c</p>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'p', 0, 'p:last', 0);
      LegacyUnit.execCommand(editor, 'InsertDefinitionList');

      LegacyUnit.equal(editor.getContent(),
        '<dl>' +
        '<dt>a</dt>' +
        '<dt>b</dt>' +
        '<dt>c</dt>' +
        '</dl>'
      );
      LegacyUnit.equal(editor.selection.getStart().nodeName, 'DT');
    });

    suite.test('Apply OL list to single P', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<p>a</p>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'p', 0);
      LegacyUnit.execCommand(editor, 'InsertDefinitionList');

      LegacyUnit.equal(editor.getContent(), '<dl><dt>a</dt></dl>');
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'DT');
    });

    suite.test('Apply DL to P and merge with adjacent lists', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<dl>' +
        '<dt>a</dt>' +
        '</dl>' +
        '<p>b</p>' +
        '<dl>' +
        '<dt>c</dt>' +
        '</dl>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'p', 1);
      LegacyUnit.execCommand(editor, 'InsertDefinitionList');

      LegacyUnit.equal(editor.getContent(),
        '<dl>' +
        '<dt>a</dt>' +
        '<dt>b</dt>' +
        '<dt>c</dt>' +
        '</dl>'
      );
      LegacyUnit.equal(editor.selection.getStart().nodeName, 'DT');
    });

    suite.test('Indent single DT in DL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<dl>' +
        '<dt>a</dt>' +
        '</dl>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'dt', 0);
      LegacyUnit.execCommand(editor, 'Indent');

      LegacyUnit.equal(editor.getContent(),
        '<dl>' +
        '<dd>a</dd>' +
        '</dl>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'DD');
    });

    suite.test('Outdent single DD in DL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<dl>' +
        '<dd>a</dd>' +
        '</dl>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'dd', 1);
      LegacyUnit.execCommand(editor, 'Outdent');

      LegacyUnit.equal(editor.getContent(),
        '<dl>' +
        '<dt>a</dt>' +
        '</dl>'
      );

      LegacyUnit.equal(editor.selection.getNode().nodeName, 'DT');
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