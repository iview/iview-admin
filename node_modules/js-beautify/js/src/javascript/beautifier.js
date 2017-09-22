/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

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

var mergeOpts = require('core/options').mergeOpts;
var acorn = require('core/acorn');
var Output = require('core/output').Output;
var Tokenizer = require('./tokenizer').Tokenizer;

function remove_redundant_indentation(output, frame) {
    // This implementation is effective but has some issues:
    //     - can cause line wrap to happen too soon due to indent removal
    //           after wrap points are calculated
    // These issues are minor compared to ugly indentation.

    if (frame.multiline_frame ||
        frame.mode === MODE.ForInitializer ||
        frame.mode === MODE.Conditional) {
        return;
    }

    // remove one indent from each line inside this section
    var start_index = frame.start_line_index;

    output.remove_indent(start_index);
}

function in_array(what, arr) {
    for (var i = 0; i < arr.length; i += 1) {
        if (arr[i] === what) {
            return true;
        }
    }
    return false;
}

function trim(s) {
    return s.replace(/^\s+|\s+$/g, '');
}

function ltrim(s) {
    return s.replace(/^\s+/g, '');
}

// function rtrim(s) {
//     return s.replace(/\s+$/g, '');
// }


function generateMapFromStrings(list) {
    var result = {};
    for (var x = 0; x < list.length; x++) {
        // make the mapped names underscored instead of dash
        result[list[x].replace(/-/g, '_')] = list[x];
    }
    return result;
}

function sanitizeOperatorPosition(opPosition) {
    opPosition = opPosition || OPERATOR_POSITION.before_newline;

    if (!in_array(opPosition, validPositionValues)) {
        throw new Error("Invalid Option Value: The option 'operator_position' must be one of the following values\n" +
            validPositionValues +
            "\nYou passed in: '" + opPosition + "'");
    }

    return opPosition;
}

var validPositionValues = ['before-newline', 'after-newline', 'preserve-newline'];

// Generate map from array
var OPERATOR_POSITION = generateMapFromStrings(validPositionValues);

var OPERATOR_POSITION_BEFORE_OR_PRESERVE = [OPERATOR_POSITION.before_newline, OPERATOR_POSITION.preserve_newline];

var MODE = {
    BlockStatement: 'BlockStatement', // 'BLOCK'
    Statement: 'Statement', // 'STATEMENT'
    ObjectLiteral: 'ObjectLiteral', // 'OBJECT',
    ArrayLiteral: 'ArrayLiteral', //'[EXPRESSION]',
    ForInitializer: 'ForInitializer', //'(FOR-EXPRESSION)',
    Conditional: 'Conditional', //'(COND-EXPRESSION)',
    Expression: 'Expression' //'(EXPRESSION)'
};

