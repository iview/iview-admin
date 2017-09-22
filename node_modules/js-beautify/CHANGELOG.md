# Changelog
## v1.7.0

### Description


### Closed Issues
* Add test and tools folder to npmignore ([#1239](https://github.com/beautify-web/js-beautify/issues/1239))
* incorrect new-line insertion after "yield" ([#1206](https://github.com/beautify-web/js-beautify/issues/1206))
* Do not modify built-in objects ([#1205](https://github.com/beautify-web/js-beautify/issues/1205))
* Fix label checking incorrect box when clicked ([#1169](https://github.com/beautify-web/js-beautify/pull/1169))
* Webpack ([#1149](https://github.com/beautify-web/js-beautify/pull/1149))
* daisy-chain indentation leads to over-indentation ([#482](https://github.com/beautify-web/js-beautify/issues/482))


## v1.6.12

### Description


### Closed Issues
* CSS: Preserve Newlines ([#537](https://github.com/beautify-web/js-beautify/issues/537))


## v1.6.11

### Description
Reverted #1117 - Preserve newlines broken

### Closed Issues
* On beautify, new line before next CSS selector ([#1142](https://github.com/beautify-web/js-beautify/issues/1142))


## v1.6.10

### Description
Added `preserver_newlines` to css beautifier

### Closed Issues


## v1.6.9

### Description
* Fixed html formatting issue with attribute wrap (Thanks, @HookyQR!)
* Fixed python package publishing


### Closed Issues
* Wrong HTML beautification starting with v1.6.5 ([#1115](https://github.com/beautify-web/js-beautify/issues/1115))
* Ignore linebreak when meet handlebar ([#1104](https://github.com/beautify-web/js-beautify/pull/1104))
* Lines are not un-indented correctly when attributes are wrapped ([#1103](https://github.com/beautify-web/js-beautify/issues/1103))
* force-aligned is not aligned when indenting with tabs ([#1102](https://github.com/beautify-web/js-beautify/issues/1102))
* Python package fails to publish  ([#1101](https://github.com/beautify-web/js-beautify/issues/1101))
* Explaination of 'operator_position' is absent from README.md ([#1047](https://github.com/beautify-web/js-beautify/issues/1047))


## v1.6.8

### Description
* Fixed a batch of comment and semicolon-less code bugs


### Closed Issues
* Incorrect indentation after loop with comment ([#1090](https://github.com/beautify-web/js-beautify/issues/1090))
* Extra newline is inserted after beautifying code with anonymous function ([#1085](https://github.com/beautify-web/js-beautify/issues/1085))
* end brace with next comment line make bad indent ([#1043](https://github.com/beautify-web/js-beautify/issues/1043))
* Javascript comment in last line doesn't beautify well ([#964](https://github.com/beautify-web/js-beautify/issues/964))
* indent doesn't work with comment (jsdoc) ([#913](https://github.com/beautify-web/js-beautify/issues/913))
* Wrong indentation, when new line between chained methods ([#892](https://github.com/beautify-web/js-beautify/issues/892))
* Comments in a non-semicolon style have extra indent ([#815](https://github.com/beautify-web/js-beautify/issues/815))
* [bug] Incorrect indentation due to commented line(s) following a function call with a function argument. ([#713](https://github.com/beautify-web/js-beautify/issues/713))
* Wrong indent formatting ([#569](https://github.com/beautify-web/js-beautify/issues/569))


## v1.6.7

### Description
Added `content_unformatted` option (Thanks @arai-a)

### Closed Issues
* HTML pre code indentation ([#928](https://github.com/beautify-web/js-beautify/issues/928))
* Beautify script/style tags but ignore their inner JS/CSS content ([#906](https://github.com/beautify-web/js-beautify/issues/906))


## v1.6.6

### Description
* Added support for editorconfig from stdin
* Added js-beautify to cdnjs
* Fixed CRLF to LF for HTML and CSS on windows
* Added inheritance/overriding to config format (Thanks @DaniGuardiola and @HookyQR)
* Added `force-align` to `wrap-attributes` (Thanks @Lukinos)
* Added `force-expand-multiline` to `wrap-attributes` (Thanks @tobias-zucali)
* Added `preserve-inline` as independent brace setting (Thanks @Coburn37)
* Fixed handlebars with angle-braces (Thanks @mmsqe)



### Closed Issues
* Wrong indentation for comment after nested unbraced control constructs ([#1079](https://github.com/beautify-web/js-beautify/issues/1079))
* Should prefer breaking the line after operator ? instead of before operator < ([#1073](https://github.com/beautify-web/js-beautify/issues/1073))
* New option "force-expand-multiline" for "wrap_attributes" ([#1070](https://github.com/beautify-web/js-beautify/pull/1070))
* Breaks if html file starts with comment ([#1068](https://github.com/beautify-web/js-beautify/issues/1068))
* collapse-preserve-inline restricts users to collapse brace_style ([#1057](https://github.com/beautify-web/js-beautify/issues/1057))
* Parsing failure on numbers with "e" ([#1054](https://github.com/beautify-web/js-beautify/issues/1054))
* Issue with Browser Instructions ([#1053](https://github.com/beautify-web/js-beautify/issues/1053))
* Add preserve inline function for expand style braces ([#1052](https://github.com/beautify-web/js-beautify/issues/1052))
* Update years in LICENSE ([#1038](https://github.com/beautify-web/js-beautify/issues/1038))
* JS. Switch with template literals. Unexpected indentation. ([#1030](https://github.com/beautify-web/js-beautify/issues/1030))
* The object with spread object formatted not correctly ([#1023](https://github.com/beautify-web/js-beautify/issues/1023))
* Bad output generator function in class ([#1013](https://github.com/beautify-web/js-beautify/issues/1013))
* Support editorconfig for stdin ([#1012](https://github.com/beautify-web/js-beautify/issues/1012))
* Publish to cdnjs ([#992](https://github.com/beautify-web/js-beautify/issues/992))
* breaks if handlebars comments contain handlebars tags ([#930](https://github.com/beautify-web/js-beautify/issues/930))
* Using jsbeautifyrc is broken ([#929](https://github.com/beautify-web/js-beautify/issues/929))
* Option to put HTML attributes on their own lines, aligned ([#916](https://github.com/beautify-web/js-beautify/issues/916))
* Erroneously changes CRLF to LF on Windows in HTML and CSS ([#899](https://github.com/beautify-web/js-beautify/issues/899))
* Weird space in {get } vs { normal } ([#888](https://github.com/beautify-web/js-beautify/issues/888))
* Bad for-of formatting with constant Array ([#875](https://github.com/beautify-web/js-beautify/issues/875))
* Problems with filter property in css and scss ([#755](https://github.com/beautify-web/js-beautify/issues/755))
* Add "collapse-one-line" option for non-collapse brace styles  ([#487](https://github.com/beautify-web/js-beautify/issues/487))


## v1.6.4

### Description
* Fixed JSX multi-line root element handling 
* Fixed CSS Combinator spacing (NOTE: use `space_around_combinator` option)
* Fixed (more) CSS pseudo-class and pseudo-element selectors (Thanks @Konamiman!)
* Fixed Shorthand generator functions and `yield*` (Thanks @jgeurts!)
* Added EditorConfig support (Thanks @ethanluoyc!)
* Added indent_body_inner_html and indent_head_inner_html (Thanks @spontaliku-softaria!)
* Added js-beautify to https://cdn.rawgit.com (Thanks @zxqfox)





### Closed Issues
* css-beautify sibling combinator space issue ([#1001](https://github.com/beautify-web/js-beautify/issues/1001))
* Bug: Breaks when the source code it found an unclosed multiline comment. ([#996](https://github.com/beautify-web/js-beautify/issues/996))
* CSS: Preserve white space before pseudo-class and pseudo-element selectors ([#985](https://github.com/beautify-web/js-beautify/pull/985))
* Spelling error in token definition ([#984](https://github.com/beautify-web/js-beautify/issues/984))
* collapse-preserve-inline does not preserve simple, single line ("return") statements ([#982](https://github.com/beautify-web/js-beautify/issues/982))
* Publish the library via cdn ([#971](https://github.com/beautify-web/js-beautify/issues/971))
* Bug with css calc() function ([#957](https://github.com/beautify-web/js-beautify/issues/957))
* &:first-of-type:not(:last-child) when prettified insert erroneous white character ([#952](https://github.com/beautify-web/js-beautify/issues/952))
* Shorthand generator functions are formatting strangely ([#941](https://github.com/beautify-web/js-beautify/issues/941))
* Add handlebars support on cli for html ([#935](https://github.com/beautify-web/js-beautify/pull/935))
* Do not put a space within `yield*` generator functions. ([#920](https://github.com/beautify-web/js-beautify/issues/920))
* Possible to add an indent_inner_inner_html option? (Prevent indenting second-level tags) ([#917](https://github.com/beautify-web/js-beautify/issues/917))
* Messing up jsx formatting ([#914](https://github.com/beautify-web/js-beautify/issues/914))
* Bug report: Closing 'body' tag isn't formatted correctly ([#900](https://github.com/beautify-web/js-beautify/issues/900))
* { throw … } not working with collapse-preserve-inline ([#898](https://github.com/beautify-web/js-beautify/issues/898))
* ES6 concise method not propely indented ([#889](https://github.com/beautify-web/js-beautify/issues/889))
* CSS beautify changing symantics ([#883](https://github.com/beautify-web/js-beautify/issues/883))
* Dojo unsupported script types. ([#874](https://github.com/beautify-web/js-beautify/issues/874))
* Readme version comment  ([#868](https://github.com/beautify-web/js-beautify/issues/868))
* Extra space after pseudo-elements within :not() ([#618](https://github.com/beautify-web/js-beautify/issues/618))
* space in media queries after colon &: selectors ([#565](https://github.com/beautify-web/js-beautify/issues/565))
* Integrating editor config ([#551](https://github.com/beautify-web/js-beautify/issues/551))
* Preserve short expressions/statements on single line ([#338](https://github.com/beautify-web/js-beautify/issues/338))


## v1.6.3

### Description
Bug fixes

### Closed Issues
* CLI broken when output path is not set ([#933](https://github.com/beautify-web/js-beautify/issues/933))
* huge memory leak ([#909](https://github.com/beautify-web/js-beautify/issues/909))
* don't print unpacking errors on stdout (python) ([#884](https://github.com/beautify-web/js-beautify/pull/884))
* Fix incomplete list of non-positionable operators (python lib) ([#878](https://github.com/beautify-web/js-beautify/pull/878))
* Fix Issue #844 ([#873](https://github.com/beautify-web/js-beautify/pull/873))
* assignment exponentiation operator ([#864](https://github.com/beautify-web/js-beautify/issues/864))
* Bug in Less mixins ([#844](https://github.com/beautify-web/js-beautify/issues/844))
* Can't Nest Conditionals ([#680](https://github.com/beautify-web/js-beautify/issues/680))
* ternary operations ([#670](https://github.com/beautify-web/js-beautify/issues/670))
* Support newline before logical or ternary operator ([#605](https://github.com/beautify-web/js-beautify/issues/605))
* Provide config files for format and linting ([#336](https://github.com/beautify-web/js-beautify/issues/336))


## v1.6.2

### Description


### Closed Issues
* Add missing 'collapse-preserve-inline' option to js module ([#861](https://github.com/beautify-web/js-beautify/pull/861))


## v1.6.1

### Description
Fixes for regressions found in 1.6.0


### Closed Issues
* Inconsistent formatting for arrays of objects ([#860](https://github.com/beautify-web/js-beautify/issues/860))
* Publish v1.6.1 ([#859](https://github.com/beautify-web/js-beautify/issues/859))
* Space added to "from++" due to ES6 keyword  ([#858](https://github.com/beautify-web/js-beautify/issues/858))
* Changelog generator doesn't sort versions above 9 right ([#778](https://github.com/beautify-web/js-beautify/issues/778))
* space-after-anon-function not applied to object properties ([#761](https://github.com/beautify-web/js-beautify/issues/761))
* Separating 'input' elements adds whitespace ([#580](https://github.com/beautify-web/js-beautify/issues/580))
* Inline Format ([#572](https://github.com/beautify-web/js-beautify/issues/572))
* Preserve attributes line break in HTML ([#455](https://github.com/beautify-web/js-beautify/issues/455))
* Multiline Array ([#406](https://github.com/beautify-web/js-beautify/issues/406))


## v1.6.0

### Description
* Inline/short object and json preservation (all rejoice!)
* ES6 annotations, module import/export, arrow functions, concise methods, and more
* JSX spread attributes
* HTML wrap attributes, inline element fixes, doctype and php fixes
* Test framework hardening
* Windows build fixed and covered by appveyor continuous integration



### Closed Issues
* Individual tests pollute options object ([#855](https://github.com/beautify-web/js-beautify/issues/855))
* Object attribute assigned fat arrow function with implicit return of a ternary causes next line to indent ([#854](https://github.com/beautify-web/js-beautify/issues/854))
* Treat php tags as single in html ([#850](https://github.com/beautify-web/js-beautify/pull/850))
* Read piped input by default ([#849](https://github.com/beautify-web/js-beautify/pull/849))
* Replace makefile dependency with bash script ([#848](https://github.com/beautify-web/js-beautify/pull/848))
* list of HTML inline elements incomplete; wraps inappropriately ([#840](https://github.com/beautify-web/js-beautify/issues/840))
* Beautifying bracket-less if/elses ([#838](https://github.com/beautify-web/js-beautify/issues/838))
* <col> elements within a <colgroup> are getting indented incorrectly ([#836](https://github.com/beautify-web/js-beautify/issues/836))
* single attribute breaks jsx beautification ([#834](https://github.com/beautify-web/js-beautify/issues/834))
* Improve Python packaging ([#831](https://github.com/beautify-web/js-beautify/pull/831))
* Erroneously changes CRLF to LF on Windows. ([#829](https://github.com/beautify-web/js-beautify/issues/829))
* Can't deal with XHTML5 ([#828](https://github.com/beautify-web/js-beautify/issues/828))
* HTML after PHP is indented ([#826](https://github.com/beautify-web/js-beautify/issues/826))
* exponentiation operator ([#825](https://github.com/beautify-web/js-beautify/issues/825))
* Add support for script type "application/ld+json" ([#821](https://github.com/beautify-web/js-beautify/issues/821))
* package.json: Remove "preferGlobal" option ([#820](https://github.com/beautify-web/js-beautify/pull/820))
* Don't use array.indexOf() to support legacy browsers ([#816](https://github.com/beautify-web/js-beautify/pull/816))
* ES6 Object Shortand Indenting Weirdly Sometimes ([#810](https://github.com/beautify-web/js-beautify/issues/810))
* Implicit Return Function on New Line not Preserved ([#806](https://github.com/beautify-web/js-beautify/issues/806))
* Misformating "0b" Binary Strings ([#803](https://github.com/beautify-web/js-beautify/issues/803))
* Beautifier breaks ES6 nested template strings ([#797](https://github.com/beautify-web/js-beautify/issues/797))
* Misformating "0o" Octal Strings ([#792](https://github.com/beautify-web/js-beautify/issues/792))
* Do not use hardcoded directory for tests ([#788](https://github.com/beautify-web/js-beautify/pull/788))
* Handlebars {{else}} tag not given a newline ([#784](https://github.com/beautify-web/js-beautify/issues/784))
* Wrong indentation for XML header (<?xml version="1.0"?>) ([#783](https://github.com/beautify-web/js-beautify/issues/783))
* is_whitespace for loop incrementing wrong variable ([#777](https://github.com/beautify-web/js-beautify/pull/777))
* Newline is inserted after comment with comma_first ([#775](https://github.com/beautify-web/js-beautify/issues/775))
* Cannot copy more than 1000 characters out of CodeMirror buffer ([#768](https://github.com/beautify-web/js-beautify/issues/768))
* Missing 'var' in beautify-html.js; breaks strict mode ([#763](https://github.com/beautify-web/js-beautify/issues/763))
* Fix typo in the example javascript code of index.html ([#753](https://github.com/beautify-web/js-beautify/pull/753))


## v1.5.10

### Description
Hotfix for directives
Version jump due to release script tweaks


### Closed Issues
* Preserve directive doesn't work as intended ([#723](https://github.com/beautify-web/js-beautify/issues/723))


## v1.5.7

### Description
* Beautifier does not break PHP and Underscore.js templates
* Fix for SCSS pseudo classes and intperpolation/mixins
* Alternative Newline Characters in CSS and HTML
* Preserve formatting or completely ignore section of javascript using comments


### Closed Issues
* Support for legacy JavaScript versions (e.g. WSH+JScript & Co) ([#720](https://github.com/beautify-web/js-beautify/pull/720))
* Is \\n hard coded into CSS Beautifier logic? ([#715](https://github.com/beautify-web/js-beautify/issues/715))
* Spaces and linebreaks after # and around { } messing up interpolation/mixins (SASS/SCSS) ([#689](https://github.com/beautify-web/js-beautify/issues/689))
* Calls to functions get completely messed up in Sass (*.scss) ([#675](https://github.com/beautify-web/js-beautify/issues/675))
* No new line after selector in scss files ([#666](https://github.com/beautify-web/js-beautify/issues/666))
* using html-beautify on handlebars template deletes unclosed tag if on second line ([#623](https://github.com/beautify-web/js-beautify/issues/623))
* more Extra space after scss pseudo classes ([#557](https://github.com/beautify-web/js-beautify/issues/557))
* Unnecessary spaces in PHP code ([#490](https://github.com/beautify-web/js-beautify/issues/490))
* Some underscore.js template tags are broken ([#417](https://github.com/beautify-web/js-beautify/issues/417))
* Selective ignore using comments (feature request) ([#384](https://github.com/beautify-web/js-beautify/issues/384))


## v1.5.6

### Description
* JSX support!
* Alternative Newline Characters
* CSS and JS comment formatting fixes 
* General bug fixing


### Closed Issues


## v1.5.5

### Description
* Initial implementation of comma-first formatting - Diff-friendly literals!
* CSS: Add newline between rules
* LESS: improved function parameter formatting
* HTML: options for wrapping attributes
* General bug fixing

### Closed Issues


## v1.5.4

### Description
* Fix for LESS/CSS pseudo/classes
* Fix for HTML img tag spaces

https://github.com/beautify-web/js-beautify/compare/v1.5.3...v1.5.4

### Closed Issues


## v1.5.3

### Description
* High priority bug fixes
* Major fixes to css-beautifier to not blow up LESS/SCSS
* Lower priority bug fixes that were very ugly

https://github.com/beautify-web/js-beautify/compare/v1.5.2...v1.5.3

### Closed Issues


## v1.5.2

### Description
* Improved indenting for statements, array, variable declaration, "Starless" block-comments
* Support for bitwise-not, yield, get, set, let, const, generator functions
* Reserved words can be used as object property names
* Added options: space_after_anon_function, end-with-newline
* Properly tokenize Numbers (including decimals and exponents)
* Do not break "x++ + y"
* function declaration inside array behaves the same as in expression
* Close String literals at newline
* Support handlebar syntax 
* Check `<script>` "type"-attribute
* Allow `<style>` and `<script>` tags to be unformatted
* Port css nesting fix to python
* Fix python six dependency
* Initial very cursory support for ES6 module, export, and import 

https://github.com/beautify-web/js-beautify/compare/v1.5.1...v1.5.2

### Closed Issues


## v1.5.1

### Description
Highlights:
* Fixes var declaration of objects and arrays to indent correctly (#256, #430)
* Support keywords as IdentifierNames such as foo.catch() (#309, #351,#368, #378)
* Improved indenting for statements (#289)
* Improved ES6 support - let, const, template strings, and "fat arrow"
* Support for non-ASCII characters in variable names (#305)
* Multiple fixes to requirejs support and added tests to protect in future
* Improved LESS support (still plenty of room for improvement in this area)
* Do not add space after !!

https://github.com/einars/js-beautify/compare/v1.4.2...v1.5.1

### Closed Issues


