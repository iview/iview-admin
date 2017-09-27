asynctest(
  'browser.tinymce.plugins.template.DatesTest',

  [
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.template.Plugin',
    'tinymce.themes.modern.Theme'
  ],

  function (GeneralSteps, Logger, Pipeline, Step, TinyApis, TinyLoader, TinyUi, TemplatePlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TemplatePlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);

      var sDeleteSetting = function (key) {
        return Step.sync(function () {
          delete editor.settings[key];
        });
      };

      Pipeline.async({}, [
        Logger.t('test cdate in snippet with default class', GeneralSteps.sequence([
          tinyApis.sSetSetting('templates', [{ title: 'a', description: 'b', content: '<p class="cdate">x</p>' }]),
          tinyApis.sSetSetting('template_cdate_format', 'fake date'),
          tinyUi.sClickOnToolbar('click on template button', 'div[aria-label="Insert template"] > button'),
          tinyUi.sWaitForPopup('wait for popup', 'div[role="dialog"][aria-label="Insert template"]'),
          tinyUi.sClickOnUi('click on ok button', 'div.mce-primary button'),
          tinyApis.sAssertContent('<p class="cdate">fake date</p>'),
          tinyApis.sSetContent('')
        ])),

        Logger.t('test cdate in snippet with custom class', GeneralSteps.sequence([
          tinyApis.sSetSetting('template_cdate_classes', 'customCdateClass'),
          tinyApis.sSetSetting('templates', [{ title: 'a', description: 'b', content: '<p class="customCdateClass">x</p>' }]),
          tinyApis.sSetSetting('template_cdate_format', 'fake date'),
          tinyUi.sClickOnToolbar('click on template button', 'div[aria-label="Insert template"] > button'),
          tinyUi.sWaitForPopup('wait for popup', 'div[role="dialog"][aria-label="Insert template"]'),
          tinyUi.sClickOnUi('click on ok button', 'div.mce-primary button'),
          tinyApis.sAssertContent('<p class="customCdateClass">fake date</p>'),
          sDeleteSetting('template_cdate_classes'),
          sDeleteSetting('templates'),
          sDeleteSetting('template_cdate_format'),
          tinyApis.sSetContent('')
        ])),

        Logger.t('test mdate updates with each serialization', GeneralSteps.sequence([
          tinyApis.sSetSetting(
            'templates',
            [{ title: 'a', description: 'b', content: '<div class="mceTmpl"><p class="mdate"></p><p class="cdate"></p></div>' }]
          ),
          tinyApis.sSetSetting('template_mdate_format', 'fake modified date'),
          tinyApis.sSetSetting('template_cdate_format', 'fake created date'),
          tinyUi.sClickOnToolbar('click on template button', 'div[aria-label="Insert template"] > button'),
          tinyUi.sWaitForPopup('wait for popup', 'div[role="dialog"][aria-label="Insert template"]'),
          tinyUi.sClickOnUi('click on ok button', 'div.mce-primary button'),
          tinyApis.sAssertContent('<div class="mceTmpl"><p class="mdate">fake modified date</p><p class="cdate">fake created date</p></div>'),
          tinyApis.sSetSetting('template_mdate_format', 'changed modified date'),
          tinyApis.sAssertContent('<div class="mceTmpl"><p class="mdate">changed modified date</p><p class="cdate">fake created date</p></div>'),
          sDeleteSetting('templates'),
          sDeleteSetting('template_mdate_format'),
          sDeleteSetting('template_cdate_template'),
          tinyApis.sSetContent('')
        ])),

        Logger.t('test mdate updates with each serialization with custom class', GeneralSteps.sequence([
          tinyApis.sSetSetting('template_mdate_classes', 'modified'),
          tinyApis.sSetSetting(
            'templates',
            [{ title: 'a', description: 'b', content: '<div class="mceTmpl"><p class="modified"></p><p class="cdate"></p></div>' }]
          ),
          tinyApis.sSetSetting('template_mdate_format', 'fake modified date'),
          tinyApis.sSetSetting('template_cdate_format', 'fake created date'),
          tinyUi.sClickOnToolbar('click on template button', 'div[aria-label="Insert template"] > button'),
          tinyUi.sWaitForPopup('wait for popup', 'div[role="dialog"][aria-label="Insert template"]'),
          tinyUi.sClickOnUi('click on ok button', 'div.mce-primary button'),
          tinyApis.sAssertContent('<div class="mceTmpl"><p class="modified">fake modified date</p><p class="cdate">fake created date</p></div>'),
          tinyApis.sSetSetting('template_mdate_format', 'changed modified date'),
          tinyApis.sAssertContent('<div class="mceTmpl"><p class="modified">changed modified date</p><p class="cdate">fake created date</p></div>'),
          sDeleteSetting('template_mdate_classes'),
          sDeleteSetting('templates'),
          sDeleteSetting('template_mdate_format'),
          sDeleteSetting('template_cdate_template')
        ]))
      ], onSuccess, onFailure);
    }, {
      plugins: 'template',
      toolbar: 'template',
      indent: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);