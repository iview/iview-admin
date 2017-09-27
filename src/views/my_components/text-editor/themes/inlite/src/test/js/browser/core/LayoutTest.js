test(
  'browser/core/LayoutTest', [
    'tinymce.themes.inlite.core.Layout'
  ],
  function (Layout) {
    // TODO: Move this to atomic test when we can require parts of tinymce core using bolt

    var rect = function (x, y, w, h) {
      return { x: x, y: y, w: w, h: h };
    };

    var clientRect = function (x, y, w, h) {
      return { left: x, top: y, width: w, height: h, bottom: y + h, right: x + w };
    };

    var assertLayout = function (expected, rects) {
      var result;

      result = Layout.calc(
        rects.targetRect,
        rects.contentAreaRect,
        rects.panelRect
      );

      assert.eq(expected, result);
    };

    var testCalcPanelAtBottomLeft = function () {
      assertLayout({
        rect: rect(0, 10, 20, 10),
        position: 'bl-tl'
      }, {
        contentAreaRect: rect(0, 0, 100, 100),
        targetRect: rect(0, 0, 10, 10),
        panelRect: rect(0, 0, 20, 10)
      });
    };

    var testCalcPanelAtBottomRight = function () {
      assertLayout({
        rect: rect(80, 10, 20, 10),
        position: 'br-tr'
      }, {
        contentAreaRect: rect(0, 0, 100, 100),
        targetRect: rect(90, 0, 10, 10),
        panelRect: rect(0, 0, 20, 10)
      });
    };

    var testCalcPanelAtTopLeft = function () {
      assertLayout({
        rect: rect(0, 10, 20, 10),
        position: 'tl-bl'
      }, {
        contentAreaRect: rect(0, 0, 100, 100),
        targetRect: rect(0, 20, 10, 10),
        panelRect: rect(0, 0, 20, 10)
      });
    };

    var testCalcPanelAtTopRight = function () {
      assertLayout({
        rect: rect(80, 10, 20, 10),
        position: 'tr-br'
      }, {
        contentAreaRect: rect(0, 0, 100, 100),
        targetRect: rect(90, 20, 10, 10),
        panelRect: rect(0, 0, 20, 10)
      });
    };

    var testCalcPanelAtTopCenter = function () {
      assertLayout({
        rect: rect(35, 10, 20, 10),
        position: 'tc-bc'
      }, {
        contentAreaRect: rect(0, 0, 100, 100),
        targetRect: rect(40, 20, 10, 10),
        panelRect: rect(0, 0, 20, 10)
      });
    };

    var testCalcPanelAtBottomCenter = function () {
      assertLayout({
        rect: rect(35, 10, 20, 10),
        position: 'bc-tc'
      }, {
        contentAreaRect: rect(0, 0, 100, 100),
        targetRect: rect(40, 0, 10, 10),
        panelRect: rect(0, 0, 20, 10)
      });
    };

    var testUserConstrain = function () {
      var targetRect, contentAreaRect, panelRect, userConstrainedPanelRect, handler;

      contentAreaRect = rect(0, 0, 100, 100);
      targetRect = rect(40, 0, 10, 10);
      panelRect = rect(0, 0, 20, 10);

      handler = function (rects) {
        assert.eq(rects.elementRect, clientRect(40, 0, 10, 10));
        assert.eq(rects.contentAreaRect, clientRect(0, 0, 100, 100));
        assert.eq(rects.panelRect, clientRect(0, 0, 20, 10));
        return clientRect(1, 2, 3, 4);
      };

      userConstrainedPanelRect = Layout.userConstrain(handler, targetRect, contentAreaRect, panelRect);
      assert.eq(userConstrainedPanelRect, rect(1, 2, 3, 4));
    };

    var testCalcSmallContentRect = function () {
      var contentAreaRect = rect(0, 0, 25, 25);
      var targetRect = rect(40, 0, 10, 10);
      var panelRect = rect(0, 20, 50, 50);

      var foundRect = Layout.calc(targetRect, contentAreaRect, panelRect);
      assert.eq(foundRect, { rect: rect(20, 10, 50, 50), position: 'bc-tc' });
    };

    testCalcPanelAtBottomLeft();
    testCalcPanelAtBottomRight();
    testCalcPanelAtTopLeft();
    testCalcPanelAtTopRight();
    testCalcPanelAtTopCenter();
    testCalcPanelAtBottomCenter();
    testUserConstrain();
    testCalcSmallContentRect();
  }
);
