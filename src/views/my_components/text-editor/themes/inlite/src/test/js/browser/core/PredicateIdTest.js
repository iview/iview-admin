test(
  'browser.core.PredicateIdTest',
  [
    'tinymce.themes.inlite.core.PredicateId'
  ],
  function (PredicateId) {
    var testFromContextToolbars = function () {
      var isTrue = function () {
        return true;
      };

      var isFalse = function () {
        return false;
      };

      var predIds = PredicateId.fromContextToolbars([
        { toolbar: 'a b c', predicate: isTrue, id: 'a' },
        { toolbar: 'd e', predicate: isFalse, id: 'b' }
      ]);

      assert.eq([
        PredicateId.create('a', isTrue),
        PredicateId.create('b', isFalse)
      ], predIds);
    };

    testFromContextToolbars();
  }
);
