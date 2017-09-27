asynctest(
  'browser.tinymce.plugins.lists.AdvlistPluginTest',
  [
    'tinymce.plugins.advlist.Plugin',
    'tinymce.plugins.lists.Plugin',
    'tinymce.themes.modern.Theme',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'ephox.agar.api.Pipeline'
  ],
  function (
    AdvListPlugin, ListsPlugin, ModernTheme, LegacyUnit, TinyLoader, Pipeline
  ) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    AdvListPlugin();
    ListsPlugin();
    ModernTheme();

    var listStyleTest = function (title, definition) {
      suite.test(title, function (editor) {
        editor.getBody().innerHTML = definition.inputContent;
        LegacyUnit.setSelection(editor, definition.inputSelection[0], definition.inputSelection[1]);
        editor.execCommand(definition.command, false, { 'list-style-type': definition.listType });
        var rng = editor.selection.getRng(true);
        var expectedElm = editor.dom.select(definition.expectedSelection[0])[0];

        LegacyUnit.equal(editor.getContent(), definition.expectedContent, 'Editor content should be equal');
        LegacyUnit.equalDom(rng.startContainer.parentNode, expectedElm, 'Selection elements should be equal');
        LegacyUnit.equal(rng.startOffset, definition.expectedSelection[1], 'Selection offset should be equal');
      });
    };

    listStyleTest('Apply unordered list style to an unordered list', {
      inputContent: '<ul><li>a</li></ul>',
      inputSelection: ['li:nth-child(1)', 0],
      command: 'ApplyUnorderedListStyle',
      listType: 'disc',
      expectedContent: '<ul style="list-style-type: disc;"><li>a</li></ul>',
      expectedSelection: ['li:nth-child(1)', 0]
    });

    listStyleTest('Apply ordered list style to an ordered list', {
      inputContent: '<ol><li>a</li></ol>',
      inputSelection: ['li:nth-child(1)', 0],
      command: 'ApplyOrderedListStyle',
      listType: 'lower-roman',
      expectedContent: '<ol style="list-style-type: lower-roman;"><li>a</li></ol>',
      expectedSelection: ['li:nth-child(1)', 0]
    });

    listStyleTest('Apply unordered list style to an unordered list', {
      inputContent: '<ol><li>a</li></ol>',
      inputSelection: ['li:nth-child(1)', 0],
      command: 'ApplyUnorderedListStyle',
      listType: 'disc',
      expectedContent: '<ul style="list-style-type: disc;"><li>a</li></ul>',
      expectedSelection: ['li:nth-child(1)', 0]
    });

    listStyleTest('Apply unordered list style to an unordered list with a child unordered list', {
      inputContent: '<ul><li>a<ul><li>b</li></ul></li></ul>',
      inputSelection: ['li:nth-child(1)', 0],
      command: 'ApplyUnorderedListStyle',
      listType: 'disc',
      expectedContent: '<ul style="list-style-type: disc;"><li>a<ul><li>b</li></ul></li></ul>',
      expectedSelection: ['li:nth-child(1)', 0]
    });

    listStyleTest('Apply ordered list style to an ordered list with a child ordered list', {
      inputContent: '<ol><li>a<ol><li>b</li></ol></li></ol>',
      inputSelection: ['li:nth-child(1)', 0],
      command: 'ApplyOrderedListStyle',
      listType: 'lower-roman',
      expectedContent: '<ol style="list-style-type: lower-roman;"><li>a<ol><li>b</li></ol></li></ol>',
      expectedSelection: ['li:nth-child(1)', 0]
    });

    listStyleTest('Apply unordered list style to an unordered list with a child ordered list', {
      inputContent: '<ul><li>a<ol><li>b</li></ol></li></ul>',
      inputSelection: ['li:nth-child(1)', 0],
      command: 'ApplyUnorderedListStyle',
      listType: 'disc',
      expectedContent: '<ul style="list-style-type: disc;"><li>a<ol><li>b</li></ol></li></ul>',
      expectedSelection: ['li:nth-child(1)', 0]
    });

    listStyleTest('Apply ordered list style to an unordered list with a child unordered list', {
      inputContent: '<ol><li>a<ul><li>b</li></ul></li></ol>',
      inputSelection: ['li:nth-child(1)', 0],
      command: 'ApplyOrderedListStyle',
      listType: 'lower-roman',
      expectedContent: '<ol style="list-style-type: lower-roman;"><li>a<ul><li>b</li></ul></li></ol>',
      expectedSelection: ['li:nth-child(1)', 0]
    });

    listStyleTest('Apply unordered list style to an unordered list with a child unordered list', {
      inputContent: '<ul><li>a<ul><li>b</li></ul></li></ul>',
      inputSelection: ['li:nth-child(1) > ul > li:nth-child(1)', 0],
      command: 'ApplyUnorderedListStyle',
      listType: 'disc',
      expectedContent: '<ul><li>a<ul style="list-style-type: disc;"><li>b</li></ul></li></ul>',
      expectedSelection: ['li:nth-child(1) > ul > li:nth-child(1)', 0]
    });

    listStyleTest('Apply ordered list style to an ordered list with a child ordered list', {
      inputContent: '<ol><li>a<ol><li>b</li></ol></li></ol>',
      inputSelection: ['li:nth-child(1) > ol > li:nth-child(1)', 0],
      command: 'ApplyOrderedListStyle',
      listType: 'lower-roman',
      expectedContent: '<ol><li>a<ol style="list-style-type: lower-roman;"><li>b</li></ol></li></ol>',
      expectedSelection: ['li:nth-child(1) > ol > li:nth-child(1)', 0]
    });

    listStyleTest('Apply ordered list style to an unordered list with a child ordered list', {
      inputContent: '<ul><li>a<ol><li>b</li></ol></li></ul>',
      inputSelection: ['li:nth-child(1) > ol > li:nth-child(1)', 0],
      command: 'ApplyOrderedListStyle',
      listType: 'lower-roman',
      expectedContent: '<ul><li>a<ol style="list-style-type: lower-roman;"><li>b</li></ol></li></ul>',
      expectedSelection: ['li:nth-child(1) > ol > li:nth-child(1)', 0]
    });

    listStyleTest('Apply unordered list style to ordered list with a child unordered list', {
      inputContent: '<ol><li>a<ul><li>b</li></ul></li></ol>',
      inputSelection: ['li:nth-child(1) > ul > li:nth-child(1)', 0],
      command: 'ApplyUnorderedListStyle',
      listType: 'disc',
      expectedContent: '<ol><li>a<ul style="list-style-type: disc;"><li>b</li></ul></li></ol>',
      expectedSelection: ['li:nth-child(1) > ul > li:nth-child(1)', 0]
    });

    listStyleTest('Apply ordered list style to an unordered list with a child ordered list', {
      inputContent: '<ul><li>a<ol><li>b</li></ol></li></ul>',
      inputSelection: ['li:nth-child(1)', 0],
      command: 'ApplyOrderedListStyle',
      listType: false,
      expectedContent: '<ol><li>a<ol><li>b</li></ol></li></ol>',
      expectedSelection: ['li:nth-child(1)', 0]
    });

    listStyleTest('Apply unordered list style to an ordered list with a child unordered list', {
      inputContent: '<ol><li>a<ul><li>b</li></ul></li></ol>',
      inputSelection: ['li:nth-child(1)', 0],
      command: 'ApplyUnorderedListStyle',
      listType: false,
      expectedContent: '<ul><li>a<ul><li>b</li></ul></li></ul>',
      expectedSelection: ['li:nth-child(1)', 0]
    });

    listStyleTest('Apply ordered list style "false" to an ordered list with a child unordered list', {
      inputContent: '<ol><li>a<ul><li>b</li></ul></li></ol>',
      inputSelection: ['li:nth-child(1)', 0],
      command: 'ApplyOrderedListStyle',
      listType: false,
      expectedContent: '<p>a</p><ul><li>b</li></ul>',
      expectedSelection: ['p:nth-child(1)', 0]
    });

    listStyleTest('Apply unordered list style "false" to an unordered list with a child ordered list', {
      inputContent: '<ul><li>a<ol><li>b</li></ol></li></ul>',
      inputSelection: ['li:nth-child(1)', 0],
      command: 'ApplyUnorderedListStyle',
      listType: false,
      expectedContent: '<p>a</p><ol><li>b</li></ol>',
      expectedSelection: ['p:nth-child(1)', 0]
    });

    listStyleTest('Apply unordered list style "false" to an ordered list with a child ordered list', {
      inputContent: '<ol><li>a<ol><li>b</li></ol></li></ol>',
      inputSelection: ['li:nth-child(1)', 0],
      command: 'ApplyUnorderedListStyle',
      listType: false,
      expectedContent: '<ul><li>a<ol><li>b</li></ol></li></ul>',
      expectedSelection: ['li:nth-child(1)', 0]
    });

    listStyleTest('Apply ordered list style "false" to an unordered list with a child unordered list', {
      inputContent: '<ul><li>a<ul><li>b</li></ul></li></ul>',
      inputSelection: ['li:nth-child(1)', 0],
      command: 'ApplyOrderedListStyle',
      listType: false,
      expectedContent: '<ol><li>a<ul><li>b</li></ul></li></ol>',
      expectedSelection: ['li:nth-child(1)', 0]
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, suite.toSteps(editor), onSuccess, onFailure);
    }, {
      plugins: "advlist lists",
      add_unload_trigger: false,
      indent: false,
      entities: 'raw',
      valid_elements: 'li[style],ol[style],ul[style],dl,dt,dd,em,strong,span,#p,div,br',
      valid_styles: {
        '*': 'list-style-type'
      },
      disable_nodechange: true,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);