test(
  'browser.themes.inlite.MatcherTest',
  [
    'tinymce.themes.inlite.core.Matcher'
  ],
  function (Matcher) {
    var testMatch = function (mockEditor, matches, expectedResult) {
      var result;

      result = Matcher.match(mockEditor, matches);
      assert.eq(expectedResult, result);
    };

    var match = function (key) {
      return function (editor) {
        return editor[key];
      };
    };

    var testMatcher = function () {
      var mockEditor = {
        success1: 'success1',
        success2: 'success2',
        failure: null
      };

      testMatch(mockEditor, [
        match('success1')
      ], 'success1');

      testMatch(mockEditor, [
        match(null),
        match('success2')
      ], 'success2');

      testMatch(mockEditor, [
        match('success1'),
        match('success2')
      ], 'success1');

      testMatch(mockEditor, [
        match(null)
      ], null);

      testMatch(mockEditor, [
        match(null),
        match(null)
      ], null);

      testMatch(mockEditor, [], null);
    };

    testMatcher();
  }
);
