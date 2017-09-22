/**
 * Stateful mixin for graphic object
 */

define(function (require) {

    var States = require('../States');

    var Stateful = function (opts) {

        if (opts.states) {
            this.initStates(opts.states);
        }
    };

    Stateful.prototype = {

        initStates: function (states) {
            this._states = new States({
                el: this,
                states: states
            });
        },

        setState: function (name) {
            this._states && this._states.setState(name);
        },

        getState: function () {
            return this._states && this._states.getState();
        },

        transitionState: function (name, done) {
            this._states && this._states.transitionState(name, done);
        }
    };

    return Stateful;
});