function Beautifier(js_source_text, options) {
    "use strict";
    var output;
    var tokens = [],
        token_pos;
    var tokenizer;
    var current_token;
    var last_type, last_last_text, indent_string;
    var flags, previous_flags, flag_store;
    var prefix;

    var handlers, opt;
    var baseIndentString = '';

    handlers = {
        'TK_START_EXPR': handle_start_expr,
        'TK_END_EXPR': handle_end_expr,
        'TK_START_BLOCK': handle_start_block,
        'TK_END_BLOCK': handle_end_block,
        'TK_WORD': handle_word,
        'TK_RESERVED': handle_word,
        'TK_SEMICOLON': handle_semicolon,
        'TK_STRING': handle_string,
        'TK_EQUALS': handle_equals,
        'TK_OPERATOR': handle_operator,
        'TK_COMMA': handle_comma,
        'TK_BLOCK_COMMENT': handle_block_comment,
        'TK_COMMENT': handle_comment,
        'TK_DOT': handle_dot,
        'TK_UNKNOWN': handle_unknown,
        'TK_EOF': handle_eof
    };

    function create_flags(flags_base, mode) {
        var next_indent_level = 0;
        if (flags_base) {
            next_indent_level = flags_base.indentation_level;
            if (!output.just_added_newline() &&
                flags_base.line_indent_level > next_indent_level) {
                next_indent_level = flags_base.line_indent_level;
            }
        }

        var next_flags = {
            mode: mode,
            parent: flags_base,
            last_text: flags_base ? flags_base.last_text : '', // last token text
            last_word: flags_base ? flags_base.last_word : '', // last 'TK_WORD' passed
            declaration_statement: false,
            declaration_assignment: false,
            multiline_frame: false,
            inline_frame: false,
            if_block: false,
            else_block: false,
            do_block: false,
            do_while: false,
            import_block: false,
            in_case_statement: false, // switch(..){ INSIDE HERE }
            in_case: false, // we're on the exact line with "case 0:"
            case_body: false, // the indented case-action block
            indentation_level: next_indent_level,
            line_indent_level: flags_base ? flags_base.line_indent_level : next_indent_level,
            start_line_index: output.get_line_number(),
            ternary_depth: 0
        };
        return next_flags;
    }

    // Some interpreters have unexpected results with foo = baz || bar;
    options = options ? options : {};

    // Allow the setting of language/file-type specific options
    // with inheritance of overall settings
    options = mergeOpts(options, 'js');

    opt = {};

    // compatibility, re
    if (options.brace_style === "expand-strict") { //graceful handling of deprecated option
        options.brace_style = "expand";
    } else if (options.brace_style === "collapse-preserve-inline") { //graceful handling of deprecated option
        options.brace_style = "collapse,preserve-inline";
    } else if (options.braces_on_own_line !== undefined) { //graceful handling of deprecated option
        options.brace_style = options.braces_on_own_line ? "expand" : "collapse";
    } else if (!options.brace_style) //Nothing exists to set it
    {
        options.brace_style = "collapse";
    }


    var brace_style_split = options.brace_style.split(/[^a-zA-Z0-9_\-]+/);
    opt.brace_style = brace_style_split[0];
    opt.brace_preserve_inline = brace_style_split[1] ? brace_style_split[1] : false;

    opt.indent_size = options.indent_size ? parseInt(options.indent_size, 10) : 4;
    opt.indent_char = options.indent_char ? options.indent_char : ' ';
    opt.eol = options.eol ? options.eol : 'auto';
    opt.preserve_newlines = (options.preserve_newlines === undefined) ? true : options.preserve_newlines;
    opt.unindent_chained_methods = (options.unindent_chained_methods === undefined) ? false : options.unindent_chained_methods;
    opt.break_chained_methods = (options.break_chained_methods === undefined) ? false : options.break_chained_methods;
    opt.max_preserve_newlines = (options.max_preserve_newlines === undefined) ? 0 : parseInt(options.max_preserve_newlines, 10);
    opt.space_in_paren = (options.space_in_paren === undefined) ? false : options.space_in_paren;
    opt.space_in_empty_paren = (options.space_in_empty_paren === undefined) ? false : options.space_in_empty_paren;
    opt.jslint_happy = (options.jslint_happy === undefined) ? false : options.jslint_happy;
    opt.space_after_anon_function = (options.space_after_anon_function === undefined) ? false : options.space_after_anon_function;
    opt.keep_array_indentation = (options.keep_array_indentation === undefined) ? false : options.keep_array_indentation;
    opt.space_before_conditional = (options.space_before_conditional === undefined) ? true : options.space_before_conditional;
    opt.unescape_strings = (options.unescape_strings === undefined) ? false : options.unescape_strings;
    opt.wrap_line_length = (options.wrap_line_length === undefined) ? 0 : parseInt(options.wrap_line_length, 10);
    opt.e4x = (options.e4x === undefined) ? false : options.e4x;
    opt.end_with_newline = (options.end_with_newline === undefined) ? false : options.end_with_newline;
    opt.comma_first = (options.comma_first === undefined) ? false : options.comma_first;
    opt.operator_position = sanitizeOperatorPosition(options.operator_position);

    // For testing of beautify ignore:start directive
    opt.test_output_raw = (options.test_output_raw === undefined) ? false : options.test_output_raw;

    // force opt.space_after_anon_function to true if opt.jslint_happy
    if (opt.jslint_happy) {
        opt.space_after_anon_function = true;
    }

    if (options.indent_with_tabs) {
        opt.indent_char = '\t';
        opt.indent_size = 1;
    }

    if (opt.eol === 'auto') {
        opt.eol = '\n';
        if (js_source_text && acorn.lineBreak.test(js_source_text || '')) {
            opt.eol = js_source_text.match(acorn.lineBreak)[0];
        }
    }

    opt.eol = opt.eol.replace(/\\r/, '\r').replace(/\\n/, '\n');

    //----------------------------------
    indent_string = '';
    while (opt.indent_size > 0) {
        indent_string += opt.indent_char;
        opt.indent_size -= 1;
    }

    var preindent_index = 0;
    if (js_source_text && js_source_text.length) {
        while ((js_source_text.charAt(preindent_index) === ' ' ||
                js_source_text.charAt(preindent_index) === '\t')) {
            preindent_index += 1;
        }
        baseIndentString = js_source_text.substring(0, preindent_index);
        js_source_text = js_source_text.substring(preindent_index);
    }

    last_type = 'TK_START_BLOCK'; // last token type
    last_last_text = ''; // pre-last token text
    output = new Output(indent_string, baseIndentString);

    // If testing the ignore directive, start with output disable set to true
    output.raw = opt.test_output_raw;


    // Stack of parsing/formatting states, including MODE.
    // We tokenize, parse, and output in an almost purely a forward-only stream of token input
    // and formatted output.  This makes the beautifier less accurate than full parsers
    // but also far more tolerant of syntax errors.
    //
    // For example, the default mode is MODE.BlockStatement. If we see a '{' we push a new frame of type
    // MODE.BlockStatement on the the stack, even though it could be object literal.  If we later
    // encounter a ":", we'll switch to to MODE.ObjectLiteral.  If we then see a ";",
    // most full parsers would die, but the beautifier gracefully falls back to
    // MODE.BlockStatement and continues on.
    flag_store = [];
    set_mode(MODE.BlockStatement);

    this.beautify = function() {

        /*jshint onevar:true */
        var sweet_code;
        tokenizer = new Tokenizer(js_source_text, opt, indent_string);
        tokens = tokenizer.tokenize();
        token_pos = 0;

        current_token = get_token();
        while (current_token) {
            handlers[current_token.type]();

            last_last_text = flags.last_text;
            last_type = current_token.type;
            flags.last_text = current_token.text;

            token_pos += 1;
            current_token = get_token();
        }

        sweet_code = output.get_code(opt.end_with_newline, opt.eol);

        return sweet_code;
    };

    function handle_whitespace_and_comments(local_token, preserve_statement_flags) {
        var newlines = local_token.newlines;
        var keep_whitespace = opt.keep_array_indentation && is_array(flags.mode);
        var temp_token = current_token;

        for (var h = 0; h < local_token.comments_before.length; h++) {
            // The cleanest handling of inline comments is to treat them as though they aren't there.
            // Just continue formatting and the behavior should be logical.
            // Also ignore unknown tokens.  Again, this should result in better behavior.
            current_token = local_token.comments_before[h];
            handle_whitespace_and_comments(current_token, preserve_statement_flags);
            handlers[current_token.type](preserve_statement_flags);
        }
        current_token = temp_token;

        if (keep_whitespace) {
            for (var i = 0; i < newlines; i += 1) {
                print_newline(i > 0, preserve_statement_flags);
            }
        } else {
            if (opt.max_preserve_newlines && newlines > opt.max_preserve_newlines) {
                newlines = opt.max_preserve_newlines;
            }

            if (opt.preserve_newlines) {
                if (local_token.newlines > 1) {
                    print_newline(false, preserve_statement_flags);
                    for (var j = 1; j < newlines; j += 1) {
                        print_newline(true, preserve_statement_flags);
                    }
                }
            }
        }

    }

    // we could use just string.split, but
    // IE doesn't like returning empty strings
    function split_linebreaks(s) {
        //return s.split(/\x0d\x0a|\x0a/);

        s = s.replace(acorn.allLineBreaks, '\n');
        var out = [],
            idx = s.indexOf("\n");
        while (idx !== -1) {
            out.push(s.substring(0, idx));
            s = s.substring(idx + 1);
            idx = s.indexOf("\n");
        }
        if (s.length) {
            out.push(s);
        }
        return out;
    }

    var newline_restricted_tokens = ['break', 'continue', 'return', 'throw', 'yield'];

    function allow_wrap_or_preserved_newline(force_linewrap) {
        force_linewrap = (force_linewrap === undefined) ? false : force_linewrap;

        // Never wrap the first token on a line
        if (output.just_added_newline()) {
            return;
        }

        var shouldPreserveOrForce = (opt.preserve_newlines && current_token.wanted_newline) || force_linewrap;
        var operatorLogicApplies = in_array(flags.last_text, tokenizer.positionable_operators) || in_array(current_token.text, tokenizer.positionable_operators);

        if (operatorLogicApplies) {
            var shouldPrintOperatorNewline = (
                    in_array(flags.last_text, tokenizer.positionable_operators) &&
                    in_array(opt.operator_position, OPERATOR_POSITION_BEFORE_OR_PRESERVE)
                ) ||
                in_array(current_token.text, tokenizer.positionable_operators);
            shouldPreserveOrForce = shouldPreserveOrForce && shouldPrintOperatorNewline;
        }

        if (shouldPreserveOrForce) {
            print_newline(false, true);
        } else if (opt.wrap_line_length) {
            if (last_type === 'TK_RESERVED' && in_array(flags.last_text, newline_restricted_tokens)) {
                // These tokens should never have a newline inserted
                // between them and the following expression.
                return;
            }
            var proposed_line_length = output.current_line.get_character_count() + current_token.text.length +
                (output.space_before_token ? 1 : 0);
            if (proposed_line_length >= opt.wrap_line_length) {
                print_newline(false, true);
            }
        }
    }

    function print_newline(force_newline, preserve_statement_flags) {
        if (!preserve_statement_flags) {
            if (flags.last_text !== ';' && flags.last_text !== ',' && flags.last_text !== '=' && last_type !== 'TK_OPERATOR') {
                var next_token = get_token(1);
                while (flags.mode === MODE.Statement &&
                    !(flags.if_block && next_token && next_token.type === 'TK_RESERVED' && next_token.text === 'else') &&
                    !flags.do_block) {
                    restore_mode();
                }
            }
        }

        if (output.add_new_line(force_newline)) {
            flags.multiline_frame = true;
        }
    }

    function print_token_line_indentation() {
        if (output.just_added_newline()) {
            if (opt.keep_array_indentation && is_array(flags.mode) && current_token.wanted_newline) {
                output.current_line.push(current_token.whitespace_before);
                output.space_before_token = false;
            } else if (output.set_indent(flags.indentation_level)) {
                flags.line_indent_level = flags.indentation_level;
            }
        }
    }

    function print_token(printable_token) {
        if (output.raw) {
            output.add_raw_token(current_token);
            return;
        }

        if (opt.comma_first && last_type === 'TK_COMMA' &&
            output.just_added_newline()) {
            if (output.previous_line.last() === ',') {
                var popped = output.previous_line.pop();
                // if the comma was already at the start of the line,
                // pull back onto that line and reprint the indentation
                if (output.previous_line.is_empty()) {
                    output.previous_line.push(popped);
                    output.trim(true);
                    output.current_line.pop();
                    output.trim();
                }

                // add the comma in front of the next token
                print_token_line_indentation();
                output.add_token(',');
                output.space_before_token = true;
            }
        }

        printable_token = printable_token || current_token.text;
        print_token_line_indentation();
        output.add_token(printable_token);
    }

    function indent() {
        flags.indentation_level += 1;
    }

    function deindent() {
        if (flags.indentation_level > 0 &&
            ((!flags.parent) || flags.indentation_level > flags.parent.indentation_level)) {
            flags.indentation_level -= 1;

        }
    }

    function set_mode(mode) {
        if (flags) {
            flag_store.push(flags);
            previous_flags = flags;
        } else {
            previous_flags = create_flags(null, mode);
        }

        flags = create_flags(previous_flags, mode);
    }

    function is_array(mode) {
        return mode === MODE.ArrayLiteral;
    }

    function is_expression(mode) {
        return in_array(mode, [MODE.Expression, MODE.ForInitializer, MODE.Conditional]);
    }

    function restore_mode() {
        if (flag_store.length > 0) {
            previous_flags = flags;
            flags = flag_store.pop();
            if (previous_flags.mode === MODE.Statement && !opt.unindent_chained_methods) {
                remove_redundant_indentation(output, previous_flags);
            }
        }
    }

    function start_of_object_property() {
        return flags.parent.mode === MODE.ObjectLiteral && flags.mode === MODE.Statement && (
            (flags.last_text === ':' && flags.ternary_depth === 0) || (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['get', 'set'])));
    }

    function start_of_statement() {
        if (
            (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const']) && current_token.type === 'TK_WORD') ||
            (last_type === 'TK_RESERVED' && flags.last_text === 'do') ||
            (last_type === 'TK_RESERVED' && in_array(flags.last_text, newline_restricted_tokens) && !current_token.wanted_newline) ||
            (last_type === 'TK_RESERVED' && flags.last_text === 'else' &&
                !(current_token.type === 'TK_RESERVED' && current_token.text === 'if' && !current_token.comments_before.length)) ||
            (last_type === 'TK_END_EXPR' && (previous_flags.mode === MODE.ForInitializer || previous_flags.mode === MODE.Conditional)) ||
            (last_type === 'TK_WORD' && flags.mode === MODE.BlockStatement &&
                !flags.in_case &&
                !(current_token.text === '--' || current_token.text === '++') &&
                last_last_text !== 'function' &&
                current_token.type !== 'TK_WORD' && current_token.type !== 'TK_RESERVED') ||
            (flags.mode === MODE.ObjectLiteral && (
                (flags.last_text === ':' && flags.ternary_depth === 0) || (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['get', 'set']))))
        ) {

            set_mode(MODE.Statement);
            if (!opt.unindent_chained_methods) {
                indent();
            }

            handle_whitespace_and_comments(current_token, true);

            // Issue #276:
            // If starting a new statement with [if, for, while, do], push to a new line.
            // if (a) if (b) if(c) d(); else e(); else f();
            if (!start_of_object_property()) {
                allow_wrap_or_preserved_newline(
                    current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['do', 'for', 'if', 'while']));
            }

            return true;
        }
        return false;
    }

    function all_lines_start_with(lines, c) {
        for (var i = 0; i < lines.length; i++) {
            var line = trim(lines[i]);
            if (line.charAt(0) !== c) {
                return false;
            }
        }
        return true;
    }

    function each_line_matches_indent(lines, indent) {
        var i = 0,
            len = lines.length,
            line;
        for (; i < len; i++) {
            line = lines[i];
            // allow empty lines to pass through
            if (line && line.indexOf(indent) !== 0) {
                return false;
            }
        }
        return true;
    }

    function is_special_word(word) {
        return in_array(word, ['case', 'return', 'do', 'if', 'throw', 'else']);
    }

    function get_token(offset) {
        var index = token_pos + (offset || 0);
        return (index < 0 || index >= tokens.length) ? null : tokens[index];
    }

    function handle_start_expr() {
        // The conditional starts the statement if appropriate.
        if (!start_of_statement()) {
            handle_whitespace_and_comments(current_token);
        }

        var next_mode = MODE.Expression;
        if (current_token.text === '[') {

            if (last_type === 'TK_WORD' || flags.last_text === ')') {
                // this is array index specifier, break immediately
                // a[x], fn()[x]
                if (last_type === 'TK_RESERVED' && in_array(flags.last_text, tokenizer.line_starters)) {
                    output.space_before_token = true;
                }
                set_mode(next_mode);
                print_token();
                indent();
                if (opt.space_in_paren) {
                    output.space_before_token = true;
                }
                return;
            }

            next_mode = MODE.ArrayLiteral;
            if (is_array(flags.mode)) {
                if (flags.last_text === '[' ||
                    (flags.last_text === ',' && (last_last_text === ']' || last_last_text === '}'))) {
                    // ], [ goes to new line
                    // }, [ goes to new line
                    if (!opt.keep_array_indentation) {
                        print_newline();
                    }
                }
            }

        } else {
            if (last_type === 'TK_RESERVED' && flags.last_text === 'for') {
                next_mode = MODE.ForInitializer;
            } else if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['if', 'while'])) {
                next_mode = MODE.Conditional;
            } else {
                // next_mode = MODE.Expression;
            }
        }

        if (flags.last_text === ';' || last_type === 'TK_START_BLOCK') {
            print_newline();
        } else if (last_type === 'TK_END_EXPR' || last_type === 'TK_START_EXPR' || last_type === 'TK_END_BLOCK' || flags.last_text === '.') {
            // TODO: Consider whether forcing this is required.  Review failing tests when removed.
            allow_wrap_or_preserved_newline(current_token.wanted_newline);
            // do nothing on (( and )( and ][ and ]( and .(
        } else if (!(last_type === 'TK_RESERVED' && current_token.text === '(') && last_type !== 'TK_WORD' && last_type !== 'TK_OPERATOR') {
            output.space_before_token = true;
        } else if ((last_type === 'TK_RESERVED' && (flags.last_word === 'function' || flags.last_word === 'typeof')) ||
            (flags.last_text === '*' &&
                (in_array(last_last_text, ['function', 'yield']) ||
                    (flags.mode === MODE.ObjectLiteral && in_array(last_last_text, ['{', ',']))))) {
            // function() vs function ()
            // yield*() vs yield* ()
            // function*() vs function* ()
            if (opt.space_after_anon_function) {
                output.space_before_token = true;
            }
        } else if (last_type === 'TK_RESERVED' && (in_array(flags.last_text, tokenizer.line_starters) || flags.last_text === 'catch')) {
            if (opt.space_before_conditional) {
                output.space_before_token = true;
            }
        }

        // Should be a space between await and an IIFE
        if (current_token.text === '(' && last_type === 'TK_RESERVED' && flags.last_word === 'await') {
            output.space_before_token = true;
        }

        // Support of this kind of newline preservation.
        // a = (b &&
        //     (c || d));
        if (current_token.text === '(') {
            if (last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline();
                }
            }
        }

        // Support preserving wrapped arrow function expressions
        // a.b('c',
        //     () => d.e
        // )
        if (current_token.text === '(' && last_type !== 'TK_WORD' && last_type !== 'TK_RESERVED') {
            allow_wrap_or_preserved_newline();
        }

        set_mode(next_mode);
        print_token();
        if (opt.space_in_paren) {
            output.space_before_token = true;
        }

        // In all cases, if we newline while inside an expression it should be indented.
        indent();
    }

    function handle_end_expr() {
        // statements inside expressions are not valid syntax, but...
        // statements must all be closed when their container closes
        while (flags.mode === MODE.Statement) {
            restore_mode();
        }

        handle_whitespace_and_comments(current_token);

        if (flags.multiline_frame) {
            allow_wrap_or_preserved_newline(current_token.text === ']' && is_array(flags.mode) && !opt.keep_array_indentation);
        }

        if (opt.space_in_paren) {
            if (last_type === 'TK_START_EXPR' && !opt.space_in_empty_paren) {
                // () [] no inner space in empty parens like these, ever, ref #320
                output.trim();
                output.space_before_token = false;
            } else {
                output.space_before_token = true;
            }
        }
        if (current_token.text === ']' && opt.keep_array_indentation) {
            print_token();
            restore_mode();
        } else {
            restore_mode();
            print_token();
        }
        remove_redundant_indentation(output, previous_flags);

        // do {} while () // no statement required after
        if (flags.do_while && previous_flags.mode === MODE.Conditional) {
            previous_flags.mode = MODE.Expression;
            flags.do_block = false;
            flags.do_while = false;

        }
    }

    function handle_start_block() {
        handle_whitespace_and_comments(current_token);

        // Check if this is should be treated as a ObjectLiteral
        var next_token = get_token(1);
        var second_token = get_token(2);
        if (second_token && (
                (in_array(second_token.text, [':', ',']) && in_array(next_token.type, ['TK_STRING', 'TK_WORD', 'TK_RESERVED'])) ||
                (in_array(next_token.text, ['get', 'set', '...']) && in_array(second_token.type, ['TK_WORD', 'TK_RESERVED']))
            )) {
            // We don't support TypeScript,but we didn't break it for a very long time.
            // We'll try to keep not breaking it.
            if (!in_array(last_last_text, ['class', 'interface'])) {
                set_mode(MODE.ObjectLiteral);
            } else {
                set_mode(MODE.BlockStatement);
            }
        } else if (last_type === 'TK_OPERATOR' && flags.last_text === '=>') {
            // arrow function: (param1, paramN) => { statements }
            set_mode(MODE.BlockStatement);
        } else if (in_array(last_type, ['TK_EQUALS', 'TK_START_EXPR', 'TK_COMMA', 'TK_OPERATOR']) ||
            (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['return', 'throw', 'import', 'default']))
        ) {
            // Detecting shorthand function syntax is difficult by scanning forward,
            //     so check the surrounding context.
            // If the block is being returned, imported, export default, passed as arg,
            //     assigned with = or assigned in a nested object, treat as an ObjectLiteral.
            set_mode(MODE.ObjectLiteral);
        } else {
            set_mode(MODE.BlockStatement);
        }

        var empty_braces = !next_token.comments_before.length && next_token.text === '}';
        var empty_anonymous_function = empty_braces && flags.last_word === 'function' &&
            last_type === 'TK_END_EXPR';

        if (opt.brace_preserve_inline) // check for inline, set inline_frame if so
        {
            // search forward for a newline wanted inside this block
            var index = 0;
            var check_token = null;
            flags.inline_frame = true;
            do {
                index += 1;
                check_token = get_token(index);
                if (check_token.wanted_newline) {
                    flags.inline_frame = false;
                    break;
                }
            } while (check_token.type !== 'TK_EOF' &&
                !(check_token.type === 'TK_END_BLOCK' && check_token.opened === current_token));
        }

        if ((opt.brace_style === "expand" ||
                (opt.brace_style === "none" && current_token.wanted_newline)) &&
            !flags.inline_frame) {
            if (last_type !== 'TK_OPERATOR' &&
                (empty_anonymous_function ||
                    last_type === 'TK_EQUALS' ||
                    (last_type === 'TK_RESERVED' && is_special_word(flags.last_text) && flags.last_text !== 'else'))) {
                output.space_before_token = true;
            } else {
                print_newline(false, true);
            }
        } else { // collapse || inline_frame
            if (is_array(previous_flags.mode) && (last_type === 'TK_START_EXPR' || last_type === 'TK_COMMA')) {
                if (last_type === 'TK_COMMA' || opt.space_in_paren) {
                    output.space_before_token = true;
                }

                if (last_type === 'TK_COMMA' || (last_type === 'TK_START_EXPR' && flags.inline_frame)) {
                    allow_wrap_or_preserved_newline();
                    previous_flags.multiline_frame = previous_flags.multiline_frame || flags.multiline_frame;
                    flags.multiline_frame = false;
                }
            }
            if (last_type !== 'TK_OPERATOR' && last_type !== 'TK_START_EXPR') {
                if (last_type === 'TK_START_BLOCK' && !flags.inline_frame) {
                    print_newline();
                } else {
                    output.space_before_token = true;
                }
            }
        }
        print_token();
        indent();
    }

    function handle_end_block() {
        // statements must all be closed when their container closes
        handle_whitespace_and_comments(current_token);

        while (flags.mode === MODE.Statement) {
            restore_mode();
        }

        var empty_braces = last_type === 'TK_START_BLOCK';

        if (flags.inline_frame && !empty_braces) { // try inline_frame (only set if opt.braces-preserve-inline) first
            output.space_before_token = true;
        } else if (opt.brace_style === "expand") {
            if (!empty_braces) {
                print_newline();
            }
        } else {
            // skip {}
            if (!empty_braces) {
                if (is_array(flags.mode) && opt.keep_array_indentation) {
                    // we REALLY need a newline here, but newliner would skip that
                    opt.keep_array_indentation = false;
                    print_newline();
                    opt.keep_array_indentation = true;

                } else {
                    print_newline();
                }
            }
        }
        restore_mode();
        print_token();
    }

    function handle_word() {
        if (current_token.type === 'TK_RESERVED') {
            if (in_array(current_token.text, ['set', 'get']) && flags.mode !== MODE.ObjectLiteral) {
                current_token.type = 'TK_WORD';
            } else if (in_array(current_token.text, ['as', 'from']) && !flags.import_block) {
                current_token.type = 'TK_WORD';
            } else if (flags.mode === MODE.ObjectLiteral) {
                var next_token = get_token(1);
                if (next_token.text === ':') {
                    current_token.type = 'TK_WORD';
                }
            }
        }

        if (start_of_statement()) {
            // The conditional starts the statement if appropriate.
            if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const']) && current_token.type === 'TK_WORD') {
                flags.declaration_statement = true;
            }
        } else if (current_token.wanted_newline && !is_expression(flags.mode) &&
            (last_type !== 'TK_OPERATOR' || (flags.last_text === '--' || flags.last_text === '++')) &&
            last_type !== 'TK_EQUALS' &&
            (opt.preserve_newlines || !(last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const', 'set', 'get'])))) {
            handle_whitespace_and_comments(current_token);
            print_newline();
        } else {
            handle_whitespace_and_comments(current_token);
        }

        if (flags.do_block && !flags.do_while) {
            if (current_token.type === 'TK_RESERVED' && current_token.text === 'while') {
                // do {} ## while ()
                output.space_before_token = true;
                print_token();
                output.space_before_token = true;
                flags.do_while = true;
                return;
            } else {
                // do {} should always have while as the next word.
                // if we don't see the expected while, recover
                print_newline();
                flags.do_block = false;
            }
        }

        // if may be followed by else, or not
        // Bare/inline ifs are tricky
        // Need to unwind the modes correctly: if (a) if (b) c(); else d(); else e();
        if (flags.if_block) {
            if (!flags.else_block && (current_token.type === 'TK_RESERVED' && current_token.text === 'else')) {
                flags.else_block = true;
            } else {
                while (flags.mode === MODE.Statement) {
                    restore_mode();
                }
                flags.if_block = false;
                flags.else_block = false;
            }
        }

        if (current_token.type === 'TK_RESERVED' && (current_token.text === 'case' || (current_token.text === 'default' && flags.in_case_statement))) {
            print_newline();
            if (flags.case_body || opt.jslint_happy) {
                // switch cases following one another
                deindent();
                flags.case_body = false;
            }
            print_token();
            flags.in_case = true;
            flags.in_case_statement = true;
            return;
        }

        if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
            if (!start_of_object_property()) {
                allow_wrap_or_preserved_newline();
            }
        }

        if (current_token.type === 'TK_RESERVED' && current_token.text === 'function') {
            if (in_array(flags.last_text, ['}', ';']) ||
                (output.just_added_newline() && !(in_array(flags.last_text, ['(', '[', '{', ':', '=', ',']) || last_type === 'TK_OPERATOR'))) {
                // make sure there is a nice clean space of at least one blank line
                // before a new function definition
                if (!output.just_added_blankline() && !current_token.comments_before.length) {
                    print_newline();
                    print_newline(true);
                }
            }
            if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD') {
                if (last_type === 'TK_RESERVED' && (
                        in_array(flags.last_text, ['get', 'set', 'new', 'export', 'async']) ||
                        in_array(flags.last_text, newline_restricted_tokens))) {
                    output.space_before_token = true;
                } else if (last_type === 'TK_RESERVED' && flags.last_text === 'default' && last_last_text === 'export') {
                    output.space_before_token = true;
                } else {
                    print_newline();
                }
            } else if (last_type === 'TK_OPERATOR' || flags.last_text === '=') {
                // foo = function
                output.space_before_token = true;
            } else if (!flags.multiline_frame && (is_expression(flags.mode) || is_array(flags.mode))) {
                // (function
            } else {
                print_newline();
            }

            print_token();
            flags.last_word = current_token.text;
            return;
        }

        prefix = 'NONE';

        if (last_type === 'TK_END_BLOCK') {

            if (previous_flags.inline_frame) {
                prefix = 'SPACE';
            } else if (!(current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['else', 'catch', 'finally', 'from']))) {
                prefix = 'NEWLINE';
            } else {
                if (opt.brace_style === "expand" ||
                    opt.brace_style === "end-expand" ||
                    (opt.brace_style === "none" && current_token.wanted_newline)) {
                    prefix = 'NEWLINE';
                } else {
                    prefix = 'SPACE';
                    output.space_before_token = true;
                }
            }
        } else if (last_type === 'TK_SEMICOLON' && flags.mode === MODE.BlockStatement) {
            // TODO: Should this be for STATEMENT as well?
            prefix = 'NEWLINE';
        } else if (last_type === 'TK_SEMICOLON' && is_expression(flags.mode)) {
            prefix = 'SPACE';
        } else if (last_type === 'TK_STRING') {
            prefix = 'NEWLINE';
        } else if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD' ||
            (flags.last_text === '*' &&
                (in_array(last_last_text, ['function', 'yield']) ||
                    (flags.mode === MODE.ObjectLiteral && in_array(last_last_text, ['{', ',']))))) {
            prefix = 'SPACE';
        } else if (last_type === 'TK_START_BLOCK') {
            if (flags.inline_frame) {
                prefix = 'SPACE';
            } else {
                prefix = 'NEWLINE';
            }
        } else if (last_type === 'TK_END_EXPR') {
            output.space_before_token = true;
            prefix = 'NEWLINE';
        }

        if (current_token.type === 'TK_RESERVED' && in_array(current_token.text, tokenizer.line_starters) && flags.last_text !== ')') {
            if (flags.inline_frame || flags.last_text === 'else' || flags.last_text === 'export') {
                prefix = 'SPACE';
            } else {
                prefix = 'NEWLINE';
            }

        }

        if (current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['else', 'catch', 'finally'])) {
            if ((!(last_type === 'TK_END_BLOCK' && previous_flags.mode === MODE.BlockStatement) ||
                    opt.brace_style === "expand" ||
                    opt.brace_style === "end-expand" ||
                    (opt.brace_style === "none" && current_token.wanted_newline)) &&
                !flags.inline_frame) {
                print_newline();
            } else {
                output.trim(true);
                var line = output.current_line;
                // If we trimmed and there's something other than a close block before us
                // put a newline back in.  Handles '} // comment' scenario.
                if (line.last() !== '}') {
                    print_newline();
                }
                output.space_before_token = true;
            }
        } else if (prefix === 'NEWLINE') {
            if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
                // no newline between 'return nnn'
                output.space_before_token = true;
            } else if (last_type !== 'TK_END_EXPR') {
                if ((last_type !== 'TK_START_EXPR' || !(current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['var', 'let', 'const']))) && flags.last_text !== ':') {
                    // no need to force newline on 'var': for (var x = 0...)
                    if (current_token.type === 'TK_RESERVED' && current_token.text === 'if' && flags.last_text === 'else') {
                        // no newline for } else if {
                        output.space_before_token = true;
                    } else {
                        print_newline();
                    }
                }
            } else if (current_token.type === 'TK_RESERVED' && in_array(current_token.text, tokenizer.line_starters) && flags.last_text !== ')') {
                print_newline();
            }
        } else if (flags.multiline_frame && is_array(flags.mode) && flags.last_text === ',' && last_last_text === '}') {
            print_newline(); // }, in lists get a newline treatment
        } else if (prefix === 'SPACE') {
            output.space_before_token = true;
        }
        print_token();
        flags.last_word = current_token.text;

        if (current_token.type === 'TK_RESERVED') {
            if (current_token.text === 'do') {
                flags.do_block = true;
            } else if (current_token.text === 'if') {
                flags.if_block = true;
            } else if (current_token.text === 'import') {
                flags.import_block = true;
            } else if (flags.import_block && current_token.type === 'TK_RESERVED' && current_token.text === 'from') {
                flags.import_block = false;
            }
        }
    }

    function handle_semicolon() {
        if (start_of_statement()) {
            // The conditional starts the statement if appropriate.
            // Semicolon can be the start (and end) of a statement
            output.space_before_token = false;
        } else {
            handle_whitespace_and_comments(current_token);
        }

        var next_token = get_token(1);
        while (flags.mode === MODE.Statement &&
            !(flags.if_block && next_token && next_token.type === 'TK_RESERVED' && next_token.text === 'else') &&
            !flags.do_block) {
            restore_mode();
        }

        // hacky but effective for the moment
        if (flags.import_block) {
            flags.import_block = false;
        }
        print_token();
    }

    function handle_string() {
        if (start_of_statement()) {
            // The conditional starts the statement if appropriate.
            // One difference - strings want at least a space before
            output.space_before_token = true;
        } else {
            handle_whitespace_and_comments(current_token);
            if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD' || flags.inline_frame) {
                output.space_before_token = true;
            } else if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline();
                }
            } else {
                print_newline();
            }
        }
        print_token();
    }

    function handle_equals() {
        if (start_of_statement()) {
            // The conditional starts the statement if appropriate.
        } else {
            handle_whitespace_and_comments(current_token);
        }

        if (flags.declaration_statement) {
            // just got an '=' in a var-line, different formatting/line-breaking, etc will now be done
            flags.declaration_assignment = true;
        }
        output.space_before_token = true;
        print_token();
        output.space_before_token = true;
    }

    function handle_comma() {
        handle_whitespace_and_comments(current_token, true);

        print_token();
        output.space_before_token = true;
        if (flags.declaration_statement) {
            if (is_expression(flags.parent.mode)) {
                // do not break on comma, for(var a = 1, b = 2)
                flags.declaration_assignment = false;
            }

            if (flags.declaration_assignment) {
                flags.declaration_assignment = false;
                print_newline(false, true);
            } else if (opt.comma_first) {
                // for comma-first, we want to allow a newline before the comma
                // to turn into a newline after the comma, which we will fixup later
                allow_wrap_or_preserved_newline();
            }
        } else if (flags.mode === MODE.ObjectLiteral ||
            (flags.mode === MODE.Statement && flags.parent.mode === MODE.ObjectLiteral)) {
            if (flags.mode === MODE.Statement) {
                restore_mode();
            }

            if (!flags.inline_frame) {
                print_newline();
            }
        } else if (opt.comma_first) {
            // EXPR or DO_BLOCK
            // for comma-first, we want to allow a newline before the comma
            // to turn into a newline after the comma, which we will fixup later
            allow_wrap_or_preserved_newline();
        }
    }

    function handle_operator() {
        var isGeneratorAsterisk = current_token.text === '*' &&
            ((last_type === 'TK_RESERVED' && in_array(flags.last_text, ['function', 'yield'])) ||
                (in_array(last_type, ['TK_START_BLOCK', 'TK_COMMA', 'TK_END_BLOCK', 'TK_SEMICOLON']))
            );
        var isUnary = in_array(current_token.text, ['-', '+']) && (
            in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS', 'TK_OPERATOR']) ||
            in_array(flags.last_text, tokenizer.line_starters) ||
            flags.last_text === ','
        );

        if (start_of_statement()) {
            // The conditional starts the statement if appropriate.
        } else {
            var preserve_statement_flags = !isGeneratorAsterisk;
            handle_whitespace_and_comments(current_token, preserve_statement_flags);
        }

        if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
            // "return" had a special handling in TK_WORD. Now we need to return the favor
            output.space_before_token = true;
            print_token();
            return;
        }

        // hack for actionscript's import .*;
        if (current_token.text === '*' && last_type === 'TK_DOT') {
            print_token();
            return;
        }

        if (current_token.text === '::') {
            // no spaces around exotic namespacing syntax operator
            print_token();
            return;
        }

        // Allow line wrapping between operators when operator_position is
        //   set to before or preserve
        if (last_type === 'TK_OPERATOR' && in_array(opt.operator_position, OPERATOR_POSITION_BEFORE_OR_PRESERVE)) {
            allow_wrap_or_preserved_newline();
        }

        if (current_token.text === ':' && flags.in_case) {
            flags.case_body = true;
            indent();
            print_token();
            print_newline();
            flags.in_case = false;
            return;
        }

        var space_before = true;
        var space_after = true;
        var in_ternary = false;
        if (current_token.text === ':') {
            if (flags.ternary_depth === 0) {
                // Colon is invalid javascript outside of ternary and object, but do our best to guess what was meant.
                space_before = false;
            } else {
                flags.ternary_depth -= 1;
                in_ternary = true;
            }
        } else if (current_token.text === '?') {
            flags.ternary_depth += 1;
        }

        // let's handle the operator_position option prior to any conflicting logic
        if (!isUnary && !isGeneratorAsterisk && opt.preserve_newlines && in_array(current_token.text, tokenizer.positionable_operators)) {
            var isColon = current_token.text === ':';
            var isTernaryColon = (isColon && in_ternary);
            var isOtherColon = (isColon && !in_ternary);

            switch (opt.operator_position) {
                case OPERATOR_POSITION.before_newline:
                    // if the current token is : and it's not a ternary statement then we set space_before to false
                    output.space_before_token = !isOtherColon;

                    print_token();

                    if (!isColon || isTernaryColon) {
                        allow_wrap_or_preserved_newline();
                    }

                    output.space_before_token = true;
                    return;

                case OPERATOR_POSITION.after_newline:
                    // if the current token is anything but colon, or (via deduction) it's a colon and in a ternary statement,
                    //   then print a newline.

                    output.space_before_token = true;

                    if (!isColon || isTernaryColon) {
                        if (get_token(1).wanted_newline) {
                            print_newline(false, true);
                        } else {
                            allow_wrap_or_preserved_newline();
                        }
                    } else {
                        output.space_before_token = false;
                    }

                    print_token();

                    output.space_before_token = true;
                    return;

                case OPERATOR_POSITION.preserve_newline:
                    if (!isOtherColon) {
                        allow_wrap_or_preserved_newline();
                    }

                    // if we just added a newline, or the current token is : and it's not a ternary statement,
                    //   then we set space_before to false
                    space_before = !(output.just_added_newline() || isOtherColon);

                    output.space_before_token = space_before;
                    print_token();
                    output.space_before_token = true;
                    return;
            }
        }

        if (isGeneratorAsterisk) {
            allow_wrap_or_preserved_newline();
            space_before = false;
            var next_token = get_token(1);
            space_after = next_token && in_array(next_token.type, ['TK_WORD', 'TK_RESERVED']);
        } else if (current_token.text === '...') {
            allow_wrap_or_preserved_newline();
            space_before = last_type === 'TK_START_BLOCK';
            space_after = false;
        } else if (in_array(current_token.text, ['--', '++', '!', '~']) || isUnary) {
            // unary operators (and binary +/- pretending to be unary) special cases

            space_before = false;
            space_after = false;

            // http://www.ecma-international.org/ecma-262/5.1/#sec-7.9.1
            // if there is a newline between -- or ++ and anything else we should preserve it.
            if (current_token.wanted_newline && (current_token.text === '--' || current_token.text === '++')) {
                print_newline(false, true);
            }

            if (flags.last_text === ';' && is_expression(flags.mode)) {
                // for (;; ++i)
                //        ^^^
                space_before = true;
            }

            if (last_type === 'TK_RESERVED') {
                space_before = true;
            } else if (last_type === 'TK_END_EXPR') {
                space_before = !(flags.last_text === ']' && (current_token.text === '--' || current_token.text === '++'));
            } else if (last_type === 'TK_OPERATOR') {
                // a++ + ++b;
                // a - -b
                space_before = in_array(current_token.text, ['--', '-', '++', '+']) && in_array(flags.last_text, ['--', '-', '++', '+']);
                // + and - are not unary when preceeded by -- or ++ operator
                // a-- + b
                // a * +b
                // a - -b
                if (in_array(current_token.text, ['+', '-']) && in_array(flags.last_text, ['--', '++'])) {
                    space_after = true;
                }
            }


            if (((flags.mode === MODE.BlockStatement && !flags.inline_frame) || flags.mode === MODE.Statement) &&
                (flags.last_text === '{' || flags.last_text === ';')) {
                // { foo; --i }
                // foo(); --bar;
                print_newline();
            }
        }

        output.space_before_token = output.space_before_token || space_before;
        print_token();
        output.space_before_token = space_after;
    }

    function handle_block_comment(preserve_statement_flags) {
        if (output.raw) {
            output.add_raw_token(current_token);
            if (current_token.directives && current_token.directives.preserve === 'end') {
                // If we're testing the raw output behavior, do not allow a directive to turn it off.
                output.raw = opt.test_output_raw;
            }
            return;
        }

        if (current_token.directives) {
            print_newline(false, preserve_statement_flags);
            print_token();
            if (current_token.directives.preserve === 'start') {
                output.raw = true;
            }
            print_newline(false, true);
            return;
        }

        // inline block
        if (!acorn.newline.test(current_token.text) && !current_token.wanted_newline) {
            output.space_before_token = true;
            print_token();
            output.space_before_token = true;
            return;
        }

        var lines = split_linebreaks(current_token.text);
        var j; // iterator for this case
        var javadoc = false;
        var starless = false;
        var lastIndent = current_token.whitespace_before;
        var lastIndentLength = lastIndent.length;

        // block comment starts with a new line
        print_newline(false, preserve_statement_flags);
        if (lines.length > 1) {
            javadoc = all_lines_start_with(lines.slice(1), '*');
            starless = each_line_matches_indent(lines.slice(1), lastIndent);
        }

        // first line always indented
        print_token(lines[0]);
        for (j = 1; j < lines.length; j++) {
            print_newline(false, true);
            if (javadoc) {
                // javadoc: reformat and re-indent
                print_token(' ' + ltrim(lines[j]));
            } else if (starless && lines[j].length > lastIndentLength) {
                // starless: re-indent non-empty content, avoiding trim
                print_token(lines[j].substring(lastIndentLength));
            } else {
                // normal comments output raw
                output.add_token(lines[j]);
            }
        }

        // for comments of more than one line, make sure there's a new line after
        print_newline(false, preserve_statement_flags);
    }

    function handle_comment(preserve_statement_flags) {
        if (current_token.wanted_newline) {
            print_newline(false, preserve_statement_flags);
        } else {
            output.trim(true);
        }

        output.space_before_token = true;
        print_token();
        print_newline(false, preserve_statement_flags);
    }

    function handle_dot() {
        if (start_of_statement()) {
            // The conditional starts the statement if appropriate.
        } else {
            handle_whitespace_and_comments(current_token, true);
        }

        if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
            output.space_before_token = true;
        } else {
            // allow preserved newlines before dots in general
            // force newlines on dots after close paren when break_chained - for bar().baz()
            allow_wrap_or_preserved_newline(flags.last_text === ')' && opt.break_chained_methods);
        }

        print_token();
    }

    function handle_unknown(preserve_statement_flags) {
        print_token();

        if (current_token.text[current_token.text.length - 1] === '\n') {
            print_newline(false, preserve_statement_flags);
        }
    }

    function handle_eof() {
        // Unwind any open statements
        while (flags.mode === MODE.Statement) {
            restore_mode();
        }
        handle_whitespace_and_comments(current_token);
    }
}

module.exports.Beautifier = Beautifier;