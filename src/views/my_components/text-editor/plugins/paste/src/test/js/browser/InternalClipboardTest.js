asynctest(
  'browser.tinymce.plugins.paste.InternalClipboardTest',
  [
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.RawAssertions',
    'ephox.agar.api.Step',
    'ephox.agar.api.Waiter',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.paste.core.CutCopy',
    'tinymce.plugins.paste.core.InternalHtml',
    'tinymce.plugins.paste.core.Utils',
    'tinymce.plugins.paste.Plugin',
    'tinymce.plugins.paste.test.MockDataTransfer',
    'tinymce.themes.modern.Theme'
  ],
  function (
    GeneralSteps, Logger, Pipeline, RawAssertions, Step, Waiter, TinyApis, TinyLoader,
    CutCopy, InternalHtml, Utils, Plugin, MockDataTransfer, Theme
  ) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var dataTransfer, lastPreProcessEvent, lastPostProcessEvent;

    Plugin();
    Theme();

    var sResetProcessEvents = Step.sync(function () {
      lastPreProcessEvent = null;
      lastPostProcessEvent = null;
    });

    var sCutCopyDataTransferEvent = function (editor, type) {
      return Step.sync(function () {
        dataTransfer = MockDataTransfer.create({});
        editor.fire(type, { clipboardData: dataTransfer });
      });
    };

    var sPasteDataTransferEvent = function (editor, data) {
      return Step.sync(function () {
        dataTransfer = MockDataTransfer.create(data);
        editor.fire('paste', { clipboardData: dataTransfer });
      });
    };

    var sAssertClipboardData = function (expectedHtml, expectedText) {
      return Step.sync(function () {
        RawAssertions.assertEq('text/html data should match', expectedHtml, dataTransfer.getData('text/html'));
        RawAssertions.assertEq('text/plain data should match', expectedText, dataTransfer.getData('text/plain'));
      });
    };

    var sCopy = function (editor, tinyApis, html, spath, soffset, fpath, foffset) {
      return GeneralSteps.sequence([
        tinyApis.sSetContent(html),
        tinyApis.sSetSelection(spath, soffset, fpath, foffset),
        sCutCopyDataTransferEvent(editor, 'copy')
      ]);
    };

    var sCut = function (editor, tinyApis, html, spath, soffset, fpath, foffset) {
      return GeneralSteps.sequence([
        tinyApis.sSetContent(html),
        tinyApis.sSetSelection(spath, soffset, fpath, foffset),
        sCutCopyDataTransferEvent(editor, 'cut')
      ]);
    };

    var sPaste = function (editor, tinyApis, startHtml, pasteData, spath, soffset, fpath, foffset) {
      return GeneralSteps.sequence([
        tinyApis.sSetContent(startHtml),
        tinyApis.sSetSelection(spath, soffset, fpath, foffset),
        sResetProcessEvents,
        sPasteDataTransferEvent(editor, pasteData)
      ]);
    };

    var sTestCopy = function (editor, tinyApis) {
      return Logger.t('Copy tests', GeneralSteps.sequence([
        Logger.t('Copy simple text', GeneralSteps.sequence([
          sCopy(editor, tinyApis, '<p>text</p>', [0, 0], 0, [0, 0], 4),
          sAssertClipboardData('text', 'text'),
          tinyApis.sAssertContent('<p>text</p>'),
          tinyApis.sAssertSelection([0, 0], 0, [0, 0], 4)
        ])),

        Logger.t('Copy inline elements', GeneralSteps.sequence([
          sCopy(editor, tinyApis, '<p>te<em>x</em>t</p>', [0, 0], 0, [0, 2], 1),
          sAssertClipboardData('te<em>x</em>t', 'text'),
          tinyApis.sAssertContent('<p>te<em>x</em>t</p>'),
          tinyApis.sAssertSelection([0, 0], 0, [0, 2], 1)
        ])),

        Logger.t('Copy partialy selected inline elements', GeneralSteps.sequence([
          sCopy(editor, tinyApis, '<p>a<em>cd</em>e</p>', [0, 0], 0, [0, 1, 0], 1),
          sAssertClipboardData('a<em>c</em>', 'ac'),
          tinyApis.sAssertContent('<p>a<em>cd</em>e</p>'),
          tinyApis.sAssertSelection([0, 0], 0, [0, 1, 0], 1)
        ])),

        Logger.t('Copy collapsed selection', GeneralSteps.sequence([
          sCopy(editor, tinyApis, '<p>abc</p>', [0, 0], 1, [0, 0], 1),
          sAssertClipboardData('', ''),
          tinyApis.sAssertContent('<p>abc</p>'),
          tinyApis.sAssertSelection([0, 0], 1, [0, 0], 1)
        ]))
      ]));
    };

    var sTestCut = function (editor, tinyApis) {
      var sWaitUntilAssertContent = function (expected) {
        return Waiter.sTryUntil('Cut is async now, so need to wait for content', tinyApis.sAssertContent(expected), 100, 1000);
      };

      return Logger.t('Cut tests', GeneralSteps.sequence([
        Logger.t('Cut simple text', GeneralSteps.sequence([
          sCut(editor, tinyApis, '<p>text</p>', [0, 0], 0, [0, 0], 4),
          sAssertClipboardData('text', 'text'),
          sWaitUntilAssertContent(''),
          tinyApis.sAssertSelection([0], 0, [0], 0)
        ])),

        Logger.t('Cut inline elements', GeneralSteps.sequence([
          sCut(editor, tinyApis, '<p>te<em>x</em>t</p>', [0, 0], 0, [0, 2], 1),
          sAssertClipboardData('te<em>x</em>t', 'text'),
          sWaitUntilAssertContent(''),
          tinyApis.sAssertSelection([0], 0, [0], 0)
        ])),

        Logger.t('Cut partialy selected inline elements', GeneralSteps.sequence([
          sCut(editor, tinyApis, '<p>a<em>cd</em>e</p>', [0, 0], 0, [0, 1, 0], 1),
          sAssertClipboardData('a<em>c</em>', 'ac'),
          sWaitUntilAssertContent('<p><em>d</em>e</p>'),
          tinyApis.sAssertSelection([0, 0, 0], 0, [0, 0, 0], 0)
        ])),

        Logger.t('Cut collapsed selection', GeneralSteps.sequence([
          sCut(editor, tinyApis, '<p>abc</p>', [0, 0], 1, [0, 0], 1),
          sAssertClipboardData('', ''),
          sWaitUntilAssertContent('<p>abc</p>'),
          tinyApis.sAssertSelection([0, 0], 1, [0, 0], 1)
        ]))
      ]));
    };

    var sAssertLastPreProcessEvent = function (expectedData) {
      return Step.sync(function () {
        RawAssertions.assertEq('Internal property should be equal', expectedData.internal, lastPreProcessEvent.internal);
        RawAssertions.assertEq('Content property should be equal', expectedData.content, lastPreProcessEvent.content);
      });
    };

    var sAssertLastPostProcessEvent = function (expectedData) {
      return Step.sync(function () {
        RawAssertions.assertEq('Internal property should be equal', expectedData.internal, lastPostProcessEvent.internal);
        RawAssertions.assertEq('Content property should be equal', expectedData.content, lastPostProcessEvent.node.innerHTML);
      });
    };

    var sWaitForProcessEvents = Waiter.sTryUntil('Did not get any events fired', Step.sync(function () {
      RawAssertions.assertEq('PastePreProcess event object', lastPreProcessEvent !== null, true);
      RawAssertions.assertEq('PastePostProcess event object', lastPostProcessEvent !== null, true);
    }), 100, 100);

    var sTestPaste = function (editor, tinyApis) {
      return Logger.t('Paste tests', GeneralSteps.sequence([
        Logger.t('Paste external content', GeneralSteps.sequence([
          sPaste(editor, tinyApis, '<p>abc</p>', { 'text/plain': 'X', 'text/html': '<p>X</p>' }, [0, 0], 0, [0, 0], 3),
          sWaitForProcessEvents,
          sAssertLastPreProcessEvent({ internal: false, content: 'X' }),
          sAssertLastPostProcessEvent({ internal: false, content: 'X' })
        ])),

        Logger.t('Paste external content treated as plain text', GeneralSteps.sequence([
          sPaste(editor, tinyApis, '<p>abc</p>', { 'text/html': '<p>X</p>' }, [0, 0], 0, [0, 0], 3),
          sWaitForProcessEvents,
          sAssertLastPreProcessEvent({ internal: false, content: 'X' }),
          sAssertLastPostProcessEvent({ internal: false, content: 'X' })
        ])),

        Logger.t('Paste internal content with mark', GeneralSteps.sequence([
          sPaste(editor, tinyApis, '<p>abc</p>', { 'text/plain': 'X', 'text/html': InternalHtml.mark('<p>X</p>') }, [0, 0], 0, [0, 0], 3),
          sWaitForProcessEvents,
          sAssertLastPreProcessEvent({ internal: true, content: '<p>X</p>' }),
          sAssertLastPostProcessEvent({ internal: true, content: '<p>X</p>' })
        ])),

        Logger.t('Paste internal content with mime', GeneralSteps.sequence([
          sPaste(editor, tinyApis, '<p>abc</p>',
            { 'text/plain': 'X', 'text/html': '<p>X</p>', 'x-tinymce/html': '<p>X</p>' },
            [0, 0], 0, [0, 0], 3
          ),
          sWaitForProcessEvents,
          sAssertLastPreProcessEvent({ internal: true, content: '<p>X</p>' }),
          sAssertLastPostProcessEvent({ internal: true, content: '<p>X</p>' })
        ]))
      ]));
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);

      // Disabled tests on Edge 15 due to broken clipboard API
      Pipeline.async({}, Utils.isMsEdge() ? [ ] : [
        sTestCopy(editor, tinyApis),
        sTestCut(editor, tinyApis),
        sTestPaste(editor, tinyApis)
      ], onSuccess, onFailure);
    }, {
      plugins: 'paste',
      init_instance_callback: function (editor) {
        editor.on('PastePreProcess', function (evt) {
          lastPreProcessEvent = evt;
        });

        editor.on('PastePostProcess', function (evt) {
          lastPostProcessEvent = evt;
        });
      },
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
