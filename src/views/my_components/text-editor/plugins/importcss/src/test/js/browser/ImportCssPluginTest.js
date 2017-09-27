asynctest(
  'browser.tinymce.plugins.importcss.ImportCssPluginTest.js',
  [
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.katamari.api.Arr',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'global!document',
    'tinymce.core.ui.Factory',
    'tinymce.plugins.importcss.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, Step, Arr, LegacyUnit, TinyLoader, document, Factory, ImportCssPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();
    var menuCtrl;

    ModernTheme();
    ImportCssPlugin();

    var fireFormatsMenuEvent = function (editor, styleSheets, items) {
      menuCtrl = Factory.create('menu', {
        items: items
      }).renderTo(document.getElementById('view'));

      return editor.fire('renderFormatsMenu', {
        control: menuCtrl,
        doc: {
          styleSheets: styleSheets
        }
      });
    };

    var getMenuItemFormat = function (editor, item) {
      return editor.formatter.get(item.settings.format)[0];
    };

    var sTeardown = function (editor) {
      return Step.sync(function () {
        if (menuCtrl) {
          menuCtrl.remove();
          menuCtrl = null;
        }

        editor.contentCSS = [];
        delete editor.settings.importcss_file_filter;
        delete editor.settings.importcss_merge_classes;
        delete editor.settings.importcss_append;
        delete editor.settings.importcss_selector_filter;
        delete editor.settings.importcss_groups;
        delete editor.settings.importcss_exclusive;
        delete editor.settings.importcss_selector_converter;
      });
    };

    var appendTeardown = function (editor, steps) {
      return Arr.bind(steps, function (step) {
        return [step, sTeardown(editor)];
      });
    };

    suite.test("Import content_css files", function (editor) {
      editor.contentCSS.push("test1.css");
      editor.contentCSS.push("test2.css");

      var evt = fireFormatsMenuEvent(editor, [
        {
          href: 'test1.css',
          cssRules: [
            { selectorText: '.a' },
            { selectorText: 'p.b' },
            { selectorText: 'img.c' }
          ]
        },

        { href: 'test2.css', cssRules: [{ selectorText: '.d' }] },
        { href: 'test3.css', cssRules: [{ selectorText: '.e' }] }
      ]);

      LegacyUnit.equal(evt.control.items().length, 4);

      LegacyUnit.equal(evt.control.items()[0].text(), 'a');
      LegacyUnit.equal(getMenuItemFormat(editor, evt.control.items()[0]).classes, ['a']);

      LegacyUnit.equal(evt.control.items()[1].text(), 'p.b');
      LegacyUnit.equal(getMenuItemFormat(editor, evt.control.items()[1]).block, 'p');
      LegacyUnit.equal(getMenuItemFormat(editor, evt.control.items()[1]).classes[0], 'b');

      LegacyUnit.equal(evt.control.items()[2].text(), 'img.c');
      LegacyUnit.equal(getMenuItemFormat(editor, evt.control.items()[2]).selector, 'img');
      LegacyUnit.equal(getMenuItemFormat(editor, evt.control.items()[2]).classes[0], 'c');

      LegacyUnit.equal(evt.control.items()[3].text(), 'd');
    });

    suite.test("Import custom importcss_merge_classes: false", function (editor) {
      editor.contentCSS.push("test.css");
      editor.settings.importcss_merge_classes = false;

      var evt = fireFormatsMenuEvent(editor, [
        { href: 'test.css', cssRules: [{ selectorText: '.a' }] }
      ]);

      LegacyUnit.equal(evt.control.items().length, 1);
      LegacyUnit.equal(getMenuItemFormat(editor, evt.control.items()[0]).attributes, { "class": "a" });
    });

    suite.test("Import custom importcss_append: true", function (editor) {
      editor.contentCSS.push("test.css");
      editor.settings.importcss_append = true;

      var evt = fireFormatsMenuEvent(editor, [
        { href: 'test.css', cssRules: [{ selectorText: '.b' }] }
      ], { text: 'a' });

      LegacyUnit.equal(evt.control.items().length, 2);
      LegacyUnit.equal(evt.control.items()[0].text(), 'a');
      LegacyUnit.equal(evt.control.items()[1].text(), 'b');
    });

    suite.test("Import custom importcss_selector_filter (string)", function (editor) {
      editor.contentCSS.push("test1.css");
      editor.settings.importcss_selector_filter = ".a";

      var evt = fireFormatsMenuEvent(editor, [
        {
          href: 'test1.css', cssRules: [
            { selectorText: '.a' },
            { selectorText: '.b' }
          ]
        }
      ]);

      LegacyUnit.equal(evt.control.items().length, 1);
      LegacyUnit.equal(evt.control.items()[0].text(), 'a');
    });

    suite.test("Import custom importcss_selector_filter (function)", function (editor) {
      editor.contentCSS.push("test1.css");
      editor.settings.importcss_selector_filter = function (selector) {
        return selector === ".a";
      };

      var evt = fireFormatsMenuEvent(editor, [
        {
          href: 'test1.css', cssRules: [
            { selectorText: '.a' },
            { selectorText: '.b' }
          ]
        }
      ]);

      LegacyUnit.equal(evt.control.items().length, 1);
      LegacyUnit.equal(evt.control.items()[0].text(), 'a');
    });

    suite.test("Import custom importcss_selector_filter (regexp)", function (editor) {
      editor.contentCSS.push("test1.css");
      editor.settings.importcss_selector_filter = /a/;

      var evt = fireFormatsMenuEvent(editor, [
        {
          href: 'test1.css', cssRules: [
            { selectorText: '.a' },
            { selectorText: '.b' }
          ]
        }
      ]);

      LegacyUnit.equal(evt.control.items().length, 1);
      LegacyUnit.equal(evt.control.items()[0].text(), 'a');
    });

    suite.test("Import custom importcss_groups", function (editor) {
      editor.contentCSS.push("test1.css");
      editor.settings.importcss_groups = [
        { title: 'g1', filter: /a/ },
        { title: 'g2', filter: /b/ },
        { title: 'g3' }
      ];

      var evt = fireFormatsMenuEvent(editor, [
        {
          href: 'test1.css', cssRules: [
            { selectorText: '.a' },
            { selectorText: '.b' },
            { selectorText: '.c' }
          ]
        }
      ]);

      LegacyUnit.equal(evt.control.items().length, 3);
      LegacyUnit.equal(evt.control.items()[0].text(), 'g1');
      LegacyUnit.equal(evt.control.items()[0].settings.menu[0].text, 'a');
      LegacyUnit.equal(evt.control.items()[1].text(), 'g2');
      LegacyUnit.equal(evt.control.items()[1].settings.menu[0].text, 'b');
      LegacyUnit.equal(evt.control.items()[2].text(), 'g3');
      LegacyUnit.equal(evt.control.items()[2].settings.menu[0].text, 'c');
    });

    suite.test("Import custom importcss_file_filter (string)", function (editor) {
      editor.contentCSS.push("test1.css");
      editor.settings.importcss_file_filter = "test2.css";

      var evt = fireFormatsMenuEvent(editor, [
        { href: 'test1.css', cssRules: [{ selectorText: '.a' }] },
        { href: 'test2.css', cssRules: [{ selectorText: '.b' }] }
      ]);

      LegacyUnit.equal(evt.control.items().length, 1);
      LegacyUnit.equal(evt.control.items()[0].text(), 'b');
    });

    suite.test("Import custom importcss_file_filter (function)", function (editor) {
      editor.contentCSS.push("test1.css");
      editor.settings.importcss_file_filter = function (href) {
        return href === "test2.css";
      };

      var evt = fireFormatsMenuEvent(editor, [
        { href: 'test1.css', cssRules: [{ selectorText: '.a' }] },
        { href: 'test2.css', cssRules: [{ selectorText: '.b' }] }
      ]);

      LegacyUnit.equal(evt.control.items().length, 1);
      LegacyUnit.equal(evt.control.items()[0].text(), 'b');
    });

    suite.test("Import custom importcss_file_filter (regexp)", function (editor) {
      editor.contentCSS.push("test1.css");
      editor.settings.importcss_file_filter = /test2\.css/;

      var evt = fireFormatsMenuEvent(editor, [
        { href: 'test1.css', cssRules: [{ selectorText: '.a' }] },
        { href: 'test2.css', cssRules: [{ selectorText: '.b' }] }
      ]);

      LegacyUnit.equal(evt.control.items().length, 1);
      LegacyUnit.equal(evt.control.items()[0].text(), 'b');
    });

    suite.test("Import custom importcss_selector_converter", function (editor) {
      editor.settings.importcss_groups = [
        { title: 'g1', filter: /\.a/, custom: 'A' },
        { title: 'g2', filter: /\.b/, custom: 'B' },
        { title: 'g3', custom: 'C' }
      ];

      editor.contentCSS.push("test1.css");
      editor.settings.importcss_selector_converter = function (selector, group) {
        return {
          title: selector + group.custom,
          inline: 'span'
        };
      };

      var evt = fireFormatsMenuEvent(editor, [
        {
          href: 'test1.css', cssRules: [
            { selectorText: '.a' },
            { selectorText: '.b' },
            { selectorText: '.c' }
          ]
        }
      ]);

      var items = evt.control.items();
      LegacyUnit.equal(items.length, 3);
      LegacyUnit.equal(items[0].text(), 'g1');
      LegacyUnit.equal(items[0].settings.menu[0].text, '.aA');
      LegacyUnit.equal(items[1].text(), 'g2');
      LegacyUnit.equal(items[1].settings.menu[0].text, '.bB');
      LegacyUnit.equal(items[2].text(), 'g3');
      LegacyUnit.equal(items[2].settings.menu[0].text, '.cC');
    });

    suite.test("Import custom group selector_converter", function (editor) {
      var constant = function (format) {
        return function () {
          return format;
        };
      };

      var formatA = {
        title: 'my format a',
        selector: 'p'
      };

      var formatB = {
        title: 'my format b',
        selector: 'h1'
      };

      editor.settings.importcss_groups = [
        { title: 'g1', filter: /\.a/, selector_converter: constant(formatA) },
        { title: 'g2', filter: /\.b/, selector_converter: constant(formatB) },
        { title: 'g3', custom: 'C' }
      ];

      editor.contentCSS.push("test1.css");

      var evt = fireFormatsMenuEvent(editor, [
        {
          href: 'test1.css', cssRules: [
            { selectorText: '.a' },
            { selectorText: '.b' },
            { selectorText: '.c' }
          ]
        }
      ]);

      var items = evt.control.items();
      LegacyUnit.equal(items.length, 3);
      LegacyUnit.equal(items[0].text(), 'g1');
      LegacyUnit.equal(items[0].settings.menu[0].text, 'my format a');
      LegacyUnit.equal(items[1].text(), 'g2');
      LegacyUnit.equal(items[1].settings.menu[0].text, 'my format b');
      LegacyUnit.equal(items[2].text(), 'g3');
      LegacyUnit.equal(items[2].settings.menu[0].text, 'c');
    });

    suite.test("Import custom importcss_exclusive: true", function (editor) {
      editor.settings.importcss_exclusive = true;
      editor.settings.importcss_groups = [
        { title: 'g1' },
        { title: 'g2' }
      ];

      editor.contentCSS.push("test1.css");
      var evt = fireFormatsMenuEvent(editor, [
        {
          href: 'test1.css', cssRules: [
            { selectorText: '.a' },
            { selectorText: '.b' },
            { selectorText: '.c' }
          ]
        }
      ]);

      var items = evt.control.items();
      LegacyUnit.equal(items.length, 1);
      LegacyUnit.equal(items[0].text(), 'g1');
      LegacyUnit.equal(items[0].settings.menu[0].text, 'a');
      LegacyUnit.equal(items[0].settings.menu[1].text, 'b');
    });

    suite.test("Import custom importcss_exclusive: false", function (editor) {
      editor.settings.importcss_exclusive = false;
      editor.settings.importcss_groups = [
        { title: 'g1' },
        { title: 'g2' }
      ];

      editor.contentCSS.push("test1.css");
      var evt = fireFormatsMenuEvent(editor, [
        {
          href: 'test1.css', cssRules: [
            { selectorText: '.a' },
            { selectorText: '.b' },
            { selectorText: '.c' }
          ]
        }
      ]);

      var items = evt.control.items();
      LegacyUnit.equal(items.length, 2);
      LegacyUnit.equal(items[0].text(), 'g1');
      LegacyUnit.equal(items[0].settings.menu[0].text, 'a');
      LegacyUnit.equal(items[0].settings.menu[1].text, 'b');
      LegacyUnit.equal(items[1].text(), 'g2');
      LegacyUnit.equal(items[1].settings.menu[0].text, 'a');
      LegacyUnit.equal(items[1].settings.menu[1].text, 'b');
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, appendTeardown(editor, suite.toSteps(editor)), onSuccess, onFailure);
    }, {
      add_unload_trigger: false,
      plugins: 'importcss',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);