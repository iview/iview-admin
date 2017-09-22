
    var circularLayoutHelper = require('./circularLayoutHelper');
    module.exports = function (ecModel) {
        ecModel.eachSeriesByType('graph', function (seriesModel) {
            if (seriesModel.get('layout') === 'circular') {
                circularLayoutHelper(seriesModel);
            }
        });
    };
