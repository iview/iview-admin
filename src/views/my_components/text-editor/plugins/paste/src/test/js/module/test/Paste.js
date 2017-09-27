define(
  'tinymce.plugins.paste.test.Paste',

  [
    'ephox.agar.api.Step',
    'tinymce.plugins.paste.test.MockDataTransfer'
  ],

  function (Step, MockDataTransfer) {
    var sPaste = function (editor, data) {
      return Step.sync(function () {
        var dataTransfer = MockDataTransfer.create(data);
        editor.fire('paste', { clipboardData: dataTransfer });
      });
    };

    return {
      sPaste: sPaste
    };

  }
);
