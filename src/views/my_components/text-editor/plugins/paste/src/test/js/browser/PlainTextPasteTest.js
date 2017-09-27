asynctest(
  'tinymce.plugins.paste.browser.PlainTextPaste', [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.Guard',
    'ephox.agar.api.Keyboard',
    'ephox.agar.api.Pipeline',
    'ephox.katamari.api.Id',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Obj',
    'ephox.sugar.api.node.Element',
    'global!setTimeout',
    'tinymce.core.EditorManager',
    'tinymce.core.test.ViewBlock',
    'tinymce.plugins.paste.Plugin',
    'tinymce.plugins.paste.test.MockDataTransfer',
    'tinymce.themes.modern.Theme'
  ],
  function (Assertions, Chain, Guard, Keyboard, Pipeline, Id, Merger, Obj, Element, setTimeout, EditorManager, ViewBlock, PastePlugin, MockDataTransfer, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    var viewBlock = new ViewBlock();

    var cCreateEditorFromSettings = function (settings, html) {
      return Chain.on(function (viewBlock, next, die) {
        var randomId = Id.generate('tiny-');
        html = html || '<textarea></textarea>';

        viewBlock.update(html);
        viewBlock.get().firstChild.id = randomId;

        EditorManager.init(Merger.merge(settings, {
          selector: '#' + randomId,
          skin_url: '/project/src/skins/lightgray/dist/lightgray',
          indent: false,
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

    var cRemoveEditor = function () {
      return Chain.op(function (editor) {
        editor.remove();
      });
    };


    var cClearEditor = function () {
      return Chain.on(function (editor, next, die) {
        editor.setContent("");
        next(Chain.wrap(editor));
      });
    };


    var cFireFakePasteEvent = function (data) {
      return Chain.on(function (editor, next, die) {
        editor.fire('paste', { clipboardData: MockDataTransfer.create(data) });
        next(Chain.wrap(editor));
      });
    };


    var cAssertEditorContent = function (label, expected) {
      return Chain.on(function (editor, next, die) {
        Assertions.assertHtml(label || "Asserting editors content", expected, editor.getContent());
        next(Chain.wrap(editor));
      });
    };


    var cAssertClipboardPaste = function (expected, data) {
      var chains = [];

      Obj.each(data, function (data, label) {
        chains.push(
          cFireFakePasteEvent(data),
          Chain.control(
            cAssertEditorContent(label, expected),
            Guard.tryUntil('Wait for paste to succeed.', 100, 1000)
          ),
          cClearEditor()
        );
      });

      return Chain.fromChains(chains);
    };


    var srcText = 'one\r\ntwo\r\n\r\nthree\r\n\r\n\r\nfour\r\n\r\n\r\n\r\n.';

    var pasteData = {
      'Firefox': {
        'text/plain': srcText,
        'text/html': 'one<br>two<br><br>three<br><br><br>four<br><br><br><br>.'
      },
      'Chrome': {
        'text/plain': srcText,
        'text/html': '<div>one</div><div>two</div><div><br></div><div>three</div><div><br></div><div><br></div><div>four</div><div><br></div><div><br></div><div><br></div><div>.'
      },
      'Edge': {
        'text/plain': srcText,
        'text/html': '<div>one<br>two</div><div>three</div><div><br>four</div><div><br></div><div>.</div>'
      },
      'IE': {
        'text/plain': srcText,
        'text/html': '<p>one<br>two</p><p>three</p><p><br>four</p><p><br></p><p>.</p>'
      }
    };

    var expectedWithRootBlock = '<p>one<br />two</p><p>three</p><p><br />four</p><p>&nbsp;</p><p>.</p>';
    var expectedWithRootBlockAndAttrs = '<p class="attr">one<br />two</p><p class="attr">three</p><p class="attr"><br />four</p><p class="attr">&nbsp;</p><p class="attr">.</p>';
    var expectedWithoutRootBlock = 'one<br />two<br /><br />three<br /><br /><br />four<br /><br /><br /><br />.';


    Theme();
    PastePlugin();

    viewBlock.attach();

    Pipeline.async({}, [
      Chain.asStep(viewBlock, [
        cCreateEditorFromSettings({
          plugins: 'paste',
          forced_root_block: 'p' // default
        }),
        cAssertClipboardPaste(expectedWithRootBlock, pasteData),
        cRemoveEditor()
      ]),
      Chain.asStep(viewBlock, [
        cCreateEditorFromSettings({
          plugins: 'paste',
          forced_root_block: 'p',
          forced_root_block_attrs: {
            'class': 'attr'
          }
        }),
        cAssertClipboardPaste(expectedWithRootBlockAndAttrs, pasteData),
        cRemoveEditor()
      ]),
      Chain.asStep(viewBlock, [
        cCreateEditorFromSettings({
          plugins: 'paste',
          forced_root_block: false
        }),
        cAssertClipboardPaste(expectedWithoutRootBlock, pasteData),
        cRemoveEditor()
      ])
    ], function () {
      viewBlock.detach();
      success();
    }, failure);
  }
);