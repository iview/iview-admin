asynctest(
  'tinymce.lists.browser.RemoveTest',
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

    suite.test('Remove UL at single LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li');
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        '<p>a</p>'
      );
      LegacyUnit.equal(editor.selection.getStart().nodeName, 'P');
    });

    suite.test('Remove UL at start LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li');
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        '<p>a</p>' +
        '<ul>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>'
      );
      LegacyUnit.equal(editor.selection.getStart().nodeName, 'P');
    });

    suite.test('Remove UL at start empty LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li><br></li>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li');
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        '<p>\u00a0</p>' +
        '<ul>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>'
      );
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'P');
    });

    suite.test('Remove UL at middle LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(2)', 1);
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '</ul>' +
        '<p>b</p>' +
        '<ul>' +
        '<li>c</li>' +
        '</ul>'
      );
      LegacyUnit.equal(editor.selection.getStart().nodeName, 'P');
    });

    suite.test('Remove UL at middle empty LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li><br></li>' +
        '<li>c</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:nth-child(2)', 0);
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '</ul>' +
        '<p>\u00a0</p>' +
        '<ul>' +
        '<li>c</li>' +
        '</ul>'
      );
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'P');
    });

    suite.test('Remove UL at end LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:last', 1);
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ul>' +
        '<p>c</p>'
      );
      LegacyUnit.equal(editor.selection.getStart().nodeName, 'P');
    });

    suite.test('Remove UL at end empty LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '<li><br></li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:last', 0);
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ul>' +
        '<p>\u00a0</p>'
      );
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'P');
    });

    suite.test('Remove UL at middle LI inside parent OL', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a</li>' +
        '<ul>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '<li>d</li>' +
        '</ul>' +
        '<li>e</li>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'ul li:nth-child(2)', 1);
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a</li>' +
        '<ul>' +
        '<li>b</li>' +
        '</ul>' +
        '</ol>' +
        '<p>c</p>' +
        '<ol>' +
        '<ul>' +
        '<li>d</li>' +
        '</ul>' +
        '<li>e</li>' +
        '</ol>'
      );
      LegacyUnit.equal(editor.selection.getStart().nodeName, 'P');
    });

    suite.test('Remove UL at middle LI inside parent OL (html5)', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '<li>c</li>' +
        '<li>d</li>' +
        '</ul>' +
        '</li>' +
        '<li>e</li>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'ul li:nth-child(2)', 1);
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '</ul>' +
        '</li>' +
        '</ol>' +
        '<p>c</p>' +
        '<ol>' +
        '<li style="list-style-type: none;">' +
        '<ul>' +
        '<li>d</li>' +
        '</ul>' +
        '</li>' +
        '<li>e</li>' +
        '</ol>'
      );
      LegacyUnit.equal(editor.selection.getStart().nodeName, 'P');
    });

    suite.test('Remove OL on a deep nested LI', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ol>' +
        '<li>a' +
        '<ol>' +
        '<li>b</li>' +
        '<li>c' +
        '<ol>' +
        '<li>d</li>' +
        '<li>e</li>' +
        '<li>f</li>' +
        '</ol>' +
        '</li>' +
        '<li>g</li>' +
        '<li>h</li>' +
        '</ol>' +
        '</li>' +
        '<li>i</li>' +
        '</ol>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'ol ol ol li:nth-child(2)', 1);
      LegacyUnit.execCommand(editor, 'InsertOrderedList');

      LegacyUnit.equal(editor.getContent(),
        '<ol>' +
        '<li>a' +
        '<ol>' +
        '<li>b</li>' +
        '<li>c' +
        '<ol>' +
        '<li>d</li>' +
        '</ol>' +
        '</li>' +
        '</ol>' +
        '</li>' +
        '</ol>' +
        '<p>e</p>' +
        '<ol>' +
        '<li style="list-style-type: none;">' +
        '<ol>' +
        '<li style="list-style-type: none;">' +
        '<ol>' +
        '<li>f</li>' +
        '</ol>' +
        '</li>' +
        '<li>g</li>' +
        '<li>h</li>' +
        '</ol>' +
        '</li>' +
        '<li>i</li>' +
        '</ol>'
      );

      LegacyUnit.equal(editor.selection.getStart().nodeName, 'P');
    });

    suite.test('Remove UL with single LI in BR mode', function (editor) {
      editor.settings.forced_root_block = false;

      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li', 1);
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        'a'
      );
      LegacyUnit.equal(editor.selection.getStart().nodeName, 'BODY');

      editor.settings.forced_root_block = 'p';
    });

    suite.test('Remove UL with multiple LI in BR mode', function (editor) {
      editor.settings.forced_root_block = false;

      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a</li>' +
        '<li>b</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:first', 1, 'li:last', 1);
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        'a<br />' +
        'b'
      );
      LegacyUnit.equal(editor.selection.getStart().nodeName, 'BODY');

      editor.settings.forced_root_block = 'p';
    });

    suite.test('Remove empty UL between two textblocks', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<div>a</div>' +
        '<ul>' +
        '<li></li>' +
        '</ul>' +
        '<div>b</div>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li:first', 0);
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        '<div>a</div>' +
        '<p>\u00a0</p>' +
        '<div>b</div>'
      );
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'P');
    });

    suite.test('Remove indented list with single item', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
        '<li>a' +
        '<ul>' +
        '<li>b</li>' +
        '</ul>' +
        '</li>' +
        '<li>c</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'li li', 0, 'li li', 1);
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '</ul>' +
        '<p>b</p>' +
        '<ul>' +
        '<li>c</li>' +
        '</ul>'
      );
      LegacyUnit.equal(editor.selection.getNode().nodeName, 'P');
    });

    suite.test('Remove indented list with multiple items', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
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

      editor.focus();
      LegacyUnit.setSelection(editor, 'li li:first', 0, 'li li:last', 1);
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
        '<li>a</li>' +
        '</ul>' +
        '<p>b</p>' +
        '<p>c</p>' +
        '<ul>' +
        '<li>d</li>' +
        '</ul>'
      );
      LegacyUnit.equal(editor.selection.getStart().firstChild.data, 'b');
      LegacyUnit.equal(editor.selection.getEnd().firstChild.data, 'c');
    });

    suite.test('Remove indented list with multiple items', function (editor) {
      editor.getBody().innerHTML = LegacyUnit.trimBrs(
        '<ul>' +
          '<li>a</li>' +
          '<li><p>b</p></li>' +
          '<li>c</li>' +
        '</ul>'
      );

      editor.focus();
      LegacyUnit.setSelection(editor, 'p', 0);
      LegacyUnit.execCommand(editor, 'InsertUnorderedList');

      LegacyUnit.equal(editor.getContent(),
        '<ul>' +
          '<li>a</li>' +
        '</ul>' +
        '<p>b</p>' +
        '<ul>' +
          '<li>c</li>' +
        '</ul>'
      );
    });

    // Ignore on IE 7, 8 this is a known bug not worth fixing
    if (!Env.ie || Env.ie > 8) {
      suite.test('Remove empty UL between two textblocks in BR mode', function (editor) {
        editor.settings.forced_root_block = false;

        editor.getBody().innerHTML = LegacyUnit.trimBrs(
          '<div>a</div>' +
          '<ul>' +
          '<li></li>' +
          '</ul>' +
          '<div>b</div>'
        );

        editor.focus();
        LegacyUnit.setSelection(editor, 'li:first', 0);
        LegacyUnit.execCommand(editor, 'InsertUnorderedList');

        LegacyUnit.equal(editor.getContent(),
          '<div>a</div>' +
          '<br />' +
          '<div>b</div>'
        );
        LegacyUnit.equal(editor.selection.getStart().nodeName, 'BR');

        editor.settings.forced_root_block = 'p';
      });
    }

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