/*
 * Added for Saucelabs
 * https://github.com/axemclion/grunt-saucelabs#test-result-details-with-qunit
 */
var log = [];
var testName;

QUnit.done(function (test_results) {
  var tests = [];
  for(var i = 0, len = log.length; i < len; i++) {
    var details = log[i];
    tests.push({
      name: details.name,
      result: details.result,
      expected: details.expected,
      actual: details.actual,
      source: details.source
    });
  }
  test_results.tests = tests;

  window.global_test_results = test_results;
});
QUnit.testStart(function(testDetails){
  QUnit.log(function(details){
    if (!details.result) {
      details.name = testDetails.name;
      log.push(details);
    }
  });
});

/*
 * Require for Tests
 */
requirejs.config({
  baseUrl: '../',
  paths: {
    'underscore':                'bower_components/underscore/underscore',
    'jquery':                    'bower_components/jquery/dist/jquery',
    'handlebars':                'bower_components/handlebars/handlebars.runtime',
    'jquery.boiler':             'bower_components/jquery-boiler/jquery.boiler',
    'gemini.support':            'bower_components/gemini-support/gemini.support',
    'gemini':                    'bower_components/gemini-loader/gemini',
    'gemini.fold':               'bower_components/gemini-fold/gemini.fold',
    'gemini.respond':            'bower_components/gemini-respond/gemini.respond',
    'gemini.touch':              'bower_components/gemini-touch/gemini.touch',
    'fastclick':                 'bower_components/fastclick/lib/fastclick',
    'hammerjs':                  'bower_components/hammerjs/hammer',
    'jquery.hammer':             'bower_components/jquery-hammerjs/jquery.hammer',
    'gemini.carousel.templates': 'templates'
  }
});

