/**
 * SVG Painter
 * @module zrender/svg/Painter
 */

define(function (require) {
    var svgCore = require('./core');
    var zrLog = require('../core/log');
    var matrix = require('../core/matrix');
    var Path = require('../graphic/Path');
    var ZImage = require('../graphic/Image');
    var ZText = require('../graphic/Text');
    var arrayDiff = require('../core/arrayDiff');
    var util = require('../core/util');

    var svgGraphic = require('./graphic');
    var svgPath = svgGraphic.path;
    var svgImage = svgGraphic.image;
    var svgText = svgGraphic.text;

    var createElement = svgCore.createElement;

    var GRADIENT_MARK = '_gradientInUse';
    var CLIPPATH_MARK = '_clipPathInUse';
    var MARK_UNUSED = '0';
    var MARK_USED = '1';

    var nextGradientId = 1;
    var nextClippathId = 1;

    function parseInt10(val) {
        return parseInt(val, 10);
    }

    function getSvgProxy(el) {
        if (el instanceof Path) {
            return svgPath;
        }
        else if (el instanceof ZImage) {
            return svgImage;
        }
        else if (el instanceof ZText) {
            return svgText;
        }
        else {
            return svgPath;
        }
    }

    function checkParentAvailable(parent, child) {
        return child && parent && child.parentNode !== parent;
    }

    function insertAfter(parent, child, prevSibling) {
        if (checkParentAvailable(parent, child) && prevSibling) {
            var nextSibling = prevSibling.nextSibling;
            nextSibling ? parent.insertBefore(child, nextSibling)
                : parent.appendChild(child);
        }
    }

    function prepend(parent, child) {
        if (checkParentAvailable(parent, child)) {
            var firstChild = parent.firstChild;
            firstChild ? parent.insertBefore(child, firstChild)
                : parent.appendChild(child);
        }
    }

    function append(parent, child) {
        if (checkParentAvailable(parent, child)) {
            parent.appendChild(child);
        }
    }

    function remove(parent, child) {
        if (child && parent && child.parentNode === parent) {
            parent.removeChild(child);
        }
    }

    function getTextSvgElement(displayable) {
        return displayable.__textSvgEl;
    }

    function getSvgElement(displayable) {
        return displayable.__svgEl;
    }

    /**
     * @alias module:zrender/svg/Painter
     */
    var SVGPainter = function (root, storage) {

        this.root = root;

        this.storage = storage;

        var svgRoot = createElement('svg');

        var viewport = document.createElement('div');
        viewport.style.cssText = 'overflow: hidden;';

        this._svgRoot = svgRoot;
        this._viewport = viewport;

        root.appendChild(viewport);
        viewport.appendChild(svgRoot);

        this.resize();

        this._visibleList = [];
    };

    SVGPainter.prototype = {

        constructor: SVGPainter,

        getViewportRoot: function () {
            return this._viewport;
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

        refresh: function () {

            var list = this.storage.getDisplayList(true);

            this._paintList(list);
        },

        _paintList: function (list) {
            this._markGradientsUnused();
            this._markClipPathsUnused();

            var svgRoot = this._svgRoot;
            var visibleList = this._visibleList;
            var listLen = list.length;

            var newVisibleList = [];
            var i;
            for (i = 0; i < listLen; i++) {
                var displayable = list[i];
                var svgProxy = getSvgProxy(displayable);
                if (!displayable.invisible) {
                    if (displayable.__dirty) {
                        svgProxy && svgProxy.brush(displayable);
                        var el = getSvgElement(displayable)
                            || getTextSvgElement(displayable);
                        this._doClip(displayable, el);

                        // Update gradient
                        if (displayable.style) {
                            this._updateGradient(displayable.style.fill);
                            this._updateGradient(displayable.style.stroke);
                        }

                        displayable.__dirty = false;
                    }
                    newVisibleList.push(displayable);
                }
            }

            var diff = arrayDiff(visibleList, newVisibleList);
            var prevSvgElement;

            // First do remove, in case element moved to the head and do remove after add
            for (i = 0; i < diff.length; i++) {
                var item = diff[i];
                if (item.cmd === '-') {
                    var displayable = visibleList[item.idx];
                    var svgElement = getSvgElement(displayable);
                    var textSvgElement = getTextSvgElement(displayable);
                    remove(svgRoot, svgElement);
                    remove(svgRoot, textSvgElement);
                }
            }
            for (i = 0; i < diff.length; i++) {
                var item = diff[i];
                switch (item.cmd) {
                    case '=':
                        var displayable = visibleList[item.idx];
                        prevSvgElement
                            = svgElement
                            = getTextSvgElement(displayable)
                            || getSvgElement(displayable);
                        this._markGradientUsed(displayable);
                        this._markClipPathUsed(displayable);
                        break;
                    case '+':
                        var displayable = newVisibleList[item.idx];
                        var svgElement = getSvgElement(displayable);
                        var textSvgElement = getTextSvgElement(displayable);
                        prevSvgElement ? insertAfter(svgRoot, svgElement, prevSvgElement)
                            : prepend(svgRoot, svgElement);
                        if (svgElement) {
                            insertAfter(svgRoot, textSvgElement, svgElement);
                        }
                        else if (prevSvgElement) {
                            insertAfter(svgRoot, textSvgElement, prevSvgElement);
                        }
                        else {
                            prepend(svgRoot, textSvgElement);
                        }
                        // Insert text
                        insertAfter(svgRoot, textSvgElement, svgElement);
                        prevSvgElement = textSvgElement || svgElement;
                        this._markClipPathUsed(displayable);
                        break;
                    // case '^':
                        // var displayable = visibleList[item.idx];
                        // var svgElement = getSvgElement(displayable);
                        // prevSvgElement ? insertAfter(svgRoot, svgElement, prevSvgElement)
                        //     : prepend(svgRoot, svgElement);
                        // break;
                }

                this._createGradient(svgElement, displayable, 'fill');
                this._createGradient(svgElement, displayable, 'stroke');
            }

            this._removeUnusedGradients();
            this._removeUnusedClipPaths();

            this._visibleList = newVisibleList;
        },

        /**
         * Create new gradient for fill or stroke
         *
         * @param {SvgElement}  svgElement   SVG element to paint
         * @param {Displayable} displayable  zrender displayable element
         * @param {string}      fillOrStroke should be 'fill' or 'stroke'
         */
        _createGradient: function (svgElement, displayable, fillOrStroke) {
            if (displayable
                && displayable.style
                && displayable.style[fillOrStroke]
                && (displayable.style[fillOrStroke].type === 'linear'
                    || displayable.style[fillOrStroke].type === 'radial')
            ) {
                var gradient = displayable.style[fillOrStroke];
                var defs = this._getDefs(true);

                // Create dom in <defs> if not exists
                var dom;
                if (gradient.__dom) {
                    // Gradient exists
                    dom = gradient.__dom;
                    if (!defs.contains(gradient.__dom)) {
                        // __dom is no longer in defs, recreate
                        this._addGradientDom(dom);
                    }
                }
                else {
                    dom = this._addGradient(gradient);
                }

                // Mark gradient to be used
                dom[GRADIENT_MARK] = MARK_USED;

                var id = dom.getAttribute('id');
                svgElement.setAttribute(fillOrStroke, 'url(#' + id + ')');
            }
        },

        /**
         * Add a new gradient tag in <defs>
         *
         * @param {Gradient} gradient zr gradient instance
         * @returns {SVGElement} Either <linearGradient>
         *                       or <radialGradient> element
         */
        _addGradient: function (gradient) {
            var el;
            if (gradient.type === 'linear') {
                el = createElement('linearGradient');
            }
            else if (gradient.type === 'radial') {
                el = createElement('radialGradient');
            }
            else {
                zrLog('Illegal gradient type.');
                return null;
            }

            // Set dom id with gradient id, since each gradient instance
            // will have no more than one dom element.
            // id may exists before for those dirty elements, in which case
            // id should remain the same, and other attributes should be
            // updated.
            gradient.id = gradient.id || nextGradientId++;
            el.setAttribute('id', 'zr-gradient-' + gradient.id);

            this._updateGradientDom(gradient, el);
            this._addGradientDom(el);

            return el;
        },

        /**
         * Add gradient dom to defs
         *
         * @param {SVGElement} dom      Either <linearGradient>
         *                              or <radialGradient> element
         */
        _addGradientDom: function (dom) {
            var defs = this._getDefs(true);
            defs.appendChild(dom);
        },

        /**
         * Update gradient
         *
         * @param {Gradient} gradient zr gradient instance
         */
        _updateGradient: function (gradient) {
            // Not a gradient
            if (!gradient
                || gradient.type !== 'linear' && gradient.type !== 'radial'
            ) {
                return;
            }

            // Update previous gradient dom if exists
            var defs = this._getDefs(false);
            if (gradient.__dom && defs && defs.contains(gradient.__dom)) {
                // Update dom
                var type = gradient.type;
                var tagName = gradient.__dom.tagName;
                if (type === 'linear' && tagName === 'linearGradient'
                    || type === 'radial' && tagName === 'radialGradient'
                ) {
                    // Gradient type is not changed, update gradient
                    this._updateGradientDom(gradient, gradient.__dom);
                }
                else {
                    // Remove and re-create if type is changed
                    defs.removeChild(gradient.__dom);
                    this._addGradient(gradient);
                }
            }
            else {
                // No previous dom, create new
                var dom = this._addGradient(gradient);
                gradient.__dom = dom;
            }
        },

        /**
         * Update gradient dom
         *
         * @param {Gradient} gradient zr gradient instance
         * @param {SVGElement} dom Either <linearGradient>
         *                         or <radialGradient> element
         */
        _updateGradientDom: function (gradient, dom) {
            if (gradient.type === 'linear') {
                dom.setAttribute('x1', gradient.x);
                dom.setAttribute('y1', gradient.y);
                dom.setAttribute('x2', gradient.x2);
                dom.setAttribute('y2', gradient.y2);
            }
            else if (gradient.type === 'radial') {
                dom.setAttribute('cx', gradient.x);
                dom.setAttribute('cy', gradient.y);
                dom.setAttribute('r', gradient.r);
            }
            else {
                zrLog('Illegal gradient type.');
                return;
            }

            if (gradient.global) {
                // x1, x2, y1, y2 in range of 0 to canvas width or height
                dom.setAttribute('gradientUnits', 'userSpaceOnUse');
            }
            else {
                // x1, x2, y1, y2 in range of 0 to 1
                dom.setAttribute('gradientUnits', 'objectBoundingBox');
            }

            // Remove color stops if exists
            dom.innerHTML = '';

            // Add color stops
            var colors = gradient.colorStops;
            for (var i = 0, len = colors.length; i < len; ++i) {
                var stop = createElement('stop');
                stop.setAttribute('offset', colors[i].offset * 100 + '%');
                stop.setAttribute('stop-color', colors[i].color);
                dom.appendChild(stop);
            }

            // Store dom element in gradient, to avoid creating multiple
            // dom instances for the same gradient element
            gradient.__dom = dom;
        },

        /**
         * Mark gradients to be unused before painting, and clear unused
         * ones at the end of the painting
         */
        _markGradientsUnused: function () {
            var doms = this._getGradients();
            util.each(doms, function (dom) {
                dom[GRADIENT_MARK] = MARK_UNUSED;
            });
        },

        /**
         * Remove unused gradients defined in <defs>
         */
        _removeUnusedGradients: function () {
            var defs = this._getDefs(false);
            if (!defs) {
                // Nothing to remove
                return;
            }

            var doms = this._getGradients();
            util.each(doms, function (dom) {
                if (dom[GRADIENT_MARK] !== MARK_USED) {
                    // Remove gradient
                    defs.removeChild(dom);
                }
            });
        },

        /**
         * Mark a single gradient to be used
         *
         * @param {Displayable} displayable displayable element
         */
        _markGradientUsed: function (displayable) {
            if (displayable.style) {
                var gradient = displayable.style.fill;
                if (gradient && gradient.__dom) {
                    gradient.__dom[GRADIENT_MARK] = MARK_USED;
                }

                gradient = displayable.style.stroke;
                if (gradient && gradient.__dom) {
                    gradient.__dom[GRADIENT_MARK] = MARK_USED;
                }
            }
        },

        /**
         * Get the <defs> tag for svgRoot; optionally creates one if not exists.
         *
         * @param {boolean} isForceCreating if need to create when not exists
         * @returns {SVGDefsElement} SVG <defs> element, null if it doesn't
         * exist and isForceCreating is false
         */
        _getDefs: function (isForceCreating) {
            var svgRoot = this._svgRoot;
            var defs = this._svgRoot.getElementsByTagName('defs');
            if (defs.length === 0) {
                // Not exist
                if (isForceCreating) {
                    var defs = svgRoot.insertBefore(
                        createElement('defs'), // Create new tag
                        svgRoot.firstChild // Insert in the front of svg
                    );
                    if (!defs.contains) {
                        // IE doesn't support contains method
                        defs.contains = function (el) {
                            var children = defs.children;
                            if (!children) {
                                return false;
                            }
                            for (var i = children.length - 1; i >= 0; --i) {
                                if (children[i] === el) {
                                    return true;
                                }
                            }
                            return false;
                        };
                    }
                    return defs;
                }
                else {
                    return null;
                }
            }
            else {
                return defs[0];
            }
        },

        _getGradients: function () {
            var defs = this._getDefs(false);
            if (!defs) {
                // No gradients when defs is not defined
                return [];
            }

            var gradType = ['linear', 'radial'];
            var doms = [];

            util.each(gradType, function (type) {
                var tags = defs.getElementsByTagName(type + 'Gradient');
                // Note that tags is HTMLCollection, which is array-like
                // rather than real array.
                // So `doms.concat(tags)` add tags as one object.
                doms = doms.concat([].slice.call(tags));
            });

            return doms;
        },

        _doClip: function (el, svgElement) {
            this._doClipEl(svgElement, el.__clipPaths, false);

            var textEl = getTextSvgElement(el);
            if (textEl) {
                // Make another clipPath for text, since it's transform
                // matrix is not the same with svgElement
                this._doClipEl(textEl, el.__clipPaths, true);
            }

            this._markClipPathUsed(el);
        },

        /**
         * Create an SVGElement of displayable and create a <clipPath> of its
         * clipPath
         */
        _doClipEl: function (parentEl, clipPaths, isText) {
            if (clipPaths && clipPaths.length > 0) {
                // Has clipPath, create <clipPath> with the first clipPath
                var defs = this._getDefs(true);
                var clipPath = clipPaths[0];
                var clipPathEl;
                var id;

                var dom = isText ? '__textDom' : '__dom';

                if (clipPath[dom]) {
                    // Use a dom that is already in <defs>
                    id = clipPath[dom].getAttribute('id');
                    clipPathEl = clipPath[dom];

                    // Use a dom that is already in <defs>
                    if (!defs.contains(clipPathEl)) {
                        // This happens when set old clipPath that has
                        // been previously removed
                        defs.appendChild(clipPathEl);
                    }
                }
                else {
                    // New <clipPath>
                    id = 'zr-clip-' + nextClippathId;
                    ++nextClippathId;
                    clipPathEl = createElement('clipPath');
                    clipPathEl.setAttribute('id', id);
                    defs.appendChild(clipPathEl);

                    clipPath[dom] = clipPathEl;
                }

                // Build path and add to <clipPath>
                var svgProxy = getSvgProxy(clipPath);
                if (clipPath.transform
                    && clipPath.parent.invTransform
                    && !isText
                ) {
                    /**
                     * If a clipPath has a parent with transform, the transform
                     * of parent should not be considered when setting transform
                     * of clipPath. So we need to transform back from parent's
                     * transform, which is done by multiplying parent's inverse
                     * transform.
                     */
                    // Store old transform
                    var transform = Array.prototype.slice.call(
                        clipPath.transform
                    );

                    // Transform back from parent, and brush path
                    matrix.mul(
                        clipPath.transform,
                        clipPath.parent.invTransform,
                        clipPath.transform
                    );
                    svgProxy.brush(clipPath);

                    // Set back transform of clipPath
                    clipPath.transform = transform;
                }
                else {
                    svgProxy.brush(clipPath);
                }

                var pathEl = getSvgElement(clipPath);
                clipPathEl.appendChild(pathEl);

                parentEl.setAttribute('clip-path', 'url(#' + id + ')');

                if (clipPaths.length > 1) {
                    // Make the other clipPaths recursively
                    this._doClipEl(clipPathEl, clipPaths.slice(1), isText);
                }
            }
            else {
                // No clipPath
                parentEl.setAttribute('clip-path', 'none');
            }

        },

        _markClipPathsUnused: function () {
            var tags = this._getClipPaths();
            util.each(tags, function (tag) {
                tag[CLIPPATH_MARK] = MARK_UNUSED;
            });
        },

        _markClipPathUsed: function (displayable) {
            if (displayable.__clipPaths && displayable.__clipPaths.length > 0) {
                util.each(displayable.__clipPaths, function (clipPath) {
                    if (clipPath.__dom) {
                        clipPath.__dom[CLIPPATH_MARK] = MARK_USED;
                    }
                    if (clipPath.__textDom) {
                        clipPath.__textDom[CLIPPATH_MARK] = MARK_USED;
                    }
                });
            }
        },

        _getClipPaths: function () {
            var defs = this._getDefs(false);
            if (!defs) {
                return [];
            }

            var tags = defs.getElementsByTagName('clipPath');
            return [].slice.call(tags);
        },

        _removeUnusedClipPaths: function () {
            var defs = this._getDefs(false);
            if (!defs) {
                // Nothing to remove
                return;
            }

            var doms = this._getClipPaths();
            util.each(doms, function (dom) {
                if (dom[CLIPPATH_MARK] !== MARK_USED) {
                    defs.removeChild(dom);
                }
            });
        },

        resize: function () {
            var width = this._getWidth();
            var height = this._getHeight();

            if (this._width !== width && this._height !== height) {
                this._width = width;
                this._height = height;

                var viewportStyle = this._viewport.style;
                viewportStyle.width = width + 'px';
                viewportStyle.height = height + 'px';

                var svgRoot = this._svgRoot;
                // Set width by 'svgRoot.width = width' is invalid
                svgRoot.setAttribute('width', width);
                svgRoot.setAttribute('height', height);
            }
        },

        getWidth: function () {
            return this._getWidth();
        },

        getHeight: function () {
            return this._getHeight();
        },

        _getWidth: function () {
            var root = this.root;
            var stl = document.defaultView.getComputedStyle(root);

            return ((root.clientWidth || parseInt10(stl.width))
                    - parseInt10(stl.paddingLeft)
                    - parseInt10(stl.paddingRight)) | 0;
        },

        _getHeight: function () {
            var root = this.root;
            var stl = document.defaultView.getComputedStyle(root);

            return ((root.clientHeight || parseInt10(stl.height))
                    - parseInt10(stl.paddingTop)
                    - parseInt10(stl.paddingBottom)) | 0;
        },

        dispose: function () {
            this.root.innerHTML = '';

            this._svgRoot =
            this._viewport =
            this.storage = null;
        },

        clear: function () {
            if (this._viewport) {
                this.root.removeChild(this._viewport);
            }
        }
    };

    // Not supported methods
    function createMethodNotSupport(method) {
        return function () {
            zrLog('In SVG mode painter not support method "' + method + '"')
        }
    }

    var notSupportedMethods = [
        'getLayer', 'insertLayer', 'eachLayer', 'eachBuiltinLayer', 'eachOtherLayer', 'getLayers',
        'modLayer', 'delLayer', 'clearLayer', 'toDataURL', 'pathToImage'
    ];

    for (var i = 0; i < notSupportedMethods.length; i++) {
        var name = notSupportedMethods[i];
        SVGPainter.prototype[name] = createMethodNotSupport(name);
    }

    return SVGPainter;
});
