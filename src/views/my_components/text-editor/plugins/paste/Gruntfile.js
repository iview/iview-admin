/*eslint-env node */

module.exports = function (grunt) {
  grunt.initConfig({
    "bolt-init": {
      "plugin": {
        config_dir: "config/bolt"
      }
    },

    "bolt-build": {
      "plugin": {
        config_js: "config/bolt/prod.js",
        output_dir: "scratch",
        main: "tinymce.plugins.paste.Plugin",
        filename: "plugin",

        generate_inline: true,
        minimise_module_names: true,

        files: {
          src: ["src/main/js/Plugin.js"]
        }
      }
    },

    copy: {
      "plugin": {
        files: [
          {
            src: "scratch/inline/plugin.raw.js",
            dest: "dist/paste/plugin.js"
          }
        ]
      }
    },

    eslint: {
      options: {
        config: "../../../.eslintrc"
      },

      src: [
        "src"
      ]
    },

    "bedrock-manual": {
      "all": {
        config: "config/bolt/browser.js",
        // Exclude webdriver tests
        testfiles: "src/test/js/browser/**/*Test.js",
        projectdir: "../../..",
        options: {
          stopOnFailure: true
        }
      }
    },

    "bedrock-auto": {
      phantomjs: {
        config: 'config/bolt/browser.js',
        testfiles: [
          'src/test/js/browser/**/*Test.js',
          'src/test/js/webdriver/**/*Test.js'
        ],
        projectdir: '../../..',
        browser: 'phantomjs',
        options: {
          stopOnFailure: true
        }
      },

      "chrome": {
        config: "config/bolt/browser.js",
        testfiles: [
          'src/test/js/webdriver/**/*Test.js'
        ],
        projectdir: "../../..",
        browser: "chrome",
        options: {
          stopOnFailure: true
        }
      }
    },

    "bolt-test": {
      "atomic" :{
        config: "config/bolt/atomic.js",
        files: {
          src: [ "src/test/js/atomic/**/*Test.js" ]
        }
      }
    },

    uglify: {
      options: {
        beautify: {
          ascii_only: true,
          screw_ie8: false
        },

        compress: {
          screw_ie8: false
        }
      },

      "plugin": {
        files: [
          {
            src: "scratch/inline/plugin.js",
            dest: "dist/paste/plugin.min.js"
          }
        ]
      }
    }
  });

  grunt.task.loadTasks("../../../node_modules/@ephox/bolt/tasks");
  grunt.task.loadTasks("../../../node_modules/@ephox/bedrock/tasks");
  grunt.task.loadTasks("../../../node_modules/grunt-contrib-copy/tasks");
  grunt.task.loadTasks("../../../node_modules/grunt-contrib-uglify/tasks");
  grunt.task.loadTasks("../../../node_modules/grunt-eslint/tasks");

  grunt.registerTask("default", ["bolt-init", "bolt-build", "copy", "eslint", "uglify"]);
  grunt.registerTask("tests", [ "bolt-test", "bedrock-auto:phantomjs", "bedrock-auto:chrome" ]);
};