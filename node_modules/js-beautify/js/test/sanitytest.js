//
// simple testing interface
// written by Einar Lielmanis, einar@jsbeautifier.org
//
// usage:
//
// var t = new SanityTest(function (x) { return x; }, 'my function');
// t.expect('input', 'output');
// t.expect('a', 'a');
// output_somewhere(t.results()); // good for <pre>, html safe-ish
// alert(t.results_raw());        // html unescaped


function SanityTest(func, name_of_test) {

    var test_func = func || function(x) {
        return x;
    };

    var test_name = name_of_test || '';

    var n_failed = 0;
    var n_succeeded = 0;

    var failures = [];

    this.test_function = function(func, name) {
        test_func = func;
        test_name = name || '';
    };

    this.get_exitcode = function() {
        return n_succeeded === 0 || n_failed !== 0 ? 1 : 0;
    };

    this.expect = function(parameters, expected_value) {
        // multi-parameter calls not supported (I don't need them now).
        var result = test_func(parameters);
        // proper array checking is a pain. i'll maybe do it later, compare strings representations instead
        if ((result === expected_value) || (expected_value instanceof Array && result.join(', ') === expected_value.join(', '))) {
            n_succeeded += 1;
        } else {
            n_failed += 1;
            failures.push([test_name, parameters, expected_value, result]);
        }
    };


    this.results_raw = function() {
        var results = '';
        if (n_failed === 0) {
            if (n_succeeded === 0) {
                results = 'No tests run.';
            } else {
                results = 'All ' + n_succeeded + ' tests passed.';
            }
        } else {
            for (var i = 0; i < failures.length; i++) {
                var f = failures[i];
                if (f[0]) {
                    f[0] = f[0] + ' ';
                }
                results += '==== ' + f[0] + '============================================================\n';
                results += '---- input -------\n' + this.prettyprint(f[1]) + '\n';
                results += '---- expected ----\n' + this.prettyprint(f[2]) + '\n';
                results += '---- output ------\n' + this.prettyprint(f[3]) + '\n';
                results += '---- expected-ws ------\n' + this.prettyprint_whitespace(f[2]) + '\n';
                results += '---- output-ws ------\n' + this.prettyprint_whitespace(f[3]) + '\n';
                results += '================================================================\n\n';
            }
            results += n_failed + ' tests failed.\n';
        }
        return results;
    };


    this.results = function() {
        return this.lazy_escape(this.results_raw());
    };

    this.prettyprint_whitespace = function(something, quote_strings) {
        return (this.prettyprint(something, quote_strings)
            .replace(/\r\n/g, '\\r\n')
            .replace(/\n/g, '\\n\n')
            .replace(/\r/g, '\\r\n')
            .replace(/ /g, '_')
            .replace(/\t/g, '===|'));
    };

    this.prettyprint = function(something, quote_strings) {
        var type = typeof something;
        switch (type.toLowerCase()) {
            case 'string':
                if (quote_strings) {
                    return "'" + something.replace("'", "\\'") + "'";
                }
                return something;
            case 'number':
                return '' + something;
            case 'boolean':
                return something ? 'true' : 'false';
            case 'undefined':
                return 'undefined';
            case 'object':
                if (something instanceof Array) {
                    var x = [];
                    var expected_index = 0;
                    for (var k in something) {
                        if (k === expected_index) {
                            x.push(this.prettyprint(something[k], true));
                            expected_index += 1;
                        } else {
                            x.push('\n' + k + ': ' + this.prettyprint(something[k], true));
                        }
                    }
                    return '[' + x.join(', ') + ']';
                }
                return 'object: ' + something;
            default:
                return type + ': ' + something;
        }
    };


    this.lazy_escape = function(str) {
        return str.replace(/</g, '&lt;').replace(/\>/g, '&gt;').replace(/\n/g, '<br />');
    };


    this.log = function() {
        if (window.console) {
            if (console.firebug) {
                console.log.apply(console, Array.prototype.slice.call(arguments));
            } else {
                console.log.call(console, Array.prototype.slice.call(arguments));
            }
        }
    };

}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SanityTest;
}