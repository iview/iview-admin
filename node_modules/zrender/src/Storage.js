/**
 * Storage内容仓库模块
 * @module zrender/Storage
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 * @author errorrik (errorrik@gmail.com)
 * @author pissang (https://github.com/pissang/)
 */
define(function (require) {

    'use strict';

    var util = require('./core/util');
    var env = require('./core/env');

    var Group = require('./container/Group');

    // Use timsort because in most case elements are partially sorted
    // https://jsfiddle.net/pissang/jr4x7mdm/8/
    var timsort = require('./core/timsort');

    function shapeCompareFunc(a, b) {
        if (a.zlevel === b.zlevel) {
            if (a.z === b.z) {
                // if (a.z2 === b.z2) {
                //     // FIXME Slow has renderidx compare
                //     // http://stackoverflow.com/questions/20883421/sorting-in-javascript-should-every-compare-function-have-a-return-0-statement
                //     // https://github.com/v8/v8/blob/47cce544a31ed5577ffe2963f67acb4144ee0232/src/js/array.js#L1012
                //     return a.__renderidx - b.__renderidx;
                // }
                return a.z2 - b.z2;
            }
            return a.z - b.z;
        }
        return a.zlevel - b.zlevel;
    }
    /**
     * 内容仓库 (M)
     * @alias module:zrender/Storage
     * @constructor
     */
    var Storage = function () {
        this._roots = [];

        this._displayList = [];

        this._displayListLen = 0;
    };

    Storage.prototype = {

        constructor: Storage,

        /**
         * @param  {Function} cb
         *
         */
        traverse: function (cb, context) {
            for (var i = 0; i < this._roots.length; i++) {
                this._roots[i].traverse(cb, context);
            }
        },

        /**
         * 返回所有图形的绘制队列
         * @param {boolean} [update=false] 是否在返回前更新该数组
         * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组, 在 update 为 true 的时候有效
         *
         * 详见{@link module:zrender/graphic/Displayable.prototype.updateDisplayList}
         * @return {Array.<module:zrender/graphic/Displayable>}
         */
        getDisplayList: function (update, includeIgnore) {
            includeIgnore = includeIgnore || false;
            if (update) {
                this.updateDisplayList(includeIgnore);
            }
            return this._displayList;
        },

        /**
         * 更新图形的绘制队列。
         * 每次绘制前都会调用，该方法会先深度优先遍历整个树，更新所有Group和Shape的变换并且把所有可见的Shape保存到数组中，
         * 最后根据绘制的优先级（zlevel > z > 插入顺序）排序得到绘制队列
         * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组
         */
        updateDisplayList: function (includeIgnore) {
            this._displayListLen = 0;
            var roots = this._roots;
            var displayList = this._displayList;
            for (var i = 0, len = roots.length; i < len; i++) {
                this._updateAndAddDisplayable(roots[i], null, includeIgnore);
            }
            displayList.length = this._displayListLen;

            // for (var i = 0, len = displayList.length; i < len; i++) {
            //     displayList[i].__renderidx = i;
            // }

            // displayList.sort(shapeCompareFunc);
            env.canvasSupported && timsort(displayList, shapeCompareFunc);
        },

        _updateAndAddDisplayable: function (el, clipPaths, includeIgnore) {

            if (el.ignore && !includeIgnore) {
                return;
            }

            el.beforeUpdate();

            if (el.__dirty) {

                el.update();

            }

            el.afterUpdate();

            var userSetClipPath = el.clipPath;
            if (userSetClipPath) {

                // FIXME 效率影响
                if (clipPaths) {
                    clipPaths = clipPaths.slice();
                }
                else {
                    clipPaths = [];
                }

                var currentClipPath = userSetClipPath;
                var parentClipPath = el;
                // Recursively add clip path
                while (currentClipPath) {
                    // clipPath 的变换是基于使用这个 clipPath 的元素
                    currentClipPath.parent = parentClipPath;
                    currentClipPath.updateTransform();

                    clipPaths.push(currentClipPath);

                    parentClipPath = currentClipPath;
                    currentClipPath = currentClipPath.clipPath;
                }
            }

            if (el.isGroup) {
                var children = el._children;

                for (var i = 0; i < children.length; i++) {
                    var child = children[i];

                    // Force to mark as dirty if group is dirty
                    // FIXME __dirtyPath ?
                    if (el.__dirty) {
                        child.__dirty = true;
                    }

                    this._updateAndAddDisplayable(child, clipPaths, includeIgnore);
                }

                // Mark group clean here
                el.__dirty = false;

            }
            else {
                el.__clipPaths = clipPaths;

                this._displayList[this._displayListLen++] = el;
            }
        },

        /**
         * 添加图形(Shape)或者组(Group)到根节点
         * @param {module:zrender/Element} el
         */
        addRoot: function (el) {
            if (el.__storage === this) {
                return;
            }

            if (el instanceof Group) {
                el.addChildrenToStorage(this);
            }

            this.addToStorage(el);
            this._roots.push(el);
        },

        /**
         * 删除指定的图形(Shape)或者组(Group)
         * @param {string|Array.<string>} [el] 如果为空清空整个Storage
         */
        delRoot: function (el) {
            if (el == null) {
                // 不指定el清空
                for (var i = 0; i < this._roots.length; i++) {
                    var root = this._roots[i];
                    if (root instanceof Group) {
                        root.delChildrenFromStorage(this);
                    }
                }

                this._roots = [];
                this._displayList = [];
                this._displayListLen = 0;

                return;
            }

            if (el instanceof Array) {
                for (var i = 0, l = el.length; i < l; i++) {
                    this.delRoot(el[i]);
                }
                return;
            }


            var idx = util.indexOf(this._roots, el);
            if (idx >= 0) {
                this.delFromStorage(el);
                this._roots.splice(idx, 1);
                if (el instanceof Group) {
                    el.delChildrenFromStorage(this);
                }
            }
        },

        addToStorage: function (el) {
            el.__storage = this;
            el.dirty(false);

            return this;
        },

        delFromStorage: function (el) {
            if (el) {
                el.__storage = null;
            }

            return this;
        },

        /**
         * 清空并且释放Storage
         */
        dispose: function () {
            this._renderList =
            this._roots = null;
        },

        displayableSortFunc: shapeCompareFunc
    };

    return Storage;
});
