test(
  'atomic.themes.core.ConvertTest',
  [
    'tinymce.themes.inlite.core.Convert'
  ],
  function (Convert) {
    var testConvert = function () {
      assert.eq({ x: 1, y: 2, w: 3, h: 4 }, Convert.fromClientRect({ left: 1, top: 2, width: 3, height: 4 }));
      assert.eq({ x: 2, y: 3, w: 4, h: 5 }, Convert.fromClientRect({ left: 2, top: 3, width: 4, height: 5 }));
      assert.eq({ left: 1, top: 2, width: 3, height: 4, bottom: 2 + 4, right: 1 + 3 }, Convert.toClientRect({ x: 1, y: 2, w: 3, h: 4 }));
      assert.eq({ left: 2, top: 3, width: 4, height: 5, bottom: 3 + 5, right: 2 + 4 }, Convert.toClientRect({ x: 2, y: 3, w: 4, h: 5 }));
    };

    testConvert();
  }
);
