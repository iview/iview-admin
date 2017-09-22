/*
    AUTO-GENERATED. DO NOT MODIFY.
    Script: test/generate-tests.js
    Template: test/data/javascript/node.mustache
    Data: test/data/javascript/tests.js

  The MIT License (MIT)

  Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
/*jshint unused:false */

function run_javascript_tests(test_obj, Urlencoded, js_beautify, html_beautify, css_beautify)
{

    var default_opts = {
        indent_size: 4,
        indent_char: ' ',
        preserve_newlines: true,
        jslint_happy: false,
        keep_array_indentation: false,
        brace_style: 'collapse',
        space_before_conditional: true,
        break_chained_methods: false,
        selector_separator: '\n',
        end_with_newline: false
    };
    var opts;

    default_opts.indent_size = 4;
    default_opts.indent_char = ' ';
    default_opts.preserve_newlines = true;
    default_opts.jslint_happy = false;
    default_opts.keep_array_indentation = false;
    default_opts.brace_style = 'collapse';
    default_opts.operator_position = 'before-newline';

    function reset_options()
    {
        opts = JSON.parse(JSON.stringify(default_opts));
    }

    function test_js_beautifier(input)
    {
        return js_beautify(input, opts);
    }

    var sanitytest;

    // test the input on beautifier with the current flag settings
    // does not check the indentation / surroundings as bt() does
    function test_fragment(input, expected)
    {
        expected = expected || expected === '' ? expected : input;
        sanitytest.expect(input, expected);
        // if the expected is different from input, run it again
        // expected output should be unchanged when run twice.
        if (expected !== input) {
            sanitytest.expect(expected, expected);
        }

        // Everywhere we do newlines, they should be replaced with opts.eol
        opts.eol = '\r\\n';
        expected = expected.replace(/[\n]/g, '\r\n');
        sanitytest.expect(input, expected);
        if (input.indexOf('\n') !== -1) {
            input = input.replace(/[\n]/g, '\r\n');
            sanitytest.expect(input, expected);
            // Ensure support for auto eol detection
            opts.eol = 'auto';
            sanitytest.expect(input, expected);
        }
        opts.eol = '\n';
    }



    // test the input on beautifier with the current flag settings
    // test both the input as well as { input } wrapping
    function bt(input, expectation)
    {
        var wrapped_input, wrapped_expectation;

        expectation = expectation || expectation === '' ? expectation : input;
        sanitytest.test_function(test_js_beautifier, 'js_beautify');
        test_fragment(input, expectation);

        // If we set raw, input should be unchanged
        opts.test_output_raw = true;
        if (!opts.end_with_newline) {
            test_fragment(input, input);
        }
        opts.test_output_raw = false;

        // test also the returned indentation
        // e.g if input = "asdf();"
        // then test that this remains properly formatted as well:
        // {
        //     asdf();
        //     indent;
        // }

        var current_indent_size = opts.js ? opts.js.indent_size : null;
        current_indent_size = current_indent_size ? current_indent_size : opts.indent_size;
        if (current_indent_size === 4 && input) {
            wrapped_input = '{\n' + input.replace(/^(.+)$/mg, '    $1') + '\n    foo = bar;\n}';
            wrapped_expectation = '{\n' + expectation.replace(/^(.+)$/mg, '    $1') + '\n    foo = bar;\n}';
            test_fragment(wrapped_input, wrapped_expectation);

            // If we set raw, input should be unchanged
            opts.test_output_raw = true;
            if (!opts.end_with_newline) {
                test_fragment(wrapped_input, wrapped_input);
            }
            opts.test_output_raw = false;
        }

    }

    // run all tests for the given brace style ("collapse", "expand", "end-expand", or "none").
    // uses various whitespace combinations before and after opening and closing braces,
    // respectively, for most of the tests' inputs.
    function beautify_brace_tests(brace_style) {

        var indent_on_wrap_str = '    '; // could use Array(opts.indent_size + 1).join(' '); if we wanted to replace _all_ of the hardcoded 4-space in the test and expectation strings

        function permute_brace_tests(expect_open_white, expect_close_white) {

            // run the tests that need permutation against a specific combination of
            // pre-opening-brace and pre-closing-brace whitespace
            function run_brace_permutation(test_open_white, test_close_white) {
                var to = test_open_white,
                    tc = test_close_white,
                    eo = expect_open_white ? expect_open_white : to === '' ? ' ' : to,
                    ec = expect_close_white ? expect_close_white : tc === '' ? ' ' : tc,
                    i = eo === '\n' ? indent_on_wrap_str: '';

                bt( '//case 1\nif (a == 1)' + to + '{}\n//case 2\nelse if (a == 2)' + to + '{}',
                    '//case 1\nif (a == 1)' + eo + '{}\n//case 2\nelse if (a == 2)' + eo + '{}');
                bt( 'if(1)' + to + '{2}' + tc + 'else' + to + '{3}',
                    'if (1)' + eo + '{\n    2\n}' + ec + 'else' + eo + '{\n    3\n}');
                bt( 'try' + to + '{a();}' + tc +
                    'catch(b)' + to + '{c();}' + tc +
                    'catch(d)' + to + '{}' + tc +
                    'finally' + to + '{e();}',
                    // expected
                    'try' + eo + '{\n    a();\n}' + ec +
                    'catch (b)' + eo + '{\n    c();\n}' + ec +
                    'catch (d)' + eo + '{}' + ec +
                    'finally' + eo + '{\n    e();\n}');
                bt( 'if(a)' + to + '{b();}' + tc + 'else if(c) foo();',
                    'if (a)' + eo + '{\n    b();\n}' + ec + 'else if (c) foo();');
                // if/else statement with empty body
                bt( 'if (a)' + to + '{\n// comment\n}' + tc + 'else' + to + '{\n// comment\n}',
                    'if (a)' + eo + '{\n    // comment\n}' + ec + 'else' + eo + '{\n    // comment\n}');
                bt( 'if (x)' + to + '{y}' + tc + 'else' + to + '{ if (x)' + to + '{y}}',
                    'if (x)' + eo + '{\n    y\n}' + ec + 'else' + eo + '{\n    if (x)' + eo + i + '{\n        y\n    }\n}');
                bt( 'if (a)' + to + '{\nb;\n}' + tc + 'else' + to + '{\nc;\n}',
                    'if (a)' + eo + '{\n    b;\n}' + ec + 'else' + eo + '{\n    c;\n}');
                test_fragment('    /*\n* xx\n*/\n// xx\nif (foo)' + to + '{\n    bar();\n}',
                              '    /*\n     * xx\n     */\n    // xx\n    if (foo)' + eo + i + '{\n        bar();\n    }');
                bt( 'if (foo)' + to + '{}' + tc + 'else /regex/.test();',
                    'if (foo)' + eo + '{}' + ec + 'else /regex/.test();');
                test_fragment('if (foo)' + to + '{', 'if (foo)' + eo + '{');
                test_fragment('foo' + to + '{', 'foo' + eo + '{');
                test_fragment('return;' + to + '{', 'return;' + eo + '{');
                bt( 'function x()' + to + '{\n    foo();\n}zzz', 'function x()' + eo +'{\n    foo();\n}\nzzz');
                bt( 'var a = new function a()' + to + '{};', 'var a = new function a()' + eo + '{};');
                bt( 'var a = new function a()' + to + '    {},\n    b = new function b()' + to + '    {};',
                    'var a = new function a()' + eo + i + '{},\n    b = new function b()' + eo + i + '{};');
                bt("foo(" + to + "{\n    'a': 1\n},\n10);",
                   "foo(" + (eo === ' ' ? '' : eo) + i + "{\n        'a': 1\n    },\n    10);"); // "foo( {..." is a weird case
                bt('(["foo","bar"]).each(function(i)' + to + '{return i;});',
                   '(["foo", "bar"]).each(function(i)' + eo + '{\n    return i;\n});');
                bt('(function(i)' + to + '{return i;})();', '(function(i)' + eo + '{\n    return i;\n})();');

                bt( "test( /*Argument 1*/" + to + "{\n" +
                    "    'Value1': '1'\n" +
                    "}, /*Argument 2\n" +
                    " */ {\n" +
                    "    'Value2': '2'\n" +
                    "});",
                    // expected
                    "test( /*Argument 1*/" + eo + i + "{\n" +
                    "        'Value1': '1'\n" +
                    "    },\n" +
                    "    /*Argument 2\n" +
                    "     */\n" +
                    "    {\n" +
                    "        'Value2': '2'\n" +
                    "    });");

                bt( "test( /*Argument 1*/" + to + "{\n" +
                    "    'Value1': '1'\n" +
                    "}, /*Argument 2\n" +
                    " */\n" +
                    "{\n" +
                    "    'Value2': '2'\n" +
                    "});",
                    // expected
                    "test( /*Argument 1*/" + eo + i + "{\n" +
                    "        'Value1': '1'\n" +
                    "    },\n" +
                    "    /*Argument 2\n" +
                    "     */\n" +
                    "    {\n" +
                    "        'Value2': '2'\n" +
                    "    });");
            }

            run_brace_permutation('\n', '\n');
            run_brace_permutation('\n', ' ');
            run_brace_permutation(' ', ' ');
            run_brace_permutation(' ', '\n');
            run_brace_permutation('','');

            // brace tests that don't make sense to permutate
            test_fragment('return {'); // return needs the brace.
            test_fragment('return /* inline */ {');
            bt('throw {}');
            bt('throw {\n    foo;\n}');
            bt( 'var foo = {}');
            test_fragment('a: do {} while (); xxx', 'a: do {} while ();\nxxx');
            bt( '{a: do {} while (); xxx}', '{\n    a: do {} while ();xxx\n}');
            bt( 'var a = new function() {};');
            bt( 'var a = new function()\n{};', 'var a = new function() {};');
            bt( "test(\n" +
                "/*Argument 1*/ {\n" +
                "    'Value1': '1'\n" +
                "},\n" +
                "/*Argument 2\n" +
                " */ {\n" +
                "    'Value2': '2'\n" +
                "});",
                // expected
                "test(\n" +
                "    /*Argument 1*/\n" +
                "    {\n" +
                "        'Value1': '1'\n" +
                "    },\n" +
                "    /*Argument 2\n" +
                "     */\n" +
                "    {\n" +
                "        'Value2': '2'\n" +
                "    });");
        }

        reset_options();
        opts.brace_style = brace_style;

        switch(opts.brace_style) {
        case 'collapse':
            permute_brace_tests(' ', ' ');
            break;
        case 'expand':
            permute_brace_tests('\n', '\n');
            break;
        case 'end-expand':
            permute_brace_tests(' ', '\n');
            break;
        case 'none':
            permute_brace_tests();
            break;
        }
    }

    function unicode_char(value) {
        return String.fromCharCode(value);
    }

    function beautifier_tests()
    {
        sanitytest = test_obj;


        //============================================================
        // Unicode Support
        reset_options();
        bt('var ' + unicode_char(3232) + '_' + unicode_char(3232) + ' = "hi";');
        bt(
            'var ' + unicode_char(228) + 'x = {\n' +
            '    ' + unicode_char(228) + 'rgerlich: true\n' +
            '};');


        //============================================================
        // Test template and continuation strings
        reset_options();
        bt('`This is a ${template} string.`');
        bt(
            '`This\n' +
            '  is\n' +
            '  a\n' +
            '  ${template}\n' +
            '  string.`');
        bt(
            'a = `This is a continuation\\\n' +
            'string.`');
        bt(
            'a = "This is a continuation\\\n' +
            'string."');
        bt(
            '`SELECT\n' +
            '  nextval(\'${this.options.schema ? `${this.options.schema}.` : \'\'}"${this.tableName}_${this.autoIncrementField}_seq"\'::regclass\n' +
            '  ) nextval;`');
        
        // Tests for #1030
        bt(
            'const composeUrl = (host) => {\n' +
            '    return `${host `test`}`;\n' +
            '};');
        bt(
            'const composeUrl = (host, api, key, data) => {\n' +
            '    switch (api) {\n' +
            '        case "Init":\n' +
            '            return `${host}/vwapi/Init?VWID=${key}&DATA=${encodeURIComponent(\n' +
            '                Object.keys(data).map((k) => `${k}=${ data[k]}` ).join(";")\n' +
            '            )}`;\n' +
            '        case "Pay":\n' +
            '            return `${host}/vwapi/Pay?SessionId=${par}`;\n' +
            '    };\n' +
            '};');


        //============================================================
        // ES7 Decorators
        reset_options();
        bt('@foo');
        bt('@foo(bar)');
        bt(
            '@foo(function(k, v) {\n' +
            '    implementation();\n' +
            '})');


        //============================================================
        // ES7 exponential
        reset_options();
        bt('x ** 2');
        bt('x ** -2');


        //============================================================
        // Spread operator
        reset_options();
        opts.brace_style = "collapse,preserve-inline";
        bt('const m = { ...item, c: 3 };');
        bt(
            'const m = {\n' +
            '    ...item,\n' +
            '    c: 3\n' +
            '};');
        bt('const m = { c: 3, ...item };');
        bt('const m = [...item, 3];');
        bt('const m = [3, ...item];');


        //============================================================
        // Object literal shorthand functions
        reset_options();
        bt(
            'return {\n' +
            '    foo() {\n' +
            '        return 42;\n' +
            '    }\n' +
            '}');
        bt(
            'var foo = {\n' +
            '    * bar() {\n' +
            '        yield 42;\n' +
            '    }\n' +
            '};');
        bt(
            'var foo = {bar(){return 42;},*barGen(){yield 42;}};',
            //  -- output --
            'var foo = {\n' +
            '    bar() {\n' +
            '        return 42;\n' +
            '    },\n' +
            '    * barGen() {\n' +
            '        yield 42;\n' +
            '    }\n' +
            '};');
        
        // also handle generator shorthand in class - #1013
        bt(
            'class A {\n' +
            '    fn() {\n' +
            '        return true;\n' +
            '    }\n' +
            '\n' +
            '    * gen() {\n' +
            '        return true;\n' +
            '    }\n' +
            '}');
        bt(
            'class A {\n' +
            '    * gen() {\n' +
            '        return true;\n' +
            '    }\n' +
            '\n' +
            '    fn() {\n' +
            '        return true;\n' +
            '    }\n' +
            '}');


        //============================================================
        // End With Newline - (eof = "\n")
        reset_options();
        opts.end_with_newline = true;
        test_fragment('', '\n');
        test_fragment('   return .5', '   return .5\n');
        test_fragment(
            '   \n' +
            '\n' +
            'return .5\n' +
            '\n' +
            '\n' +
            '\n',
            //  -- output --
            '   return .5\n');
        test_fragment('\n');

        // End With Newline - (eof = "")
        reset_options();
        opts.end_with_newline = false;
        test_fragment('');
        test_fragment('   return .5');
        test_fragment(
            '   \n' +
            '\n' +
            'return .5\n' +
            '\n' +
            '\n' +
            '\n',
            //  -- output --
            '   return .5');
        test_fragment('\n', '');


        //============================================================
        // Support simple language specific option inheritance/overriding - (j = "   ")
        reset_options();
        opts.js = { 'indent_size': 3 };
        opts.css = { 'indent_size': 5 };
        bt(
            'if (a == b) {\n' +
            '   test();\n' +
            '}');

        // Support simple language specific option inheritance/overriding - (j = "    ")
        reset_options();
        opts.html = { 'js': { 'indent_size': 3 }, 'css': { 'indent_size': 5 } };
        bt(
            'if (a == b) {\n' +
            '    test();\n' +
            '}');

        // Support simple language specific option inheritance/overriding - (j = "    ")
        reset_options();
        opts.indent_size = 9;
        opts.html = { 'js': { 'indent_size': 3 }, 'css': { 'indent_size': 5 }, 'indent_size': 2};
        opts.js = { 'indent_size': 4 };
        opts.css = { 'indent_size': 3 };
        bt(
            'if (a == b) {\n' +
            '    test();\n' +
            '}');


        //============================================================
        // Brace style permutations - (ibo = "", iao = "", ibc = "", iac = "", obo = " ", oao = " ", obc = " ", oac = " ")
        reset_options();
        opts.brace_style = 'collapse,preserve-inline';
        bt(
            'var a ={a: 2};\n' +
            'var a ={a: 2};',
            //  -- output --
            'var a = { a: 2 };\n' +
            'var a = { a: 2 };');
        bt(
            '//case 1\n' +
            'if (a == 1){}\n' +
            '//case 2\n' +
            'else if (a == 2){}',
            //  -- output --
            '//case 1\n' +
            'if (a == 1) {}\n' +
            '//case 2\n' +
            'else if (a == 2) {}');
        bt('if(1){2}else{3}', 'if (1) { 2 } else { 3 }');
        bt('try{a();}catch(b){c();}catch(d){}finally{e();}', 'try { a(); } catch (b) { c(); } catch (d) {} finally { e(); }');

        // Brace style permutations - (ibo = "\n", iao = "\n", ibc = "\n", iac = "\n", obo = " ", oao = "\n    ", obc = "\n", oac = " ")
        reset_options();
        opts.brace_style = 'collapse,preserve-inline';
        bt(
            'var a =\n' +
            '{\n' +
            'a: 2\n' +
            '}\n' +
            ';\n' +
            'var a =\n' +
            '{\n' +
            'a: 2\n' +
            '}\n' +
            ';',
            //  -- output --
            'var a = {\n' +
            '    a: 2\n' +
            '};\n' +
            'var a = {\n' +
            '    a: 2\n' +
            '};');
        bt(
            '//case 1\n' +
            'if (a == 1)\n' +
            '{}\n' +
            '//case 2\n' +
            'else if (a == 2)\n' +
            '{}',
            //  -- output --
            '//case 1\n' +
            'if (a == 1) {}\n' +
            '//case 2\n' +
            'else if (a == 2) {}');
        bt(
            'if(1)\n' +
            '{\n' +
            '2\n' +
            '}\n' +
            'else\n' +
            '{\n' +
            '3\n' +
            '}',
            //  -- output --
            'if (1) {\n' +
            '    2\n' +
            '} else {\n' +
            '    3\n' +
            '}');
        bt(
            'try\n' +
            '{\n' +
            'a();\n' +
            '}\n' +
            'catch(b)\n' +
            '{\n' +
            'c();\n' +
            '}\n' +
            'catch(d)\n' +
            '{}\n' +
            'finally\n' +
            '{\n' +
            'e();\n' +
            '}',
            //  -- output --
            'try {\n' +
            '    a();\n' +
            '} catch (b) {\n' +
            '    c();\n' +
            '} catch (d) {} finally {\n' +
            '    e();\n' +
            '}');

        // Brace style permutations - (ibo = "", iao = "", ibc = "", iac = "", obo = " ", oao = "\n    ", obc = "\n", oac = " ")
        reset_options();
        opts.brace_style = 'collapse';
        bt(
            'var a ={a: 2};\n' +
            'var a ={a: 2};',
            //  -- output --
            'var a = {\n' +
            '    a: 2\n' +
            '};\n' +
            'var a = {\n' +
            '    a: 2\n' +
            '};');
        bt(
            '//case 1\n' +
            'if (a == 1){}\n' +
            '//case 2\n' +
            'else if (a == 2){}',
            //  -- output --
            '//case 1\n' +
            'if (a == 1) {}\n' +
            '//case 2\n' +
            'else if (a == 2) {}');
        bt(
            'if(1){2}else{3}',
            //  -- output --
            'if (1) {\n' +
            '    2\n' +
            '} else {\n' +
            '    3\n' +
            '}');
        bt(
            'try{a();}catch(b){c();}catch(d){}finally{e();}',
            //  -- output --
            'try {\n' +
            '    a();\n' +
            '} catch (b) {\n' +
            '    c();\n' +
            '} catch (d) {} finally {\n' +
            '    e();\n' +
            '}');

        // Brace style permutations - (ibo = "\n", iao = "\n", ibc = "\n", iac = "\n", obo = " ", oao = "\n    ", obc = "\n", oac = " ")
        reset_options();
        opts.brace_style = 'collapse';
        bt(
            'var a =\n' +
            '{\n' +
            'a: 2\n' +
            '}\n' +
            ';\n' +
            'var a =\n' +
            '{\n' +
            'a: 2\n' +
            '}\n' +
            ';',
            //  -- output --
            'var a = {\n' +
            '    a: 2\n' +
            '};\n' +
            'var a = {\n' +
            '    a: 2\n' +
            '};');
        bt(
            '//case 1\n' +
            'if (a == 1)\n' +
            '{}\n' +
            '//case 2\n' +
            'else if (a == 2)\n' +
            '{}',
            //  -- output --
            '//case 1\n' +
            'if (a == 1) {}\n' +
            '//case 2\n' +
            'else if (a == 2) {}');
        bt(
            'if(1)\n' +
            '{\n' +
            '2\n' +
            '}\n' +
            'else\n' +
            '{\n' +
            '3\n' +
            '}',
            //  -- output --
            'if (1) {\n' +
            '    2\n' +
            '} else {\n' +
            '    3\n' +
            '}');
        bt(
            'try\n' +
            '{\n' +
            'a();\n' +
            '}\n' +
            'catch(b)\n' +
            '{\n' +
            'c();\n' +
            '}\n' +
            'catch(d)\n' +
            '{}\n' +
            'finally\n' +
            '{\n' +
            'e();\n' +
            '}',
            //  -- output --
            'try {\n' +
            '    a();\n' +
            '} catch (b) {\n' +
            '    c();\n' +
            '} catch (d) {} finally {\n' +
            '    e();\n' +
            '}');


        //============================================================
        // Comma-first option - (c0 = ",\n", c1 = ",\n    ", c2 = ",\n        ", c3 = ",\n            ", f1 = "    ,\n    ")
        reset_options();
        opts.comma_first = false;
        bt(
            '{a:1, b:2}',
            //  -- output --
            '{\n' +
            '    a: 1,\n' +
            '    b: 2\n' +
            '}');
        bt(
            'var a=1, b=c[d], e=6;',
            //  -- output --
            'var a = 1,\n' +
            '    b = c[d],\n' +
            '    e = 6;');
        bt(
            'for(var a=1,b=2,c=3;d<3;d++)\n' +
            'e',
            //  -- output --
            'for (var a = 1, b = 2, c = 3; d < 3; d++)\n' +
            '    e');
        bt(
            'for(var a=1,b=2,\n' +
            'c=3;d<3;d++)\n' +
            'e',
            //  -- output --
            'for (var a = 1, b = 2,\n' +
            '        c = 3; d < 3; d++)\n' +
            '    e');
        bt(
            'function foo() {\n' +
            '    return [\n' +
            '        "one",\n' +
            '        "two"\n' +
            '    ];\n' +
            '}');
        bt(
            'a=[[1,2],[4,5],[7,8]]',
            //  -- output --
            'a = [\n' +
            '    [1, 2],\n' +
            '    [4, 5],\n' +
            '    [7, 8]\n' +
            ']');
        bt(
            'a=[[1,2],[4,5],[7,8],]',
            //  -- output --
            'a = [\n' +
            '    [1, 2],\n' +
            '    [4, 5],\n' +
            '    [7, 8],\n' +
            ']');
        bt(
            'a=[[1,2],[4,5],function(){},[7,8]]',
            //  -- output --
            'a = [\n' +
            '    [1, 2],\n' +
            '    [4, 5],\n' +
            '    function() {},\n' +
            '    [7, 8]\n' +
            ']');
        bt(
            'a=[[1,2],[4,5],function(){},function(){},[7,8]]',
            //  -- output --
            'a = [\n' +
            '    [1, 2],\n' +
            '    [4, 5],\n' +
            '    function() {},\n' +
            '    function() {},\n' +
            '    [7, 8]\n' +
            ']');
        bt(
            'a=[[1,2],[4,5],function(){},[7,8]]',
            //  -- output --
            'a = [\n' +
            '    [1, 2],\n' +
            '    [4, 5],\n' +
            '    function() {},\n' +
            '    [7, 8]\n' +
            ']');
        bt('a=[b,c,function(){},function(){},d]', 'a = [b, c, function() {}, function() {}, d]');
        bt(
            'a=[b,c,\n' +
            'function(){},function(){},d]',
            //  -- output --
            'a = [b, c,\n' +
            '    function() {},\n' +
            '    function() {},\n' +
            '    d\n' +
            ']');
        bt('a=[a[1],b[4],c[d[7]]]', 'a = [a[1], b[4], c[d[7]]]');
        bt('[1,2,[3,4,[5,6],7],8]', '[1, 2, [3, 4, [5, 6], 7], 8]');
        bt(
            '[[["1","2"],["3","4"]],[["5","6","7"],["8","9","0"]],[["1","2","3"],["4","5","6","7"],["8","9","0"]]]',
            //  -- output --
            '[\n' +
            '    [\n' +
            '        ["1", "2"],\n' +
            '        ["3", "4"]\n' +
            '    ],\n' +
            '    [\n' +
            '        ["5", "6", "7"],\n' +
            '        ["8", "9", "0"]\n' +
            '    ],\n' +
            '    [\n' +
            '        ["1", "2", "3"],\n' +
            '        ["4", "5", "6", "7"],\n' +
            '        ["8", "9", "0"]\n' +
            '    ]\n' +
            ']');
        bt(
            'changeCollection.add({\n' +
            '    name: "Jonathan" // New line inserted after this line on every save\n' +
            '    , age: 25\n' +
            '});',
            //  -- output --
            'changeCollection.add({\n' +
            '    name: "Jonathan" // New line inserted after this line on every save\n' +
            '        ,\n' +
            '    age: 25\n' +
            '});');
        bt(
            'changeCollection.add(\n' +
            '    function() {\n' +
            '        return true;\n' +
            '    },\n' +
            '    function() {\n' +
            '        return true;\n' +
            '    }\n' +
            ');');

        // Comma-first option - (c0 = "\n, ", c1 = "\n    , ", c2 = "\n        , ", c3 = "\n            , ", f1 = ", ")
        reset_options();
        opts.comma_first = true;
        bt(
            '{a:1, b:2}',
            //  -- output --
            '{\n' +
            '    a: 1\n' +
            '    , b: 2\n' +
            '}');
        bt(
            'var a=1, b=c[d], e=6;',
            //  -- output --
            'var a = 1\n' +
            '    , b = c[d]\n' +
            '    , e = 6;');
        bt(
            'for(var a=1,b=2,c=3;d<3;d++)\n' +
            'e',
            //  -- output --
            'for (var a = 1, b = 2, c = 3; d < 3; d++)\n' +
            '    e');
        bt(
            'for(var a=1,b=2,\n' +
            'c=3;d<3;d++)\n' +
            'e',
            //  -- output --
            'for (var a = 1, b = 2\n' +
            '        , c = 3; d < 3; d++)\n' +
            '    e');
        bt(
            'function foo() {\n' +
            '    return [\n' +
            '        "one"\n' +
            '        , "two"\n' +
            '    ];\n' +
            '}');
        bt(
            'a=[[1,2],[4,5],[7,8]]',
            //  -- output --
            'a = [\n' +
            '    [1, 2]\n' +
            '    , [4, 5]\n' +
            '    , [7, 8]\n' +
            ']');
        bt(
            'a=[[1,2],[4,5],[7,8],]',
            //  -- output --
            'a = [\n' +
            '    [1, 2]\n' +
            '    , [4, 5]\n' +
            '    , [7, 8]\n' +
            ', ]');
        bt(
            'a=[[1,2],[4,5],function(){},[7,8]]',
            //  -- output --
            'a = [\n' +
            '    [1, 2]\n' +
            '    , [4, 5]\n' +
            '    , function() {}\n' +
            '    , [7, 8]\n' +
            ']');
        bt(
            'a=[[1,2],[4,5],function(){},function(){},[7,8]]',
            //  -- output --
            'a = [\n' +
            '    [1, 2]\n' +
            '    , [4, 5]\n' +
            '    , function() {}\n' +
            '    , function() {}\n' +
            '    , [7, 8]\n' +
            ']');
        bt(
            'a=[[1,2],[4,5],function(){},[7,8]]',
            //  -- output --
            'a = [\n' +
            '    [1, 2]\n' +
            '    , [4, 5]\n' +
            '    , function() {}\n' +
            '    , [7, 8]\n' +
            ']');
        bt('a=[b,c,function(){},function(){},d]', 'a = [b, c, function() {}, function() {}, d]');
        bt(
            'a=[b,c,\n' +
            'function(){},function(){},d]',
            //  -- output --
            'a = [b, c\n' +
            '    , function() {}\n' +
            '    , function() {}\n' +
            '    , d\n' +
            ']');
        bt('a=[a[1],b[4],c[d[7]]]', 'a = [a[1], b[4], c[d[7]]]');
        bt('[1,2,[3,4,[5,6],7],8]', '[1, 2, [3, 4, [5, 6], 7], 8]');
        bt(
            '[[["1","2"],["3","4"]],[["5","6","7"],["8","9","0"]],[["1","2","3"],["4","5","6","7"],["8","9","0"]]]',
            //  -- output --
            '[\n' +
            '    [\n' +
            '        ["1", "2"]\n' +
            '        , ["3", "4"]\n' +
            '    ]\n' +
            '    , [\n' +
            '        ["5", "6", "7"]\n' +
            '        , ["8", "9", "0"]\n' +
            '    ]\n' +
            '    , [\n' +
            '        ["1", "2", "3"]\n' +
            '        , ["4", "5", "6", "7"]\n' +
            '        , ["8", "9", "0"]\n' +
            '    ]\n' +
            ']');
        bt(
            'changeCollection.add({\n' +
            '    name: "Jonathan" // New line inserted after this line on every save\n' +
            '    , age: 25\n' +
            '});');
        bt(
            'changeCollection.add(\n' +
            '    function() {\n' +
            '        return true;\n' +
            '    },\n' +
            '    function() {\n' +
            '        return true;\n' +
            '    }\n' +
            ');',
            //  -- output --
            'changeCollection.add(\n' +
            '    function() {\n' +
            '        return true;\n' +
            '    }\n' +
            '    , function() {\n' +
            '        return true;\n' +
            '    }\n' +
            ');');


        //============================================================
        // Unindent chained functions - ()
        reset_options();
        opts.unindent_chained_methods = true;
        bt(
            'f().f().f()\n' +
            '    .f().f();',
            //  -- output --
            'f().f().f()\n' +
            '.f().f();');
        bt(
            'f()\n' +
            '    .f()\n' +
            '    .f();',
            //  -- output --
            'f()\n' +
            '.f()\n' +
            '.f();');
        bt(
            'f(function() {\n' +
            '    f()\n' +
            '        .f()\n' +
            '        .f();\n' +
            '});',
            //  -- output --
            'f(function() {\n' +
            '    f()\n' +
            '    .f()\n' +
            '    .f();\n' +
            '});');


        //============================================================
        // Space in parens tests - (s = "", e = "")
        reset_options();
        opts.space_in_paren = false;
        opts.space_in_empty_paren = false;
        bt('if(p) foo(a,b);', 'if (p) foo(a, b);');
        bt(
            'try{while(true){willThrow()}}catch(result)switch(result){case 1:++result }',
            //  -- output --
            'try {\n' +
            '    while (true) {\n' +
            '        willThrow()\n' +
            '    }\n' +
            '} catch (result) switch (result) {\n' +
            '    case 1:\n' +
            '        ++result\n' +
            '}');
        bt('((e/((a+(b)*c)-d))^2)*5;', '((e / ((a + (b) * c) - d)) ^ 2) * 5;');
        bt(
            'function f(a,b) {if(a) b()}function g(a,b) {if(!a) b()}',
            //  -- output --
            'function f(a, b) {\n' +
            '    if (a) b()\n' +
            '}\n' +
            '\n' +
            'function g(a, b) {\n' +
            '    if (!a) b()\n' +
            '}');
        bt('a=[];', 'a = [];');
        bt('a=[b,c,d];', 'a = [b, c, d];');
        bt('a= f[b];', 'a = f[b];');
        bt(
            '{\n' +
            '    files: [ {\n' +
            '        expand: true,\n' +
            '        cwd: "www/gui/",\n' +
            '        src: [ "im/design_standards/*.*" ],\n' +
            '        dest: "www/gui/build"\n' +
            '    } ]\n' +
            '}',
            //  -- output --
            '{\n' +
            '    files: [{\n' +
            '        expand: true,\n' +
            '        cwd: "www/gui/",\n' +
            '        src: ["im/design_standards/*.*"],\n' +
            '        dest: "www/gui/build"\n' +
            '    }]\n' +
            '}');

        // Space in parens tests - (s = "", e = "")
        reset_options();
        opts.space_in_paren = false;
        opts.space_in_empty_paren = true;
        bt('if(p) foo(a,b);', 'if (p) foo(a, b);');
        bt(
            'try{while(true){willThrow()}}catch(result)switch(result){case 1:++result }',
            //  -- output --
            'try {\n' +
            '    while (true) {\n' +
            '        willThrow()\n' +
            '    }\n' +
            '} catch (result) switch (result) {\n' +
            '    case 1:\n' +
            '        ++result\n' +
            '}');
        bt('((e/((a+(b)*c)-d))^2)*5;', '((e / ((a + (b) * c) - d)) ^ 2) * 5;');
        bt(
            'function f(a,b) {if(a) b()}function g(a,b) {if(!a) b()}',
            //  -- output --
            'function f(a, b) {\n' +
            '    if (a) b()\n' +
            '}\n' +
            '\n' +
            'function g(a, b) {\n' +
            '    if (!a) b()\n' +
            '}');
        bt('a=[];', 'a = [];');
        bt('a=[b,c,d];', 'a = [b, c, d];');
        bt('a= f[b];', 'a = f[b];');
        bt(
            '{\n' +
            '    files: [ {\n' +
            '        expand: true,\n' +
            '        cwd: "www/gui/",\n' +
            '        src: [ "im/design_standards/*.*" ],\n' +
            '        dest: "www/gui/build"\n' +
            '    } ]\n' +
            '}',
            //  -- output --
            '{\n' +
            '    files: [{\n' +
            '        expand: true,\n' +
            '        cwd: "www/gui/",\n' +
            '        src: ["im/design_standards/*.*"],\n' +
            '        dest: "www/gui/build"\n' +
            '    }]\n' +
            '}');

        // Space in parens tests - (s = " ", e = "")
        reset_options();
        opts.space_in_paren = true;
        opts.space_in_empty_paren = false;
        bt('if(p) foo(a,b);', 'if ( p ) foo( a, b );');
        bt(
            'try{while(true){willThrow()}}catch(result)switch(result){case 1:++result }',
            //  -- output --
            'try {\n' +
            '    while ( true ) {\n' +
            '        willThrow()\n' +
            '    }\n' +
            '} catch ( result ) switch ( result ) {\n' +
            '    case 1:\n' +
            '        ++result\n' +
            '}');
        bt('((e/((a+(b)*c)-d))^2)*5;', '( ( e / ( ( a + ( b ) * c ) - d ) ) ^ 2 ) * 5;');
        bt(
            'function f(a,b) {if(a) b()}function g(a,b) {if(!a) b()}',
            //  -- output --
            'function f( a, b ) {\n' +
            '    if ( a ) b()\n' +
            '}\n' +
            '\n' +
            'function g( a, b ) {\n' +
            '    if ( !a ) b()\n' +
            '}');
        bt('a=[];', 'a = [];');
        bt('a=[b,c,d];', 'a = [ b, c, d ];');
        bt('a= f[b];', 'a = f[ b ];');
        bt(
            '{\n' +
            '    files: [ {\n' +
            '        expand: true,\n' +
            '        cwd: "www/gui/",\n' +
            '        src: [ "im/design_standards/*.*" ],\n' +
            '        dest: "www/gui/build"\n' +
            '    } ]\n' +
            '}');

        // Space in parens tests - (s = " ", e = " ")
        reset_options();
        opts.space_in_paren = true;
        opts.space_in_empty_paren = true;
        bt('if(p) foo(a,b);', 'if ( p ) foo( a, b );');
        bt(
            'try{while(true){willThrow()}}catch(result)switch(result){case 1:++result }',
            //  -- output --
            'try {\n' +
            '    while ( true ) {\n' +
            '        willThrow( )\n' +
            '    }\n' +
            '} catch ( result ) switch ( result ) {\n' +
            '    case 1:\n' +
            '        ++result\n' +
            '}');
        bt('((e/((a+(b)*c)-d))^2)*5;', '( ( e / ( ( a + ( b ) * c ) - d ) ) ^ 2 ) * 5;');
        bt(
            'function f(a,b) {if(a) b()}function g(a,b) {if(!a) b()}',
            //  -- output --
            'function f( a, b ) {\n' +
            '    if ( a ) b( )\n' +
            '}\n' +
            '\n' +
            'function g( a, b ) {\n' +
            '    if ( !a ) b( )\n' +
            '}');
        bt('a=[];', 'a = [ ];');
        bt('a=[b,c,d];', 'a = [ b, c, d ];');
        bt('a= f[b];', 'a = f[ b ];');
        bt(
            '{\n' +
            '    files: [ {\n' +
            '        expand: true,\n' +
            '        cwd: "www/gui/",\n' +
            '        src: [ "im/design_standards/*.*" ],\n' +
            '        dest: "www/gui/build"\n' +
            '    } ]\n' +
            '}');


        //============================================================
        // operator_position option - ensure no neswlines if preserve_newlines is false - ()
        reset_options();
        opts.operator_position = 'before-newline';
        opts.preserve_newlines = false;
        bt(
            'var res = a + b - c / d * e % f;\n' +
            'var res = g & h | i ^ j;\n' +
            'var res = (k && l || m) ? n : o;\n' +
            'var res = p >> q << r >>> s;\n' +
            'var res = t === u !== v != w == x >= y <= z > aa < ab;\n' +
            'ac + -ad');
        bt(
            'var res = a + b\n' +
            '- c /\n' +
            'd  *     e\n' +
            '%\n' +
            'f;\n' +
            '   var res = g & h\n' +
            '| i ^\n' +
            'j;\n' +
            'var res = (k &&\n' +
            'l\n' +
            '|| m) ?\n' +
            'n\n' +
            ': o\n' +
            ';\n' +
            'var res = p\n' +
            '>> q <<\n' +
            'r\n' +
            '>>> s;\n' +
            'var res\n' +
            '  = t\n' +
            '\n' +
            ' === u !== v\n' +
            ' !=\n' +
            'w\n' +
            '== x >=\n' +
            'y <= z > aa <\n' +
            'ab;\n' +
            'ac +\n' +
            '-ad',
            //  -- output --
            'var res = a + b - c / d * e % f;\n' +
            'var res = g & h | i ^ j;\n' +
            'var res = (k && l || m) ? n : o;\n' +
            'var res = p >> q << r >>> s;\n' +
            'var res = t === u !== v != w == x >= y <= z > aa < ab;\n' +
            'ac + -ad');

        // operator_position option - ensure no neswlines if preserve_newlines is false - ()
        reset_options();
        opts.operator_position = 'after-newline';
        opts.preserve_newlines = false;
        bt(
            'var res = a + b - c / d * e % f;\n' +
            'var res = g & h | i ^ j;\n' +
            'var res = (k && l || m) ? n : o;\n' +
            'var res = p >> q << r >>> s;\n' +
            'var res = t === u !== v != w == x >= y <= z > aa < ab;\n' +
            'ac + -ad');
        bt(
            'var res = a + b\n' +
            '- c /\n' +
            'd  *     e\n' +
            '%\n' +
            'f;\n' +
            '   var res = g & h\n' +
            '| i ^\n' +
            'j;\n' +
            'var res = (k &&\n' +
            'l\n' +
            '|| m) ?\n' +
            'n\n' +
            ': o\n' +
            ';\n' +
            'var res = p\n' +
            '>> q <<\n' +
            'r\n' +
            '>>> s;\n' +
            'var res\n' +
            '  = t\n' +
            '\n' +
            ' === u !== v\n' +
            ' !=\n' +
            'w\n' +
            '== x >=\n' +
            'y <= z > aa <\n' +
            'ab;\n' +
            'ac +\n' +
            '-ad',
            //  -- output --
            'var res = a + b - c / d * e % f;\n' +
            'var res = g & h | i ^ j;\n' +
            'var res = (k && l || m) ? n : o;\n' +
            'var res = p >> q << r >>> s;\n' +
            'var res = t === u !== v != w == x >= y <= z > aa < ab;\n' +
            'ac + -ad');

        // operator_position option - ensure no neswlines if preserve_newlines is false - ()
        reset_options();
        opts.operator_position = 'preserve-newline';
        opts.preserve_newlines = false;
        bt(
            'var res = a + b - c / d * e % f;\n' +
            'var res = g & h | i ^ j;\n' +
            'var res = (k && l || m) ? n : o;\n' +
            'var res = p >> q << r >>> s;\n' +
            'var res = t === u !== v != w == x >= y <= z > aa < ab;\n' +
            'ac + -ad');
        bt(
            'var res = a + b\n' +
            '- c /\n' +
            'd  *     e\n' +
            '%\n' +
            'f;\n' +
            '   var res = g & h\n' +
            '| i ^\n' +
            'j;\n' +
            'var res = (k &&\n' +
            'l\n' +
            '|| m) ?\n' +
            'n\n' +
            ': o\n' +
            ';\n' +
            'var res = p\n' +
            '>> q <<\n' +
            'r\n' +
            '>>> s;\n' +
            'var res\n' +
            '  = t\n' +
            '\n' +
            ' === u !== v\n' +
            ' !=\n' +
            'w\n' +
            '== x >=\n' +
            'y <= z > aa <\n' +
            'ab;\n' +
            'ac +\n' +
            '-ad',
            //  -- output --
            'var res = a + b - c / d * e % f;\n' +
            'var res = g & h | i ^ j;\n' +
            'var res = (k && l || m) ? n : o;\n' +
            'var res = p >> q << r >>> s;\n' +
            'var res = t === u !== v != w == x >= y <= z > aa < ab;\n' +
            'ac + -ad');


        //============================================================
        // operator_position option - set to 'before-newline' (default value)
        reset_options();
        
        // comprehensive, various newlines
        bt(
            'var res = a + b\n' +
            '- c /\n' +
            'd  *     e\n' +
            '%\n' +
            'f;\n' +
            '   var res = g & h\n' +
            '| i ^\n' +
            'j;\n' +
            'var res = (k &&\n' +
            'l\n' +
            '|| m) ?\n' +
            'n\n' +
            ': o\n' +
            ';\n' +
            'var res = p\n' +
            '>> q <<\n' +
            'r\n' +
            '>>> s;\n' +
            'var res\n' +
            '  = t\n' +
            '\n' +
            ' === u !== v\n' +
            ' !=\n' +
            'w\n' +
            '== x >=\n' +
            'y <= z > aa <\n' +
            'ab;\n' +
            'ac +\n' +
            '-ad',
            //  -- output --
            'var res = a + b -\n' +
            '    c /\n' +
            '    d * e %\n' +
            '    f;\n' +
            'var res = g & h |\n' +
            '    i ^\n' +
            '    j;\n' +
            'var res = (k &&\n' +
            '        l ||\n' +
            '        m) ?\n' +
            '    n :\n' +
            '    o;\n' +
            'var res = p >>\n' +
            '    q <<\n' +
            '    r >>>\n' +
            '    s;\n' +
            'var res = t\n' +
            '\n' +
            '    ===\n' +
            '    u !== v !=\n' +
            '    w ==\n' +
            '    x >=\n' +
            '    y <= z > aa <\n' +
            '    ab;\n' +
            'ac +\n' +
            '    -ad');
        
        // colon special case
        bt(
            'var a = {\n' +
            '    b\n' +
            ': bval,\n' +
            '    c:\n' +
            'cval\n' +
            '    ,d: dval\n' +
            '};\n' +
            'var e = f ? g\n' +
            ': h;\n' +
            'var i = j ? k :\n' +
            'l;',
            //  -- output --
            'var a = {\n' +
            '    b: bval,\n' +
            '    c: cval,\n' +
            '    d: dval\n' +
            '};\n' +
            'var e = f ? g :\n' +
            '    h;\n' +
            'var i = j ? k :\n' +
            '    l;');
        
        // catch-all, includes brackets and other various code
        bt(
            'var d = 1;\n' +
            'if (a === b\n' +
            '    && c) {\n' +
            '    d = (c * everything\n' +
            '            / something_else) %\n' +
            '        b;\n' +
            '    e\n' +
            '        += d;\n' +
            '\n' +
            '} else if (!(complex && simple) ||\n' +
            '    (emotion && emotion.name === "happy")) {\n' +
            '    cryTearsOfJoy(many ||\n' +
            '        anOcean\n' +
            '        || aRiver);\n' +
            '}',
            //  -- output --
            'var d = 1;\n' +
            'if (a === b &&\n' +
            '    c) {\n' +
            '    d = (c * everything /\n' +
            '            something_else) %\n' +
            '        b;\n' +
            '    e\n' +
            '        += d;\n' +
            '\n' +
            '} else if (!(complex && simple) ||\n' +
            '    (emotion && emotion.name === "happy")) {\n' +
            '    cryTearsOfJoy(many ||\n' +
            '        anOcean ||\n' +
            '        aRiver);\n' +
            '}');


        //============================================================
        // operator_position option - set to 'after_newline'
        reset_options();
        opts.operator_position = 'after-newline';
        
        // comprehensive, various newlines
        bt(
            'var res = a + b\n' +
            '- c /\n' +
            'd  *     e\n' +
            '%\n' +
            'f;\n' +
            '   var res = g & h\n' +
            '| i ^\n' +
            'j;\n' +
            'var res = (k &&\n' +
            'l\n' +
            '|| m) ?\n' +
            'n\n' +
            ': o\n' +
            ';\n' +
            'var res = p\n' +
            '>> q <<\n' +
            'r\n' +
            '>>> s;\n' +
            'var res\n' +
            '  = t\n' +
            '\n' +
            ' === u !== v\n' +
            ' !=\n' +
            'w\n' +
            '== x >=\n' +
            'y <= z > aa <\n' +
            'ab;\n' +
            'ac +\n' +
            '-ad',
            //  -- output --
            'var res = a + b\n' +
            '    - c\n' +
            '    / d * e\n' +
            '    % f;\n' +
            'var res = g & h\n' +
            '    | i\n' +
            '    ^ j;\n' +
            'var res = (k\n' +
            '        && l\n' +
            '        || m)\n' +
            '    ? n\n' +
            '    : o;\n' +
            'var res = p\n' +
            '    >> q\n' +
            '    << r\n' +
            '    >>> s;\n' +
            'var res = t\n' +
            '\n' +
            '    === u !== v\n' +
            '    != w\n' +
            '    == x\n' +
            '    >= y <= z > aa\n' +
            '    < ab;\n' +
            'ac\n' +
            '    + -ad');
        
        // colon special case
        bt(
            'var a = {\n' +
            '    b\n' +
            ': bval,\n' +
            '    c:\n' +
            'cval\n' +
            '    ,d: dval\n' +
            '};\n' +
            'var e = f ? g\n' +
            ': h;\n' +
            'var i = j ? k :\n' +
            'l;',
            //  -- output --
            'var a = {\n' +
            '    b: bval,\n' +
            '    c: cval,\n' +
            '    d: dval\n' +
            '};\n' +
            'var e = f ? g\n' +
            '    : h;\n' +
            'var i = j ? k\n' +
            '    : l;');
        
        // catch-all, includes brackets and other various code
        bt(
            'var d = 1;\n' +
            'if (a === b\n' +
            '    && c) {\n' +
            '    d = (c * everything\n' +
            '            / something_else) %\n' +
            '        b;\n' +
            '    e\n' +
            '        += d;\n' +
            '\n' +
            '} else if (!(complex && simple) ||\n' +
            '    (emotion && emotion.name === "happy")) {\n' +
            '    cryTearsOfJoy(many ||\n' +
            '        anOcean\n' +
            '        || aRiver);\n' +
            '}',
            //  -- output --
            'var d = 1;\n' +
            'if (a === b\n' +
            '    && c) {\n' +
            '    d = (c * everything\n' +
            '            / something_else)\n' +
            '        % b;\n' +
            '    e\n' +
            '        += d;\n' +
            '\n' +
            '} else if (!(complex && simple)\n' +
            '    || (emotion && emotion.name === "happy")) {\n' +
            '    cryTearsOfJoy(many\n' +
            '        || anOcean\n' +
            '        || aRiver);\n' +
            '}');


        //============================================================
        // operator_position option - set to 'preserve-newline'
        reset_options();
        opts.operator_position = 'preserve-newline';
        
        // comprehensive, various newlines
        bt(
            'var res = a + b\n' +
            '- c /\n' +
            'd  *     e\n' +
            '%\n' +
            'f;\n' +
            '   var res = g & h\n' +
            '| i ^\n' +
            'j;\n' +
            'var res = (k &&\n' +
            'l\n' +
            '|| m) ?\n' +
            'n\n' +
            ': o\n' +
            ';\n' +
            'var res = p\n' +
            '>> q <<\n' +
            'r\n' +
            '>>> s;\n' +
            'var res\n' +
            '  = t\n' +
            '\n' +
            ' === u !== v\n' +
            ' !=\n' +
            'w\n' +
            '== x >=\n' +
            'y <= z > aa <\n' +
            'ab;\n' +
            'ac +\n' +
            '-ad',
            //  -- output --
            'var res = a + b\n' +
            '    - c /\n' +
            '    d * e\n' +
            '    %\n' +
            '    f;\n' +
            'var res = g & h\n' +
            '    | i ^\n' +
            '    j;\n' +
            'var res = (k &&\n' +
            '        l\n' +
            '        || m) ?\n' +
            '    n\n' +
            '    : o;\n' +
            'var res = p\n' +
            '    >> q <<\n' +
            '    r\n' +
            '    >>> s;\n' +
            'var res = t\n' +
            '\n' +
            '    === u !== v\n' +
            '    !=\n' +
            '    w\n' +
            '    == x >=\n' +
            '    y <= z > aa <\n' +
            '    ab;\n' +
            'ac +\n' +
            '    -ad');
        
        // colon special case
        bt(
            'var a = {\n' +
            '    b\n' +
            ': bval,\n' +
            '    c:\n' +
            'cval\n' +
            '    ,d: dval\n' +
            '};\n' +
            'var e = f ? g\n' +
            ': h;\n' +
            'var i = j ? k :\n' +
            'l;',
            //  -- output --
            'var a = {\n' +
            '    b: bval,\n' +
            '    c: cval,\n' +
            '    d: dval\n' +
            '};\n' +
            'var e = f ? g\n' +
            '    : h;\n' +
            'var i = j ? k :\n' +
            '    l;');
        
        // catch-all, includes brackets and other various code
        bt(
            'var d = 1;\n' +
            'if (a === b\n' +
            '    && c) {\n' +
            '    d = (c * everything\n' +
            '            / something_else) %\n' +
            '        b;\n' +
            '    e\n' +
            '        += d;\n' +
            '\n' +
            '} else if (!(complex && simple) ||\n' +
            '    (emotion && emotion.name === "happy")) {\n' +
            '    cryTearsOfJoy(many ||\n' +
            '        anOcean\n' +
            '        || aRiver);\n' +
            '}');


        //============================================================
        // Yield tests
        reset_options();
        bt('yield /foo\\//;');
        bt('result = yield pgClient.query_(queryString);');
        bt('yield [1, 2]');
        bt('yield function() {};');
        bt('yield* bar();');
        
        // yield should have no space between yield and star
        bt('yield * bar();', 'yield* bar();');
        
        // yield should have space between star and generator
        bt('yield *bar();', 'yield* bar();');


        //============================================================
        // Async / await tests
        reset_options();
        bt('async function foo() {}');
        bt('let w = async function foo() {}');
        bt(
            'async function foo() {}\n' +
            'var x = await foo();');
        
        // async function as an input to another function
        bt('wrapper(async function foo() {})');
        
        // await on inline anonymous function. should have a space after await
        bt(
            'async function() {\n' +
            '    var w = await(async function() {\n' +
            '        return await foo();\n' +
            '    })();\n' +
            '}',
            //  -- output --
            'async function() {\n' +
            '    var w = await (async function() {\n' +
            '        return await foo();\n' +
            '    })();\n' +
            '}');
        
        // ensure that this doesn't break anyone with the async library
        bt('async.map(function(t) {})');


        //============================================================
        // e4x - Test that e4x literals passed through when e4x-option is enabled
        reset_options();
        opts.e4x = true;
        bt(
            'xml=<a b="c"><d/><e>\n' +
            ' foo</e>x</a>;',
            //  -- output --
            'xml = <a b="c"><d/><e>\n' +
            ' foo</e>x</a>;');
        bt('<a b=\'This is a quoted "c".\'/>');
        bt('<a b="This is a quoted \'c\'."/>');
        bt('<a b="A quote \' inside string."/>');
        bt('<a b=\'A quote " inside string.\'/>');
        bt('<a b=\'Some """ quotes ""  inside string.\'/>');
        
        // Handles inline expressions
        bt(
            'xml=<{a} b="c"><d/><e v={z}>\n' +
            ' foo</e>x</{a}>;',
            //  -- output --
            'xml = <{a} b="c"><d/><e v={z}>\n' +
            ' foo</e>x</{a}>;');
        bt(
            'xml=<{a} b="c">\n' +
            '    <e v={z}>\n' +
            ' foo</e>x</{a}>;',
            //  -- output --
            'xml = <{a} b="c">\n' +
            '    <e v={z}>\n' +
            ' foo</e>x</{a}>;');
        
        // xml literals with special characters in elem names - see http://www.w3.org/TR/REC-xml/#NT-NameChar
        bt('xml = <_:.valid.xml- _:.valid.xml-="123"/>;');
        
        // xml literals with attributes without equal sign
        bt('xml = <elem someAttr/>;');
        
        // Handles CDATA
        bt(
            'xml=<![CDATA[ b="c"><d/><e v={z}>\n' +
            ' foo</e>x/]]>;',
            //  -- output --
            'xml = <![CDATA[ b="c"><d/><e v={z}>\n' +
            ' foo</e>x/]]>;');
        bt('xml=<![CDATA[]]>;', 'xml = <![CDATA[]]>;');
        bt('xml=<a b="c"><![CDATA[d/></a></{}]]></a>;', 'xml = <a b="c"><![CDATA[d/></a></{}]]></a>;');
        
        // JSX - working jsx from http://prettydiff.com/unit_tests/beautification_javascript_jsx.txt
        bt(
            'var ListItem = React.createClass({\n' +
            '    render: function() {\n' +
            '        return (\n' +
            '            <li className="ListItem">\n' +
            '                <a href={ "/items/" + this.props.item.id }>\n' +
            '                    this.props.item.name\n' +
            '                </a>\n' +
            '            </li>\n' +
            '        );\n' +
            '    }\n' +
            '});');
        bt(
            'var List = React.createClass({\n' +
            '    renderList: function() {\n' +
            '        return this.props.items.map(function(item) {\n' +
            '            return <ListItem item={item} key={item.id} />;\n' +
            '        });\n' +
            '    },\n' +
            '\n' +
            '    render: function() {\n' +
            '        return <ul className="List">\n' +
            '                this.renderList()\n' +
            '            </ul>\n' +
            '    }\n' +
            '});');
        bt(
            'var Mist = React.createClass({\n' +
            '    renderList: function() {\n' +
            '        return this.props.items.map(function(item) {\n' +
            '            return <ListItem item={return <tag>{item}</tag>} key={item.id} />;\n' +
            '        });\n' +
            '    }\n' +
            '});');
        bt(
            '// JSX\n' +
            'var box = <Box>\n' +
            '    {shouldShowAnswer(user) ?\n' +
            '        <Answer value={false}>no</Answer> : <Box.Comment>\n' +
            '        Text Content\n' +
            '        </Box.Comment>}\n' +
            '    </Box>;\n' +
            'var a = function() {\n' +
            '    return <tsdf>asdf</tsdf>;\n' +
            '};\n' +
            '\n' +
            'var HelloMessage = React.createClass({\n' +
            '    render: function() {\n' +
            '        return <div {someAttr}>Hello {this.props.name}</div>;\n' +
            '    }\n' +
            '});\n' +
            'React.render(<HelloMessage name="John" />, mountNode);');
        bt(
            'var Timer = React.createClass({\n' +
            '    getInitialState: function() {\n' +
            '        return {\n' +
            '            secondsElapsed: 0\n' +
            '        };\n' +
            '    },\n' +
            '    tick: function() {\n' +
            '        this.setState({\n' +
            '            secondsElapsed: this.state.secondsElapsed + 1\n' +
            '        });\n' +
            '    },\n' +
            '    componentDidMount: function() {\n' +
            '        this.interval = setInterval(this.tick, 1000);\n' +
            '    },\n' +
            '    componentWillUnmount: function() {\n' +
            '        clearInterval(this.interval);\n' +
            '    },\n' +
            '    render: function() {\n' +
            '        return (\n' +
            '            <div>Seconds Elapsed: {this.state.secondsElapsed}</div>\n' +
            '        );\n' +
            '    }\n' +
            '});\n' +
            'React.render(<Timer />, mountNode);');
        bt(
            'var TodoList = React.createClass({\n' +
            '    render: function() {\n' +
            '        var createItem = function(itemText) {\n' +
            '            return <li>{itemText}</li>;\n' +
            '        };\n' +
            '        return <ul>{this.props.items.map(createItem)}</ul>;\n' +
            '    }\n' +
            '});');
        bt(
            'var TodoApp = React.createClass({\n' +
            '    getInitialState: function() {\n' +
            '        return {\n' +
            '            items: [],\n' +
            '            text: \'\'\n' +
            '        };\n' +
            '    },\n' +
            '    onChange: function(e) {\n' +
            '        this.setState({\n' +
            '            text: e.target.value\n' +
            '        });\n' +
            '    },\n' +
            '    handleSubmit: function(e) {\n' +
            '        e.preventDefault();\n' +
            '        var nextItems = this.state.items.concat([this.state.text]);\n' +
            '        var nextText = \'\';\n' +
            '        this.setState({\n' +
            '            items: nextItems,\n' +
            '            text: nextText\n' +
            '        });\n' +
            '    },\n' +
            '    render: function() {\n' +
            '        return (\n' +
            '            <div>\n' +
            '                <h3 {someAttr}>TODO</h3>\n' +
            '                <TodoList items={this.state.items} />\n' +
            '                <form onSubmit={this.handleSubmit}>\n' +
            '                    <input onChange={this.onChange} value={this.state.text} />\n' +
            '                    <button>{\'Add #\' + (this.state.items.length + 1)}</button>\n' +
            '                </form>\n' +
            '            </div>\n' +
            '        );\n' +
            '    }\n' +
            '});\n' +
            'React.render(<TodoApp />, mountNode);');
        bt(
            'var converter = new Showdown.converter();\n' +
            'var MarkdownEditor = React.createClass({\n' +
            '    getInitialState: function() {\n' +
            '        return {value: \'Type some *markdown* here!\'};\n' +
            '    },\n' +
            '    handleChange: function() {\n' +
            '        this.setState({value: this.refs.textarea.getDOMNode().value});\n' +
            '    },\n' +
            '    render: function() {\n' +
            '        return (\n' +
            '            <div className="MarkdownEditor">\n' +
            '                <h3>Input</h3>\n' +
            '                <textarea\n' +
            '                    onChange={this.handleChange}\n' +
            '                    ref="textarea"\n' +
            '                    defaultValue={this.state.value} />\n' +
            '                <h3>Output</h3>\n' +
            '            <div\n' +
            '                className="content"\n' +
            '                dangerouslySetInnerHTML=\n' +
            '                />\n' +
            '            </div>\n' +
            '        );\n' +
            '    }\n' +
            '});\n' +
            'React.render(<MarkdownEditor />, mountNode);',
            //  -- output --
            'var converter = new Showdown.converter();\n' +
            'var MarkdownEditor = React.createClass({\n' +
            '    getInitialState: function() {\n' +
            '        return {\n' +
            '            value: \'Type some *markdown* here!\'\n' +
            '        };\n' +
            '    },\n' +
            '    handleChange: function() {\n' +
            '        this.setState({\n' +
            '            value: this.refs.textarea.getDOMNode().value\n' +
            '        });\n' +
            '    },\n' +
            '    render: function() {\n' +
            '        return (\n' +
            '            <div className="MarkdownEditor">\n' +
            '                <h3>Input</h3>\n' +
            '                <textarea\n' +
            '                    onChange={this.handleChange}\n' +
            '                    ref="textarea"\n' +
            '                    defaultValue={this.state.value} />\n' +
            '                <h3>Output</h3>\n' +
            '            <div\n' +
            '                className="content"\n' +
            '                dangerouslySetInnerHTML=\n' +
            '                />\n' +
            '            </div>\n' +
            '        );\n' +
            '    }\n' +
            '});\n' +
            'React.render(<MarkdownEditor />, mountNode);');
        
        // JSX - Not quite correct jsx formatting that still works
        bt(
            'var content = (\n' +
            '        <Nav>\n' +
            '            {/* child comment, put {} around */}\n' +
            '            <Person\n' +
            '                /* multi\n' +
            '         line\n' +
            '         comment */\n' +
            '         //attr="test"\n' +
            '                name={window.isLoggedIn ? window.name : \'\'} // end of line comment\n' +
            '            />\n' +
            '        </Nav>\n' +
            '    );\n' +
            'var qwer = <DropDown> A dropdown list <Menu> <MenuItem>Do Something</MenuItem> <MenuItem>Do Something Fun!</MenuItem> <MenuItem>Do Something Else</MenuItem> </Menu> </DropDown>;\n' +
            'render(dropdown);',
            //  -- output --
            'var content = (\n' +
            '    <Nav>\n' +
            '            {/* child comment, put {} around */}\n' +
            '            <Person\n' +
            '                /* multi\n' +
            '         line\n' +
            '         comment */\n' +
            '         //attr="test"\n' +
            '                name={window.isLoggedIn ? window.name : \'\'} // end of line comment\n' +
            '            />\n' +
            '        </Nav>\n' +
            ');\n' +
            'var qwer = <DropDown> A dropdown list <Menu> <MenuItem>Do Something</MenuItem> <MenuItem>Do Something Fun!</MenuItem> <MenuItem>Do Something Else</MenuItem> </Menu> </DropDown>;\n' +
            'render(dropdown);');
        
        // Handles messed up tags, as long as it isn't the same name
        // as the root tag. Also handles tags of same name as root tag
        // as long as nesting matches.
        bt(
            'xml=<a x="jn"><c></b></f><a><d jnj="jnn"><f></a ></nj></a>;',
            //  -- output --
            'xml = <a x="jn"><c></b></f><a><d jnj="jnn"><f></a ></nj></a>;');
        
        // If xml is not terminated, the remainder of the file is treated
        // as part of the xml-literal (passed through unaltered)
        test_fragment(
            'xml=<a></b>\n' +
            'c<b;',
            //  -- output --
            'xml = <a></b>\n' +
            'c<b;');
        
        // Issue #646 = whitespace is allowed in attribute declarations
        bt(
            'let a = React.createClass({\n' +
            '    render() {\n' +
            '        return (\n' +
            '            <p className=\'a\'>\n' +
            '                <span>c</span>\n' +
            '            </p>\n' +
            '        );\n' +
            '    }\n' +
            '});');
        bt(
            'let a = React.createClass({\n' +
            '    render() {\n' +
            '        return (\n' +
            '            <p className = \'b\'>\n' +
            '                <span>c</span>\n' +
            '            </p>\n' +
            '        );\n' +
            '    }\n' +
            '});');
        bt(
            'let a = React.createClass({\n' +
            '    render() {\n' +
            '        return (\n' +
            '            <p className = "c">\n' +
            '                <span>c</span>\n' +
            '            </p>\n' +
            '        );\n' +
            '    }\n' +
            '});');
        bt(
            'let a = React.createClass({\n' +
            '    render() {\n' +
            '        return (\n' +
            '            <{e}  className = {d}>\n' +
            '                <span>c</span>\n' +
            '            </{e}>\n' +
            '        );\n' +
            '    }\n' +
            '});');
        
        // Issue #914 - Multiline attribute in root tag
        bt(
            'return (\n' +
            '    <a href="#"\n' +
            '        onClick={e => {\n' +
            '            e.preventDefault()\n' +
            '            onClick()\n' +
            '       }}>\n' +
            '       {children}\n' +
            '    </a>\n' +
            ');');
        bt(
            'return (\n' +
            '    <{\n' +
            '        a + b\n' +
            '    } href="#"\n' +
            '        onClick={e => {\n' +
            '            e.preventDefault()\n' +
            '            onClick()\n' +
            '       }}>\n' +
            '       {children}\n' +
            '    </{\n' +
            '        a + b\n' +
            '    }>\n' +
            ');');
        bt(
            'return (\n' +
            '    <{\n' +
            '        a + b\n' +
            '    } href="#"\n' +
            '        onClick={e => {\n' +
            '            e.preventDefault()\n' +
            '            onClick()\n' +
            '       }}>\n' +
            '       {children}\n' +
            '    </{a + b}>\n' +
            '    );',
            //  -- output --
            'return (\n' +
            '    <{\n' +
            '        a + b\n' +
            '    } href="#"\n' +
            '        onClick={e => {\n' +
            '            e.preventDefault()\n' +
            '            onClick()\n' +
            '       }}>\n' +
            '       {children}\n' +
            '    </{a + b}>\n' +
            ');');


        //============================================================
        // e4x disabled
        reset_options();
        opts.e4x = false;
        bt(
            'xml=<a b="c"><d/><e>\n' +
            ' foo</e>x</a>;',
            //  -- output --
            'xml = < a b = "c" > < d / > < e >\n' +
            '    foo < /e>x</a > ;');


        //============================================================
        // Multiple braces
        reset_options();
        bt(
            '{{}/z/}',
            //  -- output --
            '{\n' +
            '    {}\n' +
            '    /z/\n' +
            '}');


        //============================================================
        // Beautify preserve formatting
        reset_options();
        bt(
            '/* beautify preserve:start */\n' +
            '/* beautify preserve:end */');
        bt(
            '/* beautify preserve:start */\n' +
            '   var a = 1;\n' +
            '/* beautify preserve:end */');
        bt(
            'var a = 1;\n' +
            '/* beautify preserve:start */\n' +
            '   var a = 1;\n' +
            '/* beautify preserve:end */');
        bt('/* beautify preserve:start */     {asdklgh;y;;{}dd2d}/* beautify preserve:end */');
        bt(
            'var a =  1;\n' +
            '/* beautify preserve:start */\n' +
            '   var a = 1;\n' +
            '/* beautify preserve:end */',
            //  -- output --
            'var a = 1;\n' +
            '/* beautify preserve:start */\n' +
            '   var a = 1;\n' +
            '/* beautify preserve:end */');
        bt(
            'var a = 1;\n' +
            ' /* beautify preserve:start */\n' +
            '   var a = 1;\n' +
            '/* beautify preserve:end */',
            //  -- output --
            'var a = 1;\n' +
            '/* beautify preserve:start */\n' +
            '   var a = 1;\n' +
            '/* beautify preserve:end */');
        bt(
            'var a = {\n' +
            '    /* beautify preserve:start */\n' +
            '    one   :  1\n' +
            '    two   :  2,\n' +
            '    three :  3,\n' +
            '    ten   : 10\n' +
            '    /* beautify preserve:end */\n' +
            '};');
        bt(
            'var a = {\n' +
            '/* beautify preserve:start */\n' +
            '    one   :  1,\n' +
            '    two   :  2,\n' +
            '    three :  3,\n' +
            '    ten   : 10\n' +
            '/* beautify preserve:end */\n' +
            '};',
            //  -- output --
            'var a = {\n' +
            '    /* beautify preserve:start */\n' +
            '    one   :  1,\n' +
            '    two   :  2,\n' +
            '    three :  3,\n' +
            '    ten   : 10\n' +
            '/* beautify preserve:end */\n' +
            '};');
        
        // one space before and after required, only single spaces inside.
        bt(
            'var a = {\n' +
            '/*  beautify preserve:start  */\n' +
            '    one   :  1,\n' +
            '    two   :  2,\n' +
            '    three :  3,\n' +
            '    ten   : 10\n' +
            '};',
            //  -- output --
            'var a = {\n' +
            '    /*  beautify preserve:start  */\n' +
            '    one: 1,\n' +
            '    two: 2,\n' +
            '    three: 3,\n' +
            '    ten: 10\n' +
            '};');
        bt(
            'var a = {\n' +
            '/*beautify preserve:start*/\n' +
            '    one   :  1,\n' +
            '    two   :  2,\n' +
            '    three :  3,\n' +
            '    ten   : 10\n' +
            '};',
            //  -- output --
            'var a = {\n' +
            '    /*beautify preserve:start*/\n' +
            '    one: 1,\n' +
            '    two: 2,\n' +
            '    three: 3,\n' +
            '    ten: 10\n' +
            '};');
        bt(
            'var a = {\n' +
            '/*beautify  preserve:start*/\n' +
            '    one   :  1,\n' +
            '    two   :  2,\n' +
            '    three :  3,\n' +
            '    ten   : 10\n' +
            '};',
            //  -- output --
            'var a = {\n' +
            '    /*beautify  preserve:start*/\n' +
            '    one: 1,\n' +
            '    two: 2,\n' +
            '    three: 3,\n' +
            '    ten: 10\n' +
            '};');
        
        // Directive: ignore
        bt(
            '/* beautify ignore:start */\n' +
            '/* beautify ignore:end */');
        bt(
            '/* beautify ignore:start */\n' +
            '   var a,,,{ 1;\n' +
            '/* beautify ignore:end */');
        bt(
            'var a = 1;\n' +
            '/* beautify ignore:start */\n' +
            '   var a = 1;\n' +
            '/* beautify ignore:end */');
        bt('/* beautify ignore:start */     {asdklgh;y;+++;dd2d}/* beautify ignore:end */');
        bt(
            'var a =  1;\n' +
            '/* beautify ignore:start */\n' +
            '   var a,,,{ 1;\n' +
            '/* beautify ignore:end */',
            //  -- output --
            'var a = 1;\n' +
            '/* beautify ignore:start */\n' +
            '   var a,,,{ 1;\n' +
            '/* beautify ignore:end */');
        bt(
            'var a = 1;\n' +
            ' /* beautify ignore:start */\n' +
            '   var a,,,{ 1;\n' +
            '/* beautify ignore:end */',
            //  -- output --
            'var a = 1;\n' +
            '/* beautify ignore:start */\n' +
            '   var a,,,{ 1;\n' +
            '/* beautify ignore:end */');
        bt(
            'var a = {\n' +
            '    /* beautify ignore:start */\n' +
            '    one   :  1\n' +
            '    two   :  2,\n' +
            '    three :  {\n' +
            '    ten   : 10\n' +
            '    /* beautify ignore:end */\n' +
            '};');
        bt(
            'var a = {\n' +
            '/* beautify ignore:start */\n' +
            '    one   :  1\n' +
            '    two   :  2,\n' +
            '    three :  {\n' +
            '    ten   : 10\n' +
            '/* beautify ignore:end */\n' +
            '};',
            //  -- output --
            'var a = {\n' +
            '    /* beautify ignore:start */\n' +
            '    one   :  1\n' +
            '    two   :  2,\n' +
            '    three :  {\n' +
            '    ten   : 10\n' +
            '/* beautify ignore:end */\n' +
            '};');
        
        // Directives - multiple and interacting
        bt(
            'var a = {\n' +
            '/* beautify preserve:start */\n' +
            '/* beautify preserve:start */\n' +
            '    one   :  1,\n' +
            '  /* beautify preserve:end */\n' +
            '    two   :  2,\n' +
            '    three :  3,\n' +
            '/* beautify preserve:start */\n' +
            '    ten   : 10\n' +
            '/* beautify preserve:end */\n' +
            '};',
            //  -- output --
            'var a = {\n' +
            '    /* beautify preserve:start */\n' +
            '/* beautify preserve:start */\n' +
            '    one   :  1,\n' +
            '  /* beautify preserve:end */\n' +
            '    two: 2,\n' +
            '    three: 3,\n' +
            '    /* beautify preserve:start */\n' +
            '    ten   : 10\n' +
            '/* beautify preserve:end */\n' +
            '};');
        bt(
            'var a = {\n' +
            '/* beautify ignore:start */\n' +
            '    one   :  1\n' +
            ' /* beautify ignore:end */\n' +
            '    two   :  2,\n' +
            '/* beautify ignore:start */\n' +
            '    three :  {\n' +
            '    ten   : 10\n' +
            '/* beautify ignore:end */\n' +
            '};',
            //  -- output --
            'var a = {\n' +
            '    /* beautify ignore:start */\n' +
            '    one   :  1\n' +
            ' /* beautify ignore:end */\n' +
            '    two: 2,\n' +
            '    /* beautify ignore:start */\n' +
            '    three :  {\n' +
            '    ten   : 10\n' +
            '/* beautify ignore:end */\n' +
            '};');
        
        // Starts can occur together, ignore:end must occur alone.
        bt(
            'var a = {\n' +
            '/* beautify ignore:start */\n' +
            '    one   :  1\n' +
            '    NOTE: ignore end block does not support starting other directives\n' +
            '    This does not match the ending the ignore...\n' +
            ' /* beautify ignore:end preserve:start */\n' +
            '    two   :  2,\n' +
            '/* beautify ignore:start */\n' +
            '    three :  {\n' +
            '    ten   : 10\n' +
            '    ==The next comment ends the starting ignore==\n' +
            '/* beautify ignore:end */\n' +
            '};',
            //  -- output --
            'var a = {\n' +
            '    /* beautify ignore:start */\n' +
            '    one   :  1\n' +
            '    NOTE: ignore end block does not support starting other directives\n' +
            '    This does not match the ending the ignore...\n' +
            ' /* beautify ignore:end preserve:start */\n' +
            '    two   :  2,\n' +
            '/* beautify ignore:start */\n' +
            '    three :  {\n' +
            '    ten   : 10\n' +
            '    ==The next comment ends the starting ignore==\n' +
            '/* beautify ignore:end */\n' +
            '};');
        bt(
            'var a = {\n' +
            '/* beautify ignore:start preserve:start */\n' +
            '    one   :  {\n' +
            ' /* beautify ignore:end */\n' +
            '    two   :  2,\n' +
            '  /* beautify ignore:start */\n' +
            '    three :  {\n' +
            '/* beautify ignore:end */\n' +
            '    ten   : 10\n' +
            '   // This is all preserved\n' +
            '};',
            //  -- output --
            'var a = {\n' +
            '    /* beautify ignore:start preserve:start */\n' +
            '    one   :  {\n' +
            ' /* beautify ignore:end */\n' +
            '    two   :  2,\n' +
            '  /* beautify ignore:start */\n' +
            '    three :  {\n' +
            '/* beautify ignore:end */\n' +
            '    ten   : 10\n' +
            '   // This is all preserved\n' +
            '};');
        bt(
            'var a = {\n' +
            '/* beautify ignore:start preserve:start */\n' +
            '    one   :  {\n' +
            ' /* beautify ignore:end */\n' +
            '    two   :  2,\n' +
            '  /* beautify ignore:start */\n' +
            '    three :  {\n' +
            '/* beautify ignore:end */\n' +
            '    ten   : 10,\n' +
            '/* beautify preserve:end */\n' +
            '     eleven: 11\n' +
            '};',
            //  -- output --
            'var a = {\n' +
            '    /* beautify ignore:start preserve:start */\n' +
            '    one   :  {\n' +
            ' /* beautify ignore:end */\n' +
            '    two   :  2,\n' +
            '  /* beautify ignore:start */\n' +
            '    three :  {\n' +
            '/* beautify ignore:end */\n' +
            '    ten   : 10,\n' +
            '/* beautify preserve:end */\n' +
            '    eleven: 11\n' +
            '};');


        //============================================================
        // Comments and  tests
        reset_options();
        
        // #913
        bt(
            'class test {\n' +
            '    method1() {\n' +
            '        let resp = null;\n' +
            '    }\n' +
            '    /**\n' +
            '     * @param {String} id\n' +
            '     */\n' +
            '    method2(id) {\n' +
            '        let resp2 = null;\n' +
            '    }\n' +
            '}');
        
        // #1090
        bt(
            'for (var i = 0; i < 20; ++i) // loop\n' +
            '    if (i % 3) {\n' +
            '        console.log(i);\n' +
            '    }\n' +
            'console.log("done");');
        
        // #1043
        bt(
            'var o = {\n' +
            '    k: 0\n' +
            '}\n' +
            '// ...\n' +
            'foo(o)');
        
        // #713 and #964
        bt(
            'Meteor.call("foo", bar, function(err, result) {\n' +
            '    Session.set("baz", result.lorem)\n' +
            '})\n' +
            '//blah blah');
        
        // #815
        bt(
            'foo()\n' +
            '// this is a comment\n' +
            'bar()\n' +
            '\n' +
            'const foo = 5\n' +
            '// comment\n' +
            'bar()');
        
        // This shows current behavior.  Note #1069 is not addressed yet.
        bt(
            'if (modulus === 2) {\n' +
            '    // i might be odd here\n' +
            '    i += (i & 1);\n' +
            '    // now i is guaranteed to be even\n' +
            '    // this block is obviously about the statement above\n' +
            '\n' +
            '    // #1069 This should attach to the block below\n' +
            '    // this comment is about the block after it.\n' +
            '} else {\n' +
            '    // rounding up using integer arithmetic only\n' +
            '    if (i % modulus)\n' +
            '        i += modulus - (i % modulus);\n' +
            '    // now i is divisible by modulus\n' +
            '    // behavior of comments should be different for single statements vs block statements/expressions\n' +
            '}\n' +
            '\n' +
            'if (modulus === 2)\n' +
            '    // i might be odd here\n' +
            '    i += (i & 1);\n' +
            '// now i is guaranteed to be even\n' +
            '// non-braced comments unindent immediately\n' +
            '\n' +
            '// this comment is about the block after it.\n' +
            'else\n' +
            '    // rounding up using integer arithmetic only\n' +
            '    if (i % modulus)\n' +
            '        i += modulus - (i % modulus);\n' +
            '// behavior of comments should be different for single statements vs block statements/expressions');


        //============================================================
        // Template Formatting
        reset_options();
        bt('<?=$view["name"]; ?>');
        bt('a = <?= external() ?>;');
        bt(
            '<?php\n' +
            'for($i = 1; $i <= 100; $i++;) {\n' +
            '    #count to 100!\n' +
            '    echo($i . "</br>");\n' +
            '}\n' +
            '?>');
        bt('a = <%= external() %>;');


        //============================================================
        // jslint and space after anon function - (f = " ", c = "")
        reset_options();
        opts.jslint_happy = true;
        opts.space_after_anon_function = true;
        bt(
            'a=typeof(x)',
            //  -- output --
            'a = typeof (x)');
        bt(
            'x();\n' +
            '\n' +
            'function(){}',
            //  -- output --
            'x();\n' +
            '\n' +
            'function () {}');
        bt(
            'x();\n' +
            '\n' +
            'var x = {\n' +
            'x: function(){}\n' +
            '}',
            //  -- output --
            'x();\n' +
            '\n' +
            'var x = {\n' +
            '    x: function () {}\n' +
            '}');
        bt(
            'function () {\n' +
            '    var a, b, c, d, e = [],\n' +
            '        f;\n' +
            '}');
        bt(
            'switch(x) {case 0: case 1: a(); break; default: break}',
            //  -- output --
            'switch (x) {\n' +
            'case 0:\n' +
            'case 1:\n' +
            '    a();\n' +
            '    break;\n' +
            'default:\n' +
            '    break\n' +
            '}');
        bt(
            'switch(x){case -1:break;case !y:break;}',
            //  -- output --
            'switch (x) {\n' +
            'case -1:\n' +
            '    break;\n' +
            'case !y:\n' +
            '    break;\n' +
            '}');
        
        // typical greasemonkey start
        test_fragment(
            '// comment 2\n' +
            '(function ()');
        bt(
            'var a2, b2, c2, d2 = 0, c = function() {}, d = \'\';',
            //  -- output --
            'var a2, b2, c2, d2 = 0,\n' +
            '    c = function () {},\n' +
            '    d = \'\';');
        bt(
            'var a2, b2, c2, d2 = 0, c = function() {},\n' +
            'd = \'\';',
            //  -- output --
            'var a2, b2, c2, d2 = 0,\n' +
            '    c = function () {},\n' +
            '    d = \'\';');
        bt(
            'var o2=$.extend(a);function(){alert(x);}',
            //  -- output --
            'var o2 = $.extend(a);\n' +
            '\n' +
            'function () {\n' +
            '    alert(x);\n' +
            '}');
        bt(
            'function*() {\n' +
            '    yield 1;\n' +
            '}',
            //  -- output --
            'function* () {\n' +
            '    yield 1;\n' +
            '}');
        bt(
            'function* x() {\n' +
            '    yield 1;\n' +
            '}');

        // jslint and space after anon function - (f = " ", c = "")
        reset_options();
        opts.jslint_happy = true;
        opts.space_after_anon_function = false;
        bt(
            'a=typeof(x)',
            //  -- output --
            'a = typeof (x)');
        bt(
            'x();\n' +
            '\n' +
            'function(){}',
            //  -- output --
            'x();\n' +
            '\n' +
            'function () {}');
        bt(
            'x();\n' +
            '\n' +
            'var x = {\n' +
            'x: function(){}\n' +
            '}',
            //  -- output --
            'x();\n' +
            '\n' +
            'var x = {\n' +
            '    x: function () {}\n' +
            '}');
        bt(
            'function () {\n' +
            '    var a, b, c, d, e = [],\n' +
            '        f;\n' +
            '}');
        bt(
            'switch(x) {case 0: case 1: a(); break; default: break}',
            //  -- output --
            'switch (x) {\n' +
            'case 0:\n' +
            'case 1:\n' +
            '    a();\n' +
            '    break;\n' +
            'default:\n' +
            '    break\n' +
            '}');
        bt(
            'switch(x){case -1:break;case !y:break;}',
            //  -- output --
            'switch (x) {\n' +
            'case -1:\n' +
            '    break;\n' +
            'case !y:\n' +
            '    break;\n' +
            '}');
        
        // typical greasemonkey start
        test_fragment(
            '// comment 2\n' +
            '(function ()');
        bt(
            'var a2, b2, c2, d2 = 0, c = function() {}, d = \'\';',
            //  -- output --
            'var a2, b2, c2, d2 = 0,\n' +
            '    c = function () {},\n' +
            '    d = \'\';');
        bt(
            'var a2, b2, c2, d2 = 0, c = function() {},\n' +
            'd = \'\';',
            //  -- output --
            'var a2, b2, c2, d2 = 0,\n' +
            '    c = function () {},\n' +
            '    d = \'\';');
        bt(
            'var o2=$.extend(a);function(){alert(x);}',
            //  -- output --
            'var o2 = $.extend(a);\n' +
            '\n' +
            'function () {\n' +
            '    alert(x);\n' +
            '}');
        bt(
            'function*() {\n' +
            '    yield 1;\n' +
            '}',
            //  -- output --
            'function* () {\n' +
            '    yield 1;\n' +
            '}');
        bt(
            'function* x() {\n' +
            '    yield 1;\n' +
            '}');

        // jslint and space after anon function - (f = " ", c = "    ")
        reset_options();
        opts.jslint_happy = false;
        opts.space_after_anon_function = true;
        bt(
            'a=typeof(x)',
            //  -- output --
            'a = typeof (x)');
        bt(
            'x();\n' +
            '\n' +
            'function(){}',
            //  -- output --
            'x();\n' +
            '\n' +
            'function () {}');
        bt(
            'x();\n' +
            '\n' +
            'var x = {\n' +
            'x: function(){}\n' +
            '}',
            //  -- output --
            'x();\n' +
            '\n' +
            'var x = {\n' +
            '    x: function () {}\n' +
            '}');
        bt(
            'function () {\n' +
            '    var a, b, c, d, e = [],\n' +
            '        f;\n' +
            '}');
        bt(
            'switch(x) {case 0: case 1: a(); break; default: break}',
            //  -- output --
            'switch (x) {\n' +
            '    case 0:\n' +
            '    case 1:\n' +
            '        a();\n' +
            '        break;\n' +
            '    default:\n' +
            '        break\n' +
            '}');
        bt(
            'switch(x){case -1:break;case !y:break;}',
            //  -- output --
            'switch (x) {\n' +
            '    case -1:\n' +
            '        break;\n' +
            '    case !y:\n' +
            '        break;\n' +
            '}');
        
        // typical greasemonkey start
        test_fragment(
            '// comment 2\n' +
            '(function ()');
        bt(
            'var a2, b2, c2, d2 = 0, c = function() {}, d = \'\';',
            //  -- output --
            'var a2, b2, c2, d2 = 0,\n' +
            '    c = function () {},\n' +
            '    d = \'\';');
        bt(
            'var a2, b2, c2, d2 = 0, c = function() {},\n' +
            'd = \'\';',
            //  -- output --
            'var a2, b2, c2, d2 = 0,\n' +
            '    c = function () {},\n' +
            '    d = \'\';');
        bt(
            'var o2=$.extend(a);function(){alert(x);}',
            //  -- output --
            'var o2 = $.extend(a);\n' +
            '\n' +
            'function () {\n' +
            '    alert(x);\n' +
            '}');
        bt(
            'function*() {\n' +
            '    yield 1;\n' +
            '}',
            //  -- output --
            'function* () {\n' +
            '    yield 1;\n' +
            '}');
        bt(
            'function* x() {\n' +
            '    yield 1;\n' +
            '}');

        // jslint and space after anon function - (f = "", c = "    ")
        reset_options();
        opts.jslint_happy = false;
        opts.space_after_anon_function = false;
        bt(
            'a=typeof(x)',
            //  -- output --
            'a = typeof(x)');
        bt(
            'x();\n' +
            '\n' +
            'function(){}',
            //  -- output --
            'x();\n' +
            '\n' +
            'function() {}');
        bt(
            'x();\n' +
            '\n' +
            'var x = {\n' +
            'x: function(){}\n' +
            '}',
            //  -- output --
            'x();\n' +
            '\n' +
            'var x = {\n' +
            '    x: function() {}\n' +
            '}');
        bt(
            'function () {\n' +
            '    var a, b, c, d, e = [],\n' +
            '        f;\n' +
            '}',
            //  -- output --
            'function() {\n' +
            '    var a, b, c, d, e = [],\n' +
            '        f;\n' +
            '}');
        bt(
            'switch(x) {case 0: case 1: a(); break; default: break}',
            //  -- output --
            'switch (x) {\n' +
            '    case 0:\n' +
            '    case 1:\n' +
            '        a();\n' +
            '        break;\n' +
            '    default:\n' +
            '        break\n' +
            '}');
        bt(
            'switch(x){case -1:break;case !y:break;}',
            //  -- output --
            'switch (x) {\n' +
            '    case -1:\n' +
            '        break;\n' +
            '    case !y:\n' +
            '        break;\n' +
            '}');
        
        // typical greasemonkey start
        test_fragment(
            '// comment 2\n' +
            '(function()');
        bt(
            'var a2, b2, c2, d2 = 0, c = function() {}, d = \'\';',
            //  -- output --
            'var a2, b2, c2, d2 = 0,\n' +
            '    c = function() {},\n' +
            '    d = \'\';');
        bt(
            'var a2, b2, c2, d2 = 0, c = function() {},\n' +
            'd = \'\';',
            //  -- output --
            'var a2, b2, c2, d2 = 0,\n' +
            '    c = function() {},\n' +
            '    d = \'\';');
        bt(
            'var o2=$.extend(a);function(){alert(x);}',
            //  -- output --
            'var o2 = $.extend(a);\n' +
            '\n' +
            'function() {\n' +
            '    alert(x);\n' +
            '}');
        bt(
            'function*() {\n' +
            '    yield 1;\n' +
            '}');
        bt(
            'function* x() {\n' +
            '    yield 1;\n' +
            '}');


        //============================================================
        // Regression tests
        reset_options();
        
        // Issue 241
        bt(
            'obj\n' +
            '    .last({\n' +
            '        foo: 1,\n' +
            '        bar: 2\n' +
            '    });\n' +
            'var test = 1;');
        bt(
            'obj\n' +
            '    .last(a, function() {\n' +
            '        var test;\n' +
            '    });\n' +
            'var test = 1;');
        bt(
            'obj.first()\n' +
            '    .second()\n' +
            '    .last(function(err, response) {\n' +
            '        console.log(err);\n' +
            '    });');
        
        // Issue 268 and 275
        bt(
            'obj.last(a, function() {\n' +
            '    var test;\n' +
            '});\n' +
            'var test = 1;');
        bt(
            'obj.last(a,\n' +
            '    function() {\n' +
            '        var test;\n' +
            '    });\n' +
            'var test = 1;');
        bt(
            '(function() {if (!window.FOO) window.FOO || (window.FOO = function() {var b = {bar: "zort"};});})();',
            //  -- output --
            '(function() {\n' +
            '    if (!window.FOO) window.FOO || (window.FOO = function() {\n' +
            '        var b = {\n' +
            '            bar: "zort"\n' +
            '        };\n' +
            '    });\n' +
            '})();');
        
        // Issue 281
        bt(
            'define(["dojo/_base/declare", "my/Employee", "dijit/form/Button",\n' +
            '    "dojo/_base/lang", "dojo/Deferred"\n' +
            '], function(declare, Employee, Button, lang, Deferred) {\n' +
            '    return declare(Employee, {\n' +
            '        constructor: function() {\n' +
            '            new Button({\n' +
            '                onClick: lang.hitch(this, function() {\n' +
            '                    new Deferred().then(lang.hitch(this, function() {\n' +
            '                        this.salary * 0.25;\n' +
            '                    }));\n' +
            '                })\n' +
            '            });\n' +
            '        }\n' +
            '    });\n' +
            '});');
        bt(
            'define(["dojo/_base/declare", "my/Employee", "dijit/form/Button",\n' +
            '        "dojo/_base/lang", "dojo/Deferred"\n' +
            '    ],\n' +
            '    function(declare, Employee, Button, lang, Deferred) {\n' +
            '        return declare(Employee, {\n' +
            '            constructor: function() {\n' +
            '                new Button({\n' +
            '                    onClick: lang.hitch(this, function() {\n' +
            '                        new Deferred().then(lang.hitch(this, function() {\n' +
            '                            this.salary * 0.25;\n' +
            '                        }));\n' +
            '                    })\n' +
            '                });\n' +
            '            }\n' +
            '        });\n' +
            '    });');
        
        // Issue 459
        bt(
            '(function() {\n' +
            '    return {\n' +
            '        foo: function() {\n' +
            '            return "bar";\n' +
            '        },\n' +
            '        bar: ["bar"]\n' +
            '    };\n' +
            '}());');
        
        // Issue 505 - strings should end at newline unless continued by backslash
        bt(
            'var name = "a;\n' +
            'name = "b";');
        bt(
            'var name = "a;\\\n' +
            '    name = b";');
        
        // Issue 514 - some operators require spaces to distinguish them
        bt('var c = "_ACTION_TO_NATIVEAPI_" + ++g++ + +new Date;');
        bt('var c = "_ACTION_TO_NATIVEAPI_" - --g-- - -new Date;');
        
        // Issue 440 - reserved words can be used as object property names
        bt(
            'a = {\n' +
            '    function: {},\n' +
            '    "function": {},\n' +
            '    throw: {},\n' +
            '    "throw": {},\n' +
            '    var: {},\n' +
            '    "var": {},\n' +
            '    set: {},\n' +
            '    "set": {},\n' +
            '    get: {},\n' +
            '    "get": {},\n' +
            '    if: {},\n' +
            '    "if": {},\n' +
            '    then: {},\n' +
            '    "then": {},\n' +
            '    else: {},\n' +
            '    "else": {},\n' +
            '    yay: {}\n' +
            '};');
        
        // Issue 331 - if-else with braces edge case
        bt(
            'if(x){a();}else{b();}if(y){c();}',
            //  -- output --
            'if (x) {\n' +
            '    a();\n' +
            '} else {\n' +
            '    b();\n' +
            '}\n' +
            'if (y) {\n' +
            '    c();\n' +
            '}');
        
        // Issue 485 - ensure function declarations behave the same in arrays as elsewhere
        bt(
            'var v = ["a",\n' +
            '    function() {\n' +
            '        return;\n' +
            '    }, {\n' +
            '        id: 1\n' +
            '    }\n' +
            '];');
        bt(
            'var v = ["a", function() {\n' +
            '    return;\n' +
            '}, {\n' +
            '    id: 1\n' +
            '}];');
        
        // Issue 382 - initial totally cursory support for es6 module export
        bt(
            'module "Even" {\n' +
            '    import odd from "Odd";\n' +
            '    export function sum(x, y) {\n' +
            '        return x + y;\n' +
            '    }\n' +
            '    export var pi = 3.141593;\n' +
            '    export default moduleName;\n' +
            '}');
        bt(
            'module "Even" {\n' +
            '    export default function div(x, y) {}\n' +
            '}');
        
        // Issue 889 - export default { ... }
        bt(
            'export default {\n' +
            '    func1() {},\n' +
            '    func2() {}\n' +
            '    func3() {}\n' +
            '}');
        bt(
            'export default {\n' +
            '    a() {\n' +
            '        return 1;\n' +
            '    },\n' +
            '    b() {\n' +
            '        return 2;\n' +
            '    },\n' +
            '    c() {\n' +
            '        return 3;\n' +
            '    }\n' +
            '}');
        
        // Issue 508
        bt('set["name"]');
        bt('get["name"]');
        bt(
            'a = {\n' +
            '    set b(x) {},\n' +
            '    c: 1,\n' +
            '    d: function() {}\n' +
            '};');
        bt(
            'a = {\n' +
            '    get b() {\n' +
            '        retun 0;\n' +
            '    },\n' +
            '    c: 1,\n' +
            '    d: function() {}\n' +
            '};');
        
        // Issue 298 - do not under indent if/while/for condtionals experesions
        bt(
            '\'use strict\';\n' +
            'if ([].some(function() {\n' +
            '        return false;\n' +
            '    })) {\n' +
            '    console.log("hello");\n' +
            '}');
        
        // Issue 298 - do not under indent if/while/for condtionals experesions
        bt(
            '\'use strict\';\n' +
            'if ([].some(function() {\n' +
            '        return false;\n' +
            '    })) {\n' +
            '    console.log("hello");\n' +
            '}');
        
        // Issue 552 - Typescript?  Okay... we didn't break it before, so try not to break it now.
        bt(
            'class Test {\n' +
            '    blah: string[];\n' +
            '    foo(): number {\n' +
            '        return 0;\n' +
            '    }\n' +
            '    bar(): number {\n' +
            '        return 0;\n' +
            '    }\n' +
            '}');
        bt(
            'interface Test {\n' +
            '    blah: string[];\n' +
            '    foo(): number {\n' +
            '        return 0;\n' +
            '    }\n' +
            '    bar(): number {\n' +
            '        return 0;\n' +
            '    }\n' +
            '}');
        
        // Issue 583 - Functions with comments after them should still indent correctly.
        bt(
            'function exit(code) {\n' +
            '    setTimeout(function() {\n' +
            '        phantom.exit(code);\n' +
            '    }, 0);\n' +
            '    phantom.onError = function() {};\n' +
            '}\n' +
            '// Comment');
        
        // Issue 806 - newline arrow functions
        bt(
            'a.b("c",\n' +
            '    () => d.e\n' +
            ')');
        
        // Issue 810 - es6 object literal detection
        bt(
            'function badFormatting() {\n' +
            '    return {\n' +
            '        a,\n' +
            '        b: c,\n' +
            '        d: e,\n' +
            '        f: g,\n' +
            '        h,\n' +
            '        i,\n' +
            '        j: k\n' +
            '    }\n' +
            '}\n' +
            '\n' +
            'function goodFormatting() {\n' +
            '    return {\n' +
            '        a: b,\n' +
            '        c,\n' +
            '        d: e,\n' +
            '        f: g,\n' +
            '        h,\n' +
            '        i,\n' +
            '        j: k\n' +
            '    }\n' +
            '}');
        
        // Issue 602 - ES6 object literal shorthand functions
        bt(
            'return {\n' +
            '    fn1() {},\n' +
            '    fn2() {}\n' +
            '}');
        bt(
            'throw {\n' +
            '    fn1() {},\n' +
            '    fn2() {}\n' +
            '}');
        bt(
            'foo({\n' +
            '    fn1(a) {}\n' +
            '    fn2(a) {}\n' +
            '})');
        bt(
            'foo("text", {\n' +
            '    fn1(a) {}\n' +
            '    fn2(a) {}\n' +
            '})');
        bt(
            'oneArg = {\n' +
            '    fn1(a) {\n' +
            '        do();\n' +
            '    },\n' +
            '    fn2() {}\n' +
            '}');
        bt(
            'multiArg = {\n' +
            '    fn1(a, b, c) {\n' +
            '        do();\n' +
            '    },\n' +
            '    fn2() {}\n' +
            '}');
        bt(
            'noArgs = {\n' +
            '    fn1() {\n' +
            '        do();\n' +
            '    },\n' +
            '    fn2() {}\n' +
            '}');
        bt(
            'emptyFn = {\n' +
            '    fn1() {},\n' +
            '    fn2() {}\n' +
            '}');
        bt(
            'nested = {\n' +
            '    fns: {\n' +
            '        fn1() {},\n' +
            '        fn2() {}\n' +
            '    }\n' +
            '}');
        bt(
            'array = [{\n' +
            '    fn1() {},\n' +
            '    prop: val,\n' +
            '    fn2() {}\n' +
            '}]');
        bt(
            'expr = expr ? expr : {\n' +
            '    fn1() {},\n' +
            '    fn2() {}\n' +
            '}');
        bt(
            'strange = valid + {\n' +
            '    fn1() {},\n' +
            '    fn2() {\n' +
            '        return 1;\n' +
            '    }\n' +
            '}.fn2()');
        
        // Issue 854 - Arrow function with statement block
        bt(
            'test(() => {\n' +
            '    var a = {}\n' +
            '\n' +
            '    a.what = () => true ? 1 : 2\n' +
            '\n' +
            '    a.thing = () => {\n' +
            '        b();\n' +
            '    }\n' +
            '})');
        
        // Issue 406 - Multiline array
        bt(
            'var tempName = [\n' +
            '    "temp",\n' +
            '    process.pid,\n' +
            '    (Math.random() * 0x1000000000).toString(36),\n' +
            '    new Date().getTime()\n' +
            '].join("-");');
        
        // Issue #996 - Input ends with backslash throws exception
        test_fragment(
            'sd = 1;\n' +
            '/');
        
        // Issue #1079 - unbraced if with comments should still look right
        bt(
            'if (console.log)\n' +
            '    for (var i = 0; i < 20; ++i)\n' +
            '        if (i % 3)\n' +
            '            console.log(i);\n' +
            '// all done\n' +
            'console.log("done");');
        
        // Issue #1085 - function should not have blank line in a number of cases
        bt(
            'var transformer =\n' +
            '    options.transformer ||\n' +
            '    globalSettings.transformer ||\n' +
            '    function(x) {\n' +
            '        return x;\n' +
            '    };');
        
        // Issue #569 - function should not have blank line in a number of cases
        bt(
            '(function(global) {\n' +
            '    "use strict";\n' +
            '\n' +
            '    /* jshint ignore:start */\n' +
            '    include "somefile.js"\n' +
            '    /* jshint ignore:end */\n' +
            '}(this));');
        bt(
            'function bindAuthEvent(eventName) {\n' +
            '    self.auth.on(eventName, function(event, meta) {\n' +
            '        self.emit(eventName, event, meta);\n' +
            '    });\n' +
            '}\n' +
            '["logged_in", "logged_out", "signed_up", "updated_user"].forEach(bindAuthEvent);\n' +
            '\n' +
            'function bindBrowserEvent(eventName) {\n' +
            '    browser.on(eventName, function(event, meta) {\n' +
            '        self.emit(eventName, event, meta);\n' +
            '    });\n' +
            '}\n' +
            '["navigating"].forEach(bindBrowserEvent);');
        
        // Issue #892 - new line between chained methods 
        bt(
            'foo\n' +
            '    .who()\n' +
            '\n' +
            '    .knows()\n' +
            '    // comment\n' +
            '    .nothing() // comment\n' +
            '\n' +
            '    .more()');


        //============================================================
        // Test non-positionable-ops
        reset_options();
        bt('a += 2;');
        bt('a -= 2;');
        bt('a *= 2;');
        bt('a /= 2;');
        bt('a %= 2;');
        bt('a &= 2;');
        bt('a ^= 2;');
        bt('a |= 2;');
        bt('a **= 2;');
        bt('a <<= 2;');
        bt('a >>= 2;');


        //============================================================
        // brace_style ,preserve-inline tests - (obo = " ", obot = "", oao = "\n", oaot = "    ", obc = "\n", oac = " ", oact = "")
        reset_options();
        opts.brace_style = 'collapse,preserve-inline';
        bt('import { asdf } from "asdf";');
        bt('import { get } from "asdf";');
        bt('function inLine() { console.log("oh em gee"); }');
        bt('if (cancer) { console.log("Im sorry but you only have so long to live..."); }');
        bt('if (ding) { console.log("dong"); } else { console.log("dang"); }');
        bt(
            'function kindaComplex() {\n' +
            '    var a = 2;\n' +
            '    var obj = {};\n' +
            '    var obj2 = { a: "a", b: "b" };\n' +
            '    var obj3 = {\n' +
            '        c: "c",\n' +
            '        d: "d",\n' +
            '        e: "e"\n' +
            '    };\n' +
            '}');
        bt(
            'function complex() {\n' +
            '    console.log("wowe");\n' +
            '    (function() { var a = 2; var b = 3; })();\n' +
            '    $.each(arr, function(el, idx) { return el; });\n' +
            '    var obj = {\n' +
            '        a: function() { console.log("test"); },\n' +
            '        b() {\n' +
            '             console.log("test2");\n' +
            '        }\n' +
            '    };\n' +
            '}',
            //  -- output --
            'function complex() {\n' +
            '    console.log("wowe");\n' +
            '    (function() { var a = 2; var b = 3; })();\n' +
            '    $.each(arr, function(el, idx) { return el; });\n' +
            '    var obj = {\n' +
            '        a: function() { console.log("test"); },\n' +
            '        b() {\n' +
            '            console.log("test2");\n' +
            '        }\n' +
            '    };\n' +
            '}');

        // brace_style ,preserve-inline tests - (obo = "\n", obot = "    ", oao = "\n", oaot = "    ", obc = "\n", oac = "\n", oact = "    ")
        reset_options();
        opts.brace_style = 'expand,preserve-inline';
        bt('import { asdf } from "asdf";');
        bt('import { get } from "asdf";');
        bt('function inLine() { console.log("oh em gee"); }');
        bt('if (cancer) { console.log("Im sorry but you only have so long to live..."); }');
        bt(
            'if (ding) { console.log("dong"); } else { console.log("dang"); }',
            //  -- output --
            'if (ding) { console.log("dong"); }\n' +
            'else { console.log("dang"); }');
        bt(
            'function kindaComplex() {\n' +
            '    var a = 2;\n' +
            '    var obj = {};\n' +
            '    var obj2 = { a: "a", b: "b" };\n' +
            '    var obj3 = {\n' +
            '        c: "c",\n' +
            '        d: "d",\n' +
            '        e: "e"\n' +
            '    };\n' +
            '}',
            //  -- output --
            'function kindaComplex()\n' +
            '{\n' +
            '    var a = 2;\n' +
            '    var obj = {};\n' +
            '    var obj2 = { a: "a", b: "b" };\n' +
            '    var obj3 = {\n' +
            '        c: "c",\n' +
            '        d: "d",\n' +
            '        e: "e"\n' +
            '    };\n' +
            '}');
        bt(
            'function complex() {\n' +
            '    console.log("wowe");\n' +
            '    (function() { var a = 2; var b = 3; })();\n' +
            '    $.each(arr, function(el, idx) { return el; });\n' +
            '    var obj = {\n' +
            '        a: function() { console.log("test"); },\n' +
            '        b() {\n' +
            '             console.log("test2");\n' +
            '        }\n' +
            '    };\n' +
            '}',
            //  -- output --
            'function complex()\n' +
            '{\n' +
            '    console.log("wowe");\n' +
            '    (function() { var a = 2; var b = 3; })();\n' +
            '    $.each(arr, function(el, idx) { return el; });\n' +
            '    var obj = {\n' +
            '        a: function() { console.log("test"); },\n' +
            '        b()\n' +
            '        {\n' +
            '            console.log("test2");\n' +
            '        }\n' +
            '    };\n' +
            '}');

        // brace_style ,preserve-inline tests - (obo = " ", obot = "", oao = "\n", oaot = "    ", obc = "\n", oac = "\n", oact = "    ")
        reset_options();
        opts.brace_style = 'end-expand,preserve-inline';
        bt('import { asdf } from "asdf";');
        bt('import { get } from "asdf";');
        bt('function inLine() { console.log("oh em gee"); }');
        bt('if (cancer) { console.log("Im sorry but you only have so long to live..."); }');
        bt(
            'if (ding) { console.log("dong"); } else { console.log("dang"); }',
            //  -- output --
            'if (ding) { console.log("dong"); }\n' +
            'else { console.log("dang"); }');
        bt(
            'function kindaComplex() {\n' +
            '    var a = 2;\n' +
            '    var obj = {};\n' +
            '    var obj2 = { a: "a", b: "b" };\n' +
            '    var obj3 = {\n' +
            '        c: "c",\n' +
            '        d: "d",\n' +
            '        e: "e"\n' +
            '    };\n' +
            '}');
        bt(
            'function complex() {\n' +
            '    console.log("wowe");\n' +
            '    (function() { var a = 2; var b = 3; })();\n' +
            '    $.each(arr, function(el, idx) { return el; });\n' +
            '    var obj = {\n' +
            '        a: function() { console.log("test"); },\n' +
            '        b() {\n' +
            '             console.log("test2");\n' +
            '        }\n' +
            '    };\n' +
            '}',
            //  -- output --
            'function complex() {\n' +
            '    console.log("wowe");\n' +
            '    (function() { var a = 2; var b = 3; })();\n' +
            '    $.each(arr, function(el, idx) { return el; });\n' +
            '    var obj = {\n' +
            '        a: function() { console.log("test"); },\n' +
            '        b() {\n' +
            '            console.log("test2");\n' +
            '        }\n' +
            '    };\n' +
            '}');

        // brace_style ,preserve-inline tests - (obo = " ", obot = "", oao = "\n", oaot = "    ", obc = "\n", oac = " ", oact = "")
        reset_options();
        opts.brace_style = 'none,preserve-inline';
        bt('import { asdf } from "asdf";');
        bt('import { get } from "asdf";');
        bt('function inLine() { console.log("oh em gee"); }');
        bt('if (cancer) { console.log("Im sorry but you only have so long to live..."); }');
        bt('if (ding) { console.log("dong"); } else { console.log("dang"); }');
        bt(
            'function kindaComplex() {\n' +
            '    var a = 2;\n' +
            '    var obj = {};\n' +
            '    var obj2 = { a: "a", b: "b" };\n' +
            '    var obj3 = {\n' +
            '        c: "c",\n' +
            '        d: "d",\n' +
            '        e: "e"\n' +
            '    };\n' +
            '}');
        bt(
            'function complex() {\n' +
            '    console.log("wowe");\n' +
            '    (function() { var a = 2; var b = 3; })();\n' +
            '    $.each(arr, function(el, idx) { return el; });\n' +
            '    var obj = {\n' +
            '        a: function() { console.log("test"); },\n' +
            '        b() {\n' +
            '             console.log("test2");\n' +
            '        }\n' +
            '    };\n' +
            '}',
            //  -- output --
            'function complex() {\n' +
            '    console.log("wowe");\n' +
            '    (function() { var a = 2; var b = 3; })();\n' +
            '    $.each(arr, function(el, idx) { return el; });\n' +
            '    var obj = {\n' +
            '        a: function() { console.log("test"); },\n' +
            '        b() {\n' +
            '            console.log("test2");\n' +
            '        }\n' +
            '    };\n' +
            '}');

        // brace_style ,preserve-inline tests - (obo = " ", obot = "", oao = "\n", oaot = "    ", obc = "\n", oac = " ", oact = "")
        reset_options();
        opts.brace_style = 'collapse-preserve-inline';
        bt('import { asdf } from "asdf";');
        bt('import { get } from "asdf";');
        bt('function inLine() { console.log("oh em gee"); }');
        bt('if (cancer) { console.log("Im sorry but you only have so long to live..."); }');
        bt('if (ding) { console.log("dong"); } else { console.log("dang"); }');
        bt(
            'function kindaComplex() {\n' +
            '    var a = 2;\n' +
            '    var obj = {};\n' +
            '    var obj2 = { a: "a", b: "b" };\n' +
            '    var obj3 = {\n' +
            '        c: "c",\n' +
            '        d: "d",\n' +
            '        e: "e"\n' +
            '    };\n' +
            '}');
        bt(
            'function complex() {\n' +
            '    console.log("wowe");\n' +
            '    (function() { var a = 2; var b = 3; })();\n' +
            '    $.each(arr, function(el, idx) { return el; });\n' +
            '    var obj = {\n' +
            '        a: function() { console.log("test"); },\n' +
            '        b() {\n' +
            '             console.log("test2");\n' +
            '        }\n' +
            '    };\n' +
            '}',
            //  -- output --
            'function complex() {\n' +
            '    console.log("wowe");\n' +
            '    (function() { var a = 2; var b = 3; })();\n' +
            '    $.each(arr, function(el, idx) { return el; });\n' +
            '    var obj = {\n' +
            '        a: function() { console.log("test"); },\n' +
            '        b() {\n' +
            '            console.log("test2");\n' +
            '        }\n' +
            '    };\n' +
            '}');


        //============================================================
        // Destructured and related
        reset_options();
        opts.brace_style = 'collapse,preserve-inline';
        
        // Issue 382 - import destructured 
        bt(
            'module "Even" {\n' +
            '    import { odd, oddly } from "Odd";\n' +
            '}');
        bt(
            'import defaultMember from "module-name";\n' +
            'import * as name from "module-name";\n' +
            'import { member } from "module-name";\n' +
            'import { member as alias } from "module-name";\n' +
            'import { member1, member2 } from "module-name";\n' +
            'import { member1, member2 as alias2 } from "module-name";\n' +
            'import defaultMember, { member, member2 } from "module-name";\n' +
            'import defaultMember, * as name from "module-name";\n' +
            'import "module-name";');
        
        // Issue 858 - from is a keyword only after import
        bt(
            'if (from < to) {\n' +
            '    from++;\n' +
            '} else {\n' +
            '    from--;\n' +
            '}');
        
        // Issue 511 - destrutured
        bt(
            'var { b, c } = require("../stores");\n' +
            'var { ProjectStore } = require("../stores");\n' +
            '\n' +
            'function takeThing({ prop }) {\n' +
            '    console.log("inner prop", prop)\n' +
            '}');
        
        // Issue 315 - Short objects
        bt('var a = { b: { c: { d: e } } };');
        bt(
            'var a = {\n' +
            '    b: {\n' +
            '        c: { d: e }\n' +
            '        c3: { d: e }\n' +
            '    },\n' +
            '    b2: { c: { d: e } }\n' +
            '};');
        
        // Issue 370 - Short objects in array
        bt(
            'var methods = [\n' +
            '    { name: "to" },\n' +
            '    { name: "step" },\n' +
            '    { name: "move" },\n' +
            '    { name: "min" },\n' +
            '    { name: "max" }\n' +
            '];');
        
        // Issue 838 - Short objects in array
        bt(
            'function(url, callback) {\n' +
            '    var script = document.createElement("script")\n' +
            '    if (true) script.onreadystatechange = function() {\n' +
            '        foo();\n' +
            '    }\n' +
            '    else script.onload = callback;\n' +
            '}');
        
        // Issue 578 - Odd indenting after function
        bt(
            'function bindAuthEvent(eventName) {\n' +
            '    self.auth.on(eventName, function(event, meta) {\n' +
            '        self.emit(eventName, event, meta);\n' +
            '    });\n' +
            '}\n' +
            '["logged_in", "logged_out", "signed_up", "updated_user"].forEach(bindAuthEvent);');
        
        // Issue #487 - some short expressions examples
        bt(
            'if (a == 1) { a++; }\n' +
            'a = { a: a };\n' +
            'UserDB.findOne({ username: "xyz" }, function(err, user) {});\n' +
            'import { fs } from "fs";');
        
        // Issue #982 - Fixed return expression collapse-preserve-inline
        bt(
            'function foo(arg) {\n' +
            '    if (!arg) { a(); }\n' +
            '    if (!arg) { return false; }\n' +
            '    if (!arg) { throw "inline"; }\n' +
            '    return true;\n' +
            '}');
        
        // Issue #338 - Short expressions 
        bt(
            'if (someCondition) { return something; }\n' +
            'if (someCondition) {\n' +
            '    return something;\n' +
            '}\n' +
            'if (someCondition) { break; }\n' +
            'if (someCondition) {\n' +
            '    return something;\n' +
            '}');


        //============================================================
        // Old tests
        reset_options();
        bt('');
        test_fragment('   return .5');
        test_fragment(
            '   return .5;\n' +
            '   a();');
        test_fragment(
            '    return .5;\n' +
            '    a();');
        test_fragment(
            '     return .5;\n' +
            '     a();');
        test_fragment('   < div');
        bt('a        =          1', 'a = 1');
        bt('a=1', 'a = 1');
        bt('(3) / 2');
        bt('["a", "b"].join("")');
        bt(
            'a();\n' +
            '\n' +
            'b();');
        bt(
            'var a = 1 var b = 2',
            //  -- output --
            'var a = 1\n' +
            'var b = 2');
        bt(
            'var a=1, b=c[d], e=6;',
            //  -- output --
            'var a = 1,\n' +
            '    b = c[d],\n' +
            '    e = 6;');
        bt(
            'var a,\n' +
            '    b,\n' +
            '    c;');
        bt(
            'let a = 1 let b = 2',
            //  -- output --
            'let a = 1\n' +
            'let b = 2');
        bt(
            'let a=1, b=c[d], e=6;',
            //  -- output --
            'let a = 1,\n' +
            '    b = c[d],\n' +
            '    e = 6;');
        bt(
            'let a,\n' +
            '    b,\n' +
            '    c;');
        bt(
            'const a = 1 const b = 2',
            //  -- output --
            'const a = 1\n' +
            'const b = 2');
        bt(
            'const a=1, b=c[d], e=6;',
            //  -- output --
            'const a = 1,\n' +
            '    b = c[d],\n' +
            '    e = 6;');
        bt(
            'const a,\n' +
            '    b,\n' +
            '    c;');
        bt('a = " 12345 "');
        bt('a = \' 12345 \'');
        bt('if (a == 1) b = 2;');
        bt(
            'if(1){2}else{3}',
            //  -- output --
            'if (1) {\n' +
            '    2\n' +
            '} else {\n' +
            '    3\n' +
            '}');
        bt('if(1||2);', 'if (1 || 2);');
        bt('(a==1)||(b==2)', '(a == 1) || (b == 2)');
        bt(
            'var a = 1 if (2) 3;',
            //  -- output --
            'var a = 1\n' +
            'if (2) 3;');
        bt('a = a + 1');
        bt('a = a == 1');
        bt('/12345[^678]*9+/.match(a)');
        bt('a /= 5');
        bt('a = 0.5 * 3');
        bt('a *= 10.55');
        bt('a < .5');
        bt('a <= .5');
        bt('a<.5', 'a < .5');
        bt('a<=.5', 'a <= .5');
        
        // exponent literals
        bt('a = 1e10');
        bt('a = 1.3e10');
        bt('a = 1.3e-10');
        bt('a = -12345.3e-10');
        bt('a = .12345e-10');
        bt('a = 06789e-10');
        bt('a = e - 10');
        bt('a = 1.3e+10');
        bt('a = 1.e-7');
        bt('a = -12345.3e+10');
        bt('a = .12345e+10');
        bt('a = 06789e+10');
        bt('a = e + 10');
        bt('a=0e-12345.3e-10', 'a = 0e-12345 .3e-10');
        bt('a=0.e-12345.3e-10', 'a = 0.e-12345 .3e-10');
        bt('a=0x.e-12345.3e-10', 'a = 0x.e - 12345.3e-10');
        bt('a=0x0.e-12345.3e-10', 'a = 0x0.e - 12345.3e-10');
        bt('a=0x0.0e-12345.3e-10', 'a = 0x0 .0e-12345 .3e-10');
        bt('a=0g-12345.3e-10', 'a = 0 g - 12345.3e-10');
        bt('a=0.g-12345.3e-10', 'a = 0. g - 12345.3e-10');
        bt('a=0x.g-12345.3e-10', 'a = 0x.g - 12345.3e-10');
        bt('a=0x0.g-12345.3e-10', 'a = 0x0.g - 12345.3e-10');
        bt('a=0x0.0g-12345.3e-10', 'a = 0x0 .0 g - 12345.3e-10');
        
        // Decimal literals
        bt('a = 0123456789;');
        bt('a = 9876543210;');
        bt('a = 5647308291;');
        bt('a=030e-5', 'a = 030e-5');
        bt('a=00+4', 'a = 00 + 4');
        bt('a=32+4', 'a = 32 + 4');
        bt('a=0.6g+4', 'a = 0.6 g + 4');
        bt('a=01.10', 'a = 01.10');
        bt('a=a.10', 'a = a .10');
        bt('a=00B0x0', 'a = 00 B0x0');
        bt('a=00B0xb0', 'a = 00 B0xb0');
        bt('a=00B0x0b0', 'a = 00 B0x0b0');
        bt('a=0090x0', 'a = 0090 x0');
        bt('a=0g0b0o0', 'a = 0 g0b0o0');
        
        // Hexadecimal literals
        bt('a = 0x0123456789abcdef;');
        bt('a = 0X0123456789ABCDEF;');
        bt('a = 0xFeDcBa9876543210;');
        bt('a=0x30e-5', 'a = 0x30e - 5');
        bt('a=0xF0+4', 'a = 0xF0 + 4');
        bt('a=0Xff+4', 'a = 0Xff + 4');
        bt('a=0Xffg+4', 'a = 0Xff g + 4');
        bt('a=0x01.10', 'a = 0x01 .10');
        bt('a = 0xb0ce;');
        bt('a = 0x0b0;');
        bt('a=0x0B0x0', 'a = 0x0B0 x0');
        bt('a=0x0B0xb0', 'a = 0x0B0 xb0');
        bt('a=0x0B0x0b0', 'a = 0x0B0 x0b0');
        bt('a=0X090x0', 'a = 0X090 x0');
        bt('a=0Xg0b0o0', 'a = 0X g0b0o0');
        
        // Octal literals
        bt('a = 0o01234567;');
        bt('a = 0O01234567;');
        bt('a = 0o34120675;');
        bt('a=0o30e-5', 'a = 0o30 e - 5');
        bt('a=0o70+4', 'a = 0o70 + 4');
        bt('a=0O77+4', 'a = 0O77 + 4');
        bt('a=0O778+4', 'a = 0O77 8 + 4');
        bt('a=0O77a+4', 'a = 0O77 a + 4');
        bt('a=0o01.10', 'a = 0o01 .10');
        bt('a=0o0B0x0', 'a = 0o0 B0x0');
        bt('a=0o0B0xb0', 'a = 0o0 B0xb0');
        bt('a=0o0B0x0b0', 'a = 0o0 B0x0b0');
        bt('a=0O090x0', 'a = 0O0 90 x0');
        bt('a=0Og0b0o0', 'a = 0O g0b0o0');
        
        // Binary literals
        bt('a = 0b010011;');
        bt('a = 0B010011;');
        bt('a = 0b01001100001111;');
        bt('a=0b10e-5', 'a = 0b10 e - 5');
        bt('a=0b10+4', 'a = 0b10 + 4');
        bt('a=0B11+4', 'a = 0B11 + 4');
        bt('a=0B112+4', 'a = 0B11 2 + 4');
        bt('a=0B11a+4', 'a = 0B11 a + 4');
        bt('a=0b01.10', 'a = 0b01 .10');
        bt('a=0b0B0x0', 'a = 0b0 B0x0');
        bt('a=0b0B0xb0', 'a = 0b0 B0xb0');
        bt('a=0b0B0x0b0', 'a = 0b0 B0x0b0');
        bt('a=0B090x0', 'a = 0B0 90 x0');
        bt('a=0Bg0b0o0', 'a = 0B g0b0o0');
        bt('a = [1, 2, 3, 4]');
        bt('F*(g/=f)*g+b', 'F * (g /= f) * g + b');
        bt(
            'a.b({c:d})',
            //  -- output --
            'a.b({\n' +
            '    c: d\n' +
            '})');
        bt(
            'a.b\n' +
            '(\n' +
            '{\n' +
            'c:\n' +
            'd\n' +
            '}\n' +
            ')',
            //  -- output --
            'a.b({\n' +
            '    c: d\n' +
            '})');
        bt(
            'a.b({c:"d"})',
            //  -- output --
            'a.b({\n' +
            '    c: "d"\n' +
            '})');
        bt(
            'a.b\n' +
            '(\n' +
            '{\n' +
            'c:\n' +
            '"d"\n' +
            '}\n' +
            ')',
            //  -- output --
            'a.b({\n' +
            '    c: "d"\n' +
            '})');
        bt('a=!b', 'a = !b');
        bt('a=!!b', 'a = !!b');
        bt('a?b:c', 'a ? b : c');
        bt('a?1:2', 'a ? 1 : 2');
        bt('a?(b):c', 'a ? (b) : c');
        bt(
            'x={a:1,b:w=="foo"?x:y,c:z}',
            //  -- output --
            'x = {\n' +
            '    a: 1,\n' +
            '    b: w == "foo" ? x : y,\n' +
            '    c: z\n' +
            '}');
        bt('x=a?b?c?d:e:f:g;', 'x = a ? b ? c ? d : e : f : g;');
        bt(
            'x=a?b?c?d:{e1:1,e2:2}:f:g;',
            //  -- output --
            'x = a ? b ? c ? d : {\n' +
            '    e1: 1,\n' +
            '    e2: 2\n' +
            '} : f : g;');
        bt('function void(void) {}');
        bt('if(!a)foo();', 'if (!a) foo();');
        bt('a=~a', 'a = ~a');
        bt(
            'a;/*comment*/b;',
            //  -- output --
            'a; /*comment*/\n' +
            'b;');
        bt(
            'a;/* comment */b;',
            //  -- output --
            'a; /* comment */\n' +
            'b;');
        
        // simple comments don't get touched at all
        test_fragment(
            'a;/*\n' +
            'comment\n' +
            '*/b;',
            //  -- output --
            'a;\n' +
            '/*\n' +
            'comment\n' +
            '*/\n' +
            'b;');
        bt(
            'a;/**\n' +
            '* javadoc\n' +
            '*/b;',
            //  -- output --
            'a;\n' +
            '/**\n' +
            ' * javadoc\n' +
            ' */\n' +
            'b;');
        test_fragment(
            'a;/**\n' +
            '\n' +
            'no javadoc\n' +
            '*/b;',
            //  -- output --
            'a;\n' +
            '/**\n' +
            '\n' +
            'no javadoc\n' +
            '*/\n' +
            'b;');
        
        // comment blocks detected and reindented even w/o javadoc starter
        bt(
            'a;/*\n' +
            '* javadoc\n' +
            '*/b;',
            //  -- output --
            'a;\n' +
            '/*\n' +
            ' * javadoc\n' +
            ' */\n' +
            'b;');
        bt('if(a)break;', 'if (a) break;');
        bt(
            'if(a){break}',
            //  -- output --
            'if (a) {\n' +
            '    break\n' +
            '}');
        bt('if((a))foo();', 'if ((a)) foo();');
        bt('for(var i=0;;) a', 'for (var i = 0;;) a');
        bt(
            'for(var i=0;;)\n' +
            'a',
            //  -- output --
            'for (var i = 0;;)\n' +
            '    a');
        bt('a++;');
        bt('for(;;i++)a()', 'for (;; i++) a()');
        bt(
            'for(;;i++)\n' +
            'a()',
            //  -- output --
            'for (;; i++)\n' +
            '    a()');
        bt('for(;;++i)a', 'for (;; ++i) a');
        bt('return(1)', 'return (1)');
        bt(
            'try{a();}catch(b){c();}finally{d();}',
            //  -- output --
            'try {\n' +
            '    a();\n' +
            '} catch (b) {\n' +
            '    c();\n' +
            '} finally {\n' +
            '    d();\n' +
            '}');
        
        //  magic function call
        bt('(xx)()');
        
        // another magic function call
        bt('a[1]()');
        bt(
            'if(a){b();}else if(c) foo();',
            //  -- output --
            'if (a) {\n' +
            '    b();\n' +
            '} else if (c) foo();');
        bt(
            'switch(x) {case 0: case 1: a(); break; default: break}',
            //  -- output --
            'switch (x) {\n' +
            '    case 0:\n' +
            '    case 1:\n' +
            '        a();\n' +
            '        break;\n' +
            '    default:\n' +
            '        break\n' +
            '}');
        bt(
            'switch(x){case -1:break;case !y:break;}',
            //  -- output --
            'switch (x) {\n' +
            '    case -1:\n' +
            '        break;\n' +
            '    case !y:\n' +
            '        break;\n' +
            '}');
        bt('a !== b');
        bt(
            'if (a) b(); else c();',
            //  -- output --
            'if (a) b();\n' +
            'else c();');
        
        // typical greasemonkey start
        bt(
            '// comment\n' +
            '(function something() {})');
        
        // duplicating newlines
        bt(
            '{\n' +
            '\n' +
            '    x();\n' +
            '\n' +
            '}');
        bt('if (a in b) foo();');
        bt('if (a of b) foo();');
        bt('if (a of [1, 2, 3]) foo();');
        bt(
            'if(X)if(Y)a();else b();else c();',
            //  -- output --
            'if (X)\n' +
            '    if (Y) a();\n' +
            '    else b();\n' +
            'else c();');
        bt(
            'if (foo) bar();\n' +
            'else break');
        bt('var a, b;');
        bt('var a = new function();');
        test_fragment('new function');
        bt('var a, b');
        bt(
            '{a:1, b:2}',
            //  -- output --
            '{\n' +
            '    a: 1,\n' +
            '    b: 2\n' +
            '}');
        bt(
            'a={1:[-1],2:[+1]}',
            //  -- output --
            'a = {\n' +
            '    1: [-1],\n' +
            '    2: [+1]\n' +
            '}');
        bt(
            'var l = {\'a\':\'1\', \'b\':\'2\'}',
            //  -- output --
            'var l = {\n' +
            '    \'a\': \'1\',\n' +
            '    \'b\': \'2\'\n' +
            '}');
        bt('if (template.user[n] in bk) foo();');
        bt('return 45');
        bt(
            'return this.prevObject ||\n' +
            '\n' +
            '    this.constructor(null);');
        bt('If[1]');
        bt('Then[1]');
        bt('a = 1;// comment', 'a = 1; // comment');
        bt('a = 1; // comment');
        bt(
            'a = 1;\n' +
            ' // comment',
            //  -- output --
            'a = 1;\n' +
            '// comment');
        bt('a = [-1, -1, -1]');
        bt(
            '// a\n' +
            '// b\n' +
            '\n' +
            '\n' +
            '\n' +
            '// c\n' +
            '// d');
        bt(
            '// func-comment\n' +
            '\n' +
            'function foo() {}\n' +
            '\n' +
            '// end-func-comment');
        
        // The exact formatting these should have is open for discussion, but they are at least reasonable
        bt(
            'a = [ // comment\n' +
            '    -1, -1, -1\n' +
            ']');
        bt(
            'var a = [ // comment\n' +
            '    -1, -1, -1\n' +
            ']');
        bt(
            'a = [ // comment\n' +
            '    -1, // comment\n' +
            '    -1, -1\n' +
            ']');
        bt(
            'var a = [ // comment\n' +
            '    -1, // comment\n' +
            '    -1, -1\n' +
            ']');
        bt(
            'o = [{a:b},{c:d}]',
            //  -- output --
            'o = [{\n' +
            '    a: b\n' +
            '}, {\n' +
            '    c: d\n' +
            '}]');
        
        // was: extra space appended
        bt(
            'if (a) {\n' +
            '    do();\n' +
            '}');
        
        // if/else statement with empty body
        bt(
            'if (a) {\n' +
            '// comment\n' +
            '}else{\n' +
            '// comment\n' +
            '}',
            //  -- output --
            'if (a) {\n' +
            '    // comment\n' +
            '} else {\n' +
            '    // comment\n' +
            '}');
        
        // multiple comments indentation
        bt(
            'if (a) {\n' +
            '// comment\n' +
            '// comment\n' +
            '}',
            //  -- output --
            'if (a) {\n' +
            '    // comment\n' +
            '    // comment\n' +
            '}');
        bt(
            'if (a) b() else c();',
            //  -- output --
            'if (a) b()\n' +
            'else c();');
        bt(
            'if (a) b() else if c() d();',
            //  -- output --
            'if (a) b()\n' +
            'else if c() d();');
        bt('{}');
        bt(
            '{\n' +
            '\n' +
            '}');
        bt(
            'do { a(); } while ( 1 );',
            //  -- output --
            'do {\n' +
            '    a();\n' +
            '} while (1);');
        bt('do {} while (1);');
        bt(
            'do {\n' +
            '} while (1);',
            //  -- output --
            'do {} while (1);');
        bt(
            'do {\n' +
            '\n' +
            '} while (1);');
        bt('var a = x(a, b, c)');
        bt(
            'delete x if (a) b();',
            //  -- output --
            'delete x\n' +
            'if (a) b();');
        bt(
            'delete x[x] if (a) b();',
            //  -- output --
            'delete x[x]\n' +
            'if (a) b();');
        bt('for(var a=1,b=2)d', 'for (var a = 1, b = 2) d');
        bt('for(var a=1,b=2,c=3) d', 'for (var a = 1, b = 2, c = 3) d');
        bt(
            'for(var a=1,b=2,c=3;d<3;d++)\n' +
            'e',
            //  -- output --
            'for (var a = 1, b = 2, c = 3; d < 3; d++)\n' +
            '    e');
        bt(
            'function x(){(a||b).c()}',
            //  -- output --
            'function x() {\n' +
            '    (a || b).c()\n' +
            '}');
        bt(
            'function x(){return - 1}',
            //  -- output --
            'function x() {\n' +
            '    return -1\n' +
            '}');
        bt(
            'function x(){return ! a}',
            //  -- output --
            'function x() {\n' +
            '    return !a\n' +
            '}');
        bt('x => x');
        bt('(x) => x');
        bt(
            'x => { x }',
            //  -- output --
            'x => {\n' +
            '    x\n' +
            '}');
        bt(
            '(x) => { x }',
            //  -- output --
            '(x) => {\n' +
            '    x\n' +
            '}');
        
        // a common snippet in jQuery plugins
        bt(
            'settings = $.extend({},defaults,settings);',
            //  -- output --
            'settings = $.extend({}, defaults, settings);');
        bt('$http().then().finally().default()');
        bt(
            '$http()\n' +
            '.then()\n' +
            '.finally()\n' +
            '.default()',
            //  -- output --
            '$http()\n' +
            '    .then()\n' +
            '    .finally()\n' +
            '    .default()');
        bt('$http().when.in.new.catch().throw()');
        bt(
            '$http()\n' +
            '.when\n' +
            '.in\n' +
            '.new\n' +
            '.catch()\n' +
            '.throw()',
            //  -- output --
            '$http()\n' +
            '    .when\n' +
            '    .in\n' +
            '    .new\n' +
            '    .catch()\n' +
            '    .throw()');
        bt(
            '{xxx;}()',
            //  -- output --
            '{\n' +
            '    xxx;\n' +
            '}()');
        bt(
            'a = \'a\'\n' +
            'b = \'b\'');
        bt('a = /reg/exp');
        bt('a = /reg/');
        bt('/abc/.test()');
        bt('/abc/i.test()');
        bt(
            '{/abc/i.test()}',
            //  -- output --
            '{\n' +
            '    /abc/i.test()\n' +
            '}');
        bt('var x=(a)/a;', 'var x = (a) / a;');
        bt('x != -1');
        bt('for (; s-->0;)t', 'for (; s-- > 0;) t');
        bt('for (; s++>0;)u', 'for (; s++ > 0;) u');
        bt('a = s++>s--;', 'a = s++ > s--;');
        bt('a = s++>--s;', 'a = s++ > --s;');
        bt(
            '{x=#1=[]}',
            //  -- output --
            '{\n' +
            '    x = #1=[]\n' +
            '}');
        bt(
            '{a:#1={}}',
            //  -- output --
            '{\n' +
            '    a: #1={}\n' +
            '}');
        bt(
            '{a:#1#}',
            //  -- output --
            '{\n' +
            '    a: #1#\n' +
            '}');
        test_fragment('"incomplete-string');
        test_fragment('\'incomplete-string');
        test_fragment('/incomplete-regex');
        test_fragment('`incomplete-template-string');
        test_fragment(
            '{a:1},{a:2}',
            //  -- output --
            '{\n' +
            '    a: 1\n' +
            '}, {\n' +
            '    a: 2\n' +
            '}');
        test_fragment(
            'var ary=[{a:1}, {a:2}];',
            //  -- output --
            'var ary = [{\n' +
            '    a: 1\n' +
            '}, {\n' +
            '    a: 2\n' +
            '}];');
        
        // incomplete
        test_fragment(
            '{a:#1',
            //  -- output --
            '{\n' +
            '    a: #1');
        
        // incomplete
        test_fragment(
            '{a:#',
            //  -- output --
            '{\n' +
            '    a: #');
        
        // incomplete
        test_fragment(
            '}}}',
            //  -- output --
            '}\n' +
            '}\n' +
            '}');
        test_fragment(
            '<!--\n' +
            'void();\n' +
            '// -->');
        
        // incomplete regexp
        test_fragment('a=/regexp', 'a = /regexp');
        bt(
            '{a:#1=[],b:#1#,c:#999999#}',
            //  -- output --
            '{\n' +
            '    a: #1=[],\n' +
            '    b: #1#,\n' +
            '    c: #999999#\n' +
            '}');
        bt(
            'do{x()}while(a>1)',
            //  -- output --
            'do {\n' +
            '    x()\n' +
            '} while (a > 1)');
        bt(
            'x(); /reg/exp.match(something)',
            //  -- output --
            'x();\n' +
            '/reg/exp.match(something)');
        test_fragment(
            'something();(',
            //  -- output --
            'something();\n' +
            '(');
        test_fragment(
            '#!she/bangs, she bangs\n' +
            'f=1',
            //  -- output --
            '#!she/bangs, she bangs\n' +
            '\n' +
            'f = 1');
        test_fragment(
            '#!she/bangs, she bangs\n' +
            '\n' +
            'f=1',
            //  -- output --
            '#!she/bangs, she bangs\n' +
            '\n' +
            'f = 1');
        test_fragment(
            '#!she/bangs, she bangs\n' +
            '\n' +
            '/* comment */');
        test_fragment(
            '#!she/bangs, she bangs\n' +
            '\n' +
            '\n' +
            '/* comment */');
        test_fragment('#');
        test_fragment('#!');
        bt('function namespace::something()');
        test_fragment(
            '<!--\n' +
            'something();\n' +
            '-->');
        test_fragment(
            '<!--\n' +
            'if(i<0){bla();}\n' +
            '-->',
            //  -- output --
            '<!--\n' +
            'if (i < 0) {\n' +
            '    bla();\n' +
            '}\n' +
            '-->');
        bt(
            '{foo();--bar;}',
            //  -- output --
            '{\n' +
            '    foo();\n' +
            '    --bar;\n' +
            '}');
        bt(
            '{foo();++bar;}',
            //  -- output --
            '{\n' +
            '    foo();\n' +
            '    ++bar;\n' +
            '}');
        bt(
            '{--bar;}',
            //  -- output --
            '{\n' +
            '    --bar;\n' +
            '}');
        bt(
            '{++bar;}',
            //  -- output --
            '{\n' +
            '    ++bar;\n' +
            '}');
        bt('if(true)++a;', 'if (true) ++a;');
        bt(
            'if(true)\n' +
            '++a;',
            //  -- output --
            'if (true)\n' +
            '    ++a;');
        bt('if(true)--a;', 'if (true) --a;');
        bt(
            'if(true)\n' +
            '--a;',
            //  -- output --
            'if (true)\n' +
            '    --a;');
        bt('elem[array]++;');
        bt('elem++ * elem[array]++;');
        bt('elem-- * -elem[array]++;');
        bt('elem-- + elem[array]++;');
        bt('elem-- - elem[array]++;');
        bt('elem-- - -elem[array]++;');
        bt('elem-- - +elem[array]++;');
        
        // Handling of newlines around unary ++ and -- operators
        bt(
            '{foo\n' +
            '++bar;}',
            //  -- output --
            '{\n' +
            '    foo\n' +
            '    ++bar;\n' +
            '}');
        bt(
            '{foo++\n' +
            'bar;}',
            //  -- output --
            '{\n' +
            '    foo++\n' +
            '    bar;\n' +
            '}');
        
        // This is invalid, but harder to guard against. Issue #203.
        bt(
            '{foo\n' +
            '++\n' +
            'bar;}',
            //  -- output --
            '{\n' +
            '    foo\n' +
            '    ++\n' +
            '    bar;\n' +
            '}');
        
        // regexps
        bt(
            'a(/abc\\/\\/def/);b()',
            //  -- output --
            'a(/abc\\/\\/def/);\n' +
            'b()');
        bt(
            'a(/a[b\\[\\]c]d/);b()',
            //  -- output --
            'a(/a[b\\[\\]c]d/);\n' +
            'b()');
        
        // incomplete char class
        test_fragment('a(/a[b\\[');
        
        // allow unescaped / in char classes
        bt(
            'a(/[a/b]/);b()',
            //  -- output --
            'a(/[a/b]/);\n' +
            'b()');
        bt('typeof /foo\\//;');
        bt('throw /foo\\//;');
        bt('do /foo\\//;');
        bt('return /foo\\//;');
        bt(
            'switch (a) {\n' +
            '    case /foo\\//:\n' +
            '        b\n' +
            '}');
        bt(
            'if (a) /foo\\//\n' +
            'else /foo\\//;');
        bt('if (foo) /regex/.test();');
        bt('for (index in [1, 2, 3]) /^test$/i.test(s)');
        bt(
            'function foo() {\n' +
            '    return [\n' +
            '        "one",\n' +
            '        "two"\n' +
            '    ];\n' +
            '}');
        bt(
            'a=[[1,2],[4,5],[7,8]]',
            //  -- output --
            'a = [\n' +
            '    [1, 2],\n' +
            '    [4, 5],\n' +
            '    [7, 8]\n' +
            ']');
        bt(
            'a=[[1,2],[4,5],function(){},[7,8]]',
            //  -- output --
            'a = [\n' +
            '    [1, 2],\n' +
            '    [4, 5],\n' +
            '    function() {},\n' +
            '    [7, 8]\n' +
            ']');
        bt(
            'a=[[1,2],[4,5],function(){},function(){},[7,8]]',
            //  -- output --
            'a = [\n' +
            '    [1, 2],\n' +
            '    [4, 5],\n' +
            '    function() {},\n' +
            '    function() {},\n' +
            '    [7, 8]\n' +
            ']');
        bt(
            'a=[[1,2],[4,5],function(){},[7,8]]',
            //  -- output --
            'a = [\n' +
            '    [1, 2],\n' +
            '    [4, 5],\n' +
            '    function() {},\n' +
            '    [7, 8]\n' +
            ']');
        bt('a=[b,c,function(){},function(){},d]', 'a = [b, c, function() {}, function() {}, d]');
        bt(
            'a=[b,c,\n' +
            'function(){},function(){},d]',
            //  -- output --
            'a = [b, c,\n' +
            '    function() {},\n' +
            '    function() {},\n' +
            '    d\n' +
            ']');
        bt('a=[a[1],b[4],c[d[7]]]', 'a = [a[1], b[4], c[d[7]]]');
        bt('[1,2,[3,4,[5,6],7],8]', '[1, 2, [3, 4, [5, 6], 7], 8]');
        bt(
            '[[["1","2"],["3","4"]],[["5","6","7"],["8","9","0"]],[["1","2","3"],["4","5","6","7"],["8","9","0"]]]',
            //  -- output --
            '[\n' +
            '    [\n' +
            '        ["1", "2"],\n' +
            '        ["3", "4"]\n' +
            '    ],\n' +
            '    [\n' +
            '        ["5", "6", "7"],\n' +
            '        ["8", "9", "0"]\n' +
            '    ],\n' +
            '    [\n' +
            '        ["1", "2", "3"],\n' +
            '        ["4", "5", "6", "7"],\n' +
            '        ["8", "9", "0"]\n' +
            '    ]\n' +
            ']');
        bt(
            '{[x()[0]];indent;}',
            //  -- output --
            '{\n' +
            '    [x()[0]];\n' +
            '    indent;\n' +
            '}');
        bt(
            '/*\n' +
            ' foo trailing space    \n' +
            ' * bar trailing space   \n' +
            '**/');
        bt(
            '{\n' +
            '    /*\n' +
            '    foo    \n' +
            '    * bar    \n' +
            '    */\n' +
            '}');
        bt('return ++i');
        bt('return !!x');
        bt('return !x');
        bt('return [1,2]', 'return [1, 2]');
        bt('return;');
        bt(
            'return\n' +
            'func');
        bt('catch(e)', 'catch (e)');
        bt(
            'var a=1,b={foo:2,bar:3},{baz:4,wham:5},c=4;',
            //  -- output --
            'var a = 1,\n' +
            '    b = {\n' +
            '        foo: 2,\n' +
            '        bar: 3\n' +
            '    },\n' +
            '    {\n' +
            '        baz: 4,\n' +
            '        wham: 5\n' +
            '    }, c = 4;');
        bt(
            'var a=1,b={foo:2,bar:3},{baz:4,wham:5},\n' +
            'c=4;',
            //  -- output --
            'var a = 1,\n' +
            '    b = {\n' +
            '        foo: 2,\n' +
            '        bar: 3\n' +
            '    },\n' +
            '    {\n' +
            '        baz: 4,\n' +
            '        wham: 5\n' +
            '    },\n' +
            '    c = 4;');
        
        // inline comment
        bt(
            'function x(/*int*/ start, /*string*/ foo)',
            //  -- output --
            'function x( /*int*/ start, /*string*/ foo)');
        
        // javadoc comment
        bt(
            '/**\n' +
            '* foo\n' +
            '*/',
            //  -- output --
            '/**\n' +
            ' * foo\n' +
            ' */');
        bt(
            '{\n' +
            '/**\n' +
            '* foo\n' +
            '*/\n' +
            '}',
            //  -- output --
            '{\n' +
            '    /**\n' +
            '     * foo\n' +
            '     */\n' +
            '}');
        
        // starless block comment
        bt(
            '/**\n' +
            'foo\n' +
            '*/');
        bt(
            '/**\n' +
            'foo\n' +
            '**/');
        bt(
            '/**\n' +
            'foo\n' +
            'bar\n' +
            '**/');
        bt(
            '/**\n' +
            'foo\n' +
            '\n' +
            'bar\n' +
            '**/');
        bt(
            '/**\n' +
            'foo\n' +
            '    bar\n' +
            '**/');
        bt(
            '{\n' +
            '/**\n' +
            'foo\n' +
            '*/\n' +
            '}',
            //  -- output --
            '{\n' +
            '    /**\n' +
            '    foo\n' +
            '    */\n' +
            '}');
        bt(
            '{\n' +
            '/**\n' +
            'foo\n' +
            '**/\n' +
            '}',
            //  -- output --
            '{\n' +
            '    /**\n' +
            '    foo\n' +
            '    **/\n' +
            '}');
        bt(
            '{\n' +
            '/**\n' +
            'foo\n' +
            'bar\n' +
            '**/\n' +
            '}',
            //  -- output --
            '{\n' +
            '    /**\n' +
            '    foo\n' +
            '    bar\n' +
            '    **/\n' +
            '}');
        bt(
            '{\n' +
            '/**\n' +
            'foo\n' +
            '\n' +
            'bar\n' +
            '**/\n' +
            '}',
            //  -- output --
            '{\n' +
            '    /**\n' +
            '    foo\n' +
            '\n' +
            '    bar\n' +
            '    **/\n' +
            '}');
        bt(
            '{\n' +
            '/**\n' +
            'foo\n' +
            '    bar\n' +
            '**/\n' +
            '}',
            //  -- output --
            '{\n' +
            '    /**\n' +
            '    foo\n' +
            '        bar\n' +
            '    **/\n' +
            '}');
        bt(
            '{\n' +
            '    /**\n' +
            '    foo\n' +
            'bar\n' +
            '    **/\n' +
            '}');
        bt(
            'var a,b,c=1,d,e,f=2;',
            //  -- output --
            'var a, b, c = 1,\n' +
            '    d, e, f = 2;');
        bt(
            'var a,b,c=[],d,e,f=2;',
            //  -- output --
            'var a, b, c = [],\n' +
            '    d, e, f = 2;');
        bt(
            'function() {\n' +
            '    var a, b, c, d, e = [],\n' +
            '        f;\n' +
            '}');
        bt(
            'do/regexp/;\n' +
            'while(1);',
            //  -- output --
            'do /regexp/;\n' +
            'while (1);');
        bt(
            'var a = a,\n' +
            'a;\n' +
            'b = {\n' +
            'b\n' +
            '}',
            //  -- output --
            'var a = a,\n' +
            '    a;\n' +
            'b = {\n' +
            '    b\n' +
            '}');
        bt(
            'var a = a,\n' +
            '    /* c */\n' +
            '    b;');
        bt(
            'var a = a,\n' +
            '    // c\n' +
            '    b;');
        
        // weird element referencing
        bt('foo.("bar");');
        bt(
            'if (a) a()\n' +
            'else b()\n' +
            'newline()');
        bt(
            'if (a) a()\n' +
            'newline()');
        bt('a=typeof(x)', 'a = typeof(x)');
        bt(
            'var a = function() {\n' +
            '        return null;\n' +
            '    },\n' +
            '    b = false;');
        bt(
            'var a = function() {\n' +
            '    func1()\n' +
            '}');
        bt(
            'var a = function() {\n' +
            '    func1()\n' +
            '}\n' +
            'var b = function() {\n' +
            '    func2()\n' +
            '}');
        
        // code with and without semicolons
        bt(
            'var whatever = require("whatever");\n' +
            'function() {\n' +
            '    a = 6;\n' +
            '}',
            //  -- output --
            'var whatever = require("whatever");\n' +
            '\n' +
            'function() {\n' +
            '    a = 6;\n' +
            '}');
        bt(
            'var whatever = require("whatever")\n' +
            'function() {\n' +
            '    a = 6\n' +
            '}',
            //  -- output --
            'var whatever = require("whatever")\n' +
            '\n' +
            'function() {\n' +
            '    a = 6\n' +
            '}');
        bt(
            '{"x":[{"a":1,"b":3},\n' +
            '7,8,8,8,8,{"b":99},{"a":11}]}',
            //  -- output --
            '{\n' +
            '    "x": [{\n' +
            '            "a": 1,\n' +
            '            "b": 3\n' +
            '        },\n' +
            '        7, 8, 8, 8, 8, {\n' +
            '            "b": 99\n' +
            '        }, {\n' +
            '            "a": 11\n' +
            '        }\n' +
            '    ]\n' +
            '}');
        bt(
            '{"x":[{"a":1,"b":3},7,8,8,8,8,{"b":99},{"a":11}]}',
            //  -- output --
            '{\n' +
            '    "x": [{\n' +
            '        "a": 1,\n' +
            '        "b": 3\n' +
            '    }, 7, 8, 8, 8, 8, {\n' +
            '        "b": 99\n' +
            '    }, {\n' +
            '        "a": 11\n' +
            '    }]\n' +
            '}');
        bt(
            '{"1":{"1a":"1b"},"2"}',
            //  -- output --
            '{\n' +
            '    "1": {\n' +
            '        "1a": "1b"\n' +
            '    },\n' +
            '    "2"\n' +
            '}');
        bt(
            '{a:{a:b},c}',
            //  -- output --
            '{\n' +
            '    a: {\n' +
            '        a: b\n' +
            '    },\n' +
            '    c\n' +
            '}');
        bt(
            '{[y[a]];keep_indent;}',
            //  -- output --
            '{\n' +
            '    [y[a]];\n' +
            '    keep_indent;\n' +
            '}');
        bt(
            'if (x) {y} else { if (x) {y}}',
            //  -- output --
            'if (x) {\n' +
            '    y\n' +
            '} else {\n' +
            '    if (x) {\n' +
            '        y\n' +
            '    }\n' +
            '}');
        bt(
            'if (foo) one()\n' +
            'two()\n' +
            'three()');
        bt(
            'if (1 + foo() && bar(baz()) / 2) one()\n' +
            'two()\n' +
            'three()');
        bt(
            'if (1 + foo() && bar(baz()) / 2) one();\n' +
            'two();\n' +
            'three();');
        bt(
            'var a=1,b={bang:2},c=3;',
            //  -- output --
            'var a = 1,\n' +
            '    b = {\n' +
            '        bang: 2\n' +
            '    },\n' +
            '    c = 3;');
        bt(
            'var a={bing:1},b=2,c=3;',
            //  -- output --
            'var a = {\n' +
            '        bing: 1\n' +
            '    },\n' +
            '    b = 2,\n' +
            '    c = 3;');


    }

    function beautifier_unconverted_tests()
    {
        sanitytest = test_obj;

        reset_options();
        //============================================================
        opts.indent_size = 1;
        opts.indent_char = ' ';
        bt('{ one_char() }', "{\n one_char()\n}");

        bt('var a,b=1,c=2', 'var a, b = 1,\n c = 2');

        opts.indent_size = 4;
        opts.indent_char = ' ';
        bt('{ one_char() }', "{\n    one_char()\n}");

        opts.indent_size = 1;
        opts.indent_char = "\t";
        bt('{ one_char() }', "{\n\tone_char()\n}");
        bt('x = a ? b : c; x;', 'x = a ? b : c;\nx;');

        //set to something else than it should change to, but with tabs on, should override
        opts.indent_size = 5;
        opts.indent_char = ' ';
        opts.indent_with_tabs = true;

        bt('{ one_char() }', "{\n\tone_char()\n}");
        bt('x = a ? b : c; x;', 'x = a ? b : c;\nx;');

        opts.indent_size = 4;
        opts.indent_char = ' ';
        opts.indent_with_tabs = false;

        reset_options();
        //============================================================
        opts.preserve_newlines = false;

        bt('var\na=dont_preserve_newlines;', 'var a = dont_preserve_newlines;');

        // make sure the blank line between function definitions stays
        // even when preserve_newlines = false
        bt('function foo() {\n    return 1;\n}\n\nfunction foo() {\n    return 1;\n}');
        bt('function foo() {\n    return 1;\n}\nfunction foo() {\n    return 1;\n}',
           'function foo() {\n    return 1;\n}\n\nfunction foo() {\n    return 1;\n}'
          );
        bt('function foo() {\n    return 1;\n}\n\n\nfunction foo() {\n    return 1;\n}',
           'function foo() {\n    return 1;\n}\n\nfunction foo() {\n    return 1;\n}'
          );

        opts.preserve_newlines = true;
        bt('var\na=do_preserve_newlines;', 'var\n    a = do_preserve_newlines;');
        bt('if (foo) //  comment\n{\n    bar();\n}');


        reset_options();
        //============================================================
        opts.keep_array_indentation = false;
        bt("a = ['a', 'b', 'c',\n   'd', 'e', 'f']",
            "a = ['a', 'b', 'c',\n    'd', 'e', 'f'\n]");
        bt("a = ['a', 'b', 'c',\n   'd', 'e', 'f',\n        'g', 'h', 'i']",
            "a = ['a', 'b', 'c',\n    'd', 'e', 'f',\n    'g', 'h', 'i'\n]");
        bt("a = ['a', 'b', 'c',\n       'd', 'e', 'f',\n            'g', 'h', 'i']",
            "a = ['a', 'b', 'c',\n    'd', 'e', 'f',\n    'g', 'h', 'i'\n]");
        bt('var x = [{}\n]', 'var x = [{}]');
        bt('var x = [{foo:bar}\n]', 'var x = [{\n    foo: bar\n}]');
        bt("a = ['something',\n    'completely',\n    'different'];\nif (x);",
            "a = ['something',\n    'completely',\n    'different'\n];\nif (x);");
        bt("a = ['a','b','c']", "a = ['a', 'b', 'c']");

        bt("a = ['a',   'b','c']", "a = ['a', 'b', 'c']");
        bt("x = [{'a':0}]",
            "x = [{\n    'a': 0\n}]");
        bt('{a([[a1]], {b;});}',
            '{\n    a([\n        [a1]\n    ], {\n        b;\n    });\n}');
        bt("a();\n   [\n   ['sdfsdfsd'],\n        ['sdfsdfsdf']\n   ].toString();",
            "a();\n[\n    ['sdfsdfsd'],\n    ['sdfsdfsdf']\n].toString();");
        bt("a();\na = [\n   ['sdfsdfsd'],\n        ['sdfsdfsdf']\n   ].toString();",
            "a();\na = [\n    ['sdfsdfsd'],\n    ['sdfsdfsdf']\n].toString();");
        bt("function() {\n    Foo([\n        ['sdfsdfsd'],\n        ['sdfsdfsdf']\n    ]);\n}",
            "function() {\n    Foo([\n        ['sdfsdfsd'],\n        ['sdfsdfsdf']\n    ]);\n}");
        bt('function foo() {\n    return [\n        "one",\n        "two"\n    ];\n}');
        // 4 spaces per indent input, processed with 4-spaces per indent
        bt( "function foo() {\n" +
            "    return [\n" +
            "        {\n" +
            "            one: 'x',\n" +
            "            two: [\n" +
            "                {\n" +
            "                    id: 'a',\n" +
            "                    name: 'apple'\n" +
            "                }, {\n" +
            "                    id: 'b',\n" +
            "                    name: 'banana'\n" +
            "                }\n" +
            "            ]\n" +
            "        }\n" +
            "    ];\n" +
            "}",
            "function foo() {\n" +
            "    return [{\n" +
            "        one: 'x',\n" +
            "        two: [{\n" +
            "            id: 'a',\n" +
            "            name: 'apple'\n" +
            "        }, {\n" +
            "            id: 'b',\n" +
            "            name: 'banana'\n" +
            "        }]\n" +
            "    }];\n" +
            "}");
        // 3 spaces per indent input, processed with 4-spaces per indent
        bt( "function foo() {\n" +
            "   return [\n" +
            "      {\n" +
            "         one: 'x',\n" +
            "         two: [\n" +
            "            {\n" +
            "               id: 'a',\n" +
            "               name: 'apple'\n" +
            "            }, {\n" +
            "               id: 'b',\n" +
            "               name: 'banana'\n" +
            "            }\n" +
            "         ]\n" +
            "      }\n" +
            "   ];\n" +
            "}",
            "function foo() {\n" +
            "    return [{\n" +
            "        one: 'x',\n" +
            "        two: [{\n" +
            "            id: 'a',\n" +
            "            name: 'apple'\n" +
            "        }, {\n" +
            "            id: 'b',\n" +
            "            name: 'banana'\n" +
            "        }]\n" +
            "    }];\n" +
            "}");

        opts.keep_array_indentation = true;
        bt("a = ['a', 'b', 'c',\n   'd', 'e', 'f']");
        bt("a = ['a', 'b', 'c',\n   'd', 'e', 'f',\n        'g', 'h', 'i']");
        bt("a = ['a', 'b', 'c',\n       'd', 'e', 'f',\n            'g', 'h', 'i']");
        bt('var x = [{}\n]', 'var x = [{}\n]');
        bt('var x = [{foo:bar}\n]', 'var x = [{\n        foo: bar\n    }\n]');
        bt("a = ['something',\n    'completely',\n    'different'];\nif (x);");
        bt("a = ['a','b','c']", "a = ['a', 'b', 'c']");
        bt("a = ['a',   'b','c']", "a = ['a', 'b', 'c']");
        bt("x = [{'a':0}]",
            "x = [{\n    'a': 0\n}]");
        bt('{a([[a1]], {b;});}',
            '{\n    a([[a1]], {\n        b;\n    });\n}');
        bt("a();\n   [\n   ['sdfsdfsd'],\n        ['sdfsdfsdf']\n   ].toString();",
            "a();\n   [\n   ['sdfsdfsd'],\n        ['sdfsdfsdf']\n   ].toString();");
        bt("a();\na = [\n   ['sdfsdfsd'],\n        ['sdfsdfsdf']\n   ].toString();",
            "a();\na = [\n   ['sdfsdfsd'],\n        ['sdfsdfsdf']\n   ].toString();");
        bt("function() {\n    Foo([\n        ['sdfsdfsd'],\n        ['sdfsdfsdf']\n    ]);\n}",
            "function() {\n    Foo([\n        ['sdfsdfsd'],\n        ['sdfsdfsdf']\n    ]);\n}");
        bt('function foo() {\n    return [\n        "one",\n        "two"\n    ];\n}');
        // 4 spaces per indent input, processed with 4-spaces per indent
        bt( "function foo() {\n" +
            "    return [\n" +
            "        {\n" +
            "            one: 'x',\n" +
            "            two: [\n" +
            "                {\n" +
            "                    id: 'a',\n" +
            "                    name: 'apple'\n" +
            "                }, {\n" +
            "                    id: 'b',\n" +
            "                    name: 'banana'\n" +
            "                }\n" +
            "            ]\n" +
            "        }\n" +
            "    ];\n" +
            "}");
        // 3 spaces per indent input, processed with 4-spaces per indent
        // Should be unchanged, but is not - #445
//         bt( "function foo() {\n" +
//             "   return [\n" +
//             "      {\n" +
//             "         one: 'x',\n" +
//             "         two: [\n" +
//             "            {\n" +
//             "               id: 'a',\n" +
//             "               name: 'apple'\n" +
//             "            }, {\n" +
//             "               id: 'b',\n" +
//             "               name: 'banana'\n" +
//             "            }\n" +
//             "         ]\n" +
//             "      }\n" +
//             "   ];\n" +
//             "}");


        reset_options();
        //============================================================
        bt('a = //comment\n    /regex/;');

        bt('if (a)\n{\nb;\n}\nelse\n{\nc;\n}', 'if (a) {\n    b;\n} else {\n    c;\n}');

        // tests for brace positioning
        beautify_brace_tests('expand');
        beautify_brace_tests('collapse');
        beautify_brace_tests('end-expand');
        beautify_brace_tests('none');

        test_fragment('roo = {\n    /*\n    ****\n      FOO\n    ****\n    */\n    BAR: 0\n};');

        bt('"foo""bar""baz"', '"foo"\n"bar"\n"baz"');
        bt("'foo''bar''baz'", "'foo'\n'bar'\n'baz'");


        test_fragment("if (zz) {\n    // ....\n}\n(function");

        bt("{\n    get foo() {}\n}");
        bt("{\n    var a = get\n    foo();\n}");
        bt("{\n    set foo() {}\n}");
        bt("{\n    var a = set\n    foo();\n}");
        bt("var x = {\n    get function()\n}");
        bt("var x = {\n    set function()\n}");

        // According to my current research get/set have no special meaning outside of an object literal
        bt("var x = set\n\na() {}", "var x = set\n\na() {}");
        bt("var x = set\n\nfunction() {}", "var x = set\n\nfunction() {}");

        bt('<!-- foo\nbar();\n-->');
        bt('<!-- dont crash'); // -->
        bt('for () /abc/.test()');
        bt('if (k) /aaa/m.test(v) && l();');
        bt('switch (true) {\n    case /swf/i.test(foo):\n        bar();\n}');
        bt('createdAt = {\n    type: Date,\n    default: Date.now\n}');
        bt('switch (createdAt) {\n    case a:\n        Date,\n    default:\n        Date.now\n}');

        reset_options();
        //============================================================
        opts.space_before_conditional = false;
        bt('if(a) b()');


        reset_options();
        //============================================================
        opts.preserve_newlines = true;
        bt('var a = 42; // foo\n\nvar b;');
        bt('var a = 42; // foo\n\n\nvar b;');
        bt("var a = 'foo' +\n    'bar';");
        bt("var a = \"foo\" +\n    \"bar\";");
        bt('this.oa = new OAuth(\n' +
           '    _requestToken,\n' +
           '    _accessToken,\n' +
           '    consumer_key\n' +
           ');');


        reset_options();
        //============================================================
        opts.unescape_strings = false;
        bt('"\\\\s"'); // == "\\s" in the js source
        bt("'\\\\s'"); // == '\\s' in the js source
        bt("'\\\\\\s'"); // == '\\\s' in the js source
        bt("'\\s'"); // == '\s' in the js source
        bt('"•"');
        bt('"—"');
        bt('"\\x41\\x42\\x43\\x01"', '"\\x41\\x42\\x43\\x01"');
        bt('"\\u2022"', '"\\u2022"');
        bt('a = /\s+/');
        // bt('a = /\\x41/','a = /A/');
        bt('"\\u2022";a = /\s+/;"\\x41\\x42\\x43\\x01".match(/\\x41/);','"\\u2022";\na = /\s+/;\n"\\x41\\x42\\x43\\x01".match(/\\x41/);');
        test_fragment('"\\x22\\x27",\'\\x22\\x27\',"\\x5c",\'\\x5c\',"\\xff and \\xzz","unicode \\u0000 \\u0022 \\u0027 \\u005c \\uffff \\uzzzz"', '"\\x22\\x27", \'\\x22\\x27\', "\\x5c", \'\\x5c\', "\\xff and \\xzz", "unicode \\u0000 \\u0022 \\u0027 \\u005c \\uffff \\uzzzz"');

        opts.unescape_strings = true;
        test_fragment('"\\x20\\x40\\x4a"', '" @J"');
        test_fragment('"\\xff\\x40\\x4a"');
        test_fragment('"\\u0072\\u016B\\u0137\\u012B\\u0074\\u0069\\u0073"', '"\u0072\u016B\u0137\u012B\u0074\u0069\u0073"');
        test_fragment('"Google Chrome est\\u00E1 actualizado."', '"Google Chrome está actualizado."');
        test_fragment('"\\x22\\x27",\'\\x22\\x27\',"\\x5c",\'\\x5c\',"\\xff and \\xzz","unicode \\u0000 \\u0022 \\u0027 \\u005c \\uffff"',
           '"\\"\\\'", \'\\"\\\'\', "\\\\", \'\\\\\', "\\xff and \\xzz", "unicode \\u0000 \\" \\\' \\\\ ' + unicode_char(0xffff) + '"');

        // For error case, return the string unchanged
        test_fragment('"\\x22\\x27",\'\\x22\\x27\',"\\x5c",\'\\x5c\',"\\xff and \\xzz","unicode \\u0000 \\u0022 \\u0027 \\u005c \\uffff \\uzzzz"',
            '"\\"\\\'", \'\\"\\\'\', "\\\\", \'\\\\\', "\\xff and \\xzz", "unicode \\u0000 \\u0022 \\u0027 \\u005c \\uffff \\uzzzz"');

        reset_options();
        //============================================================
        bt('return function();');
        bt('var a = function();');
        bt('var a = 5 + function();');

        bt('import foo.*;', 'import foo.*;'); // actionscript's import
        test_fragment('function f(a: a, b: b)'); // actionscript

        bt('{\n    foo // something\n    ,\n    bar // something\n    baz\n}');
        bt('function a(a) {} function b(b) {} function c(c) {}', 'function a(a) {}\n\nfunction b(b) {}\n\nfunction c(c) {}');
        bt('foo(a, function() {})');

        bt('foo(a, /regex/)');

        bt('/* foo */\n"x"');

        reset_options();
        //============================================================
        opts.break_chained_methods = false;
        opts.preserve_newlines = false;
        bt('foo\n.bar()\n.baz().cucumber(fat)', 'foo.bar().baz().cucumber(fat)');
        bt('foo\n.bar()\n.baz().cucumber(fat); foo.bar().baz().cucumber(fat)', 'foo.bar().baz().cucumber(fat);\nfoo.bar().baz().cucumber(fat)');
        bt('foo\n.bar()\n.baz().cucumber(fat)\n foo.bar().baz().cucumber(fat)', 'foo.bar().baz().cucumber(fat)\nfoo.bar().baz().cucumber(fat)');
        bt('this\n.something = foo.bar()\n.baz().cucumber(fat)', 'this.something = foo.bar().baz().cucumber(fat)');
        bt('this.something.xxx = foo.moo.bar()');
        bt('this\n.something\n.xxx = foo.moo\n.bar()', 'this.something.xxx = foo.moo.bar()');

        opts.break_chained_methods = false;
        opts.preserve_newlines = true;
        bt('foo\n.bar()\n.baz().cucumber(fat)', 'foo\n    .bar()\n    .baz().cucumber(fat)');
        bt('foo\n.bar()\n.baz().cucumber(fat); foo.bar().baz().cucumber(fat)', 'foo\n    .bar()\n    .baz().cucumber(fat);\nfoo.bar().baz().cucumber(fat)');
        bt('foo\n.bar()\n.baz().cucumber(fat)\n foo.bar().baz().cucumber(fat)', 'foo\n    .bar()\n    .baz().cucumber(fat)\nfoo.bar().baz().cucumber(fat)');
        bt('this\n.something = foo.bar()\n.baz().cucumber(fat)', 'this\n    .something = foo.bar()\n    .baz().cucumber(fat)');
        bt('this.something.xxx = foo.moo.bar()');
        bt('this\n.something\n.xxx = foo.moo\n.bar()', 'this\n    .something\n    .xxx = foo.moo\n    .bar()');

        opts.break_chained_methods = true;
        opts.preserve_newlines = false;
        bt('foo\n.bar()\n.baz().cucumber(fat)', 'foo.bar()\n    .baz()\n    .cucumber(fat)');
        bt('foo\n.bar()\n.baz().cucumber(fat); foo.bar().baz().cucumber(fat)', 'foo.bar()\n    .baz()\n    .cucumber(fat);\nfoo.bar()\n    .baz()\n    .cucumber(fat)');
        bt('foo\n.bar()\n.baz().cucumber(fat)\n foo.bar().baz().cucumber(fat)', 'foo.bar()\n    .baz()\n    .cucumber(fat)\nfoo.bar()\n    .baz()\n    .cucumber(fat)');
        bt('this\n.something = foo.bar()\n.baz().cucumber(fat)', 'this.something = foo.bar()\n    .baz()\n    .cucumber(fat)');
        bt('this.something.xxx = foo.moo.bar()');
        bt('this\n.something\n.xxx = foo.moo\n.bar()', 'this.something.xxx = foo.moo.bar()');

        opts.break_chained_methods = true;
        opts.preserve_newlines = true;
        bt('foo\n.bar()\n.baz().cucumber(fat)', 'foo\n    .bar()\n    .baz()\n    .cucumber(fat)');
        bt('foo\n.bar()\n.baz().cucumber(fat); foo.bar().baz().cucumber(fat)', 'foo\n    .bar()\n    .baz()\n    .cucumber(fat);\nfoo.bar()\n    .baz()\n    .cucumber(fat)');
        bt('foo\n.bar()\n.baz().cucumber(fat)\n foo.bar().baz().cucumber(fat)', 'foo\n    .bar()\n    .baz()\n    .cucumber(fat)\nfoo.bar()\n    .baz()\n    .cucumber(fat)');
        bt('this\n.something = foo.bar()\n.baz().cucumber(fat)', 'this\n    .something = foo.bar()\n    .baz()\n    .cucumber(fat)');
        bt('this.something.xxx = foo.moo.bar()');
        bt('this\n.something\n.xxx = foo.moo\n.bar()', 'this\n    .something\n    .xxx = foo.moo\n    .bar()');

        reset_options();
        //============================================================
        // Line wrap test intputs
        //.............---------1---------2---------3---------4---------5---------6---------7
        //.............1234567890123456789012345678901234567890123456789012345678901234567890
        wrap_input_1=('foo.bar().baz().cucumber((fat && "sassy") || (leans && mean));\n' +
                      'Test_very_long_variable_name_this_should_never_wrap\n.but_this_can\n' +
                      'return between_return_and_expression_should_never_wrap.but_this_can\n' +
                      'throw between_throw_and_expression_should_never_wrap.but_this_can\n' +
                      'if (wraps_can_occur && inside_an_if_block) that_is_\n.okay();\n' +
                      'object_literal = {\n' +
                      '    propertx: first_token + 12345678.99999E-6,\n' +
                      '    property: first_token_should_never_wrap + but_this_can,\n' +
                      '    propertz: first_token_should_never_wrap + !but_this_can,\n' +
                      '    proper: "first_token_should_never_wrap" + "but_this_can"\n' +
                      '}');

        //.............---------1---------2---------3---------4---------5---------6---------7
        //.............1234567890123456789012345678901234567890123456789012345678901234567890
        wrap_input_2=('{\n' +
                      '    foo.bar().baz().cucumber((fat && "sassy") || (leans && mean));\n' +
                      '    Test_very_long_variable_name_this_should_never_wrap\n.but_this_can\n' +
                      '    return between_return_and_expression_should_never_wrap.but_this_can\n' +
                      '    throw between_throw_and_expression_should_never_wrap.but_this_can\n' +
                      '    if (wraps_can_occur && inside_an_if_block) that_is_\n.okay();\n' +
                      '    object_literal = {\n' +
                      '        propertx: first_token + 12345678.99999E-6,\n' +
                      '        property: first_token_should_never_wrap + but_this_can,\n' +
                      '        propertz: first_token_should_never_wrap + !but_this_can,\n' +
                      '        proper: "first_token_should_never_wrap" + "but_this_can"\n' +
                      '    }' +
                      '}');

        opts.preserve_newlines = false;
        opts.wrap_line_length = 0;
        //.............---------1---------2---------3---------4---------5---------6---------7
        //.............1234567890123456789012345678901234567890123456789012345678901234567890
        test_fragment(wrap_input_1,
                      /* expected */
                      'foo.bar().baz().cucumber((fat && "sassy") || (leans && mean));\n' +
                      'Test_very_long_variable_name_this_should_never_wrap.but_this_can\n' +
                      'return between_return_and_expression_should_never_wrap.but_this_can\n' +
                      'throw between_throw_and_expression_should_never_wrap.but_this_can\n' +
                      'if (wraps_can_occur && inside_an_if_block) that_is_.okay();\n' +
                      'object_literal = {\n' +
                      '    propertx: first_token + 12345678.99999E-6,\n' +
                      '    property: first_token_should_never_wrap + but_this_can,\n' +
                      '    propertz: first_token_should_never_wrap + !but_this_can,\n' +
                      '    proper: "first_token_should_never_wrap" + "but_this_can"\n' +
                      '}');

        opts.wrap_line_length = 70;
        //.............---------1---------2---------3---------4---------5---------6---------7
        //.............1234567890123456789012345678901234567890123456789012345678901234567890
        test_fragment(wrap_input_1,
                      /* expected */
                      'foo.bar().baz().cucumber((fat && "sassy") || (leans && mean));\n' +
                      'Test_very_long_variable_name_this_should_never_wrap.but_this_can\n' +
                      'return between_return_and_expression_should_never_wrap.but_this_can\n' +
                      'throw between_throw_and_expression_should_never_wrap.but_this_can\n' +
                      'if (wraps_can_occur && inside_an_if_block) that_is_.okay();\n' +
                      'object_literal = {\n' +
                      '    propertx: first_token + 12345678.99999E-6,\n' +
                      '    property: first_token_should_never_wrap + but_this_can,\n' +
                      '    propertz: first_token_should_never_wrap + !but_this_can,\n' +
                      '    proper: "first_token_should_never_wrap" + "but_this_can"\n' +
                      '}');

        opts.wrap_line_length = 40;
        //.............---------1---------2---------3---------4---------5---------6---------7
        //.............1234567890123456789012345678901234567890123456789012345678901234567890
        test_fragment(wrap_input_1,
                      /* expected */
                      'foo.bar().baz().cucumber((fat &&\n' +
                      '    "sassy") || (leans && mean));\n' +
                      'Test_very_long_variable_name_this_should_never_wrap\n' +
                      '    .but_this_can\n' +
                      'return between_return_and_expression_should_never_wrap\n' +
                      '    .but_this_can\n' +
                      'throw between_throw_and_expression_should_never_wrap\n' +
                      '    .but_this_can\n' +
                      'if (wraps_can_occur &&\n' +
                      '    inside_an_if_block) that_is_.okay();\n' +
                      'object_literal = {\n' +
                      '    propertx: first_token +\n' +
                      '        12345678.99999E-6,\n' +
                      '    property: first_token_should_never_wrap +\n' +
                      '        but_this_can,\n' +
                      '    propertz: first_token_should_never_wrap +\n' +
                      '        !but_this_can,\n' +
                      '    proper: "first_token_should_never_wrap" +\n' +
                      '        "but_this_can"\n' +
                      '}');

        opts.wrap_line_length = 41;
        // NOTE: wrap is only best effort - line continues until next wrap point is found.
        //.............---------1---------2---------3---------4---------5---------6---------7
        //.............1234567890123456789012345678901234567890123456789012345678901234567890
        test_fragment(wrap_input_1,
                      /* expected */
                      'foo.bar().baz().cucumber((fat && "sassy") ||\n' +
                      '    (leans && mean));\n' +
                      'Test_very_long_variable_name_this_should_never_wrap\n' +
                      '    .but_this_can\n' +
                      'return between_return_and_expression_should_never_wrap\n' +
                      '    .but_this_can\n' +
                      'throw between_throw_and_expression_should_never_wrap\n' +
                      '    .but_this_can\n' +
                      'if (wraps_can_occur &&\n' +
                      '    inside_an_if_block) that_is_.okay();\n' +
                      'object_literal = {\n' +
                      '    propertx: first_token +\n' +
                      '        12345678.99999E-6,\n' +
                      '    property: first_token_should_never_wrap +\n' +
                      '        but_this_can,\n' +
                      '    propertz: first_token_should_never_wrap +\n' +
                      '        !but_this_can,\n' +
                      '    proper: "first_token_should_never_wrap" +\n' +
                      '        "but_this_can"\n' +
                      '}');

        opts.wrap_line_length = 45;
        // NOTE: wrap is only best effort - line continues until next wrap point is found.
        //.............---------1---------2---------3---------4---------5---------6---------7
        //.............1234567890123456789012345678901234567890123456789012345678901234567890
        test_fragment(wrap_input_2,
                      /* expected */
                      '{\n' +
                      '    foo.bar().baz().cucumber((fat && "sassy") ||\n' +
                      '        (leans && mean));\n' +
                      '    Test_very_long_variable_name_this_should_never_wrap\n' +
                      '        .but_this_can\n' +
                      '    return between_return_and_expression_should_never_wrap\n' +
                      '        .but_this_can\n' +
                      '    throw between_throw_and_expression_should_never_wrap\n' +
                      '        .but_this_can\n' +
                      '    if (wraps_can_occur &&\n' +
                      '        inside_an_if_block) that_is_.okay();\n' +
                      '    object_literal = {\n' +
                      '        propertx: first_token +\n' +
                      '            12345678.99999E-6,\n' +
                      '        property: first_token_should_never_wrap +\n' +
                      '            but_this_can,\n' +
                      '        propertz: first_token_should_never_wrap +\n' +
                      '            !but_this_can,\n' +
                      '        proper: "first_token_should_never_wrap" +\n' +
                      '            "but_this_can"\n' +
                      '    }\n'+
                      '}');

        opts.preserve_newlines = true;
        opts.wrap_line_length = 0;
        //.............---------1---------2---------3---------4---------5---------6---------7
        //.............1234567890123456789012345678901234567890123456789012345678901234567890
        test_fragment(wrap_input_1,
                      /* expected */
                      'foo.bar().baz().cucumber((fat && "sassy") || (leans && mean));\n' +
                      'Test_very_long_variable_name_this_should_never_wrap\n' +
                      '    .but_this_can\n' +
                      'return between_return_and_expression_should_never_wrap.but_this_can\n' +
                      'throw between_throw_and_expression_should_never_wrap.but_this_can\n' +
                      'if (wraps_can_occur && inside_an_if_block) that_is_\n' +
                      '    .okay();\n' +
                      'object_literal = {\n' +
                      '    propertx: first_token + 12345678.99999E-6,\n' +
                      '    property: first_token_should_never_wrap + but_this_can,\n' +
                      '    propertz: first_token_should_never_wrap + !but_this_can,\n' +
                      '    proper: "first_token_should_never_wrap" + "but_this_can"\n' +
                      '}');

        opts.wrap_line_length = 70;
        //.............---------1---------2---------3---------4---------5---------6---------7
        //.............1234567890123456789012345678901234567890123456789012345678901234567890
        test_fragment(wrap_input_1,
                      /* expected */
                      'foo.bar().baz().cucumber((fat && "sassy") || (leans && mean));\n' +
                      'Test_very_long_variable_name_this_should_never_wrap\n' +
                      '    .but_this_can\n' +
                      'return between_return_and_expression_should_never_wrap.but_this_can\n' +
                      'throw between_throw_and_expression_should_never_wrap.but_this_can\n' +
                      'if (wraps_can_occur && inside_an_if_block) that_is_\n' +
                      '    .okay();\n' +
                      'object_literal = {\n' +
                      '    propertx: first_token + 12345678.99999E-6,\n' +
                      '    property: first_token_should_never_wrap + but_this_can,\n' +
                      '    propertz: first_token_should_never_wrap + !but_this_can,\n' +
                      '    proper: "first_token_should_never_wrap" + "but_this_can"\n' +
                      '}');


        opts.wrap_line_length = 40;
        //.............---------1---------2---------3---------4---------5---------6---------7
        //.............1234567890123456789012345678901234567890123456789012345678901234567890
        test_fragment(wrap_input_1,
                      /* expected */
                      'foo.bar().baz().cucumber((fat &&\n' +
                      '    "sassy") || (leans && mean));\n' +
                      'Test_very_long_variable_name_this_should_never_wrap\n' +
                      '    .but_this_can\n' +
                      'return between_return_and_expression_should_never_wrap\n' +
                      '    .but_this_can\n' +
                      'throw between_throw_and_expression_should_never_wrap\n' +
                      '    .but_this_can\n' +
                      'if (wraps_can_occur &&\n' +
                      '    inside_an_if_block) that_is_\n' +
                      '    .okay();\n' +
                      'object_literal = {\n' +
                      '    propertx: first_token +\n' +
                      '        12345678.99999E-6,\n' +
                      '    property: first_token_should_never_wrap +\n' +
                      '        but_this_can,\n' +
                      '    propertz: first_token_should_never_wrap +\n' +
                      '        !but_this_can,\n' +
                      '    proper: "first_token_should_never_wrap" +\n' +
                      '        "but_this_can"\n' +
                      '}');

        opts.wrap_line_length = 41;
        // NOTE: wrap is only best effort - line continues until next wrap point is found.
        //.............---------1---------2---------3---------4---------5---------6---------7
        //.............1234567890123456789012345678901234567890123456789012345678901234567890
        test_fragment(wrap_input_1,
                      /* expected */
                      'foo.bar().baz().cucumber((fat && "sassy") ||\n' +
                      '    (leans && mean));\n' +
                      'Test_very_long_variable_name_this_should_never_wrap\n' +
                      '    .but_this_can\n' +
                      'return between_return_and_expression_should_never_wrap\n' +
                      '    .but_this_can\n' +
                      'throw between_throw_and_expression_should_never_wrap\n' +
                      '    .but_this_can\n' +
                      'if (wraps_can_occur &&\n' +
                      '    inside_an_if_block) that_is_\n' +
                      '    .okay();\n' +
                      'object_literal = {\n' +
                      '    propertx: first_token +\n' +
                      '        12345678.99999E-6,\n' +
                      '    property: first_token_should_never_wrap +\n' +
                      '        but_this_can,\n' +
                      '    propertz: first_token_should_never_wrap +\n' +
                      '        !but_this_can,\n' +
                      '    proper: "first_token_should_never_wrap" +\n' +
                      '        "but_this_can"\n' +
                      '}');

        opts.wrap_line_length = 45;
        // NOTE: wrap is only best effort - line continues until next wrap point is found.
        //.............---------1---------2---------3---------4---------5---------6---------7
        //.............1234567890123456789012345678901234567890123456789012345678901234567890
        test_fragment(wrap_input_2,
                      /* expected */
                      '{\n' +
                      '    foo.bar().baz().cucumber((fat && "sassy") ||\n' +
                      '        (leans && mean));\n' +
                      '    Test_very_long_variable_name_this_should_never_wrap\n' +
                      '        .but_this_can\n' +
                      '    return between_return_and_expression_should_never_wrap\n' +
                      '        .but_this_can\n' +
                      '    throw between_throw_and_expression_should_never_wrap\n' +
                      '        .but_this_can\n' +
                      '    if (wraps_can_occur &&\n' +
                      '        inside_an_if_block) that_is_\n' +
                      '        .okay();\n' +
                      '    object_literal = {\n' +
                      '        propertx: first_token +\n' +
                      '            12345678.99999E-6,\n' +
                      '        property: first_token_should_never_wrap +\n' +
                      '            but_this_can,\n' +
                      '        propertz: first_token_should_never_wrap +\n' +
                      '            !but_this_can,\n' +
                      '        proper: "first_token_should_never_wrap" +\n' +
                      '            "but_this_can"\n' +
                      '    }\n'+
                      '}');

        reset_options();
        //============================================================
        opts.preserve_newlines = false;
        bt('if (foo) // comment\n    bar();');
        bt('if (foo) // comment\n    (bar());');
        bt('if (foo) // comment\n    (bar());');
        bt('if (foo) // comment\n    /asdf/;');
        bt('this.oa = new OAuth(\n' +
           '    _requestToken,\n' +
           '    _accessToken,\n' +
           '    consumer_key\n' +
           ');',
           'this.oa = new OAuth(_requestToken, _accessToken, consumer_key);');
        bt('foo = {\n    x: y, // #44\n    w: z // #44\n}');
        bt('switch (x) {\n    case "a":\n        // comment on newline\n        break;\n    case "b": // comment on same line\n        break;\n}');
        bt('this.type =\n    this.options =\n    // comment\n    this.enabled null;',
           'this.type = this.options =\n    // comment\n    this.enabled null;');
        bt('someObj\n    .someFunc1()\n    // This comment should not break the indent\n    .someFunc2();',
           'someObj.someFunc1()\n    // This comment should not break the indent\n    .someFunc2();');

        bt('if (true ||\n!true) return;', 'if (true || !true) return;');

        // these aren't ready yet.
        //bt('if (foo) // comment\n    bar() /*i*/ + baz() /*j\n*/ + asdf();');
        bt('if\n(foo)\nif\n(bar)\nif\n(baz)\nwhee();\na();',
            'if (foo)\n    if (bar)\n        if (baz) whee();\na();');
        bt('if\n(foo)\nif\n(bar)\nif\n(baz)\nwhee();\nelse\na();',
            'if (foo)\n    if (bar)\n        if (baz) whee();\n        else a();');
        bt('if (foo)\nbar();\nelse\ncar();',
            'if (foo) bar();\nelse car();');

        bt('if (foo) if (bar) if (baz);\na();',
            'if (foo)\n    if (bar)\n        if (baz);\na();');
        bt('if (foo) if (bar) if (baz) whee();\na();',
            'if (foo)\n    if (bar)\n        if (baz) whee();\na();');
        bt('if (foo) a()\nif (bar) if (baz) whee();\na();',
            'if (foo) a()\nif (bar)\n    if (baz) whee();\na();');
        bt('if (foo);\nif (bar) if (baz) whee();\na();',
            'if (foo);\nif (bar)\n    if (baz) whee();\na();');
        bt('if (options)\n' +
           '    for (var p in options)\n' +
           '        this[p] = options[p];',
           'if (options)\n'+
           '    for (var p in options) this[p] = options[p];');
        bt('if (options) for (var p in options) this[p] = options[p];',
           'if (options)\n    for (var p in options) this[p] = options[p];');

        bt('if (options) do q(); while (b());',
           'if (options)\n    do q(); while (b());');
        bt('if (options) while (b()) q();',
           'if (options)\n    while (b()) q();');
        bt('if (options) do while (b()) q(); while (a());',
           'if (options)\n    do\n        while (b()) q(); while (a());');

        bt('function f(a, b, c,\nd, e) {}',
            'function f(a, b, c, d, e) {}');

        bt('function f(a,b) {if(a) b()}function g(a,b) {if(!a) b()}',
            'function f(a, b) {\n    if (a) b()\n}\n\nfunction g(a, b) {\n    if (!a) b()\n}');
        bt('function f(a,b) {if(a) b()}\n\n\n\nfunction g(a,b) {if(!a) b()}',
            'function f(a, b) {\n    if (a) b()\n}\n\nfunction g(a, b) {\n    if (!a) b()\n}');

        // This is not valid syntax, but still want to behave reasonably and not side-effect
        bt('(if(a) b())(if(a) b())',
            '(\n    if (a) b())(\n    if (a) b())');
        bt('(if(a) b())\n\n\n(if(a) b())',
            '(\n    if (a) b())\n(\n    if (a) b())');



        bt("if\n(a)\nb();", "if (a) b();");
        bt('var a =\nfoo', 'var a = foo');
        bt('var a = {\n"a":1,\n"b":2}', "var a = {\n    \"a\": 1,\n    \"b\": 2\n}");
        bt("var a = {\n'a':1,\n'b':2}", "var a = {\n    'a': 1,\n    'b': 2\n}");
        bt('var a = /*i*/ "b";');
        bt('var a = /*i*/\n"b";', 'var a = /*i*/ "b";');
        bt('var a = /*i*/\nb;', 'var a = /*i*/ b;');
        bt('{\n\n\n"x"\n}', '{\n    "x"\n}');
        bt('if(a &&\nb\n||\nc\n||d\n&&\ne) e = f', 'if (a && b || c || d && e) e = f');
        bt('if(a &&\n(b\n||\nc\n||d)\n&&\ne) e = f', 'if (a && (b || c || d) && e) e = f');
        test_fragment('\n\n"x"', '"x"');
        bt('a = 1;\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nb = 2;',
                'a = 1;\nb = 2;');

        opts.preserve_newlines = true;
        bt('if (foo) // comment\n    bar();');
        bt('if (foo) // comment\n    (bar());');
        bt('if (foo) // comment\n    (bar());');
        bt('if (foo) // comment\n    /asdf/;');
        bt('foo = {\n    x: y, // #44\n    w: z // #44\n}');
        bt('switch (x) {\n    case "a":\n        // comment on newline\n        break;\n    case "b": // comment on same line\n        break;\n}');
        bt('this.type =\n    this.options =\n    // comment\n    this.enabled null;');
        bt('someObj\n    .someFunc1()\n    // This comment should not break the indent\n    .someFunc2();');

        bt('if (true ||\n!true) return;', 'if (true ||\n    !true) return;');

        // these aren't ready yet.
        // bt('if (foo) // comment\n    bar() /*i*/ + baz() /*j\n*/ + asdf();');
        bt('if\n(foo)\nif\n(bar)\nif\n(baz)\nwhee();\na();',
            'if (foo)\n    if (bar)\n        if (baz)\n            whee();\na();');
        bt('if\n(foo)\nif\n(bar)\nif\n(baz)\nwhee();\nelse\na();',
            'if (foo)\n    if (bar)\n        if (baz)\n            whee();\n        else\n            a();');
        bt('if (foo)\nbar();\nelse\ncar();',
            'if (foo)\n    bar();\nelse\n    car();');
        bt('if (foo) bar();\nelse\ncar();',
            'if (foo) bar();\nelse\n    car();');

        bt('if (foo) if (bar) if (baz);\na();',
            'if (foo)\n    if (bar)\n        if (baz);\na();');
        bt('if (foo) if (bar) if (baz) whee();\na();',
            'if (foo)\n    if (bar)\n        if (baz) whee();\na();');
        bt('if (foo) a()\nif (bar) if (baz) whee();\na();',
            'if (foo) a()\nif (bar)\n    if (baz) whee();\na();');
        bt('if (foo);\nif (bar) if (baz) whee();\na();',
            'if (foo);\nif (bar)\n    if (baz) whee();\na();');
        bt('if (options)\n' +
           '    for (var p in options)\n' +
           '        this[p] = options[p];');
        bt('if (options) for (var p in options) this[p] = options[p];',
           'if (options)\n    for (var p in options) this[p] = options[p];');

        bt('if (options) do q(); while (b());',
           'if (options)\n    do q(); while (b());');
        bt('if (options) do; while (b());',
           'if (options)\n    do; while (b());');
        bt('if (options) while (b()) q();',
           'if (options)\n    while (b()) q();');
        bt('if (options) do while (b()) q(); while (a());',
           'if (options)\n    do\n        while (b()) q(); while (a());');

        bt('function f(a, b, c,\nd, e) {}',
            'function f(a, b, c,\n    d, e) {}');

        bt('function f(a,b) {if(a) b()}function g(a,b) {if(!a) b()}',
            'function f(a, b) {\n    if (a) b()\n}\n\nfunction g(a, b) {\n    if (!a) b()\n}');
        bt('function f(a,b) {if(a) b()}\n\n\n\nfunction g(a,b) {if(!a) b()}',
            'function f(a, b) {\n    if (a) b()\n}\n\n\n\nfunction g(a, b) {\n    if (!a) b()\n}');
        // This is not valid syntax, but still want to behave reasonably and not side-effect
        bt('(if(a) b())(if(a) b())',
            '(\n    if (a) b())(\n    if (a) b())');
        bt('(if(a) b())\n\n\n(if(a) b())',
            '(\n    if (a) b())\n\n\n(\n    if (a) b())');

        // space between functions
        bt('/*\n * foo\n */\nfunction foo() {}');
        bt('// a nice function\nfunction foo() {}');
        bt('function foo() {}\nfunction foo() {}',
            'function foo() {}\n\nfunction foo() {}'
        );

        bt('[\n    function() {}\n]');



        bt("if\n(a)\nb();", "if (a)\n    b();");
        bt('var a =\nfoo', 'var a =\n    foo');
        bt('var a = {\n"a":1,\n"b":2}', "var a = {\n    \"a\": 1,\n    \"b\": 2\n}");
        bt("var a = {\n'a':1,\n'b':2}", "var a = {\n    'a': 1,\n    'b': 2\n}");
        bt('var a = /*i*/ "b";');
        bt('var a = /*i*/\n"b";', 'var a = /*i*/\n    "b";');
        bt('var a = /*i*/\nb;', 'var a = /*i*/\n    b;');
        bt('{\n\n\n"x"\n}', '{\n\n\n    "x"\n}');
        bt('if(a &&\nb\n||\nc\n||d\n&&\ne) e = f', 'if (a &&\n    b ||\n    c ||\n    d &&\n    e) e = f');
        bt('if(a &&\n(b\n||\nc\n||d)\n&&\ne) e = f', 'if (a &&\n    (b ||\n        c ||\n        d) &&\n    e) e = f');
        test_fragment('\n\n"x"', '"x"');

        // this beavior differs between js and python, defaults to unlimited in js, 10 in python
        bt('a = 1;\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nb = 2;',
            'a = 1;\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nb = 2;');
        opts.max_preserve_newlines = 8;
        bt('a = 1;\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nb = 2;',
            'a = 1;\n\n\n\n\n\n\n\nb = 2;');

        reset_options();
        //============================================================


        Urlencoded.run_tests(sanitytest);
    }

    beautifier_tests();
    beautifier_unconverted_tests();
}

if (typeof exports !== "undefined") {
    exports.run_javascript_tests = run_javascript_tests;
}
