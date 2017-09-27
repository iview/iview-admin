asynctest(
  'tinymce.themes.modern.test.browser.SidebarTest',
  [
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyDom',
    'ephox.agar.api.Assertions',
    'tinymce.themes.modern.Theme',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Chain',
    'ephox.agar.api.UiFinder',
    'ephox.agar.api.Mouse',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Step'
  ],
  function (
    TinyLoader, TinyDom, Assertions, Theme,
    Pipeline, Chain, UiFinder, Mouse, GeneralSteps, Step
  ) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var dialogRoot = TinyDom.fromDom(document.body);
    var state = [];

    Theme();

    var storeEvent = function (name) {
      return function (api) {
        state.push({
          name: name,
          element: api.element()
        });
      };
    };

    var cWaitForToolbar = Chain.fromChainsWith(dialogRoot, [
      UiFinder.cWaitFor('Sidebar toolbar', '.mce-sidebar-toolbar')
    ]);

    var cFindButton = function (ariaLabel) {
      return UiFinder.cFindIn('div[aria-label="' + ariaLabel + '"]');
    };

    var cClickButton = function (ariaLabel) {
      return Chain.fromChains([
        cFindButton(ariaLabel),
        Mouse.cTrueClick
      ]);
    };

    var sClickButton = function (ariaLabel) {
      return Chain.asStep({}, [
        cWaitForToolbar,
        cClickButton(ariaLabel)
      ]);
    };

    var sResetState = Step.sync(function () {
      state = [];
    });

    var sAssertEventNames = function (expectedNames) {
      return Step.sync(function () {
        var actualNames = state.map(function (state) {
          return state.name;
        });

        Assertions.assertEq('Names need to be equal', expectedNames, actualNames);
      });
    };

    var getSidebarElement = function (index) {
      var sidebarPanelElms = document.querySelectorAll('.mce-sidebar-panel > .mce-container-body');
      var flippedIndex = sidebarPanelElms.length - 1 - index;
      return sidebarPanelElms ? sidebarPanelElms[flippedIndex] : null;
    };

    var sAssertPanelElements = function (expectedPanelIndexes) {
      return Step.sync(function () {
        state.forEach(function (state, i) {
          var actualElement = state.element;
          var expectedElement = getSidebarElement(expectedPanelIndexes[i]);
          Assertions.assertEq('Elements need to be equal', true, expectedElement === actualElement);
        });
      });
    };

    var sAssertPanelVisibility = function (visibleStates) {
      return Step.sync(function () {
        visibleStates.forEach(function (visibleState, i) {
          var panelElement = getSidebarElement(i).parentNode;
          Assertions.assertEq('Visibility need to be equal', visibleState, panelElement.style.display !== 'none');
        });
      });
    };

    var sClickAndAssertEvents = function (tooltip, expectedNames, expectedPanelIndexes) {
      return GeneralSteps.sequence([
        sResetState,
        sClickButton(tooltip),
        sAssertEventNames(expectedNames),
        sAssertPanelElements(expectedPanelIndexes)
      ]);
    };

    var sAssertButtonIcon = function (tooltip, expectedIcon) {
      return Chain.asStep({}, [
        cWaitForToolbar,
        cFindButton(tooltip),
        UiFinder.cFindIn('i'),
        Chain.op(function (iconElm) {
          var className = iconElm.dom().className;
          Assertions.assertEq('Needs to have icon class: ' + expectedIcon, true, className.indexOf('mce-i-' + expectedIcon) !== -1);
        })
      ]);
    };

    var normalizeUrlString = function (urlString) {
      return urlString.replace(/\"/g, '');
    };

    var sAssertButtonIconImage = function (tooltip, expectedIconUrl) {
      return Chain.asStep({}, [
        cWaitForToolbar,
        cFindButton(tooltip),
        UiFinder.cFindIn('i'),
        Chain.op(function (iconElm) {
          var actualUrl = normalizeUrlString(iconElm.dom().style.backgroundImage);
          Assertions.assertEq('Needs to have correct icon url', 'url(' + expectedIconUrl + ')', actualUrl);
        })
      ]);
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, [
        sAssertButtonIcon('My sidebar 1', 'bold'),
        sAssertButtonIcon('My sidebar 2', 'italic'),
        sAssertButtonIconImage('My sidebar 3', 'about:blank'),
        sClickAndAssertEvents('My sidebar 1', ['mysidebar1:render', 'mysidebar1:show'], [0, 0]),
        sAssertPanelVisibility([true]),
        sClickAndAssertEvents('My sidebar 2', ['mysidebar1:hide', 'mysidebar2:render', 'mysidebar2:show'], [0, 1, 1]),
        sAssertPanelVisibility([false, true]),
        sClickAndAssertEvents('My sidebar 3', ['mysidebar2:hide', 'mysidebar3:render', 'mysidebar3:show'], [1, 2, 2]),
        sAssertPanelVisibility([false, false, true]),
        sClickAndAssertEvents('My sidebar 3', ['mysidebar3:hide'], [2]),
        sAssertPanelVisibility([false, false, false])
      ], onSuccess, onFailure);
    }, {
      theme: 'modern',
      setup: function (editor) {
        editor.addSidebar('mysidebar1', {
          tooltip: 'My sidebar 1',
          icon: 'bold',
          onrender: storeEvent('mysidebar1:render'),
          onshow: storeEvent('mysidebar1:show'),
          onhide: storeEvent('mysidebar1:hide')
        });

        editor.addSidebar('mysidebar2', {
          tooltip: 'My sidebar 2',
          icon: 'italic',
          onrender: storeEvent('mysidebar2:render'),
          onshow: storeEvent('mysidebar2:show'),
          onhide: storeEvent('mysidebar2:hide')
        });

        editor.addSidebar('mysidebar3', {
          tooltip: 'My sidebar 3',
          image: 'about:blank',
          onrender: storeEvent('mysidebar3:render'),
          onshow: storeEvent('mysidebar3:show'),
          onhide: storeEvent('mysidebar3:hide')
        });
      },
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
