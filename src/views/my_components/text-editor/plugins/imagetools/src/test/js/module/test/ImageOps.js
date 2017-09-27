define(
  'tinymce.plugins.imagetools.test.ImageOps',
  [
    'ephox.agar.api.Chain',
    'ephox.agar.api.Guard',
    'ephox.agar.api.Mouse',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.agar.api.UiFinder',
    'ephox.agar.mouse.Clicks',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Result',
    'ephox.mcagar.api.TinyDom',
    'ephox.mcagar.api.TinyUi',
    'ephox.sugar.api.events.DomEvent',
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.search.PredicateFilter',
    'ephox.sugar.api.search.Selectors',
    'ephox.sugar.api.view.Visibility'
  ],
  function (Chain, Guard, Mouse, Pipeline, Step, UiFinder, Clicks, Fun, Result, TinyDom, TinyUi, DomEvent, Attr, PredicateFilter, Selectors, Visibility) {

    // IMPORTANT: we match buttons by their aria-label

    return function (editor) {
      var ui = TinyUi(editor);

      var cHasState = function (predicate) {
        return Chain.binder(function (element) {
          return predicate(element) ? Result.value(element) : Result.error("Predicate didn't match.");
        });
      };


      var cWaitForState = function (predicate) {
        return Chain.control(
          cHasState(predicate),
          Guard.tryUntil("Predicate has failed.", 10, 3000)
        );
      };


      var cWaitForChain = function (chain) {
        return Chain.control(
          chain,
          Guard.tryUntil("Chain has failed.", 10, 3000)
        );
      };


      var cFindChildWithState = function (selector, predicate) {
        return Chain.on(function (scope, next, die) {
          var children = PredicateFilter.descendants(scope, function (element) {
            return Selectors.is(element, selector) && predicate(element);
          });
          children.length ? next(Chain.wrap(children[0])) : die();
        });
      };


      var cDragSlider = Chain.fromChains([
        UiFinder.cFindIn('div[role="slider"]'),
        Chain.on(function (element, next, die) {
          var pos = editor.dom.getPos(element.dom());

          var unbindMouseMove = DomEvent.bind(element, 'mousemove', function (e) {
            Clicks.mouseup(element);
            unbindMouseMove();
            next(Chain.wrap(element));
          }).unbind;

          var unbindMouseDown = DomEvent.bind(element, 'mousedown', function (e) {
            Clicks.mousemove(element, pos.x + 10, pos.y); // not sure if xy actually matters here
            unbindMouseDown();
          }).unbind;

          Clicks.mousedown(element);
        })
      ]);


      var cExecCommandFromDialog = function (label) {
        var cInteractWithUi;

        switch (label) {
          case 'Rotate counterclockwise':
          case 'Rotate clockwise':
          case 'Flip vertically':
          case 'Flip horizontally':
            // Orientation operations, like Flip or Rotate are grouped in a sub-panel
            cInteractWithUi = cClickToolbarButton(label);
            label = 'Orientation';
            break;

          case 'Brightness':
          case 'Contrast':
          case 'Color levels':
          case 'Gamma':
            cInteractWithUi = cDragSlider;
            break;

          default:
            cInteractWithUi = Chain.wait(1);
        }


        return Chain.fromChains([
          cClickToolbarButton('Edit image'),
          Chain.fromParent(ui.cWaitForPopup('wait for Edit Image dialog', 'div[aria-label="Edit image"][role="dialog"]'), [
            ui.cWaitForUi('wait for canvas', '.mce-imagepanel > img'),
            cClickToolbarButton(label),
            Chain.fromParent(cWaitForChain(cFindChildWithState('.mce-container.mce-form', Visibility.isVisible)), [
              Chain.fromChains([
                cInteractWithUi
              ]),
              cClickButton('Apply')
            ]),
            ui.cWaitForUi('wait for Save button to become enabled', 'div[role="button"]:contains(Save):not(.mce-disabled)'),
            cClickButton('Save')
          ])
        ]);
      };


      var cWaitForUi = function (label, selector) {
        return UiFinder.cWaitForState(label, selector, Fun.constant(true));
      };


      var cClickButton = function (text) {
        return Chain.fromChains([
          cWaitForUi('wait for ' + text + ' button', 'div[role="button"]:contains(' + text + '):not(.mce-disabled)'),
          Mouse.cClick
        ]);
      };


      var cClickToolbarButton = function (label) {
        return Chain.fromChains([
          UiFinder.cFindIn('div[aria-label="' + label + '"][role="button"]'),
          Mouse.cClick
        ]);
      };


      var sWaitForUrlChange = function (imgEl, origUrl) {
        return Chain.asStep(imgEl, [
          cWaitForState(function (el) {
            return Attr.get(el, 'src') !== origUrl;
          })
        ]);
      };


      var sExec = function (execFromToolbar, label) {
        return Step.async(function (next, die) {
          var imgEl = TinyDom.fromDom(editor.selection.getNode());
          var origUrl = Attr.get(imgEl, 'src');

          Pipeline.async({}, [
            Chain.asStep(imgEl, [
              Mouse.cClick,
              ui.cWaitForPopup('wait for Imagetools toolbar', 'div[aria-label="Inline toolbar"][role="dialog"]'),
              execFromToolbar ? cClickToolbarButton(label) : cExecCommandFromDialog(label)
            ]),
            sWaitForUrlChange(imgEl, origUrl)
          ], function () {
            next();
          }, die);
        });
      };

      return {
        sExecToolbar: Fun.curry(sExec, true),
        sExecDialog: Fun.curry(sExec, false)
      };
    };
  }
);
