/*eslint-env node */

module.exports = function (grunt) {
  grunt.initConfig({
    "bolt-init": {
      "theme": {
        config_dir: "config/bolt"
      }
    },

    "bolt-build": {
      "theme": {
        config_js: "config/bolt/prod.js",
        output_dir: "scratch",
        main: "tinymce.themes.inlite.Theme",
        filename: "theme",

        generate_inline: true,
        minimise_module_names: true,

        files: {
          src: ["src/main/js/Theme.js"]
        }
      }
    },

    copy: {
      "theme": {
        files: [
          {
            src: "scratch/inline/theme.raw.js",
            dest: "dist/inlite/theme.js"
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

      "theme": {
        files: [
          {
            src: "scratch/inline/theme.js",
            dest: "dist/inlite/theme.min.js"
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
