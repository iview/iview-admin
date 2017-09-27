define(
  'tinymce.plugins.imagetools.test.ImageUtils',
  [
    'ephox.agar.api.RawAssertions',
    'ephox.agar.api.Step',
    'ephox.agar.api.Waiter',
    'ephox.katamari.api.Cell',
    'global!Image'
  ],
  function (RawAssertions, Step, Waiter, Cell, Image) {
    var sExecCommand = function (editor, cmd, value) {
      return Step.sync(function () {
        editor.execCommand(cmd, false, value);
      });
    };

    var sLoadImage = function (editor, url) {
      return Step.async(function (done) {
        var img = new Image();

        img.onload = function () {
          editor.setContent('<p><img src="' + url + '" /></p>');
          done();
        };

        img.src = url;
      });
    };

    var sUploadImages = function (editor) {
      return Step.async(function (done) {
        editor.uploadImages(done);
      });
    };

    var sWaitForBlobImage = function (editor) {
      return Waiter.sTryUntil('Did not find a blobimage', Step.sync(function () {
        RawAssertions.assertEq('Should be one blob image', true, editor.dom.select('img[src^=blob]').length === 1);
      }), 10, 3000);
    };

    var createStateContainer = function () {
      var state = Cell(null);

      var handler = function (url) {
        return function (blobInfo, success) {
          state.set({
            blobInfo: blobInfo
          });

          success(url);
        };
      };

      var sResetState = Step.sync(function () {
        state.set(null);
      });

      var sWaitForState = Waiter.sTryUntil('Did not get a state change', Step.sync(function () {
        RawAssertions.assertEq('Should be true when we have the state', true, state.get() !== null);
      }), 10, 3000);

      return {
        get: state.get,
        handler: handler,
        sResetState: sResetState,
        sWaitForState: sWaitForState
      };
    };

    return {
      sExecCommand: sExecCommand,
      sLoadImage: sLoadImage,
      sUploadImages: sUploadImages,
      sWaitForBlobImage: sWaitForBlobImage,
      createStateContainer: createStateContainer
    };
  }
);
