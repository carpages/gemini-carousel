/* eslint key-spacing: ["error", { "align": "colon" }] */
require.config({
  baseUrl: '../',
  paths  : {
    'jquery'                   : 'bower_components/jquery/dist/jquery',
    'jquery.boiler'            : 'bower_components/jquery-boiler/jquery.boiler',
    'handlebars'               : 'bower_components/handlebars/handlebars.runtime',
    'underscore'               : 'bower_components/underscore/underscore',
    'gemini'                   : 'bower_components/gemini-loader/gemini',
    'gemini.fold'              : 'bower_components/gemini-fold/gemini.fold',
    'gemini.respond'           : 'bower_components/gemini-respond/gemini.respond',
    'gemini.support'           : 'bower_components/gemini-support/gemini.support',
    'gemini.carousel.templates': 'templates'
  }
});

require([ 'gemini', 'gemini.carousel' ], function( G ) {
  $( '.carousel' ).carousel();
});
