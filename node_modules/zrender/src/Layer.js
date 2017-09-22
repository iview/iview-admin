/**
 * @module zrender/Layer
 * @author pissang(https://www.github.com/pissang)
 */
define(function (require) {

    var util = require('./core/util');
    var config = require('./config');
    var Style = require('./graphic/Style');
    var Pattern = require('./graphic/Pattern');

    function returnFalse() {
        return false;
    }

    /**
     * 创建dom
     *
     * @inner
     * @param {string} id dom id 待用
     * @param {string} type dom type，such as canvas, div etc.
     * @param {Painter} painter painter instance
     * @param {number} number
     */
    function createDom(id, type, painter, dpr) {
        var newDom = document.createElement(type);
        var width = painter.getWidth();
        var height = painter.getHeight();

        var newDomStyle = newDom.style;
        // 没append呢，请原谅我这样写，清晰~
        newDomStyle.position = 'absolute';
        newDomStyle.left = 0;
        newDomStyle.top = 0;
        newDomStyle.width = width + 'px';
        newDomStyle.height = height + 'px';
        newDom.width = width * dpr;
        newDom.height = height * dpr;

        // id不作为索引用，避免可能造成的重名，定义为私有属性
        newDom.setAttribute('data-zr-dom-id', id);
        return newDom;
    }

    /**
     * @alias module:zrender/Layer
     * @constructor
     * @extends module:zrender/mixin/Transformable
     * @param {string} id
     * @param {module:zrender/Painter} painter
     * @param {number} [dpr]
     */
    var Layer = function(id, painter, dpr) {
        var dom;
        dpr = dpr || config.devicePixelRatio;
        if (typeof id === 'string') {
            dom = createDom(id, 'canvas', painter, dpr);
        }
        // Not using isDom because in node it will return false
        else if (util.isObject(id)) {
            dom = id;
            id = dom.id;
        }
        this.id = id;
        this.dom = dom;

        var domStyle = dom.style;
        if (domStyle) { // Not in node
            dom.onselectstart = returnFalse; // 避免页面选中的尴尬
            domStyle['-webkit-user-select'] = 'none';
            domStyle['user-select'] = 'none';
            domStyle['-webkit-touch-callout'] = 'none';
            domStyle['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';
            domStyle['padding'] = 0;
            domStyle['margin'] = 0;
            domStyle['border-width'] = 0;
        }

        this.domBack = null;
        this.ctxBack = null;

        this.painter = painter;

        this.config = null;

        // Configs
        /**
         * 每次清空画布的颜色
         * @type {string}
         * @default 0
         */
        this.clearColor = 0;
        /**
         * 是否开启动态模糊
         * @type {boolean}
         * @default false
         */
        this.motionBlur = false;
        /**
         * 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
         * @type {number}
         * @default 0.7
         */
        this.lastFrameAlpha = 0.7;

        /**
         * Layer dpr
         * @type {number}
         */
        this.dpr = dpr;
    };

    Layer.prototype = {

        constructor: Layer,

        elCount: 0,

        __dirty: true,

        initContext: function () {
            this.ctx = this.dom.getContext('2d');
            this.ctx.__currentValues = {};
            this.ctx.dpr = this.dpr;
        },

        createBackBuffer: function () {
            var dpr = this.dpr;

            this.domBack = createDom('back-' + this.id, 'canvas', this.painter, dpr);
            this.ctxBack = this.domBack.getContext('2d');
            this.ctxBack.__currentValues = {};

            if (dpr != 1) {
                this.ctxBack.scale(dpr, dpr);
            }
        },

        /**
         * @param  {number} width
         * @param  {number} height
         */
        resize: function (width, height) {
            var dpr = this.dpr;

            var dom = this.dom;
            var domStyle = dom.style;
            var domBack = this.domBack;

            domStyle.width = width + 'px';
            domStyle.height = height + 'px';

            dom.width = width * dpr;
            dom.height = height * dpr;

            if (domBack) {
                domBack.width = width * dpr;
                domBack.height = height * dpr;

                if (dpr != 1) {
                    this.ctxBack.scale(dpr, dpr);
                }
            }
        },

        /**
         * 清空该层画布
         * @param {boolean} clearAll Clear all with out motion blur
         */
        clear: function (clearAll) {
            var dom = this.dom;
            var ctx = this.ctx;
            var width = dom.width;
            var height = dom.height;

            var clearColor = this.clearColor;
            var haveMotionBLur = this.motionBlur && !clearAll;
            var lastFrameAlpha = this.lastFrameAlpha;

            var dpr = this.dpr;

            if (haveMotionBLur) {
                if (!this.domBack) {
                    this.createBackBuffer();
                }

                this.ctxBack.globalCompositeOperation = 'copy';
                this.ctxBack.drawImage(
                    dom, 0, 0,
                    width / dpr,
                    height / dpr
                );
            }

            ctx.clearRect(0, 0, width, height);
            if (clearColor) {
                var clearColorGradientOrPattern;
                // Gradient
                if (clearColor.colorStops) {
                    // Cache canvas gradient
                    clearColorGradientOrPattern = clearColor.__canvasGradient || Style.getGradient(ctx, clearColor, {
                        x: 0,
                        y: 0,
                        width: width,
                        height: height
                    });

                    clearColor.__canvasGradient = clearColorGradientOrPattern;
                }
                // Pattern
                else if (clearColor.image) {
                    clearColorGradientOrPattern = Pattern.prototype.getCanvasPattern.call(clearColor, ctx);
                }
                ctx.save();
                ctx.fillStyle = clearColorGradientOrPattern || clearColor;
                ctx.fillRect(0, 0, width, height);
                ctx.restore();
            }

            if (haveMotionBLur) {
                var domBack = this.domBack;
                ctx.save();
                ctx.globalAlpha = lastFrameAlpha;
                ctx.drawImage(domBack, 0, 0, width, height);
                ctx.restore();
            }
        }
    };

    return Layer;
});