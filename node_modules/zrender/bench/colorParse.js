var Benchmark = require('benchmark');
var colorUtil = require('../lib/tool/color');

new Benchmark.Suite()
    .add('Color mapping', function () {
        colorUtil.parse('#313695');
    })
    .on('error', function (e) {
        console.log(e);
    })
    .on('cycle', logCycle)
    .run();

function logCycle(event) {
    console.log(String(event.target));
}