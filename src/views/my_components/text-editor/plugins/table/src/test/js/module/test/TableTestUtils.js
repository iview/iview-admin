define(
  'tinymce.plugins.table.test.TableTestUtils',
  [
    'ephox.agar.api.Chain',
    'ephox.agar.api.Cursors',
    'ephox.agar.api.Mouse',
    'ephox.agar.api.UiFinder',
    'ephox.mcagar.api.TinyDom'
  ],
  function (Chain, Cursors, Mouse, UiFinder, TinyDom) {

    var sOpenToolbarOn = function (editor, selector, path) {
      return Chain.asStep(TinyDom.fromDom(editor.getBody()), [
        UiFinder.cFindIn(selector),
        Cursors.cFollow(path),
        Chain.op(function (target) {
          editor.selection.select(target.dom());
        }),
        Mouse.cClick
      ]);
    };

    return {
      sOpenToolbarOn: sOpenToolbarOn
    };
  }
);
