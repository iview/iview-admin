asynctest(
  'tinymce.plugins.paste.browser.ImagePasteTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.katamari.api.Arr',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'ephox.sand.api.Blob',
    'ephox.sand.api.Uint8Array',
    'ephox.sand.api.Window',
    'tinymce.core.util.Delay',
    'tinymce.core.util.Promise',
    'tinymce.plugins.paste.core.Clipboard',
    'tinymce.plugins.paste.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, Step, Arr, LegacyUnit, TinyLoader, Blob, Uint8Array, Window, Delay, Promise, Clipboard, Plugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    Plugin();
    Theme();

    var base64ImgSrc = [
      'R0lGODdhZABkAHcAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQECgAAACwAAAAAZABkAIEAAAD78jY/',
      'P3SsMjIC/4SPqcvtD6OctNqLs968+w+G4kiW5ommR8C27gvHrxrK9g3TIM7f+tcL5n4doZFFLB6F',
      'Sc6SCRFIp9SqVTp6BiPXbjer5XG95Ck47IuWy2e0bLz2tt3DR5w8p7vgd2tej6TW5ycCGMM3aFZo',
      'OCOYqFjDuOf4KPAHiPh4qZeZuEnXOfjpFto3ilZ6dxqWGreq1br2+hTLtigZaFcJuYOb67DLC+Qb',
      'UIt3i2sshyzZtEFc7JwBLT1NXI2drb3N3e39DR4uPk5ebn6Onq6+zu488A4fLz9P335Aj58fb2+g',
      '71/P759AePwADBxY8KDAhAr9MWyY7yFEgPYmRgxokWK7jEYa2XGcJ/HjgJAfSXI0mRGlRZUTWUJ0',
      '2RCmQpkHaSLEKPKdzYU4c+78VzCo0KFEixo9ijSp0qVMmzp9CjWq1KlUq1q9eqEAADs='
    ].join('');

    var sTeardown = function (editor) {
      return Step.sync(function () {
        delete editor.settings.paste_data_images;
        delete editor.settings.images_dataimg_filter;
        editor.editorUpload.destroy();
      });
    };

    var appendTeardown = function (editor, steps) {
      return Arr.bind(steps, function (step) {
        return [step, sTeardown(editor)];
      });
    };

    var base64ToBlob = function (base64, type) {
      var buff = Window.atob(base64);
      var bytes = new Uint8Array(buff.length);

      for (var i = 0; i < bytes.length; i++) {
        bytes[i] = buff.charCodeAt(i);
      }

      return new Blob([bytes], { type: type });
    };

    var noop = function () {
    };

    var mockEvent = function (type) {
      var event, transferName;

      event = {
        type: type,
        preventDefault: noop
      };

      transferName = type === 'drop' ? 'dataTransfer' : 'clipboardData';
      event[transferName] = {
        files: [
          base64ToBlob(base64ImgSrc, 'image/gif')
        ]
      };

      return event;
    };

    var setupContent = function (editor) {
      editor.setContent('<p>a</p>');
      LegacyUnit.setSelection(editor, 'p', 0);
      return editor.selection.getRng();
    };

    var waitForSelector = function (editor, selector) {
      return new Promise(function (resolve, reject) {
        var check = function (time, count) {
          var result = editor.dom.select(selector);

          if (result.length > 0) {
            resolve(result);
          } else {
            if (count === 0) {
              reject();
            } else {
              Delay.setTimeout(function () {
                check(time, count--);
              }, time);
            }
          }
        };

        check(10, 100);
      });
    };

    suite.asyncTest('dropImages', function (editor, done, die) {
      var rng, event, clipboard = new Clipboard(editor);

      editor.settings.paste_data_images = true;
      rng = setupContent(editor);

      event = mockEvent('drop');
      clipboard.pasteImageData(event, rng);

      waitForSelector(editor, 'img').then(function () {
        LegacyUnit.equal(editor.getContent(), '<p><img src=\"data:image/gif;base64,' + base64ImgSrc + '" />a</p>');
        LegacyUnit.strictEqual(editor.dom.select('img')[0].src.indexOf('blob:'), 0);

        done();
      })["catch"](die);
    });

    suite.asyncTest('pasteImages', function (editor, done, die) {
      var rng, event, clipboard = new Clipboard(editor);

      editor.settings.paste_data_images = true;
      rng = setupContent(editor);

      event = mockEvent('paste');
      clipboard.pasteImageData(event, rng);

      waitForSelector(editor, 'img').then(function () {
        LegacyUnit.equal(editor.getContent(), '<p><img src=\"data:image/gif;base64,' + base64ImgSrc + '" />a</p>');
        LegacyUnit.strictEqual(editor.dom.select('img')[0].src.indexOf('blob:'), 0);

        done();
      })["catch"](die);
    });

    suite.asyncTest('dropImages - images_dataimg_filter', function (editor, done, die) {
      var rng, event, clipboard = new Clipboard(editor);

      editor.settings.paste_data_images = true;
      editor.settings.images_dataimg_filter = function (img) {
        LegacyUnit.strictEqual(img.src, 'data:image/gif;base64,' + base64ImgSrc);
        return false;
      };
      rng = setupContent(editor);

      event = mockEvent('drop');
      clipboard.pasteImageData(event, rng);

      waitForSelector(editor, 'img').then(function () {
        LegacyUnit.equal(editor.getContent(), '<p><img src=\"data:image/gif;base64,' + base64ImgSrc + '" />a</p>');
        LegacyUnit.strictEqual(editor.dom.select('img')[0].src.indexOf('data:'), 0);

        done();
      })["catch"](die);
    });

    suite.asyncTest('pasteImages - images_dataimg_filter', function (editor, done, die) {
      var rng, event, clipboard = new Clipboard(editor);

      editor.settings.paste_data_images = true;
      editor.settings.images_dataimg_filter = function (img) {
        LegacyUnit.strictEqual(img.src, 'data:image/gif;base64,' + base64ImgSrc);
        return false;
      };
      rng = setupContent(editor);

      event = mockEvent('paste');
      clipboard.pasteImageData(event, rng);

      waitForSelector(editor, 'img').then(function () {
        LegacyUnit.equal(editor.getContent(), '<p><img src=\"data:image/gif;base64,' + base64ImgSrc + '" />a</p>');
        LegacyUnit.strictEqual(editor.dom.select('img')[0].src.indexOf('data:'), 0);

        done();
      })["catch"](die);
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, appendTeardown(editor, suite.toSteps(editor)), onSuccess, onFailure);
    }, {
      add_unload_trigger: false,
      disable_nodechange: true,
      entities: 'raw',
      indent: false,
      automatic_uploads: false,
      plugins: "paste",
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
