

    module.exports = require('./BaseBarSeries').extend({

        type: 'series.bar',

        dependencies: ['grid', 'polar'],

        brushSelector: 'rect'
    });
