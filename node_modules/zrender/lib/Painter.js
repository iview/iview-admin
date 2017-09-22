'use strict';
/**
 * Default canvas painter
 * @module zrender/Painter
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 *         errorrik (errorrik@gmail.com)
 *         pissang (https://www.github.com/pissang)
 */
 

    var config = require('./config');
    var util = require('./core/util');
    var log = require('./core/log');
    var BoundingRect = require('./core/BoundingRect');
    var timsort = require('./core/timsort');

    var Layer = require('./Layer');

    var requestAnimationFrame = require('./animation/requestAnimationFrame');

    // PENDIGN
    // Layer exceeds MAX_PROGRESSIVE_LAYER_NUMBER may have some problem when flush directly second time.
    //
    // Maximum progressive layer. When exceeding this number. All elements will be drawed in the last layer.
    var MAX_PROGRESSIVE_LAYER_NUMBER = 5;

    function parseInt10(val) {
        return parseInt(val, 10);
    }

    function isLayerValid(layer) {
        if (!layer) {
            return false;
        }

        if (layer.__builtin__) {
            return true;
        }

        if (typeof(layer.resize) !== 'function'
            || typeof(layer.refresh) !== 'function'
        ) {
            return false;
        }

        return true;
    }

    function preProcessLayer(layer) {
        layer.__unusedCount++;
    }

    function postProcessLayer(layer) {
        if (layer.__unusedCount == 1) {
            layer.clear();
        }
    }

    var tmpRect = new BoundingRect(0, 0, 0, 0);
    var viewRect = new BoundingRect(0, 0, 0, 0);
    function isDisplayableCulled(el, width, height) {
        tmpRect.copy(el.getBoundingRect());
        if (el.transform) {
            tmpRect.applyTransform(el.transform);
        }
        viewRect.width = width;
        viewRect.height = height;
        return !tmpRect.intersect(viewRect);
    }

    function isClipPathChanged(clipPaths, prevClipPaths) {
        if (clipPaths == prevClipPaths) { // Can both be null or undefined
            return false;
        }

        if (!clipPaths || !prevClipPaths || (clipPaths.length !== prevClipPaths.length)) {
            return true;
        }
        for (var i = 0; i < clipPaths.length; i++) {
            if (clipPaths[i] !== prevClipPaths[i]) {
                return true;
            }
        }
    }

    function doClip(clipPaths, ctx) {
        for (var i = 0; i < clipPaths.length; i++) {
            var clipPath = clipPaths[i];

            clipPath.setTransform(ctx);
            ctx.beginPath();
            clipPath.buildPath(ctx, clipPath.shape);
            ctx.clip();
            // Transform back
            clipPath.restoreTransform(ctx);
        }
    }

    function createRoot(width, height) {
        var domRoot = document.createElement('div');

        // domRoot.onselectstart = returnFalse; // 避免页面选中的尴尬
        domRoot.style.cssText = [
            'position:relative',
            'overflow:hidden',
            'width:' + width + 'px',
            'height:' + height + 'px',
            'padding:0',
            'margin:0',
            'border-width:0'
        ].join(';') + ';';

        return domRoot;
    }

    /**
     * @alias module:zrender/Painter
     * @constructor
     * @param {HTMLElement} root 绘图容器
     * @param {module:zrender/Storage} storage
     * @param {Object} opts
     */
    var Painter = function (root, storage, opts) {
        // In node environment using node-canvas
        var singleCanvas = !root.nodeName // In node ?
            || root.nodeName.toUpperCase() === 'CANVAS';

        this._opts = opts = util.extend({}, opts || {});

        /**
         * @type {number}
         */
        this.dpr = opts.devicePixelRatio || config.devicePixelRatio;
        /**
         * @type {boolean}
         * @private
         */
        this._singleCanvas = singleCanvas;
        /**
         * 绘图容器
         * @type {HTMLElement}
         */
        this.root = root;

        var rootStyle = root.style;

        if (rootStyle) {
            rootStyle['-webkit-tap-highlight-color'] = 'transparent';
            rootStyle['-webkit-user-select'] =
            rootStyle['user-select'] =
            rootStyle['-webkit-touch-callout'] = 'none';

            root.innerHTML = '';
        }

        /**
         * @type {module:zrender/Storage}
         */
        this.storage = storage;

        /**
         * @type {Array.<number>}
         * @private
         */
        var zlevelList = this._zlevelList = [];

        /**
         * @type {Object.<string, module:zrender/Layer>}
         * @private
         */
        var layers = this._layers = {};

        /**
         * @type {Object.<string, Object>}
         * @type {private}
         */
        this._layerConfig = {};

        if (!singleCanvas) {
            this._width = this._getSize(0);
            this._height = this._getSize(1);

            var domRoot = this._domRoot = createRoot(
                this._width, this._height
            );
            root.appendChild(domRoot);
        }
        else {
            if (opts.width != null) {
                root.width = opts.width;
            }
            if (opts.height != null) {
                root.height = opts.height;
            }
            // Use canvas width and height directly
            var width = root.width;
            var height = root.height;
            this._width = width;
            this._height = height;

            // Create layer if only one given canvas
            // Device pixel ratio is fixed to 1 because given canvas has its specified width and height
            var mainLayer = new Layer(root, this, 1);
            mainLayer.initContext();
            // FIXME Use canvas width and height
            // mainLayer.resize(width, height);
            layers[0] = mainLayer;
            zlevelList.push(0);

            this._domRoot = root;
        }

        // Layers for progressive rendering
        this._progressiveLayers = [];

        /**
         * @type {module:zrender/Layer}
         * @private
         */
        this._hoverlayer;

        this._hoverElements = [];
    };

    Painter.prototype = {

        constructor: Painter,

        /**
         * If painter use a single canvas
         * @return {boolean}
         */
        isSingleCanvas: function () {
            return this._singleCanvas;
        },
        /**
         * @return {HTMLDivElement}
         */
        getViewportRoot: function () {
            return this._domRoot;
        },

        getViewportRootOffset: function () {
            var viewportRoot = this.getViewportRoot();
            if (viewportRoot) {
                return {
                    offsetLeft: viewportRoot.offsetLeft || 0,
                    offsetTop: viewportRoot.offsetTop || 0
                };
            }
        },

        /**
         * 刷新
         * @param {boolean} [paintAll=false] 强制绘制所有displayable
         */
        refresh: function (paintAll) {

            var list = this.storage.getDisplayList(true);

            var zlevelList = this._zlevelList;

            this._paintList(list, paintAll);

            // Paint custum layers
            for (var i = 0; i < zlevelList.length; i++) {
                var z = zlevelList[i];
                var layer = this._layers[z];
                if (!layer.__builtin__ && layer.refresh) {
                    layer.refresh();
                }
            }

            this.refreshHover();

            if (this._progressiveLayers.length) {
                this._startProgessive();
            }

            return this;
        },

        addHover: function (el, hoverStyle) {
            if (el.__hoverMir) {
                return;
            }
            var elMirror = new el.constructor({
                style: el.style,
                shape: el.shape
            });
            elMirror.__from = el;
            el.__hoverMir = elMirror;
            elMirror.setStyle(hoverStyle);
            this._hoverElements.push(elMirror);
        },

        removeHover: function (el) {
            var elMirror = el.__hoverMir;
            var hoverElements = this._hoverElements;
            var idx = util.indexOf(hoverElements, elMirror);
            if (idx >= 0) {
                hoverElements.splice(idx, 1);
            }
            el.__hoverMir = null;
        },

        clearHover: function (el) {
            var hoverElements = this._hoverElements;
            for (var i = 0; i < hoverElements.length; i++) {
                var from = hoverElements[i].__from;
                if (from) {
                    from.__hoverMir = null;
                }
            }
            hoverElements.length = 0;
        },

        refreshHover: function () {
            var hoverElements = this._hoverElements;
            var len = hoverElements.length;
            var hoverLayer = this._hoverlayer;
            hoverLayer && hoverLayer.clear();

            if (!len) {
                return;
            }
            timsort(hoverElements, this.storage.displayableSortFunc);

            // Use a extream large zlevel
            // FIXME?
            if (!hoverLayer) {
                hoverLayer = this._hoverlayer = this.getLayer(1e5);
            }

            var scope = {};
            hoverLayer.ctx.save();
            for (var i = 0; i < len;) {
                var el = hoverElements[i];
                var originalEl = el.__from;
                // Original el is removed
                // PENDING
                if (!(originalEl && originalEl.__zr)) {
                    hoverElements.splice(i, 1);
                    originalEl.__hoverMir = null;
                    len--;
                    continue;
                }
                i++;

                // Use transform
                // FIXME style and shape ?
                if (!originalEl.invisible) {
                    el.transform = originalEl.transform;
                    el.invTransform = originalEl.invTransform;
                    el.__clipPaths = originalEl.__clipPaths;
                    // el.
                    this._doPaintEl(el, hoverLayer, true, scope);
                }
            }
            hoverLayer.ctx.restore();
        },

        _startProgessive: function () {
            var self = this;

            if (!self._furtherProgressive) {
                return;
            }

            // Use a token to stop progress steps triggered by
            // previous zr.refresh calling.
            var token = self._progressiveToken = +new Date();

            self._progress++;
            requestAnimationFrame(step);

            function step() {
                // In case refreshed or disposed
                if (token === self._progressiveToken && self.storage) {

                    self._doPaintList(self.storage.getDisplayList());

                    if (self._furtherProgressive) {
                        self._progress++;
                        requestAnimationFrame(step);
                    }
                    else {
                        self._progressiveToken = -1;
                    }
                }
            }
        },

        _clearProgressive: function () {
            this._progressiveToken = -1;
            this._progress = 0;
            util.each(this._progressiveLayers, function (layer) {
                layer.__dirty && layer.clear();
            });
        },

        _paintList: function (list, paintAll) {

            if (paintAll == null) {
                paintAll = false;
            }

            this._updateLayerStatus(list);

            this._clearProgressive();

            this.eachBuiltinLayer(preProcessLayer);

            this._doPaintList(list, paintAll);

            this.eachBuiltinLayer(postProcessLayer);
        },

        _doPaintList: function (list, paintAll) {
            var currentLayer;
            var currentZLevel;
            var ctx;

            // var invTransform = [];
            var scope;

            var progressiveLayerIdx = 0;
            var currentProgressiveLayer;

            var width = this._width;
            var height = this._height;
            var layerProgress;
            var frame = this._progress;
            function flushProgressiveLayer(layer) {
                var dpr = ctx.dpr || 1;
                ctx.save();
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
                // Avoid layer don't clear in next progressive frame
                currentLayer.__dirty = true;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.drawImage(layer.dom, 0, 0, width * dpr, height * dpr);
                ctx.restore();
            }

            for (var i = 0, l = list.length; i < l; i++) {
                var el = list[i];
                var elZLevel = this._singleCanvas ? 0 : el.zlevel;

                var elFrame = el.__frame;

                // Flush at current context
                // PENDING
                if (elFrame < 0 && currentProgressiveLayer) {
                    flushProgressiveLayer(currentProgressiveLayer);
                    currentProgressiveLayer = null;
                }

                // Change draw layer
                if (currentZLevel !== elZLevel) {
                    if (ctx) {
                        ctx.restore();
                    }

                    // Reset scope
                    scope = {};

                    // Only 0 zlevel if only has one canvas
                    currentZLevel = elZLevel;
                    currentLayer = this.getLayer(currentZLevel);

                    if (!currentLayer.__builtin__) {
                        log(
                            'ZLevel ' + currentZLevel
                            + ' has been used by unkown layer ' + currentLayer.id
                        );
                    }

                    ctx = currentLayer.ctx;
                    ctx.save();

                    // Reset the count
                    currentLayer.__unusedCount = 0;

                    if (currentLayer.__dirty || paintAll) {
                        currentLayer.clear();
                    }
                }

                if (!(currentLayer.__dirty || paintAll)) {
                    continue;
                }

                if (elFrame >= 0) {
                    // Progressive layer changed
                    if (!currentProgressiveLayer) {
                        currentProgressiveLayer = this._progressiveLayers[
                            Math.min(progressiveLayerIdx++, MAX_PROGRESSIVE_LAYER_NUMBER - 1)
                        ];

                        currentProgressiveLayer.ctx.save();
                        currentProgressiveLayer.renderScope = {};

                        if (currentProgressiveLayer
                            && (currentProgressiveLayer.__progress > currentProgressiveLayer.__maxProgress)
                        ) {
                            // flushProgressiveLayer(currentProgressiveLayer);
                            // Quick jump all progressive elements
                            // All progressive element are not dirty, jump over and flush directly
                            i = currentProgressiveLayer.__nextIdxNotProg - 1;
                            // currentProgressiveLayer = null;
                            continue;
                        }

                        layerProgress = currentProgressiveLayer.__progress;

                        if (!currentProgressiveLayer.__dirty) {
                            // Keep rendering
                            frame = layerProgress;
                        }

                        currentProgressiveLayer.__progress = frame + 1;
                    }

                    if (elFrame === frame) {
                        this._doPaintEl(el, currentProgressiveLayer, true, currentProgressiveLayer.renderScope);
                    }
                }
                else {
                    this._doPaintEl(el, currentLayer, paintAll, scope);
                }

                el.__dirty = false;
            }

            if (currentProgressiveLayer) {
                flushProgressiveLayer(currentProgressiveLayer);
            }

            // Restore the lastLayer ctx
            ctx && ctx.restore();
            // If still has clipping state
            // if (scope.prevElClipPaths) {
            //     ctx.restore();
            // }

            this._furtherProgressive = false;
            util.each(this._progressiveLayers, function (layer) {
                if (layer.__maxProgress >= layer.__progress) {
                    this._furtherProgressive = true;
                }
            }, this);
        },

        _doPaintEl: function (el, currentLayer, forcePaint, scope) {
            var ctx = currentLayer.ctx;
            var m = el.transform;
            if (
                (currentLayer.__dirty || forcePaint)
                // Ignore invisible element
                && !el.invisible
                // Ignore transparent element
                && el.style.opacity !== 0
                // Ignore scale 0 element, in some environment like node-canvas
                // Draw a scale 0 element can cause all following draw wrong
                // And setTransform with scale 0 will cause set back transform failed.
                && !(m && !m[0] && !m[3])
                // Ignore culled element
                && !(el.culling && isDisplayableCulled(el, this._width, this._height))
            ) {

                var clipPaths = el.__clipPaths;

                // Optimize when clipping on group with several elements
                if (scope.prevClipLayer !== currentLayer
                    || isClipPathChanged(clipPaths, scope.prevElClipPaths)
                ) {
                    // If has previous clipping state, restore from it
                    if (scope.prevElClipPaths) {
                        scope.prevClipLayer.ctx.restore();
                        scope.prevClipLayer = scope.prevElClipPaths = null;

                        // Reset prevEl since context has been restored
                        scope.prevEl = null;
                    }
                    // New clipping state
                    if (clipPaths) {
                        ctx.save();
                        doClip(clipPaths, ctx);
                        scope.prevClipLayer = currentLayer;
                        scope.prevElClipPaths = clipPaths;
                    }
                }
                el.beforeBrush && el.beforeBrush(ctx);

                el.brush(ctx, scope.prevEl || null);
                scope.prevEl = el;

                el.afterBrush && el.afterBrush(ctx);
            }
        },

        /**
         * 获取 zlevel 所在层，如果不存在则会创建一个新的层
         * @param {number} zlevel
         * @return {module:zrender/Layer}
         */
        getLayer: function (zlevel) {
            if (this._singleCanvas) {
                return this._layers[0];
            }

            var layer = this._layers[zlevel];
            if (!layer) {
                // Create a new layer
                layer = new Layer('zr_' + zlevel, this, this.dpr);
                layer.__builtin__ = true;

                if (this._layerConfig[zlevel]) {
                    util.merge(layer, this._layerConfig[zlevel], true);
                }

                this.insertLayer(zlevel, layer);

                // Context is created after dom inserted to document
                // Or excanvas will get 0px clientWidth and clientHeight
                layer.initContext();
            }

            return layer;
        },

        insertLayer: function (zlevel, layer) {

            var layersMap = this._layers;
            var zlevelList = this._zlevelList;
            var len = zlevelList.length;
            var prevLayer = null;
            var i = -1;
            var domRoot = this._domRoot;

            if (layersMap[zlevel]) {
                log('ZLevel ' + zlevel + ' has been used already');
                return;
            }
            // Check if is a valid layer
            if (!isLayerValid(layer)) {
                log('Layer of zlevel ' + zlevel + ' is not valid');
                return;
            }

            if (len > 0 && zlevel > zlevelList[0]) {
                for (i = 0; i < len - 1; i++) {
                    if (
                        zlevelList[i] < zlevel
                        && zlevelList[i + 1] > zlevel
                    ) {
                        break;
                    }
                }
                prevLayer = layersMap[zlevelList[i]];
            }
            zlevelList.splice(i + 1, 0, zlevel);

            layersMap[zlevel] = layer;

            // Vitual layer will not directly show on the screen.
            // (It can be a WebGL layer and assigned to a ZImage element)
            // But it still under management of zrender.
            if (!layer.virtual) {
                if (prevLayer) {
                    var prevDom = prevLayer.dom;
                    if (prevDom.nextSibling) {
                        domRoot.insertBefore(
                            layer.dom,
                            prevDom.nextSibling
                        );
                    }
                    else {
                        domRoot.appendChild(layer.dom);
                    }
                }
                else {
                    if (domRoot.firstChild) {
                        domRoot.insertBefore(layer.dom, domRoot.firstChild);
                    }
                    else {
                        domRoot.appendChild(layer.dom);
                    }
                }
            }
        },

        // Iterate each layer
        eachLayer: function (cb, context) {
            var zlevelList = this._zlevelList;
            var z;
            var i;
            for (i = 0; i < zlevelList.length; i++) {
                z = zlevelList[i];
                cb.call(context, this._layers[z], z);
            }
        },

        // Iterate each buildin layer
        eachBuiltinLayer: function (cb, context) {
            var zlevelList = this._zlevelList;
            var layer;
            var z;
            var i;
            for (i = 0; i < zlevelList.length; i++) {
                z = zlevelList[i];
                layer = this._layers[z];
                if (layer.__builtin__) {
                    cb.call(context, layer, z);
                }
            }
        },

        // Iterate each other layer except buildin layer
        eachOtherLayer: function (cb, context) {
            var zlevelList = this._zlevelList;
            var layer;
            var z;
            var i;
            for (i = 0; i < zlevelList.length; i++) {
                z = zlevelList[i];
                layer = this._layers[z];
                if (!layer.__builtin__) {
                    cb.call(context, layer, z);
                }
            }
        },

        /**
         * 获取所有已创建的层
         * @param {Array.<module:zrender/Layer>} [prevLayer]
         */
        getLayers: function () {
            return this._layers;
        },

        _updateLayerStatus: function (list) {

            var layers = this._layers;
            var progressiveLayers = this._progressiveLayers;

            var elCountsLastFrame = {};
            var progressiveElCountsLastFrame = {};

            this.eachBuiltinLayer(function (layer, z) {
                elCountsLastFrame[z] = layer.elCount;
                layer.elCount = 0;
                layer.__dirty = false;
            });

            util.each(progressiveLayers, function (layer, idx) {
                progressiveElCountsLastFrame[idx] = layer.elCount;
                layer.elCount = 0;
                layer.__dirty = false;
            });

            var progressiveLayerCount = 0;
            var currentProgressiveLayer;
            var lastProgressiveKey;
            var frameCount = 0;
            for (var i = 0, l = list.length; i < l; i++) {
                var el = list[i];
                var zlevel = this._singleCanvas ? 0 : el.zlevel;
                var layer = layers[zlevel];
                var elProgress = el.progressive;
                if (layer) {
                    layer.elCount++;
                    layer.__dirty = layer.__dirty || el.__dirty;
                }

                /////// Update progressive
                if (elProgress >= 0) {
                    // Fix wrong progressive sequence problem.
                    if (lastProgressiveKey !== elProgress) {
                        lastProgressiveKey = elProgress;
                        frameCount++;
                    }
                    var elFrame = el.__frame = frameCount - 1;
                    if (!currentProgressiveLayer) {
                        var idx = Math.min(progressiveLayerCount, MAX_PROGRESSIVE_LAYER_NUMBER - 1);
                        currentProgressiveLayer = progressiveLayers[idx];
                        if (!currentProgressiveLayer) {
                            currentProgressiveLayer = progressiveLayers[idx] = new Layer(
                                'progressive', this, this.dpr
                            );
                            currentProgressiveLayer.initContext();
                        }
                        currentProgressiveLayer.__maxProgress = 0;
                    }
                    currentProgressiveLayer.__dirty = currentProgressiveLayer.__dirty || el.__dirty;
                    currentProgressiveLayer.elCount++;

                    currentProgressiveLayer.__maxProgress = Math.max(
                        currentProgressiveLayer.__maxProgress, elFrame
                    );

                    if (currentProgressiveLayer.__maxProgress >= currentProgressiveLayer.__progress) {
                        // Should keep rendering this  layer because progressive rendering is not finished yet
                        layer.__dirty = true;
                    }
                }
                else {
                    el.__frame = -1;

                    if (currentProgressiveLayer) {
                        currentProgressiveLayer.__nextIdxNotProg = i;
                        progressiveLayerCount++;
                        currentProgressiveLayer = null;
                    }
                }
            }

            if (currentProgressiveLayer) {
                progressiveLayerCount++;
                currentProgressiveLayer.__nextIdxNotProg = i;
            }

            // 层中的元素数量有发生变化
            this.eachBuiltinLayer(function (layer, z) {
                if (elCountsLastFrame[z] !== layer.elCount) {
                    layer.__dirty = true;
                }
            });

            progressiveLayers.length = Math.min(progressiveLayerCount, MAX_PROGRESSIVE_LAYER_NUMBER);
            util.each(progressiveLayers, function (layer, idx) {
                if (progressiveElCountsLastFrame[idx] !== layer.elCount) {
                    el.__dirty = true;
                }
                if (layer.__dirty) {
                    layer.__progress = 0;
                }
            });
        },

        /**
         * 清除hover层外所有内容
         */
        clear: function () {
            this.eachBuiltinLayer(this._clearLayer);
            return this;
        },

        _clearLayer: function (layer) {
            layer.clear();
        },

        /**
         * 修改指定zlevel的绘制参数
         *
         * @param {string} zlevel
         * @param {Object} config 配置对象
         * @param {string} [config.clearColor=0] 每次清空画布的颜色
         * @param {string} [config.motionBlur=false] 是否开启动态模糊
         * @param {number} [config.lastFrameAlpha=0.7]
         *                 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
         */
        configLayer: function (zlevel, config) {
            if (config) {
                var layerConfig = this._layerConfig;
                if (!layerConfig[zlevel]) {
                    layerConfig[zlevel] = config;
                }
                else {
                    util.merge(layerConfig[zlevel], config, true);
                }

                var layer = this._layers[zlevel];

                if (layer) {
                    util.merge(layer, layerConfig[zlevel], true);
                }
            }
        },

        /**
         * 删除指定层
         * @param {number} zlevel 层所在的zlevel
         */
        delLayer: function (zlevel) {
            var layers = this._layers;
            var zlevelList = this._zlevelList;
            var layer = layers[zlevel];
            if (!layer) {
                return;
            }
            layer.dom.parentNode.removeChild(layer.dom);
            delete layers[zlevel];

            zlevelList.splice(util.indexOf(zlevelList, zlevel), 1);
        },

        /**
         * 区域大小变化后重绘
         */
        resize: function (width, height) {
            var domRoot = this._domRoot;
            // FIXME Why ?
            domRoot.style.display = 'none';

            // Save input w/h
            var opts = this._opts;
            width != null && (opts.width = width);
            height != null && (opts.height = height);

            width = this._getSize(0);
            height = this._getSize(1);

            domRoot.style.display = '';

            // 优化没有实际改变的resize
            if (this._width != width || height != this._height) {
                domRoot.style.width = width + 'px';
                domRoot.style.height = height + 'px';

                for (var id in this._layers) {
                    if (this._layers.hasOwnProperty(id)) {
                        this._layers[id].resize(width, height);
                    }
                }
                util.each(this._progressiveLayers, function (layer) {
                    layer.resize(width, height);
                });

                this.refresh(true);
            }

            this._width = width;
            this._height = height;

            return this;
        },

        /**
         * 清除单独的一个层
         * @param {number} zlevel
         */
        clearLayer: function (zlevel) {
            var layer = this._layers[zlevel];
            if (layer) {
                layer.clear();
            }
        },

        /**
         * 释放
         */
        dispose: function () {
            this.root.innerHTML = '';

            this.root =
            this.storage =

            this._domRoot =
            this._layers = null;
        },

        /**
         * Get canvas which has all thing rendered
         * @param {Object} opts
         * @param {string} [opts.backgroundColor]
         */
        getRenderedCanvas: function (opts) {
            opts = opts || {};
            if (this._singleCanvas) {
                return this._layers[0].dom;
            }

            var imageLayer = new Layer('image', this, opts.pixelRatio || this.dpr);
            imageLayer.initContext();

            imageLayer.clearColor = opts.backgroundColor;
            imageLayer.clear();

            var displayList = this.storage.getDisplayList(true);

            var scope = {};
            var zlevel;

            var self = this;
            function findAndDrawOtherLayer(smaller, larger) {
                var zlevelList = self._zlevelList;
                if (smaller == null) {
                    smaller = -Infinity;
                }
                var intermediateLayer;
                for (var i = 0; i < zlevelList.length; i++) {
                    var z = zlevelList[i];
                    var layer = self._layers[z];
                    if (!layer.__builtin__ && z > smaller && z < larger) {
                        intermediateLayer = layer;
                        break;
                    }
                }
                if (intermediateLayer && intermediateLayer.renderToCanvas) {
                    imageLayer.ctx.save();
                    intermediateLayer.renderToCanvas(imageLayer.ctx);
                    imageLayer.ctx.restore();
                }
            }
            for (var i = 0; i < displayList.length; i++) {
                var el = displayList[i];

                if (el.zlevel !== zlevel) {
                    findAndDrawOtherLayer(zlevel, el.zlevel);
                    zlevel = el.zlevel;
                }
                this._doPaintEl(el, imageLayer, true, scope);
            }

            findAndDrawOtherLayer(zlevel, Infinity);

            return imageLayer.dom;
        },
        /**
         * 获取绘图区域宽度
         */
        getWidth: function () {
            return this._width;
        },

        /**
         * 获取绘图区域高度
         */
        getHeight: function () {
            return this._height;
        },

        _getSize: function (whIdx) {
            var opts = this._opts;
            var wh = ['width', 'height'][whIdx];
            var cwh = ['clientWidth', 'clientHeight'][whIdx];
            var plt = ['paddingLeft', 'paddingTop'][whIdx];
            var prb = ['paddingRight', 'paddingBottom'][whIdx];

            if (opts[wh] != null && opts[wh] !== 'auto') {
                return parseFloat(opts[wh]);
            }

            var root = this.root;
            // IE8 does not support getComputedStyle, but it use VML.
            var stl = document.defaultView.getComputedStyle(root);

            return (
                (root[cwh] || parseInt10(stl[wh]) || parseInt10(root.style[wh]))
                - (parseInt10(stl[plt]) || 0)
                - (parseInt10(stl[prb]) || 0)
            ) | 0;
        },

        pathToImage: function (path, dpr) {
            dpr = dpr || this.dpr;

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var rect = path.getBoundingRect();
            var style = path.style;
            var shadowBlurSize = style.shadowBlur;
            var shadowOffsetX = style.shadowOffsetX;
            var shadowOffsetY = style.shadowOffsetY;
            var lineWidth = style.hasStroke() ? style.lineWidth : 0;

            var leftMargin = Math.max(lineWidth / 2, -shadowOffsetX + shadowBlurSize);
            var rightMargin = Math.max(lineWidth / 2, shadowOffsetX + shadowBlurSize);
            var topMargin = Math.max(lineWidth / 2, -shadowOffsetY + shadowBlurSize);
            var bottomMargin = Math.max(lineWidth / 2, shadowOffsetY + shadowBlurSize);
            var width = rect.width + leftMargin + rightMargin;
            var height = rect.height + topMargin + bottomMargin;

            canvas.width = width * dpr;
            canvas.height = height * dpr;

            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, width, height);
            ctx.dpr = dpr;

            var pathTransform = {
                position: path.position,
                rotation: path.rotation,
                scale: path.scale
            };
            path.position = [leftMargin - rect.x, topMargin - rect.y];
            path.rotation = 0;
            path.scale = [1, 1];
            path.updateTransform();
            if (path) {
                path.brush(ctx);
            }

            var ImageShape = require('./graphic/Image');
            var imgShape = new ImageShape({
                style: {
                    x: 0,
                    y: 0,
                    image: canvas
                }
            });

            if (pathTransform.position != null) {
                imgShape.position = path.position = pathTransform.position;
            }

            if (pathTransform.rotation != null) {
                imgShape.rotation = path.rotation = pathTransform.rotation;
            }

            if (pathTransform.scale != null) {
                imgShape.scale = path.scale = pathTransform.scale;
            }

            return imgShape;
        }
    };

    module.exports = Painter;

