test(
  'atomic.tinymce.plugins.visualchars.DataTest',
  [
    'ephox.agar.api.RawAssertions',
    'tinymce.plugins.visualchars.core.Data'
  ],
    function (RawAssertions, Data) {
      RawAssertions.assertEq(
        'should return correst selector',
        'span.mce-a,span.mce-b',
        Data.charMapToSelector({ a: "a", b: "b" })
      );

      RawAssertions.assertEq(
        'should return correct regexp',
        "/[ab]/",
        Data.charMapToRegExp({ a: "a", b: "b" }).toString()
      );

      RawAssertions.assertEq(
        'should return correct global regexp',
        "/[ab]/g",
        Data.charMapToRegExp({ a: "a", b: "b" }, true).toString()
      );
    }
);
