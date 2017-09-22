/*global module:false*/
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            src: [
                'build/dependencies/*.js',
                'node_modules/ayepromise/ayepromise.js',
                'src/util.js',
                'src/proxies.js',
                'src/documentUtil.js',
                'src/documentHelper.js',
                'src/mediaQueryHelper.js',
                'src/browser.js',
                'src/svg2image.js',
                'src/document2svg.js',
                'src/rasterize.js',
                'src/index.js'
            ],
            options: {
                specs: 'test/specs/*.js',
                vendor: [
                    'node_modules/imagediff/imagediff.js'
                ],
                helpers: [
                    'test/helpers.js',
                    'test/diffHelper.js',
                    'test/testHelper.js',
                    'test/gruntpath.js'
                ],
                display: 'short',
                summary: true
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
            sanedomparsererror: {
                src: 'node_modules/sane-domparser-error/index.js',
                dest: 'build/dependencies/sane-domparser-error.js',
                options: {
                    browserifyOptions: {
                        standalone: 'sanedomparsererror'
                    }
                }
            },
            url: {
                src: 'node_modules/url/url.js',
                dest: 'build/dependencies/url.js',
                options: {
                    browserifyOptions: {
                        standalone: 'url'
                    }
                }
            },
            cssmediaquery: {
                src: 'node_modules/css-mediaquery/index.js',
                dest: 'build/dependencies/cssmediaquery.js',
                options: {
                    browserifyOptions: {
                        standalone: 'cssMediaQuery'
                    }
                }
            },
            inlineresources: {
                src: 'node_modules/inlineresources/src/inline.js',
                dest: 'build/dependencies/inlineresources.js',
                options: {
                    browserifyOptions: {
                        'standalone': 'inlineresources'
                    }
                }
            },
            allinone: {
                src: 'dist/rasterizeHTML.js',
                dest: 'build/rasterizeHTML.allinone.js',
                options: {
                    browserifyOptions: {
                        standalone: 'rasterizeHTML'
                    }
                }
            }
        },
        clean: {
            all: ['build']
        },
        umd: {
            all: {
                src: 'build/rasterizeHTML.concat.js',
                dest: 'build/rasterizeHTML.umd.js',
                objectToExport: 'rasterizeHTML',
                indent: '    ',
                deps: {
                    'default': ['url', 'cssMediaQuery', 'xmlserializer', 'sanedomparsererror', 'ayepromise', 'inlineresources'],
                    cjs: ['url', 'css-mediaquery', 'xmlserializer', 'sane-domparser-error', 'ayepromise', 'inlineresources'],
                    amd: ['url', 'css-mediaquery', 'xmlserializer', 'sane-domparser-error', 'ayepromise', 'inlineresources']
                }
            }
        },
        concat: {
            one: {
                src: [
                    'src/util.js',
                    'src/proxies.js',
                    'src/documentUtil.js',
                    'src/documentHelper.js',
                    'src/mediaQueryHelper.js',
                    'src/browser.js',
                    'src/svg2image.js',
                    'src/document2svg.js',
                    'src/rasterize.js',
                    'src/index.js'
                ],
                dest: 'build/rasterizeHTML.concat.js'
            },
            dist: {
                options: {
                    banner:'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        '* <%= pkg.homepage %>\n' +
                        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                        ' Licensed <%= pkg.license %> */\n'
                },
                src: ['build/rasterizeHTML.umd.js'],
                dest: 'dist/<%= pkg.title %>'
            }
        },
        uglify: {
            dist: {
                options: {
                    banner:'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        '* <%= pkg.homepage %>\n' +
                        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                        ' Licensed <%= pkg.license %> */\n'
                },
                files: {
                    'dist/rasterizeHTML.min.js': ['dist/rasterizeHTML.js']
                }
            },
            allinone: {
                options: {
                    banner:'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        '* <%= pkg.homepage %>\n' +
                        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                        ' Licensed <%= pkg.license %> */\n' +
                        '/* Integrated dependencies:\n' +
                        ' * url (MIT License),\n' +
                        ' * css-mediaquery (BSD License),\n' +
                        ' * CSSOM.js (MIT License),\n' +
                        ' * ayepromise (BSD License & WTFPL),\n' +
                        ' * xmlserializer (MIT License),\n' +
                        ' * sane-domparser-error (BSD License),\n' +
                        ' * css-font-face-src (BSD License),\n' +
                        ' * inlineresources (MIT License) */\n'
                },
                files: {
                    'dist/rasterizeHTML.allinone.js': ['build/rasterizeHTML.allinone.js']
                }
            }
        },
        watch: {
            files: [
                'src/*.js',
                'test/specs/*.js'
            ],
            tasks: ['jshint', 'jasmine']
        },
        jshint: {
            all: ["src/**/*.js", "test/**/*.js", "*.js"],
            options: {
                jshintrc: true
            }
        },
        "regex-check": {
            files: [
                'src/*',
                'test/**/*.html',
                'test/**/*.js'
            ],
            options: {
                pattern : /FIXME/g
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-regex-check');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-umd');

    grunt.registerTask('deps', [
        'browserify:url',
        'browserify:cssmediaquery',
        'browserify:xmlserializer',
        'browserify:sanedomparsererror',
        'browserify:inlineresources'
    ]);

    grunt.registerTask('test', [
        'jshint',
        'jasmine',
        'regex-check'
    ]);

    grunt.registerTask('build', [
        'concat:one',
        'umd',
        'concat:dist',
        'browserify:allinone',
        'uglify'
    ]);

    grunt.registerTask('default', [
        'clean',
        'deps',
        'test',
        'build'
    ]);

};
