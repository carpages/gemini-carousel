module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    jsdoc : {
      docstrap : {
        src : ['jquery.carousel.js'],
        options : {
          destination : "testdocs/",
          template : "node_modules/ink-docstrap/template",
          configure : "jsdoc.conf.json"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('default', ['jsdoc']);

};
