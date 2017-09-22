/*jshint node:true */

var SanityTest = require('./sanitytest'),
    Urlencoded = require('../lib/unpackers/urlencode_unpacker'),
    run_javascript_tests = require('./generated/beautify-javascript-tests').run_javascript_tests,
    run_css_tests = require('./generated/beautify-css-tests').run_css_tests,
    run_html_tests = require('./generated/beautify-html-tests').run_html_tests;

function test_legacy_names() {
    var beautify = require('../index');
    var results = new SanityTest();

    console.log('First ensure that legacy import names equal the new ones');
    results.expect(beautify.js, beautify.js_beautify);
    results.expect(beautify.css, beautify.css_beautify);
    results.expect(beautify.html, beautify.html_beautify);

    console.log(results.results_raw());
    return results;
}

function node_beautifier_tests(name, test_runner) {
    console.log('Testing ' + name + ' with node.js CommonJS...');
    var beautify = require('../index');

    var results = new SanityTest();
    test_runner(
        results,
        Urlencoded,
        beautify.js,
        beautify.html,
        beautify.css);

    console.log(results.results_raw());
    return results;
}

if (require.main === module) {
    process.exit(
        test_legacy_names() +
        node_beautifier_tests('js-beautifier', run_javascript_tests).get_exitcode() +
        node_beautifier_tests('css-beautifier', run_css_tests).get_exitcode() +
        node_beautifier_tests('html-beautifier', run_html_tests).get_exitcode()
    );
}