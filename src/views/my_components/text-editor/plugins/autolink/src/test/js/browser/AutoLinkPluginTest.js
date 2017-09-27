asynctest(
  'browser.tinymce.plugins.autolink.AutoLinkPluginTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.core.Env',
    'tinymce.plugins.autolink.Plugin',
    'tinymce.plugins.autolink.test.KeyUtils',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, LegacyUnit, TinyLoader, Env, Plugin, KeyUtils, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    Theme();
    Plugin();

    var typeUrl = function (editor, url) {
      editor.setContent('<p>' + url + '</p>');
      LegacyUnit.setSelection(editor, 'p', url.length);
      KeyUtils.type(editor, ' ');
      return editor.getContent();
    };

    var typeAnEclipsedURL = function (editor, url) {
      url = "(" + url;
      editor.setContent('<p>' + url + '</p>');
      LegacyUnit.setSelection(editor, 'p', url.length);
      KeyUtils.type(editor, ')');
      return editor.getContent();
    };

    var typeNewlineURL = function (editor, url) {
      editor.setContent('<p>' + url + '</p>');
      LegacyUnit.setSelection(editor, 'p', url.length);
      KeyUtils.type(editor, '\n');
      return editor.getContent();
    };

    suite.test("Urls ended with space", function (editor) {
      LegacyUnit.equal(typeUrl(editor, 'http://www.domain.com'), '<p><a href="http://www.domain.com">http://www.domain.com</a></p>');
      LegacyUnit.equal(typeUrl(editor, 'https://www.domain.com'), '<p><a href="https://www.domain.com">https://www.domain.com</a></p>');
      LegacyUnit.equal(typeUrl(editor, 'ssh://www.domain.com'), '<p><a href="ssh://www.domain.com">ssh://www.domain.com</a></p>');
      LegacyUnit.equal(typeUrl(editor, 'ftp://www.domain.com'), '<p><a href="ftp://www.domain.com">ftp://www.domain.com</a></p>');
      LegacyUnit.equal(typeUrl(editor, 'www.domain.com'), '<p><a href="http://www.domain.com">www.domain.com</a></p>');
      LegacyUnit.equal(typeUrl(editor, 'www.domain.com.'), '<p><a href="http://www.domain.com">www.domain.com</a>.</p>');
      LegacyUnit.equal(typeUrl(editor, 'user@domain.com'), '<p><a href="mailto:user@domain.com">user@domain.com</a></p>');
      LegacyUnit.equal(typeUrl(editor, 'mailto:user@domain.com'), '<p><a href="mailto:user@domain.com">mailto:user@domain.com</a></p>');
      LegacyUnit.equal(typeUrl(editor, 'first-last@domain.com'), '<p><a href="mailto:first-last@domain.com">first-last@domain.com</a></p>');
    });

    suite.test("Urls ended with )", function (editor) {
      LegacyUnit.equal(
        typeAnEclipsedURL(editor, 'http://www.domain.com'),
        '<p>(<a href="http://www.domain.com">http://www.domain.com</a>)</p>'
      );
      LegacyUnit.equal(
        typeAnEclipsedURL(editor, 'https://www.domain.com'),
        '<p>(<a href="https://www.domain.com">https://www.domain.com</a>)</p>'
      );
      LegacyUnit.equal(
        typeAnEclipsedURL(editor, 'ssh://www.domain.com'),
        '<p>(<a href="ssh://www.domain.com">ssh://www.domain.com</a>)</p>'
      );
      LegacyUnit.equal(
        typeAnEclipsedURL(editor, 'ftp://www.domain.com'),
        '<p>(<a href="ftp://www.domain.com">ftp://www.domain.com</a>)</p>'
      );
      LegacyUnit.equal(typeAnEclipsedURL(editor, 'www.domain.com'), '<p>(<a href="http://www.domain.com">www.domain.com</a>)</p>');
      LegacyUnit.equal(typeAnEclipsedURL(editor, 'www.domain.com.'), '<p>(<a href="http://www.domain.com">www.domain.com</a>.)</p>');
    });

    suite.test("Urls ended with new line", function (editor) {
      LegacyUnit.equal(
        typeNewlineURL(editor, 'http://www.domain.com'),
        '<p><a href="http://www.domain.com">http://www.domain.com</a></p><p>&nbsp;</p>'
      );
      LegacyUnit.equal(
        typeNewlineURL(editor, 'https://www.domain.com'),
        '<p><a href="https://www.domain.com">https://www.domain.com</a></p><p>&nbsp;</p>'
      );
      LegacyUnit.equal(
        typeNewlineURL(editor, 'ssh://www.domain.com'),
        '<p><a href="ssh://www.domain.com">ssh://www.domain.com</a></p><p>&nbsp;</p>'
      );
      LegacyUnit.equal(
        typeNewlineURL(editor, 'ftp://www.domain.com'),
        '<p><a href="ftp://www.domain.com">ftp://www.domain.com</a></p><p>&nbsp;</p>'
      );
      LegacyUnit.equal(
        typeNewlineURL(editor, 'www.domain.com'),
        '<p><a href="http://www.domain.com">www.domain.com</a></p><p>&nbsp;</p>'
      );
      LegacyUnit.equal(
        typeNewlineURL(editor, 'www.domain.com.'),
        '<p><a href="http://www.domain.com">www.domain.com</a>.</p><p>&nbsp;</p>'
      );
    });

    suite.test("default_link_target='_self'", function (editor) {
      editor.settings.default_link_target = '_self';
      LegacyUnit.equal(
        typeUrl(editor, 'http://www.domain.com'),
        '<p><a href="http://www.domain.com" target="_self">http://www.domain.com</a></p>'
      );
      delete editor.settings.default_link_target;
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var steps = Env.ie ? [] : suite.toSteps(editor);
      Pipeline.async({}, steps, onSuccess, onFailure);
    }, {
      plugins: 'autolink',
      indent: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);