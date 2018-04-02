require.config({
  baseUrl: '../',
  paths: {
    jquery: 'bower_components/jquery/dist/jquery',
    'jquery.boiler': 'bower_components/jquery-boiler/jquery.boiler',
    handlebars: 'bower_components/handlebars/handlebars.runtime',
    underscore: 'bower_components/underscore/underscore',
    gemini: 'bower_components/gemini-loader/gemini',
    'gemini.fold': 'bower_components/gemini-fold/gemini.fold',
    'gemini.respond': 'bower_components/gemini-respond/gemini.respond',
    'gemini.support': 'bower_components/gemini-support/gemini.support',
    'gemini.touch': 'bower_components/gemini-touch/gemini.touch',
    fastclick: 'bower_components/fastclick/lib/fastclick',
    'jquery.hammer': 'bower_components/jquery-hammerjs/jquery.hammer',
    hammerjs: 'bower_components/hammerjs/hammer',
    'gemini.carousel.templates': 'templates'
  }
});

require([ 'gemini', 'gemini.carousel' ], function( G ) {
  G( '.carousel' ).carousel();
});
