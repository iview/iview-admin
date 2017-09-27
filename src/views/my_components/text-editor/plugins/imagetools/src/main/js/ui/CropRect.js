/**
 * CropRect.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.imagetools.ui.CropRect',
  [
    'tinymce.core.dom.DomQuery',
    'tinymce.core.geom.Rect',
    'tinymce.core.ui.Factory',
    'tinymce.core.util.Observable',
    'tinymce.core.util.Tools',
    'tinymce.core.util.VK'
  ],
  function (DomQuery, Rect, Factory, Observable, Tools, VK) {
    var count = 0;

    return function (currentRect, viewPortRect, clampRect, containerElm, action) {
      var instance, handles, dragHelpers, blockers, prefix = 'mce-', id = prefix + 'crid-' + (count++);

      handles = [
        { name: 'move', xMul: 0, yMul: 0, deltaX: 1, deltaY: 1, deltaW: 0, deltaH: 0, label: 'Crop Mask' },
        { name: 'nw', xMul: 0, yMul: 0, deltaX: 1, deltaY: 1, deltaW: -1, deltaH: -1, label: 'Top Left Crop Handle' },
        { name: 'ne', xMul: 1, yMul: 0, deltaX: 0, deltaY: 1, deltaW: 1, deltaH: -1, label: 'Top Right Crop Handle' },
        { name: 'sw', xMul: 0, yMul: 1, deltaX: 1, deltaY: 0, deltaW: -1, deltaH: 1, label: 'Bottom Left Crop Handle' },
        { name: 'se', xMul: 1, yMul: 1, deltaX: 0, deltaY: 0, deltaW: 1, deltaH: 1, label: 'Bottom Right Crop Handle' }
      ];

      blockers = ["top", "right", "bottom", "left"];

      function getAbsoluteRect(outerRect, relativeRect) {
        return {
          x: relativeRect.x + outerRect.x,
          y: relativeRect.y + outerRect.y,
          w: relativeRect.w,
          h: relativeRect.h
        };
      }

      function getRelativeRect(outerRect, innerRect) {
        return {
          x: innerRect.x - outerRect.x,
          y: innerRect.y - outerRect.y,
          w: innerRect.w,
          h: innerRect.h
        };
      }

      function getInnerRect() {
        return getRelativeRect(clampRect, currentRect);
      }

      function moveRect(handle, startRect, deltaX, deltaY) {
        var x, y, w, h, rect;

        x = startRect.x;
        y = startRect.y;
        w = startRect.w;
        h = startRect.h;

        x += deltaX * handle.deltaX;
        y += deltaY * handle.deltaY;
        w += deltaX * handle.deltaW;
        h += deltaY * handle.deltaH;

        if (w < 20) {
          w = 20;
        }

        if (h < 20) {
          h = 20;
        }

        rect = currentRect = Rect.clamp({ x: x, y: y, w: w, h: h }, clampRect, handle.name === 'move');
        rect = getRelativeRect(clampRect, rect);

        instance.fire('updateRect', { rect: rect });
        setInnerRect(rect);
      }

      function render() {
        function createDragHelper(handle) {
          var startRect;
          var DragHelper = Factory.get('DragHelper');

          return new DragHelper(id, {
            document: containerElm.ownerDocument,
            handle: id + '-' + handle.name,

            start: function () {
              startRect = currentRect;
            },

            drag: function (e) {
              moveRect(handle, startRect, e.deltaX, e.deltaY);
            }
          });
        }

        DomQuery(
          '<div id="' + id + '" class="' + prefix + 'croprect-container"' +
          ' role="grid" aria-dropeffect="execute">'
        ).appendTo(containerElm);

        Tools.each(blockers, function (blocker) {
          DomQuery('#' + id, containerElm).append(
            '<div id="' + id + '-' + blocker + '"class="' + prefix + 'croprect-block" style="display: none" data-mce-bogus="all">'
          );
        });

        Tools.each(handles, function (handle) {
          DomQuery('#' + id, containerElm).append(
            '<div id="' + id + '-' + handle.name + '" class="' + prefix +
            'croprect-handle ' + prefix + 'croprect-handle-' + handle.name + '"' +
            'style="display: none" data-mce-bogus="all" role="gridcell" tabindex="-1"' +
            ' aria-label="' + handle.label + '" aria-grabbed="false">'
          );
        });

        dragHelpers = Tools.map(handles, createDragHelper);

        repaint(currentRect);

        DomQuery(containerElm).on('focusin focusout', function (e) {
          DomQuery(e.target).attr('aria-grabbed', e.type === 'focus');
        });

        DomQuery(containerElm).on('keydown', function (e) {
          var activeHandle;

          Tools.each(handles, function (handle) {
            if (e.target.id === id + '-' + handle.name) {
              activeHandle = handle;
              return false;
            }
          });

          function moveAndBlock(evt, handle, startRect, deltaX, deltaY) {
            evt.stopPropagation();
            evt.preventDefault();

            moveRect(activeHandle, startRect, deltaX, deltaY);
          }

          switch (e.keyCode) {
            case VK.LEFT:
              moveAndBlock(e, activeHandle, currentRect, -10, 0);
              break;

            case VK.RIGHT:
              moveAndBlock(e, activeHandle, currentRect, 10, 0);
              break;

            case VK.UP:
              moveAndBlock(e, activeHandle, currentRect, 0, -10);
              break;

            case VK.DOWN:
              moveAndBlock(e, activeHandle, currentRect, 0, 10);
              break;

            case VK.ENTER:
            case VK.SPACEBAR:
              e.preventDefault();
              action();
              break;
          }
        });
      }

      function toggleVisibility(state) {
        var selectors;

        selectors = Tools.map(handles, function (handle) {
          return '#' + id + '-' + handle.name;
        }).concat(Tools.map(blockers, function (blocker) {
          return '#' + id + '-' + blocker;
        })).join(',');

        if (state) {
          DomQuery(selectors, containerElm).show();
        } else {
          DomQuery(selectors, containerElm).hide();
        }
      }

      function repaint(rect) {
        function updateElementRect(name, rect) {
          if (rect.h < 0) {
            rect.h = 0;
          }

          if (rect.w < 0) {
            rect.w = 0;
          }

          DomQuery('#' + id + '-' + name, containerElm).css({
            left: rect.x,
            top: rect.y,
            width: rect.w,
            height: rect.h
          });
        }

        Tools.each(handles, function (handle) {
          DomQuery('#' + id + '-' + handle.name, containerElm).css({
            left: rect.w * handle.xMul + rect.x,
            top: rect.h * handle.yMul + rect.y
          });
        });

        updateElementRect('top', { x: viewPortRect.x, y: viewPortRect.y, w: viewPortRect.w, h: rect.y - viewPortRect.y });
        updateElementRect('right', { x: rect.x + rect.w, y: rect.y, w: viewPortRect.w - rect.x - rect.w + viewPortRect.x, h: rect.h });
        updateElementRect('bottom', {
          x: viewPortRect.x,
          y: rect.y + rect.h,
          w: viewPortRect.w,
          h: viewPortRect.h - rect.y - rect.h + viewPortRect.y
        });
        updateElementRect('left', { x: viewPortRect.x, y: rect.y, w: rect.x - viewPortRect.x, h: rect.h });
        updateElementRect('move', rect);
      }

      function setRect(rect) {
        currentRect = rect;
        repaint(currentRect);
      }

      function setViewPortRect(rect) {
        viewPortRect = rect;
        repaint(currentRect);
      }

      function setInnerRect(rect) {
        setRect(getAbsoluteRect(clampRect, rect));
      }

      function setClampRect(rect) {
        clampRect = rect;
        repaint(currentRect);
      }

      function destroy() {
        Tools.each(dragHelpers, function (helper) {
          helper.destroy();
        });

        dragHelpers = [];
      }

      render(containerElm);

      instance = Tools.extend({
        toggleVisibility: toggleVisibility,
        setClampRect: setClampRect,
        setRect: setRect,
        getInnerRect: getInnerRect,
        setInnerRect: setInnerRect,
        setViewPortRect: setViewPortRect,
        destroy: destroy
      }, Observable);

      return instance;
    };
  }
);
