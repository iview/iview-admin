var test = require('tape'),
    report = require('browserify-tape-spec');

var saneDomParserError = require('../index.js');

test('should pass through a valid document', function (t) {
    var dom = new DOMParser().parseFromString('<xml></xml>', 'text/xml');

    t.equal(saneDomParserError.failOnParseError(dom), dom);
    t.end();
});

test('should throw error on invalid input', function (t) {
    var dom = new DOMParser().parseFromString('<parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml"></parsererror>', 'text/xml');

    t.throws(function () {
        saneDomParserError.failOnParseError(dom);
    }, /Parse error/);

    t.end();
});

test('should include error message from Firefox 40', function (t) {
    var dom = new DOMParser().parseFromString('<parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml">XML Parsing Error: prefix not bound to a namespace\n Location: file:////tmp/index.html\n Line Number 1, Column 57:<sourcetext>&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;&lt;head/&gt;&lt;body&gt;&lt;namespace:customtag&gt;&lt;!-- namespace:customtag--&gt;&lt;/namespace:customtag&gt;&lt;/body&gt;&lt;/html&gt;\n --------------------------------------------------------^</sourcetext></parsererror>', 'text/xml');

    t.throws(function () {
        saneDomParserError.failOnParseError(dom);
    }, /XML Parsing Error: prefix not bound to a namespace/);

    t.end();
});

test('should include error message from Chrome 45 and Safari 7', function (t) {
    var dom = new DOMParser().parseFromString('<xml><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 5: Couldn\'t find end of Start Tag xml\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></xml>', 'text/xml');

    t.throws(function () {
        saneDomParserError.failOnParseError(dom);
    }, /error on line 1 at column 5: Couldn't find end of Start Tag xml$/);

    t.end();
});

test('should include error message from Chrome 45 with underlying HTML structure', function (t) {
    var dom = new DOMParser().parseFromString('<html xmlns="http://www.w3.org/1999/xhtml"><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 77: Namespace prefix namespace on customtag is not defined\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></html>', 'text/xml');

    t.throws(function () {
        saneDomParserError.failOnParseError(dom);
    }, /error on line 1 at column 77: Namespace prefix namespace on customtag is not defined$/);

    t.end();
});

test('Integration: works in your browser with unfinished tag', function (t) {
    var failingParseDom = new DOMParser().parseFromString('<xml', 'text/xml');

    t.throws(function () {
        saneDomParserError.failOnParseError(failingParseDom);
    }, /XML Parsing Error: unclosed token|Couldn't find end of Start Tag xml|Premature end of document/);

    t.end();
});

// Hide test from PhantomJS. It happily parses the broken document
if (navigator.userAgent.indexOf('PhantomJS') === -1) {
    test('Integration: works in your browser with XML namespace issue', function (t) {
        var failingParseDom = new DOMParser().parseFromString('<html xmlns="http://www.w3.org/1999/xhtml"><head/><body><namespace:customtag/></body></html>', 'application/xml');

        t.throws(function () {
            saneDomParserError.failOnParseError(failingParseDom);
        }, /XML Parsing Error: prefix not bound to a namespace|Namespace prefix namespace on customtag is not defined/);

        t.end();
    });
}


if (navigator.userAgent.indexOf('PhantomJS') === -1) {
    test.createStream().pipe(report('out'));
}
