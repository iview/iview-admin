'use strict';
/**
 * 事件辅助类
 * @module zrender/core/event
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 */


    var Eventful = require('../mixin/Eventful');
    var env = require('./env');

    var isDomLevel2 = (typeof window !== 'undefined') && !!window.addEventListener;

    function getBoundingClientRect(el) {
        // BlackBerry 5, iOS 3 (original iPhone) don't have getBoundingRect
        return el.getBoundingClientRect ? el.getBoundingClientRect() : {left: 0, top: 0};
    }

    // `calculate` is optional, default false
    function clientToLocal(el, e, out, calculate) {
        out = out || {};

        // According to the W3C Working Draft, offsetX and offsetY should be relative
        // to the padding edge of the target element. The only browser using this convention
        // is IE. Webkit uses the border edge, Opera uses the content edge, and FireFox does
        // not support the properties.
        // (see http://www.jacklmoore.com/notes/mouse-position/)
        // In zr painter.dom, padding edge equals to border edge.

        // FIXME
        // When mousemove event triggered on ec tooltip, target is not zr painter.dom, and
        // offsetX/Y is relative to e.target, where the calculation of zrX/Y via offsetX/Y
        // is too complex. So css-transfrom dont support in this case temporarily.
        if (calculate || !env.canvasSupported) {
            defaultGetZrXY(el, e, out);
        }
        // Caution: In FireFox, layerX/layerY Mouse position relative to the closest positioned
        // ancestor element, so we should make sure el is positioned (e.g., not position:static).
        // BTW1, Webkit don't return the same results as FF in non-simple cases (like add
        // zoom-factor, overflow / opacity layers, transforms ...)
        // BTW2, (ev.offsetY || ev.pageY - $(ev.target).offset().top) is not correct in preserve-3d.
        // <https://bugs.jquery.com/ticket/8523#comment:14>
        // BTW3, In ff, offsetX/offsetY is always 0.
        else if (env.browser.firefox && e.layerX != null && e.layerX !== e.offsetX) {
            out.zrX = e.layerX;
            out.zrY = e.layerY;
        }
        // For IE6+, chrome, safari, opera. (When will ff support offsetX?)
        else if (e.offsetX != null) {
            out.zrX = e.offsetX;
            out.zrY = e.offsetY;
        }
        // For some other device, e.g., IOS safari.
        else {
            defaultGetZrXY(el, e, out);
        }

        return out;
    }

    function defaultGetZrXY(el, e, out) {
        // This well-known method below does not support css transform.
        var box = getBoundingClientRect(el);
        out.zrX = e.clientX - box.left;
        out.zrY = e.clientY - box.top;
    }

    /**
     * 如果存在第三方嵌入的一些dom触发的事件，或touch事件，需要转换一下事件坐标.
     * `calculate` is optional, default false.
     */
    function normalizeEvent(el, e, calculate) {

        e = e || window.event;

        if (e.zrX != null) {
            return e;
        }

        var eventType = e.type;
        var isTouch = eventType && eventType.indexOf('touch') >= 0;

        if (!isTouch) {
            clientToLocal(el, e, e, calculate);
            e.zrDelta = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
        }
        else {
            var touch = eventType != 'touchend'
                ? e.targetTouches[0]
                : e.changedTouches[0];
            touch && clientToLocal(el, touch, e, calculate);
        }

        return e;
    }

    function addEventListener(el, name, handler) {
        if (isDomLevel2) {
            el.addEventListener(name, handler);
        }
        else {
            el.attachEvent('on' + name, handler);
        }
    }

    function removeEventListener(el, name, handler) {
        if (isDomLevel2) {
            el.removeEventListener(name, handler);
        }
        else {
            el.detachEvent('on' + name, handler);
        }
    }

    /**
     * preventDefault and stopPropagation.
     * Notice: do not do that in zrender. Upper application
     * do that if necessary.
     *
     * @memberOf module:zrender/core/event
     * @method
     * @param {Event} e : event对象
     */
    var stop = isDomLevel2
        ? function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.cancelBubble = true;
        }
        : function (e) {
            e.returnValue = false;
            e.cancelBubble = true;
        };

    module.exports = {
        clientToLocal: clientToLocal,
        normalizeEvent: normalizeEvent,
        addEventListener: addEventListener,
        removeEventListener: removeEventListener,

        stop: stop,
        // 做向上兼容
        Dispatcher: Eventful
    };

