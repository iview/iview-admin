

    var zrUtil = require('zrender/lib/core/util');
    var echarts = require('../echarts');

    require('./funnel/FunnelSeries');
    require('./funnel/FunnelView');

    echarts.registerVisual(zrUtil.curry(require('../visual/dataColor'), 'funnel'));
    echarts.registerLayout(require('./funnel/funnelLayout'));

    echarts.registerProcessor(zrUtil.curry(require('../processor/dataFilter'), 'funnel'));
