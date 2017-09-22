'use strict';
/**
 * @module zrender/Element
 */


    var guid = require('./core/guid');
    var Eventful = require('./mixin/Eventful');
    var Transformable = require('./mixin/Transformable');
    var Animatable = require('./mixin/Animatable');
    var zrUtil = require('./core/util');

    /**
     * @alias module:zrender/Element
     * @constructor
     * @extends {module:zrender/mixin/Animatable}
     * @extends {module:zrender/mixin/Transformable}
     * @extends {module:zrender/mixin/Eventful}
     */
    var Element = function (opts) {

        Transformable.call(this, opts);
        Eventful.call(this, opts);
        Animatable.call(this, opts);

        /**
         * 画布元素ID
         * @type {string}
         */
        this.id = opts.id || guid();
    };

    Element.prototype = {

        /**
         * 元素类型
         * Element type
         * @type {string}
         */
        type: 'element',

        /**
         * 元素名字
         * Element name
         * @type {string}
         */
        name: '',

        /**
         * ZRender 实例对象，会在 element 添加到 zrender 实例中后自动赋值
         * ZRender instance will be assigned when element is associated with zrender
         * @name module:/zrender/Element#__zr
         * @type {module:zrender/ZRender}
         */
        __zr: null,

        /**
         * 图形是否忽略，为true时忽略图形的绘制以及事件触发
         * If ignore drawing and events of the element object
         * @name module:/zrender/Element#ignore
         * @type {boolean}
         * @default false
         */
        ignore: false,

        /**
         * 用于裁剪的路径(shape)，所有 Group 内的路径在绘制时都会被这个路径裁剪
         * 该路径会继承被裁减对象的变换
         * @type {module:zrender/graphic/Path}
         * @see http://www.w3.org/TR/2dcontext/#clipping-region
         * @readOnly
         */
        clipPath: null,

        /**
         * Drift element
         * @param  {number} dx dx on the global space
         * @param  {number} dy dy on the global space
         */
        drift: function (dx, dy) {
            switch (this.draggable) {
                case 'horizontal':
                    dy = 0;
                    break;
                case 'vertical':
                    dx = 0;
                    break;
            }

            var m = this.transform;
            if (!m) {
                m = this.transform = [1, 0, 0, 1, 0, 0];
            }
            m[4] += dx;
            m[5] += dy;

            this.decomposeTransform();
            this.dirty(false);
        },

        /**
         * Hook before update
         */
        beforeUpdate: function () {},
        /**
         * Hook after update
         */
        afterUpdate: function () {},
        /**
         * Update each frame
         */
        update: function () {
            this.updateTransform();
        },

        /**
         * @param  {Function} cb
         * @param  {}   context
         */
        traverse: function (cb, context) {},

        /**
         * @protected
         */
        attrKV: function (key, value) {
            if (key === 'position' || key === 'scale' || key === 'origin') {
                // Copy the array
                if (value) {
                    var target = this[key];
                    if (!target) {
                        target = this[key] = [];
                    }
                    target[0] = value[0];
                    target[1] = value[1];
                }
            }
            else {
                this[key] = value;
            }
        },

        /**
         * Hide the element
         */
        hide: function () {
            this.ignore = true;
            this.__zr && this.__zr.refresh();
        },

        /**
         * Show the element
         */
        show: function () {
            this.ignore = false;
            this.__zr && this.__zr.refresh();
        },

        /**
         * @param {string|Object} key
         * @param {*} value
         */
        attr: function (key, value) {
            if (typeof key === 'string') {
                this.attrKV(key, value);
            }
            else if (zrUtil.isObject(key)) {
                for (var name in key) {
                    if (key.hasOwnProperty(name)) {
                        this.attrKV(name, key[name]);
                    }
                }
            }

            this.dirty(false);

            return this;
        },

        /**
         * @param {module:zrender/graphic/Path} clipPath
         */
        setClipPath: function (clipPath) {
            var zr = this.__zr;
            if (zr) {
                clipPath.addSelfToZr(zr);
            }

            // Remove previous clip path
            if (this.clipPath && this.clipPath !== clipPath) {
                this.removeClipPath();
            }

            this.clipPath = clipPath;
            clipPath.__zr = zr;
            clipPath.__clipTarget = this;

            this.dirty(false);
        },

        /**
         */
        removeClipPath: function () {
            var clipPath = this.clipPath;
            if (clipPath) {
                if (clipPath.__zr) {
                    clipPath.removeSelfFromZr(clipPath.__zr);
                }

                clipPath.__zr = null;
                clipPath.__clipTarget = null;
                this.clipPath = null;

                this.dirty(false);
            }
        },

        /**
         * Add self from zrender instance.
         * Not recursively because it will be invoked when element added to storage.
         * @param {module:zrender/ZRender} zr
         */
        addSelfToZr: function (zr) {
            this.__zr = zr;
            // 添加动画
            var animators = this.animators;
            if (animators) {
                for (var i = 0; i < animators.length; i++) {
                    zr.animation.addAnimator(animators[i]);
                }
            }

            if (this.clipPath) {
                this.clipPath.addSelfToZr(zr);
            }
        },

        /**
         * Remove self from zrender instance.
         * Not recursively because it will be invoked when element added to storage.
         * @param {module:zrender/ZRender} zr
         */
        removeSelfFromZr: function (zr) {
            this.__zr = null;
            // 移除动画
            var animators = this.animators;
            if (animators) {
                for (var i = 0; i < animators.length; i++) {
                    zr.animation.removeAnimator(animators[i]);
                }
            }

            if (this.clipPath) {
                this.clipPath.removeSelfFromZr(zr);
            }
        }
    };

    zrUtil.mixin(Element, Animatable);
    zrUtil.mixin(Element, Transformable);
    zrUtil.mixin(Element, Eventful);

    module.exports = Element;
