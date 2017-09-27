/*eslint-env node */

module.exports = function (grunt) {
  grunt.initConfig({
    copy: {
      "plugin": {
        files: [
          { expand: true, cwd: 'src/main', src: ['img/**'], dest: 'dist/compat3x' },
          { expand: true, cwd: 'src/main', src: ['css/**'], dest: 'dist/compat3x' },
          { expand: true, cwd: 'src/main/js', src: ['utils/**', 'plugin.js', 'tiny_mce_popup.js'], dest: 'dist/compat3x' }
        ]
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
            src: "src/main/js/plugin.js",
            dest: "dist/compat3x/plugin.min.js"
          }
        ]
      }
    }
  });

  grunt.task.loadTasks("../../../../node_modules/@ephox/bolt/tasks");
  grunt.task.loadTasks("../../../../node_modules/grunt-contrib-copy/tasks");
  grunt.task.loadTasks("../../../../node_modules/grunt-contrib-uglify/tasks");
  grunt.task.loadTasks("../../../../node_modules/grunt-eslint/tasks");

  grunt.registerTask("default", ["copy", 'uglify']);
};