require(['gemini', 'gemini.carousel'], function(G) {
  QUnit.start();

  // Rounding shortcut
  var R = Math.round;

  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  /**
   * Helpers
   */
  function visibleInBody(el, container) {
    if (container === undefined) container = 'body';

    var Container = {};
    var El = {};
    var $container = $(container);
    var $el = $(el);

    Container.top    = $container.scrollTop();
    Container.bottom = Container.top + $container.height();
    Container.left   = $container.scrollLeft();
    Container.right  = Container.left + $container.width();

    El.top    = $el.offset().top;
    El.bottom = El.top + $el.height();
    El.left   = $el.offset().left;
    El.right  = El.left + $el.width();

    return ((El.bottom <= Container.bottom) && (El.top >= Container.top)) &&
           ((El.right <= Container.right) && (El.left >= Container.left)) &&
           $el.width() > 0 &&
           $el.height() > 0 &&
           (parseFloat($el.css('opacity')) > 0);
  }

  /**
   * CORE
   */
  QUnit.module('Core Plugin Tests', {
    beforeEach: function() {
      this.$el = $('#js-fixture-1').clone();
    }
  });

  QUnit.test('carousel() is defined', function(assert) {
    assert.expect(1);

    assert.strictEqual(typeof this.$el.carousel, 'function');
  });

  QUnit.test('Is chainable', function(assert) {
    assert.expect(1);

    assert.strictEqual(this.$el.carousel(), this.$el);
  });

  QUnit.test('Public access to plugin object', function(assert) {
    assert.expect(1);

    this.$el.carousel();
    assert.strictEqual(this.$el.data('carousel').el, this.$el[0]);
  });

  /**
   * Functionality
   */
  var lifecycle = {
    beforeEach: function() {
      this.$el = $('#js-fixture-1').clone();
      this.$list = this.$el.find('ul');
      this.$first = this.$el.find('li').first();
      $('#js-fixtures').append(this.$el);
    },
    afterEach: function() {
      this.$el.remove();
    }
  };
  QUnit.module('Basic Functionality', lifecycle);

  QUnit.test('Displays one item per page by default', function(assert) {
    assert.expect(1);

    assert.ok(R(this.$el.width() / this.$first.width()) == 1);
  });

  QUnit.test('Adding extensions changes carousel', function(assert) {
    assert.expect(4);

    this.$el.removeClass('carousel').addClass('carousel--2');

    assert.ok(R(this.$el.width() / this.$first.width()) == 2);

    this.$el.removeClass('carousel--2').addClass('carousel--3');

    assert.ok(R(this.$el.width() / this.$first.width()) == 3);

    this.$el.removeClass('carousel--3').addClass('carousel--4');

    assert.ok(R(this.$el.width() / this.$first.width()) == 4);

    this.$el.removeClass('carousel--4').addClass('carousel--5');

    assert.ok(R(this.$el.width() / this.$first.width()) == 5);
  });

  QUnit.test('Changes to next page on next', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var t = this;

    t.$el.carousel();

    assert.ok(
      Math.abs(t.$el.offset().left - t.$first.offset().left) < 1
    );

    t.$el.carousel('next');

    setTimeout(function() {
      assert.ok(
        Math.abs(t.$el.offset().left - t.$list.find('li:nth-child(2)').offset().left) < 1
      );
      done();
    }, 500);
  });

  QUnit.test('Changes to previous page on previous', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var done2 = assert.async();
    var t = this;

    t.$el.carousel();

    t.$el.carousel('next');

    setTimeout(function() {
      assert.ok(
        Math.abs(t.$el.offset().left - t.$list.find('li:nth-child(2)').offset().left) < 1
      );
      done();

      t.$el.carousel('previous');

      setTimeout(function() {
        assert.ok(
          Math.abs(t.$el.offset().left - t.$first.offset().left) < 1
        );
        done2();
      }, 500);
    }, 500);
  });

  QUnit.test('Does not go before first', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var t = this;

    t.$el.carousel();

    assert.ok(
      Math.abs(t.$el.offset().left - t.$first.offset().left) < 1
    );

    t.$el.carousel('previous');

    setTimeout(function() {
      assert.ok(
        Math.abs(t.$el.offset().left - t.$first.offset().left) < 1
      );
      done();
    }, 500);
  });

  QUnit.test('Does not go after last', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var t = this;
    var $last = t.$list.find('li').last();

    t.$el.carousel();
    t.$el.carousel('gotoPage', t.$list.find('li').length, false);

    assert.ok(
      Math.abs(t.$el.offset().left - $last.offset().left) < 1
    );

    t.$el.carousel('next');

    setTimeout(function() {
      assert.ok(
        Math.abs(t.$el.offset().left - $last.offset().left) < 1
      );
      done();
    }, 500);
  });

  QUnit.test('Listens to buttons with data-goto values', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var t = this;

    t.$el.carousel();

    assert.ok(
      Math.abs(t.$el.offset().left - t.$first.offset().left) < 1
    );

    t.$el.find('#js-button-2').trigger('click');

    setTimeout(function() {
      assert.ok(
        Math.abs(t.$el.offset().left - t.$list.find('li:nth-child(2)').offset().left) < 1
      );
      done();
    }, 500);
  });

  QUnit.test('Adjusts carousel size on resize', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var t = this;

    t.$el.removeClass('carousel').addClass('carousel--2');

    assert.ok(R(t.$el.width() / t.$first.width()) == 2);

    t.$el.width(320);

    setTimeout(function() {
      assert.ok(R(t.$el.width() / t.$first.width()) == 2);
      done();
    }, 500);

  });

  /* Can't properly trigger screen resize for text :(
  QUnit.test('Jumps to first item on screen resize', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var t = this;

    t.$el.carousel();

    assert.ok(
      Math.abs(t.$el.offset().left - t.$first.offset().left) < 1
    );

    t.$el.carousel('next');

    setTimeout(function() {
      $.respond.trigger('resize');

      setTimeout(function() {
        assert.ok(
          Math.abs(t.$el.offset().left - t.$first.offset().left) < 1
        );
        done();
      }, 500);
    }, 500);

  });*/

  //Settings
  //It should add pagination
  //It should turn off animation on request
  //It should loop when set
  //It should adjust to specified container
  //It should target the specified carousel
  //It should adjust scroll speed when specified
  //It should map thumbnails when specified
  //It should trigger an onChange event

});
