module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'dev/js/**/*.js']
    },
    browserify: {
      build: {
        dest: 'app/app.js',
        src: ['dev/js/**/*.js']
      },
      test: {
      	dest: 'unit_tests/app-test.js',
	      src: ['dev/js/**/*.js', '!dev/js/bootstrap.js']
      },
      specs: {
        dest: 'unit_tests/all-tests.js',
        src: ['unit_tests/specs/**/*.js']
      }
    },
    jasmine: {
      src: 'unit_tests/app-test.js',
      options: {
        specs: 'unit_tests/all-tests.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('test', ['jshint', 'browserify:test', 'browserify:specs', 'jasmine']);
  grunt.registerTask('justbuild', ['browserify:build']);
  grunt.registerTask('default', ['test', 'justbuild']);
};
