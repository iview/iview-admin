

    var zrUtil = require('zrender/lib/core/util');
    var echarts = require('../echarts');

    require('./pie/PieSeries');
    require('./pie/PieView');

    require('../action/createDataSelectAction')('pie', [{
        type: 'pieToggleSelect',
        event: 'pieselectchanged',
        method: 'toggleSelected'
    }, {
        type: 'pieSelect',
        event: 'pieselected',
        method: 'select'
    }, {
        type: 'pieUnSelect',
        event: 'pieunselected',
        method: 'unSelect'
    }]);

    echarts.registerVisual(zrUtil.curry(require('../visual/dataColor'), 'pie'));

    echarts.registerLayout(zrUtil.curry(
        require('./pie/pieLayout'), 'pie'
    ));

    echarts.registerProcessor(zrUtil.curry(require('../processor/dataFilter'), 'pie'));
