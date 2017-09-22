/**
 * VML Painter.
 *
 * @module zrender/vml/Painter
 */



    var zrLog = require('../core/log');
    var vmlCore = require('./core');

    function parseInt10(val) {
        return parseInt(val, 10);
    }

    /**
     * @alias module:zrender/vml/Painter
     */
    function VMLPainter(root, storage) {

        vmlCore.initVML();

        this.root = root;

        this.storage = storage;

        var vmlViewport = document.createElement('div');

        var vmlRoot = document.createElement('div');

        vmlViewport.style.cssText = 'display:inline-block;overflow:hidden;position:relative;width:300px;height:150px;';

        vmlRoot.style.cssText = 'position:absolute;left:0;top:0;';

        root.appendChild(vmlViewport);

        this._vmlRoot = vmlRoot;
        this._vmlViewport = vmlViewport;

        this.resize();

        // Modify storage
        var oldDelFromStorage = storage.delFromStorage;
        var oldAddToStorage = storage.addToStorage;
        storage.delFromStorage = function (el) {
            oldDelFromStorage.call(storage, el);

            if (el) {
                el.onRemove && el.onRemove(vmlRoot);
            }
        };

        storage.addToStorage = function (el) {
            // Displayable already has a vml node
            el.onAdd && el.onAdd(vmlRoot);

            oldAddToStorage.call(storage, el);
        };

        this._firstPaint = true;
    }

    VMLPainter.prototype = {

        constructor: VMLPainter,

        /**
         * @return {HTMLDivElement}
         */
        getViewportRoot: function () {
            return this._vmlViewport;
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
         */
        refresh: function () {

            var list = this.storage.getDisplayList(true, true);

            this._paintList(list);
        },

        _paintList: function (list) {
            var vmlRoot = this._vmlRoot;
            for (var i = 0; i < list.length; i++) {
                var el = list[i];
                if (el.invisible || el.ignore) {
                    if (!el.__alreadyNotVisible) {
                        el.onRemove(vmlRoot);
                    }
                    // Set as already invisible
                    el.__alreadyNotVisible = true;
                }
                else {
                    if (el.__alreadyNotVisible) {
                        el.onAdd(vmlRoot);
                    }
                    el.__alreadyNotVisible = false;
                    if (el.__dirty) {
                        el.beforeBrush && el.beforeBrush();
                        (el.brushVML || el.brush).call(el, vmlRoot);
                        el.afterBrush && el.afterBrush();
                    }
                }
                el.__dirty = false;
            }

            if (this._firstPaint) {
                // Detached from document at first time
                // to avoid page refreshing too many times

                // FIXME 如果每次都先 removeChild 可能会导致一些填充和描边的效果改变
                this._vmlViewport.appendChild(vmlRoot);
                this._firstPaint = false;
            }
        },

        resize: function (width, height) {
            var width = width == null ? this._getWidth() : width;
            var height = height == null ? this._getHeight() : height;

            if (this._width != width || this._height != height) {
                this._width = width;
                this._height = height;

                var vmlViewportStyle = this._vmlViewport.style;
                vmlViewportStyle.width = width + 'px';
                vmlViewportStyle.height = height + 'px';
            }
        },

        dispose: function () {
            this.root.innerHTML = '';

            this._vmlRoot =
            this._vmlViewport =
            this.storage = null;
        },

        getWidth: function () {
            return this._width;
        },

        getHeight: function () {
            return this._height;
        },

        clear: function () {
            if (this._vmlViewport) {
                this.root.removeChild(this._vmlViewport);
            }
        },

        _getWidth: function () {
            var root = this.root;
            var stl = root.currentStyle;

            return ((root.clientWidth || parseInt10(stl.width))
                    - parseInt10(stl.paddingLeft)
                    - parseInt10(stl.paddingRight)) | 0;
        },

        _getHeight: function () {
            var root = this.root;
            var stl = root.currentStyle;

            return ((root.clientHeight || parseInt10(stl.height))
                    - parseInt10(stl.paddingTop)
                    - parseInt10(stl.paddingBottom)) | 0;
        }
    };

    // Not supported methods
    function createMethodNotSupport(method) {
        return function () {
            zrLog('In IE8.0 VML mode painter not support method "' + method + '"');
        };
    }

    var notSupportedMethods = [
        'getLayer', 'insertLayer', 'eachLayer', 'eachBuiltinLayer', 'eachOtherLayer', 'getLayers',
        'modLayer', 'delLayer', 'clearLayer', 'toDataURL', 'pathToImage'
    ];

    for (var i = 0; i < notSupportedMethods.length; i++) {
        var name = notSupportedMethods[i];
        VMLPainter.prototype[name] = createMethodNotSupport(name);
    }

    module.exports = VMLPainter;
