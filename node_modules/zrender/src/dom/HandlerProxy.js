define(function (require) {

    var eventTool = require('../core/event');
    var zrUtil = require('../core/util');
    var Eventful = require('../mixin/Eventful');
    var env = require('../core/env');
    var GestureMgr = require('../core/GestureMgr');

    var addEventListener = eventTool.addEventListener;
    var removeEventListener = eventTool.removeEventListener;
    var normalizeEvent = eventTool.normalizeEvent;

    var TOUCH_CLICK_DELAY = 300;

    var mouseHandlerNames = [
        'click', 'dblclick', 'mousewheel', 'mouseout',
        'mouseup', 'mousedown', 'mousemove', 'contextmenu'
    ];

    var touchHandlerNames = [
        'touchstart', 'touchend', 'touchmove'
    ];

    var pointerEventNames = {
        pointerdown: 1, pointerup: 1, pointermove: 1, pointerout: 1
    };

    var pointerHandlerNames = zrUtil.map(mouseHandlerNames, function (name) {
        var nm = name.replace('mouse', 'pointer');
        return pointerEventNames[nm] ? nm : name;
    });

    function eventNameFix(name) {
        return (name === 'mousewheel' && env.browser.firefox) ? 'DOMMouseScroll' : name;
    }

    function processGesture(proxy, event, stage) {
        var gestureMgr = proxy._gestureMgr;

        stage === 'start' && gestureMgr.clear();

        var gestureInfo = gestureMgr.recognize(
            event,
            proxy.handler.findHover(event.zrX, event.zrY, null).target,
            proxy.dom
        );

        stage === 'end' && gestureMgr.clear();

        // Do not do any preventDefault here. Upper application do that if necessary.
        if (gestureInfo) {
            var type = gestureInfo.type;
            event.gestureEvent = type;

            proxy.handler.dispatchToElement({target: gestureInfo.target}, type, gestureInfo.event);
        }
    }

    // function onMSGestureChange(proxy, event) {
    //     if (event.translationX || event.translationY) {
    //         // mousemove is carried by MSGesture to reduce the sensitivity.
    //         proxy.handler.dispatchToElement(event.target, 'mousemove', event);
    //     }
    //     if (event.scale !== 1) {
    //         event.pinchX = event.offsetX;
    //         event.pinchY = event.offsetY;
    //         event.pinchScale = event.scale;
    //         proxy.handler.dispatchToElement(event.target, 'pinch', event);
    //     }
    // }

    /**
     * Prevent mouse event from being dispatched after Touch Events action
     * @see <https://github.com/deltakosh/handjs/blob/master/src/hand.base.js>
     * 1. Mobile browsers dispatch mouse events 300ms after touchend.
     * 2. Chrome for Android dispatch mousedown for long-touch about 650ms
     * Result: Blocking Mouse Events for 700ms.
     */
    function setTouchTimer(instance) {
        instance._touching = true;
        clearTimeout(instance._touchTimer);
        instance._touchTimer = setTimeout(function () {
            instance._touching = false;
        }, 700);
    }


    var domHandlers = {
        /**
         * Mouse move handler
         * @inner
         * @param {Event} event
         */
        mousemove: function (event) {
            event = normalizeEvent(this.dom, event);

            this.trigger('mousemove', event);
        },

        /**
         * Mouse out handler
         * @inner
         * @param {Event} event
         */
        mouseout: function (event) {
            event = normalizeEvent(this.dom, event);

            var element = event.toElement || event.relatedTarget;
            if (element != this.dom) {
                while (element && element.nodeType != 9) {
                    // 忽略包含在root中的dom引起的mouseOut
                    if (element === this.dom) {
                        return;
                    }

                    element = element.parentNode;
                }
            }

            this.trigger('mouseout', event);
        },

        /**
         * Touch开始响应函数
         * @inner
         * @param {Event} event
         */
        touchstart: function (event) {
            // Default mouse behaviour should not be disabled here.
            // For example, page may needs to be slided.
            event = normalizeEvent(this.dom, event);

            // Mark touch, which is useful in distinguish touch and
            // mouse event in upper applicatoin.
            event.zrByTouch = true;

            this._lastTouchMoment = new Date();

            processGesture(this, event, 'start');

            // In touch device, trigger `mousemove`(`mouseover`) should
            // be triggered, and must before `mousedown` triggered.
            domHandlers.mousemove.call(this, event);

            domHandlers.mousedown.call(this, event);

            setTouchTimer(this);
        },

        /**
         * Touch移动响应函数
         * @inner
         * @param {Event} event
         */
        touchmove: function (event) {

            event = normalizeEvent(this.dom, event);

            // Mark touch, which is useful in distinguish touch and
            // mouse event in upper applicatoin.
            event.zrByTouch = true;

            processGesture(this, event, 'change');

            // Mouse move should always be triggered no matter whether
            // there is gestrue event, because mouse move and pinch may
            // be used at the same time.
            domHandlers.mousemove.call(this, event);

            setTouchTimer(this);
        },

        /**
         * Touch结束响应函数
         * @inner
         * @param {Event} event
         */
        touchend: function (event) {

            event = normalizeEvent(this.dom, event);

            // Mark touch, which is useful in distinguish touch and
            // mouse event in upper applicatoin.
            event.zrByTouch = true;

            processGesture(this, event, 'end');

            domHandlers.mouseup.call(this, event);

            // Do not trigger `mouseout` here, in spite of `mousemove`(`mouseover`) is
            // triggered in `touchstart`. This seems to be illogical, but by this mechanism,
            // we can conveniently implement "hover style" in both PC and touch device just
            // by listening to `mouseover` to add "hover style" and listening to `mouseout`
            // to remove "hover style" on an element, without any additional code for
            // compatibility. (`mouseout` will not be triggered in `touchend`, so "hover
            // style" will remain for user view)

            // click event should always be triggered no matter whether
            // there is gestrue event. System click can not be prevented.
            if (+new Date() - this._lastTouchMoment < TOUCH_CLICK_DELAY) {
                domHandlers.click.call(this, event);
            }

            setTouchTimer(this);
        },

        pointerdown: function (event) {
            domHandlers.mousedown.call(this, event);

            // if (useMSGuesture(this, event)) {
            //     this._msGesture.addPointer(event.pointerId);
            // }
        },

        pointermove: function (event) {
            // FIXME
            // pointermove is so sensitive that it always triggered when
            // tap(click) on touch screen, which affect some judgement in
            // upper application. So, we dont support mousemove on MS touch
            // device yet.
            if (!isPointerFromTouch(event)) {
                domHandlers.mousemove.call(this, event);
            }
        },

        pointerup: function (event) {
            domHandlers.mouseup.call(this, event);
        },

        pointerout: function (event) {
            // pointerout will be triggered when tap on touch screen
            // (IE11+/Edge on MS Surface) after click event triggered,
            // which is inconsistent with the mousout behavior we defined
            // in touchend. So we unify them.
            // (check domHandlers.touchend for detailed explanation)
            if (!isPointerFromTouch(event)) {
                domHandlers.mouseout.call(this, event);
            }
        }
    };

    function isPointerFromTouch(event) {
        var pointerType = event.pointerType;
        return pointerType === 'pen' || pointerType === 'touch';
    }

    // function useMSGuesture(handlerProxy, event) {
    //     return isPointerFromTouch(event) && !!handlerProxy._msGesture;
    // }

    // Common handlers
    zrUtil.each(['click', 'mousedown', 'mouseup', 'mousewheel', 'dblclick', 'contextmenu'], function (name) {
        domHandlers[name] = function (event) {
            event = normalizeEvent(this.dom, event);
            this.trigger(name, event);
        };
    });

    /**
     * 为控制类实例初始化dom 事件处理函数
     *
     * @inner
     * @param {module:zrender/Handler} instance 控制类实例
     */
    function initDomHandler(instance) {
        zrUtil.each(touchHandlerNames, function (name) {
            instance._handlers[name] = zrUtil.bind(domHandlers[name], instance);
        });

        zrUtil.each(pointerHandlerNames, function (name) {
            instance._handlers[name] = zrUtil.bind(domHandlers[name], instance);
        });

        zrUtil.each(mouseHandlerNames, function (name) {
            instance._handlers[name] = makeMouseHandler(domHandlers[name], instance);
        });

        function makeMouseHandler(fn, instance) {
            return function () {
                if (instance._touching) {
                    return;
                }
                return fn.apply(instance, arguments);
            };
        }
    }


    function HandlerDomProxy(dom) {
        Eventful.call(this);

        this.dom = dom;

        /**
         * @private
         * @type {boolean}
         */
        this._touching = false;

        /**
         * @private
         * @type {number}
         */
        this._touchTimer;

        /**
         * @private
         * @type {module:zrender/core/GestureMgr}
         */
        this._gestureMgr = new GestureMgr();

        this._handlers = {};

        initDomHandler(this);

        if (env.pointerEventsSupported) { // Only IE11+/Edge
            // 1. On devices that both enable touch and mouse (e.g., MS Surface and lenovo X240),
            // IE11+/Edge do not trigger touch event, but trigger pointer event and mouse event
            // at the same time.
            // 2. On MS Surface, it probablely only trigger mousedown but no mouseup when tap on
            // screen, which do not occurs in pointer event.
            // So we use pointer event to both detect touch gesture and mouse behavior.
            mountHandlers(pointerHandlerNames, this);

            // FIXME
            // Note: MS Gesture require CSS touch-action set. But touch-action is not reliable,
            // which does not prevent defuault behavior occasionally (which may cause view port
            // zoomed in but use can not zoom it back). And event.preventDefault() does not work.
            // So we have to not to use MSGesture and not to support touchmove and pinch on MS
            // touch screen. And we only support click behavior on MS touch screen now.

            // MS Gesture Event is only supported on IE11+/Edge and on Windows 8+.
            // We dont support touch on IE on win7.
            // See <https://msdn.microsoft.com/en-us/library/dn433243(v=vs.85).aspx>
            // if (typeof MSGesture === 'function') {
            //     (this._msGesture = new MSGesture()).target = dom; // jshint ignore:line
            //     dom.addEventListener('MSGestureChange', onMSGestureChange);
            // }
        }
        else {
            if (env.touchEventsSupported) {
                mountHandlers(touchHandlerNames, this);
                // Handler of 'mouseout' event is needed in touch mode, which will be mounted below.
                // addEventListener(root, 'mouseout', this._mouseoutHandler);
            }

            // 1. Considering some devices that both enable touch and mouse event (like on MS Surface
            // and lenovo X240, @see #2350), we make mouse event be always listened, otherwise
            // mouse event can not be handle in those devices.
            // 2. On MS Surface, Chrome will trigger both touch event and mouse event. How to prevent
            // mouseevent after touch event triggered, see `setTouchTimer`.
            mountHandlers(mouseHandlerNames, this);
        }

        function mountHandlers(handlerNames, instance) {
            zrUtil.each(handlerNames, function (name) {
                addEventListener(dom, eventNameFix(name), instance._handlers[name]);
            }, instance);
        }
    }

    var handlerDomProxyProto = HandlerDomProxy.prototype;
    handlerDomProxyProto.dispose = function () {
        var handlerNames = mouseHandlerNames.concat(touchHandlerNames);

        for (var i = 0; i < handlerNames.length; i++) {
            var name = handlerNames[i];
            removeEventListener(this.dom, eventNameFix(name), this._handlers[name]);
        }
    };

    handlerDomProxyProto.setCursor = function (cursorStyle) {
        this.dom.style.cursor = cursorStyle || 'default';
    };

    zrUtil.mixin(HandlerDomProxy, Eventful);

    return HandlerDomProxy;
});