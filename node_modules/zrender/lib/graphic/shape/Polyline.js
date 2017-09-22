/**
 * @module zrender/graphic/shape/Polyline
 */


    var polyHelper = require('../helper/poly');

    module.exports = require('../Path').extend({
        
        type: 'polyline',

        shape: {
            points: null,

            smooth: false,

            smoothConstraint: null
        },

        style: {
            stroke: '#000',

            fill: null
        },

        buildPath: function (ctx, shape) {
            polyHelper.buildPath(ctx, shape, false);
        }
    });
