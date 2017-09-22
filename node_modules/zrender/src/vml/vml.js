define(function (require) {
    require('./graphic');
    require('../zrender').registerPainter('vml', require('./Painter'));
});