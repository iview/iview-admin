define(function(require) {
    'use strict';

    var zrUtil = require('../core/util');

    var Gradient = require('./Gradient');

    /**
     * x, y, x2, y2 are all percent from 0 to 1
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [x2=1]
     * @param {number} [y2=0]
     * @param {Array.<Object>} colorStops
     * @param {boolean} [globalCoord=false]
     */
    var LinearGradient = function (x, y, x2, y2, colorStops, globalCoord) {
        // Should do nothing more in this constructor. Because gradient can be
        // declard by `color: {type: 'linear', colorStops: ...}`, where
        // this constructor will not be called.

        this.x = x == null ? 0 : x;

        this.y = y == null ? 0 : y;

        this.x2 = x2 == null ? 1 : x2;

        this.y2 = y2 == null ? 0 : y2;

        // Can be cloned
        this.type = 'linear';

        // If use global coord
        this.global = globalCoord || false;

        Gradient.call(this, colorStops);
    };

    LinearGradient.prototype = {

        constructor: LinearGradient
    };

    zrUtil.inherits(LinearGradient, Gradient);

    return LinearGradient;
});