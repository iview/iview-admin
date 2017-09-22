

    var zrUtil = require('zrender/lib/core/util');
    var echarts = require('../echarts');

    require('./effectScatter/EffectScatterSeries');
    require('./effectScatter/EffectScatterView');

    echarts.registerVisual(zrUtil.curry(
        require('../visual/symbol'), 'effectScatter', 'circle', null
    ));
    echarts.registerLayout(zrUtil.curry(
        require('../layout/points'), 'effectScatter'
    ));
