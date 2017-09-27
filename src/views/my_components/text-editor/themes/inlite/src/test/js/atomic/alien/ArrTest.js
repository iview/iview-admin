test(
  'atomic.themes.alien.ArrTest',
  [
    'tinymce.themes.inlite.alien.Arr'
  ],
  function (Arr) {
    var testFlatten = function () {
      assert.eq(Arr.flatten([1, 2, [3, 4, [5, 6]], [7, 8], 9]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    };

    testFlatten();
  }
);
