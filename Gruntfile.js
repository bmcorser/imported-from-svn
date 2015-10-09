module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'app/js/**/*.js']
    },
    browserify: {
      build: {
        dest: "app/concat.js",
        src: ["app/js/**/*.js", "app/code.js"]
      },
      test: {
	dest: "unit_tests/src.js",
	src: ["app/js/**/*.js"]
      },
      specs: {
        dest: "unit_tests/test.js",
        src: ["unit_tests/specs/**/*.js"]
      }
    },
    jasmine: {
      src: "unit_tests/src.js",
      options: {
        specs: "unit_tests/test.js"
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', ['jshint', 'browserify:test', 'browserify:specs', 'jasmine', 'browserify:build']);
};
