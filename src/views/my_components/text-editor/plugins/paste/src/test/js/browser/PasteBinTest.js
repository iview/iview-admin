asynctest(
  'tinymce.plugins.paste.browser.PasteBin', [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.Pipeline',
    'ephox.katamari.api.Id',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Obj',
    'ephox.mcagar.api.TinyLoader',
    'global!setTimeout',
    'tinymce.core.EditorManager',
    'tinymce.core.test.ViewBlock',
    'tinymce.plugins.paste.core.PasteBin',
    'tinymce.plugins.paste.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Assertions, Chain, Pipeline, Id, Merger, Obj, TinyLoader, setTimeout, EditorManager, ViewBlock, PasteBin, PastePlugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    Theme();
    PastePlugin();

    var cases = [
      {
        label: "TINY-1162: testing nested paste bins",
        content: '<div id="mcepastebin" contenteditable="true" data-mce-bogus="all" data-mce-style="position: absolute; top: 0.40000057220458984px;width: 10px; height: 10px; overflow: hidden; opacity: 0" style="position: absolute; top: 0.40000057220458984px;width: 10px; height: 10px; overflow: hidden; opacity: 0"><div id="mcepastebin" data-mce-bogus="all" data-mce-style="position: absolute; top: 0.40000057220458984px;width: 10px; height: 10px; overflow: hidden; opacity: 0" style="position: absolute; top: 0.40000057220458984px;width: 10px; height: 10px; overflow: hidden; opacity: 0">a</div><div id="mcepastebin" data-mce-bogus="all" data-mce-style="position: absolute; top: 0.40000057220458984px;width: 10px; height: 10px; overflow: hidden; opacity: 0" style="position: absolute; top: 0.40000057220458984px;width: 10px; height: 10px; overflow: hidden; opacity: 0">b</div></div>',
        result: '<div>a</div><div>b</div>'
      },
      {
        label: "TINY-1162: testing adjacent paste bins",
        content: '<div id="mcepastebin" contenteditable="true" data-mce-bogus="all" data-mce-style="position: absolute; top: 0.40000057220458984px;width: 10px; height: 10px; overflow: hidden; opacity: 0" style="position: absolute; top: 0.40000057220458984px;width: 10px; height: 10px; overflow: hidden; opacity: 0"><p>a</p><p>b</p></div><div id="mcepastebin" contenteditable="true" data-mce-bogus="all" data-mce-style="position: absolute; top: 0.40000057220458984px;width: 10px; height: 10px; overflow: hidden; opacity: 0" style="position: absolute; top: 0.40000057220458984px;width: 10px; height: 10px; overflow: hidden; opacity: 0"><p>c</p></div>',
        result: '<p>a</p><p>b</p><p>c</p>'
      }
    ];

    var viewBlock = new ViewBlock();

    var cCreateEditorFromSettings = function (settings, html) {
      return Chain.on(function (viewBlock, next, die) {
        var randomId = Id.generate('tiny');
        html = html || '<textarea></textarea>';

        viewBlock.update(html);
        viewBlock.get().firstChild.id = randomId;

        EditorManager.init(Merger.merge(settings || {}, {
          selector: '#' + randomId,
          add_unload_trigger: false,
          indent: false,
          plugins: 'paste',
          skin_url: '/project/src/skins/lightgray/dist/lightgray',
          setup: function (editor) {
            editor.on('SkinLoaded', function () {
              setTimeout(function () {
                next(Chain.wrap(editor));
              }, 0);
            });
          }
        }));
      });
    };

    var cCreateEditorFromHtml = function (html, settings) {
      return cCreateEditorFromSettings(settings, html);
    };

    var cRemoveEditor = function () {
      return Chain.op(function (editor) {
        editor.remove();
      });
    };

    var cAssertCases = function (cases) {
      return Chain.op(function (editor) {
        var pasteBin = new PasteBin(editor);
        Obj.each(cases, function (c, i) {
          editor.getBody().innerHTML = c.content;
          Assertions.assertEq(c.label || "Asserting paste bin case " + i, c.result, pasteBin.getHtml());
          pasteBin.remove();
        });
      });
    };

    viewBlock.attach();

    Pipeline.async({}, [
      Chain.asStep(viewBlock, [
        cCreateEditorFromSettings(),
        cAssertCases(cases),
        cRemoveEditor()
      ]),

      // TINY-1208/TINY-1209: same cases, but for inline editor
      Chain.asStep(viewBlock, [
        cCreateEditorFromHtml('<div>some text</div>', { inline: true }),
        cAssertCases(cases),
        cRemoveEditor()
      ])
    ], function () {
      viewBlock.detach();
      success();
    }, failure);
  }
);