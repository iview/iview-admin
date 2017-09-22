define(function (require) {
    require('./graphic');
    require('../zrender').registerPainter('svg', require('./Painter'));
});