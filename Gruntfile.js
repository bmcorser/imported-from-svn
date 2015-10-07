module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'app/js/**/*.js']
    },
    browserify: {
      build: {
        dest: "app/concat.js",
        src: ["app/**/*.js"]
      },
      specs: {
        dest: "unit_tests/test.js",
        src: ["unit_tests/specs/**/*.js"]
      }
    },
    jasmine: {
      src: "app/concat.js",
      options: {
        specs: "unit_tests/test.js"
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', ['jshint', 'browserify', 'jasmine']);
};