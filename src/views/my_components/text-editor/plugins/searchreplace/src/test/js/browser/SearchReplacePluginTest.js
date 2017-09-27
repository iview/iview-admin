asynctest(
  'browser.tinymce.plugins.searchreplace.SearchReplacePluginTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.LegacyUnit',
    'tinymce.plugins.searchreplace.Plugin',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.searchreplace.test.HtmlUtils',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, LegacyUnit, Plugin, TinyLoader, HtmlUtils, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();
    Theme();

    suite.test('Find no match', function (editor) {
      editor.setContent('a');
      LegacyUnit.equal(0, editor.plugins.searchreplace.find('x'));
    });

    suite.test('Find single match', function (editor) {
      editor.setContent('a');
      LegacyUnit.equal(1, editor.plugins.searchreplace.find('a'));
    });

    suite.test('Find single match in multiple elements', function (editor) {
      editor.setContent('t<b>e</b><i>xt</i>');
      LegacyUnit.equal(1, editor.plugins.searchreplace.find('text'));
    });

    suite.test('Find single match, match case: true', function (editor) {
      editor.setContent('a A');
      LegacyUnit.equal(1, editor.plugins.searchreplace.find('A', true));
    });

    suite.test('Find single match, whole words: true', function (editor) {
      editor.setContent('a Ax');
      LegacyUnit.equal(1, editor.plugins.searchreplace.find('a', false, true));
    });

    suite.test('Find multiple matches', function (editor) {
      editor.setContent('a b A');
      LegacyUnit.equal(2, editor.plugins.searchreplace.find('a'));
    });

    suite.test('Find and replace single match', function (editor) {
      editor.setContent('a');
      editor.plugins.searchreplace.find('a');
      LegacyUnit.equal(editor.plugins.searchreplace.replace('x'), false);
      LegacyUnit.equal("<p>x</p>", editor.getContent());
    });

    suite.test('Find and replace first in multiple matches', function (editor) {
      editor.setContent('a b a');
      editor.plugins.searchreplace.find('a');
      LegacyUnit.equal(editor.plugins.searchreplace.replace('x'), true);
      LegacyUnit.equal("<p>x b a</p>", editor.getContent());
    });

    suite.test('Find and replace two consecutive spaces', function (editor) {
      editor.setContent('a&nbsp; b');
      editor.plugins.searchreplace.find('a  ');
      LegacyUnit.equal(editor.plugins.searchreplace.replace('x'), false);
      LegacyUnit.equal("<p>xb</p>", editor.getContent());
    });

    suite.test('Find and replace consecutive spaces', function (editor) {
      editor.setContent('a&nbsp; &nbsp;b');
      editor.plugins.searchreplace.find('a   ');
      LegacyUnit.equal(editor.plugins.searchreplace.replace('x'), false);
      LegacyUnit.equal("<p>xb</p>", editor.getContent());
    });

    suite.test('Find and replace all in multiple matches', function (editor) {
      editor.setContent('a b a');
      editor.plugins.searchreplace.find('a');
      LegacyUnit.equal(editor.plugins.searchreplace.replace('x', true, true), false);
      LegacyUnit.equal("<p>x b x</p>", editor.getContent());
    });

    suite.test('Find multiple matches, move to next and replace', function (editor) {
      editor.setContent('a a');
      LegacyUnit.equal(2, editor.plugins.searchreplace.find('a'));
      editor.plugins.searchreplace.next();
      LegacyUnit.equal(editor.plugins.searchreplace.replace('x'), false);
      LegacyUnit.equal("<p>a x</p>", editor.getContent());
    });

    suite.test('Find and replace fragmented match', function (editor) {
      editor.setContent('<b>te<i>s</i>t</b><b>te<i>s</i>t</b>');
      editor.plugins.searchreplace.find('test');
      LegacyUnit.equal(editor.plugins.searchreplace.replace('abc'), true);
      LegacyUnit.equal(editor.getContent(), "<p><b>abc</b><b>te<i>s</i>t</b></p>");
    });

    suite.test('Find and replace all fragmented matches', function (editor) {
      editor.setContent('<b>te<i>s</i>t</b><b>te<i>s</i>t</b>');
      editor.plugins.searchreplace.find('test');
      LegacyUnit.equal(editor.plugins.searchreplace.replace('abc', true, true), false);
      LegacyUnit.equal(editor.getContent(), "<p><b>abc</b><b>abc</b></p>");
    });

    suite.test('Find multiple matches, move to next and replace backwards', function (editor) {
      editor.setContent('a a');
      LegacyUnit.equal(2, editor.plugins.searchreplace.find('a'));
      editor.plugins.searchreplace.next();
      LegacyUnit.equal(editor.plugins.searchreplace.replace('x', false), true);
      LegacyUnit.equal(editor.plugins.searchreplace.replace('y', false), false);
      LegacyUnit.equal("<p>y x</p>", editor.getContent());
    });

    suite.test('Find multiple matches and unmark them', function (editor) {
      editor.setContent('a b a');
      LegacyUnit.equal(2, editor.plugins.searchreplace.find('a'));
      editor.plugins.searchreplace.done();
      LegacyUnit.equal('a', editor.selection.getContent());
      LegacyUnit.equal(0, editor.getBody().getElementsByTagName('span').length);
    });

    suite.test('Find multiple matches with pre blocks', function (editor) {
      editor.getBody().innerHTML = 'abc<pre>  abc  </pre>abc';
      LegacyUnit.equal(3, editor.plugins.searchreplace.find('b'));
      LegacyUnit.equal(HtmlUtils.normalizeHtml(editor.getBody().innerHTML), (
        'a<span class="mce-match-marker mce-match-marker-selected" data-mce-bogus="1" data-mce-index="0">b</span>c' +
        '<pre>  a<span class="mce-match-marker" data-mce-bogus="1" data-mce-index="1">b</span>c  </pre>' +
        'a<span class="mce-match-marker" data-mce-bogus="1" data-mce-index="2">b</span>c'
      ));
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, suite.toSteps(editor), onSuccess, onFailure);
    }, {
      plugins: 'searchreplace',
      valid_elements: 'b,i',
      indent: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);