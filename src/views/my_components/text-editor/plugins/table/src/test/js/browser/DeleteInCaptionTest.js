asynctest(
  'browser.tinymce.plugins.table.DeleteInCaptionTest',
  [
    'ephox.sugar.api.node.Element',
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Step',
    'ephox.agar.api.GeneralSteps',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.table.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Element, Assertions, Pipeline, Logger, Step, GeneralSteps, TinyActions, TinyApis, TinyLoader, Plugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    Plugin();
    Theme();

    var tableWith = function (captionHtml) {
      return '<table>' + captionHtml + '<tbody><tr><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>';
    };


    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var api = TinyApis(editor);
      var act = TinyActions(editor);

      var DELETE = 46;
      var BACKSPACE = 8;

      var sAssertDefaultPreventedAfter = function (keyCode) {
        return Step.async(function (next, die) {
          editor.on('keydown', function onKeyDown(e) {
            if (e.keyCode === keyCode) {
              editor.off('keydown', onKeyDown);
              Assertions.assertEq("Asserting for equality", e.isDefaultPrevented(), true);
              next();
            }
          });

          editor.fire('keydown', { keyCode: keyCode });
        });
      };

      // IE appends extra <p>&nbsp;</p> around the table, hence this
      var sAssertContent = function (content, extractRe) {
        extractRe = extractRe || /(<table[\s\S]+?<\/table>)/;

        var extract = function (html) {
          var m = html.match(extractRe);
          return m ? m[1] : content;
        };

        return Step.sync(function () {
          Assertions.assertHtml("Asserting TinyMCE content", content, extract(editor.getContent()));
        });
      };

      Pipeline.async({}, [
        Logger.t('simulate result of the triple click (selection beyond caption)', GeneralSteps.sequence([
          api.sSetContent(tableWith('<caption>one two three</caption>')),
          api.sSetSelection([0, 0, 0], 0, [0, 1, 0, 0], 0),
          act.sContentKeystroke(DELETE, {}),
          sAssertContent(tableWith('<caption>&nbsp;</caption>'))
        ])),

        Logger.t('test for cursor springing off in IE', GeneralSteps.sequence([
          api.sAssertSelection([0, 0, 0], 0, [0, 0, 0], 0)
        ])),

        Logger.t('test deletion at the left edge (chrome)', GeneralSteps.sequence([
          api.sSetContent(tableWith('<caption>one</caption>')),
          api.sSetCursor([0, 0, 0], 0),
          sAssertDefaultPreventedAfter(BACKSPACE),
          sAssertContent(tableWith('<caption>one</caption>'))
        ])),

        Logger.t('test deletion at the right edge', GeneralSteps.sequence([
          api.sSetContent(tableWith('<caption>one</caption>')),
          api.sSetCursor([0, 0, 0], 3),
          act.sContentKeystroke(DELETE, {}),
          sAssertContent(tableWith('<caption>one</caption>'))
        ])),

        Logger.t('test for caret in caption with blocks', GeneralSteps.sequence([
          api.sSetContent(tableWith('<caption><p>one</p></caption>')),
          api.sSetCursor([0, 0, 0, 0], 1),
          act.sContentKeystroke(DELETE, {}),
          Assertions.sAssertPresence("Detect block caret container", { 'caption > p[data-mce-caret="after"]': 1 }, Element.fromDom(editor.getBody()))
        ])),

        Logger.t('debris like empty nodes and brs constitute an empty caption', GeneralSteps.sequence([
          api.sSetContent(tableWith('<caption><p><br></p><p data-mce-caret="after" data-mce-bogus="all"><br data-mce-bogus="1"></p></caption>')),
          api.sSetCursor([0, 0], 0),
          act.sContentKeystroke(DELETE, {}),
          sAssertContent(tableWith('<caption>&nbsp;</caption>'))
        ]))
      ], onSuccess, onFailure);

    }, {
      plugins: 'table',
      indent: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
