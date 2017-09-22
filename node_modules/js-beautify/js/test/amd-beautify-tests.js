/*jshint node:true */

var requirejs = require('requirejs'),
    SanityTest = require('./sanitytest'),
    Urlencoded = require('../lib/unpackers/urlencode_unpacker'),
    run_javascript_tests = require('./generated/beautify-javascript-tests').run_javascript_tests,
    run_css_tests = require('./generated/beautify-css-tests').run_css_tests,
    run_html_tests = require('./generated/beautify-html-tests').run_html_tests;

requirejs.config({
    paths: {
        'beautify': "..",
        'beautify-lib': "../lib"
    }
});

function amd_beautifier_index_tests(name, test_runner) {
    console.log('Testing ' + name + ' with node.js Require.js (index file)...');
    var results = new SanityTest();
    var beautify = requirejs('beautify/index');

    test_runner(
        results,
        Urlencoded,
        beautify.js,
        beautify.html,
        beautify.css);

    console.log(results.results_raw());
    return results;
}

function amd_beautifier_tests(name, test_runner) {
    console.log('Testing ' + name + ' with node.js Require.js (separate file)...');
    var results = new SanityTest();
    var js_beautify = requirejs('beautify-lib/beautify'),
        css_beautify = requirejs('beautify-lib/beautify-css'),
        html_beautify = requirejs('beautify-lib/beautify-html');

    test_runner(
        results,
        Urlencoded,
        js_beautify.js_beautify,
        html_beautify.html_beautify,
        css_beautify.css_beautify);

    console.log(results.results_raw());
    return results;
}



if (require.main === module) {
    process.exit(
        amd_beautifier_tests('js-beautifier', run_javascript_tests).get_exitcode() +
        amd_beautifier_index_tests('js-beautifier', run_javascript_tests).get_exitcode() +
        amd_beautifier_tests('cs-beautifier', run_css_tests).get_exitcode() +
        amd_beautifier_index_tests('css-beautifier', run_css_tests).get_exitcode() +
        amd_beautifier_tests('html-beautifier', run_html_tests).get_exitcode() +
        amd_beautifier_index_tests('html-beautifier', run_html_tests).get_exitcode()
    );
}