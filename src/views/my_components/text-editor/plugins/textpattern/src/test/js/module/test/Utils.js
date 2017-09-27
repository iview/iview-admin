define(
  'tinymce.plugins.textpattern.test.Utils',
  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Keys',
    'ephox.katamari.api.Arr'
  ],
  function (ApproxStructure, GeneralSteps, Keys, Arr) {
    var sSetContentAndPressKey = function (key) {
      return function (tinyApis, tinyActions, content) {
        var padding = key === Keys.space() ? '\u00a0' : '';
        var extraOffset = padding === '' ? 0 : 1;
        return GeneralSteps.sequence([
          tinyApis.sSetContent('<p>' + content + padding + '</p>'),
          tinyApis.sFocus,
          tinyApis.sSetCursor(
            [0, 0],
            content.length + extraOffset
          ),
          tinyActions.sContentKeystroke(key, {})
        ]);
      };
    };

    var withTeardown = function (steps, teardownStep) {
      return Arr.bind(steps, function (step) {
        return [step, teardownStep];
      });
    };

    var bodyStruct = function (children) {
      return ApproxStructure.build(function (s, str) {
        return s.element('body', {
          children: children
        });
      });
    };

    var inlineStructHelper = function (tag, content) {
      return ApproxStructure.build(function (s, str) {
        return bodyStruct([
          s.element('p', {
            children: [
              s.element(tag, {
                children: [
                  s.text(str.is(content))
                ]
              }),
              s.text(str.is('\u00A0'))
            ]
          })
        ]);
      });
    };

    var inlineBlockStructHelper = function (tag, content) {
      return ApproxStructure.build(function (s, str) {
        return bodyStruct([
          s.element('p', {
            children: [
              s.element(tag, {
                children: [
                  s.text(str.is(content)),
                  s.anything()
                ]
              })
            ]
          }),
          s.element('p', {})
        ]);
      });
    };

    var blockStructHelper = function (tag, content) {
      return ApproxStructure.build(function (s, str) {
        return bodyStruct([
          s.element(tag, {
            children: [
              s.text(str.is(content))
            ]
          }),
          s.element('p', {})
        ]);
      });
    };

    return {
      sSetContentAndPressSpace: sSetContentAndPressKey(Keys.space()),
      sSetContentAndPressEnter: sSetContentAndPressKey(Keys.enter()),
      withTeardown: withTeardown,
      inlineStructHelper: inlineStructHelper,
      inlineBlockStructHelper: inlineBlockStructHelper,
      blockStructHelper: blockStructHelper
    };
  }
);