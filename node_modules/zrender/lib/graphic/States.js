/**
 * States machine for managing graphic states
 */



    /**
     * @typedef {Object} IGraphicState
     * @property {number} [zlevel]
     * @property {number} [z]
     * @property {Array.<number>} {position}
     * @property {Array.<number>|number} {rotation}
     * @property {Array.<number>} {scale}
     * @property {Object} style
     *
     * @property {Function} onenter
     * @property {Function} onleave
     * @property {Function} ontransition
     * @property {Array.<IGraphicStateTransition|string>} transition
     *           Transition object or a string descriptor like '* 30 0 Linear'
     */

    var zrUtil = require('../core/util');
    var Style = require('./Style');
    var vec2Copy = require('../core/vector').copy;

    var transitionProperties = ['position', 'rotation', 'scale', 'style', 'shape'];
    /**
     * @module zrender/graphic/States~TransitionObject
     */
    var TransitionObject = function (opts) {
        if (typeof opts == 'string') {
            this._fromStr(opts);
        }
        else if (opts) {
            opts.property && (this.property = opts.property);
            opts.duration != null && (this.duration = opts.duration);
            opts.easing && (this.easing = opts.easing);
            opts.delay && (this.delay = opts.delay);
        }
        if (this.property !== '*') {
            this.property = this.property.split(',');
        }
        else {
            this.property = transitionProperties;
        }
    };

    TransitionObject.prototype = {

        constructor: TransitionObject,

        /**
         * List of all transition properties. Splitted by comma. Must not have spaces in the string.
         * e.g. 'position,style.color'. '*' will match all the valid properties.
         * @type {string}
         * @default *
         */
        property: '*',

        /**
         * @type {string}
         * @default 'Linear'
         */
        easing: 'Linear',

        /**
         * @type {number}
         * @default 'number'
         */
        duration: 500,

        /**
         * @type {number}
         */
        delay: 0,

        _fromStr: function (str) {
            var arr = str.split(/\s+/g);
            this.property = arr[0];
            this.duration = +arr[1];
            this.delay = +arr[2];
            this.easing = arr[3];
        }
    };


    /**
     * @alias module:zrender/graphic/States
     */
    var GraphicStates = function (opts) {

        opts = opts || {};

        this._states = {};

        /**
         * Target element
         * @type {zrender/graphic/Displayable|zrender/container/Group}
         */
        this._el = opts.el;

        this._subStates = [];

        this._transitionAnimators = [];

        if (opts.initialState) {
            this._initialState = opts.initialState;
        }

        var optsStates = opts.states;
        if (optsStates) {
            for (var name in optsStates) {
                if (optsStates.hasOwnProperty(name)) {
                    var state = optsStates[name];
                    this._addState(name, state);
                }
            }
        }

        this.setState(this._initialState);
    };

    GraphicStates.prototype = {

        constructor: GraphicStates,

        /**
         * All other state will be extended from initial state
         * @type {string}
         * @private
         */
        _initialState: 'normal',

        /**
         * Current state
         * @type {string}
         * @private
         */
        _currentState: '',

        el: function () {
            return this._el;
        },

        _addState: function (name, state) {
            this._states[name] = state;

            if (state.transition) {
                state.transition = new TransitionObject(state.transition);
            }

            // Extend from initial state
            if (name !== this._initialState) {
                this._extendFromInitial(state);
            }
            else {
                var el = this._el;
                // setState 的时候自带的 style 和 shape 都会被直接覆盖
                // 所以这边先把自带的 style 和 shape 扩展到初始状态中
                zrUtil.merge(state.style, el.style, false, false);
                if (state.shape) {
                    zrUtil.merge(state.shape, el.shape, false, true);
                }
                else {
                    state.shape = zrUtil.clone(el.shape, true);
                }

                for (var name in this._states) {
                    if (this._states.hasOwnProperty(name)) {
                        this._extendFromInitial(this._states[name]);
                    }
                }
            }
        },

        _extendFromInitial: function (state) {
            var initialState = this._states[this._initialState];
            if (initialState && state !== initialState) {
                zrUtil.merge(state, initialState, false, true);
            }
        },

        setState: function (name, silent) {
            if (name === this._currentState
                && ! this.transiting()
            ) {
                return;
            }

            var state = this._states[name];

            if (state) {
                this._stopTransition();

                if (! silent) {
                    var prevState = this._states[this._currentState];
                    if (prevState) {
                        prevState.onleave && prevState.onleave.call(this);
                    }

                    state.onenter && state.onenter.call(this);
                }

                this._currentState = name;

                if (this._el) {
                    var el = this._el;

                    // Setting attributes
                    if (state.zlevel != null) {
                        el.zlevel = state.zlevel;
                    }
                    if (state.z != null) {
                        el.z = state.z;
                    }

                    // SRT
                    state.position && vec2Copy(el.position, state.position);
                    state.scale && vec2Copy(el.scale, state.scale);
                    if (state.rotation != null) {
                        el.rotation = state.rotation;
                    }

                    // Style
                    if (state.style) {
                        var initialState = this._states[this._initialState];
                        el.style = new Style();
                        if (initialState) {
                            el.style.extendFrom(initialState.style, false);
                        }
                        if (
                            // Not initial state
                            name != this._initialState
                            // Not copied from initial state in _extendFromInitial method
                            && initialState.style !== state.style
                        ) {
                            el.style.extendFrom(state.style, true);
                        }
                    }
                    if (state.shape) {
                        el.shape = zrUtil.clone(state.shape, true);
                    }

                    el.dirty();
                }
            }

            for (var i = 0; i < this._subStates.length; i++) {
                this._subStates.setState(name);
            }
        },

        getState: function () {
            return this._currentState;
        },

        transitionState: function (target, done) {
            if (
                target === this._currentState
                && ! this.transiting()
            ) {
                return;
            }

            var state = this._states[target];
            var styleShapeReg = /$[style|shape]\./;
            var self = this;

            // Animation 去重
            var propPathMap = {};

            if (state) {

                self._stopTransition();

                var el = self._el;

                if (state.transition && el && el.__zr) {// El can be animated
                    var transitionCfg = state.transition;
                    var property = transitionCfg.property;

                    var animatingCount = 0;
                    var animationDone = function () {
                        animatingCount--;
                        if (animatingCount === 0) {
                            self.setState(target);
                            done && done();
                        }
                    };
                    for (var i = 0; i < property.length; i++) {
                        var propName = property[i];

                        // Animating all the properties in style or shape
                        if (propName === 'style' || propName === 'shape') {
                            if (state[propName]) {
                                for (var key in state[propName]) {
                                    if (!state[propName].hasOwnProperty(key)) {
                                        continue;
                                    }
                                    var path = propName + '.' + key;
                                    if (propPathMap[path]) {
                                        continue;
                                    }
                                    propPathMap[path] = 1;
                                    animatingCount += self._animProp(
                                        state, propName, key, transitionCfg, animationDone
                                    );
                                }
                            }
                        }
                        else {
                            if (propPathMap[propName]) {
                                continue;
                            }
                            propPathMap[propName] = 1;
                            // Animating particular property in style or style
                            if (propName.match(styleShapeReg)) {
                                // remove 'style.', 'shape.' prefix
                                var subProp = propName.slice(0, 5);
                                propName = propName.slice(6);
                                animatingCount += self._animProp(
                                    state, subProp, propName, transitionCfg, animationDone
                                );
                            }
                            else {
                                animatingCount += self._animProp(
                                    state, '', propName, transitionCfg, animationDone
                                );
                            }

                        }
                    }
                    // No transition properties
                    if (animatingCount === 0) {
                        self.setState(target);
                        done && done();
                    }
                }
                else {
                    self.setState(target);
                    done && done();
                }
            }

            var subStates = self._subStates;
            for (var i = 0; i < subStates.length; i++) {
                subStates.transitionState(target);
            }
        },

        /**
         * Do transition animation of particular property
         * @param {Object} state
         * @param {string} subPropKey
         * @param {string} key
         * @param {Object} transitionCfg
         * @param {Function} done
         * @private
         */
        _animProp: function (state, subPropKey, key, transitionCfg, done) {
            var el = this._el;
            var stateObj = subPropKey ? state[subPropKey] : state;
            var elObj = subPropKey ? el[subPropKey] : el;
            var availableProp = stateObj && (key in stateObj)
                && elObj && (key in elObj);

            var transitionAnimators = this._transitionAnimators;
            if (availableProp) {
                var obj = {};
                if (stateObj[key] === elObj[key]) {
                    return 0;
                }
                obj[key] = stateObj[key];

                var animator = el.animate(subPropKey)
                    .when(transitionCfg.duration, obj)
                    .delay(transitionCfg.dealy)
                    .done(function () {
                        var idx = zrUtil.indexOf(transitionAnimators, 1);
                        if (idx > 0) {
                            transitionAnimators.splice(idx, 1);
                        }
                        done();
                    })
                    .start(transitionCfg.easing);
                transitionAnimators.push(animator);

                return 1;
            }
            return 0;
        },

        _stopTransition: function () {
            var transitionAnimators = this._transitionAnimators;
            for (var i = 0; i < transitionAnimators.length; i++) {
                transitionAnimators[i].stop();
            }
            transitionAnimators.length = 0;
        },

        transiting: function () {
            return this._transitionAnimators.length > 0;
        },

        addSubStates: function (states) {
            this._subStates.push(states);
        },

        removeSubStates: function (states) {
            var idx = zrUtil.indexOf(this._subStates, states);
            if (idx >= 0) {
                this._subStates.splice(states, 1);
            }
        }
    };

    module.exports = GraphicStates;
