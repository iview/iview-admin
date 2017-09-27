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
        main: "tinymce.plugins.autolink.Plugin",
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
            dest: "dist/autolink/plugin.js"
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
            dest: "dist/autolink/plugin.min.js"
          }
        ]
      }
    }
  });

  grunt.task.loadTasks("../../../node_modules/@ephox/bolt/tasks");
  grunt.task.loadTasks("../../../node_modules/grunt-contrib-copy/tasks");
  grunt.task.loadTasks("../../../node_modules/grunt-contrib-uglify/tasks");
  grunt.task.loadTasks("../../../node_modules/grunt-eslint/tasks");

  grunt.registerTask("default", ["bolt-init", "bolt-build", "copy", "eslint", "uglify"]);
};