asynctest(
  'atomic.core.ConvertTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.sand.api.Uint8Array',
    'ephox.sand.api.Window',
    'tinymce.themes.inlite.file.Conversions'
  ],
  function (Assertions, Pipeline, Step, Uint8Array, Window, Conversions) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    var base64ToBlob = function (base64, type) {
      var buff = Window.atob(base64);
      var bytes = new Uint8Array(buff.length);

      for (var i = 0; i < bytes.length; i++) {
        bytes[i] = buff.charCodeAt(i);
      }

      return new Blob([bytes], { type: type });
    };

    var sBlobToBase64 = function () {
      return Step.async(function (next) {
        var base64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        var blob = base64ToBlob(base64, 'image/gif');

        Conversions.blobToBase64(blob).then(function (convertedBase64) {
          Assertions.assertEq('Not the correct base64', base64, convertedBase64);
          next();
        });
      });
    };

    Pipeline.async({}, [
      sBlobToBase64()
    ], function () {
      success();
    }, function () {
      failure();
    });
  }
);
