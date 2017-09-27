asynctest(
  'browser.tinymce.plugins.table.NewCellRowEventsTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.table.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, LegacyUnit, TinyLoader, Plugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    Plugin();
    Theme();

    suite.test("Table newcell/newrow events", function (editor) {
      var cells = [], rows = [], counter = 0;

      editor.on('newcell', function (e) {
        cells.push(e.node);
        e.node.setAttribute('data-counter', counter++);
      });

      editor.on('newrow', function (e) {
        rows.push(e.node);
        e.node.setAttribute('data-counter', counter++);
      });

      editor.plugins.table.insertTable(2, 3);

      LegacyUnit.equal(cells.length, 6);
      LegacyUnit.equal(rows.length, 3);

      LegacyUnit.equal(cells[cells.length - 1].getAttribute('data-counter'), "8");
      LegacyUnit.equal(rows[rows.length - 1].getAttribute('data-counter'), "6");
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, suite.toSteps(editor), onSuccess, onFailure);
    }, {
      plugins: 'table',
      indent: false,
      valid_styles: {
        '*': 'width,height,vertical-align,text-align,float,border-color,background-color,border,padding,border-spacing,border-collapse'
      },
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
