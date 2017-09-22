/*global js_beautify: true */
/*jshint node:true */
/*jshint unused:false */


var fs = require('fs'),
    SanityTest = require('./sanitytest'),
    Benchmark = require('benchmark'),
    Urlencoded = require('../lib/unpackers/urlencode_unpacker'),
    js_beautify = require('../index').js_beautify,
    css_beautify = require('../index').css_beautify,
    html_beautify = require('../index').html_beautify;

function node_beautifier_html_tests() {
    console.log('Testing performance...');
    var index_html = fs.readFileSync(__dirname + '/../../index.html', 'utf8');
    var data_attr = fs.readFileSync(__dirname + '/../../test/resources/html-with-base64image.html', 'utf8');
    var options = {
        wrap_line_length: 80
    };

    //warm-up
    html_beautify(index_html, options);
    html_beautify(data_attr, options);

    var suite = new Benchmark.Suite();

    suite.add("html-beautify (index.html)", function() {
            html_beautify(index_html, options);
        })
        .add("html-beautify (base64 image)", function() {
            html_beautify(data_attr, options);
        })
        // add listeners
        .on('cycle', function(event) {
            console.log(String(event.target));
        })
        .on('error', function(event) {
            return 1;
        })
        .on('complete', function(event) {})
        .run();
    return 0;
}




if (require.main === module) {
    process.exit(node_beautifier_html_tests());
}