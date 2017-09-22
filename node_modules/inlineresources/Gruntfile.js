/*global module:false*/
"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: {
            options: {
                files: [
                    'build/testSuite.js',
                    {pattern: 'test/fixtures/**', included: false}
                ],
                frameworks: ['jasmine'],
                reporters: 'dots'
            },
            ci: {
                proxies: {
                    '/test/fixtures/': 'http://localhost:9988/base/test/fixtures/'
                },
                port: 9988,
                singleRun: true,
                browsers: ['PhantomJS']
            },
            local: {
                proxies: {
                    '/fixtures/': 'http://localhost:9989/base/test/fixtures/'
                },
                port: 9989,
                background: true,
                singleRun: false
            }
        },
        browserify: {
            xmlserializer: {
                src: 'node_modules/xmlserializer/lib/serializer.js',
                dest: 'build/dependencies/xmlserializer.js',
                options: {
                    browserifyOptions: {
                        standalone: 'xmlserializer'
                    }
                }
            },
            testSuite: {
                src: 'test/specs/*.js',
                dest: 'build/testSuite.js',
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                }
            },
            browser: {
                src: 'src/inline.js',
                dest: 'build/<%= pkg.name %>.js',
                options: {
                    browserifyOptions: {
                        standalone: '<%= pkg.name %>',
                    },
                    external: ['cssom', 'ayepromise', 'url']
                }
            },
            allinone: {
                src: 'src/inline.js',
                dest: 'build/<%= pkg.name %>.allinone.js',
                options: {
                    browserifyOptions: {
                        standalone: '<%= pkg.name %>'
                    }
                }
            },
            allinoneNoCssom: {
                src: 'src/inline.js',
                dest: 'build/<%= pkg.name %>.allinone.nocssom.js',
                options: {
                    browserifyOptions: {
                        standalone: '<%= pkg.name %>'
                    },
                    exclude: ['cssom']
                }
            }
        },
        clean: {
            dist: ['build/*.js', 'build/dependencies/', 'dist/'],
            all: ['build']
        },
        concat: {
            dist: {
                options: {
                    banner:'/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        '* <%= pkg.homepage %>\n' +
                        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                        ' Licensed <%= pkg.license %> */\n'
                },
                src: ['build/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            allinone: {
                options: {
                    banner:'/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        '* <%= pkg.homepage %>\n' +
                        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                        ' Licensed <%= pkg.license %> */\n' +
                        '/* Integrated dependencies:\n' +
                        ' * url (MIT License),\n' +
                        ' * CSSOM.js (MIT License),\n' +
                        ' * css-font-face-src (BSD License),\n' +
                        ' * ayepromise (BSD License & WTFPL) */\n'
                },
                files: {
                    'dist/<%= pkg.name %>.allinone.js': ['build/<%= pkg.name %>.allinone.js']
                }
            },
            allinoneNoCssom: {
                options: {
                    banner:'/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        '* <%= pkg.homepage %>\n' +
                        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                        ' Licensed <%= pkg.license %> */\n' +
                        '/* Integrated dependencies:\n' +
                        ' * url (MIT License),\n' +
                        ' * css-font-face-src (BSD License),\n' +
                        ' * ayepromise (BSD License & WTFPL) */\n'
                },
                files: {
                    'dist/<%= pkg.name %>.allinone.nocssom.js': ['build/<%= pkg.name %>.allinone.nocssom.js']
                }
            }
        },
        watch: {
            karma: {
                files: [
                    'src/*.js',
                    'test/specs/*.js',
                    // Ignore files generated by flycheck
                    '!**/flycheck_*.js'
                ],
                tasks: ['browserify:testSuite', 'karma:local:run']
            },
            build: {
                files: [
                    'src/*.js',
                    'test/specs/*.js'
                ],
                tasks: ['browserify:testSuite']
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                undef: true,
                unused: true,
                eqnull: true,
                trailing: true,
                browser: true,
                node: true,
                strict: true,
                globals: {
                    require: true,
                    exports: true,

                    cssom: true,
                    url: true,
                    ayepromise: true
                },
                exported: ['inline', 'inlineCss', 'inlineUtil']
            },
            uses_defaults: [
                'src/*.js',
                'Gruntfile.js',
            ],
            with_overrides: {
                options: {
                    globals: {
                        jasmine: true,
                        describe: true,
                        it: true,
                        xit: true,
                        beforeEach: true,
                        afterEach: true,
                        expect: true,
                        spyOn: true,

                        cssom: true,
                        url: true,
                        ayepromise: true
                    },
                    ignores: ['test/fixtures/']
                },
                files: {
                    src: ['test/']
                }
            }
        },
        "regex-check": {
            files: [
                'src/*',
                // 'test/{,*/}*'
                'test/*.html',
                'test/*.js',
                'test/*/*.html',
            ],
            options: {
                pattern : /FIXME/g
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-regex-check');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-umd');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('testDeps', [
        'browserify:xmlserializer'
    ]);

    grunt.registerTask('testWatch', [
        'karma:local:start',
        'watch:karma'
    ]);

    grunt.registerTask('test', [
        'browserify:testSuite',
        'jshint',
        'karma:ci',
        'regex-check'
    ]);

    grunt.registerTask('build', [
        'browserify:browser',
        'concat:dist',
        'browserify:allinone',
        'browserify:allinoneNoCssom',
        'uglify'
    ]);

    grunt.registerTask('default', [
        'clean:dist',
        'testDeps',
        'test',
        'build'
    ]);

};
