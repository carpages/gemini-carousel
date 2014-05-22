/**
 * @fileoverview

A jQuery plugin to build dynamic carousel's. The plugin works
mostly with CSS, meaning the markup is quite manipulatable.

### Notes
- Requires an include to ``carousel.scss`` in your Gemini build

### Features
- You can set the number of items per page in the markup's list. This is set
using the CSS extension ``carousel__list--{number}``.
- You can add custom navigation buttons within the carousel using the
``data-goto`` attribute. The value set will take you to the corresponding page.
You can see this in the example

 *
 * @namespace jquery.carousel
 * @copyright Carpages.ca 2014
 * @author Matt Rose <matt@mattrose.ca>

 * @requires jquery
 * @requires jquery.boiler
 * @requires jquery.fold
 * @requires jquery.respond
 * @requires gemini
 * @requires gemini.touch

 * @prop {boolean} pagination {@link jquery.carousel#pagination}
 * @prop {boolean} loop {@link jquery.carousel#loop}
 * @prop {string} container {@link jquery.carousel#container}
 * @prop {integer} indexList {@link jquery.carousel#indexList}
 * @prop {integer} scrollEventDelay {@link jquery.carousel#scrollEventDelay}
 * @prop {object} templates {@link jquery.carousel#templates}

 * @example
  <html>
    <div id="js-carousel-example" class="carousel">
      <ul class="carousel__list carousel__list--3">
        <li>Content for item 1</li>
        <li>Content for item 2</li>
        <li>Content for item 3</li>
        <li>Content for item 4</li>
      </ul>
      <!-- Can be added automatically using the pagination setting -->
      <button class="button" data-goto="--">Previous Page</button>
      <button class="button" data-goto="2">Page 2</button>
      <button class="button" data-goto="++">Next Page</button>
    </div>
  </html>

 * @example
  $('#js-carousel-example').carousel();
 */

define([
    'jquery-loader',
    'underscore',
    'jquery.carousel.templates',
    'jquery.boiler',
    'jquery.fold',
    'jquery.respond'
  ], function($, _, T){

  $.boiler('carousel', {

    defaults: {
      /**
       * Whether to append pagination to the the carousel.
       * @name jquery.carousel#pagination
       * @type Boolean
       * @default false
       */
      pagination: false,

      /**
       * Whether you want the carousel to loop.
       * @name jquery.carousel#loop
       * @type Boolean
       * @default false
       */
      loop: false,

      /**
       * Selector for the carousel's container. If false, carousel is $el.
       * @name jquery.carousel#container
       * @type String
       * @default false
       */
      container: false,

      /**
       * Specify which iteration of the .carousel__list you'd like to index for
       * the carousel.
       * @name jquery.carousel#indexList
       * @type Interger
       * @default 0
       */
      indexList: 0,

      /**
       * The delay until the scroll event is triggered on the carousel after
       * click.
       * @name jquery.carousel#scrollEventDelay
       * @type Integer
       * @default 0
       */
      scrollEventDelay: 0,

      /**
       * Precompiled Handlebar templates to replace default. Expecting 'nav' for
       * default navigation.
       * @name jquery.carousel#templates
       * @type Object
       * @default {}
       */
      templates: {}
    },

    // Event listeners
    events: {
      'click [data-goto]': '_handleClick'
    },

    // Initiate the plugin
    init: function(){
      var P = this;

      //Extend the templates
      P.T = $.extend(T, P.settings.templates);

      // Init variables
      P.currentItem = P.currentPage = 1;

      // Cache jQuery objects
      P.$carousel = !!P.settings.container ?
                    P.$el.find(P.settings.container) :
                    P.$el;
      P.$carouselLists = P.$el.find('.carousel__list');
      P.carouselList = P.$carouselLists[P.settings.indexList];
      P.$carouselList = $(P.carouselList);
      P.$currentPage = P.$el.find('[data-goto="1"]');

      // Update
      P._update();

      // Update on resize
      $.respond.bind('resize', function(e, scrn){
        P._update();
        P.gotoPage(P.currentPage);
      });

      // Touch Support
      if(GEM.Support.touch) {
        P._initTouch();
      }

    },

    /**
     * Update the carousel's cached values and render and templates
     * @name jquery.carousel#_update
     * @private
     * @function
     */
    _update: function(){
      var P = this;

      //Update Cache
      P.pageWidth = P.$carouselList.width();
      P.itemWidth = P.$carouselList.children('li:first-child').width();
      P.itemsPerPage = Math.round(P.pageWidth/P.itemWidth);

      P.itemCount = P.$carouselList.children('li').length;
      P.pageCount = Math.ceil( P.itemCount / P.itemsPerPage );

      // Template the pagination
      if(P.settings.pagination){
        P._paginate();
      }
    },

    /**
     * Render the pagination
     * @name jquery.carousel#_paginate
     * @private
     * @function
     */
    _paginate: function(){
      var P = this;

      //Template
      P.pagination = P.T.nav({
        'pageCount': P.pageCount
      });

      //Render
      if(!P.$pagination){
        //First load
        P.$pagination = $('<span/>').append(P.pagination);
        P.$el.append(P.$pagination);
      } else {
        //Replace exisiting
        P.$pagination.html(P.pagination);
      }

      //Cache
      P.$currentPageCount = P.$pagination.find('.carousel__current-page-count');
    },

    /**
     * Callback when a user clicks the carousel
     * @name jquery.carousel#_handleClick
     * @private
     * @function
     * @param {event#object} e Click event object
     * @param {element} target The targeted element
     */
    _handleClick: function(e, target){
      var P = this;
      var goTo = $(target).data('goto');

      if(!goTo) return;

      e.preventDefault();
      //Next
      if(goTo == "next" || goTo == "++")
        P.next();
      //Previous
      else if(goTo == "prev" || goTo == "previous" || goTo == "--")
        P.previous();
      //Go to page
      else P.gotoPage(goTo);
    },

    /**
     * Go to the next page on the carousel
     * @name jquery.carousel#next
     * @function
     */
    next: function(){
      var P = this;
      P.gotoPage(P.currentPage + 1);
    },

    /**
     * Go to the previous page on the carousel
     * @name jquery.carousel#previous
     * @function
     */
    previous: function(){
      var P = this;
      P.gotoPage(P.currentPage - 1);
    },

    /**
     * Go to a specific item in the carousel
     * @name jquery.carousel#_gotoItem
     * @private
     * @function
     */
    _gotoItem: function(item, animate){
      if(animate===undefined) animate = true;

      var P = this;
      if(item > P.itemCount) return;

      //Calculate the x offset in pixels
      var $item = P.$carouselList.children('li:nth-child('+item+')'),
          xOffset = $item.offset().left -
                    P.$carouselList.offset().left +
                    P.carouselList.scrollLeft;

      //Whether there are more items to scroll to
      var isMoreItems = $.rightoffold(
        P.$carouselList.find('li').last(),{
          container:P.$carouselList,
          threshold:-P.itemWidth-20
        }
      );

      //Make sure there's something to scroll to
      if ((item > P.currentItem && !isMoreItems) || xOffset < 0) return;

      //Change the item
      P.currentItem = item;
      if(animate){
        P.$carouselLists.animate({
          scrollLeft:xOffset
        }, 500);
      }else{
        P.$carouselLists.scrollLeft(xOffset);
      }

      setTimeout(
        _.bind(function(){
          $(this).trigger("scroll");
        }, P.$carousel),
      P.settings.scrollEventDelay);
    },

    /**
     * Go to a specific page in the carousel
     * @name jquery.carousel#gotoPage
     * @function
     * @param {Integer} page The desired page
     */
    gotoPage: function(page, animate){
      if(animate===undefined) animate = true;

      var P = this;
      if(page > P.pageCount) {
        if (P.settings.loop) P.gotoPage(1);
        return;
      }

      var item = P.itemsPerPage * (page - 1) + 1;

      P._gotoItem(item, animate);

      //Change active page
      P.currentPage = page;
      P.$currentPage.removeClass('is-active');
      P.$currentPage = P.$el.find('[data-goto="'+P.currentPage+'"]');
      P.$currentPage.addClass('is-active');
      if(!!P.$currentPageCount) P.$currentPageCount.html(page);
    },

    /**
     * Initiate the touch support for carousel's
     * @name jquery.carousel#_initTouch
     * @private
     * @function
     */
    _initTouch: function(){
      var P = this;

      require(['gemini.touch'], function(){

        //Add touch events
        P.$carouselList.hammer({
          drag_block_horizontal: true,
          drag_lock_to_axis: true,
          drag_lock_min_distance: 20,
          hold: false,
          tap: false
        }).on('release dragleft dragright swipeleft swiperight', function(ev){

          switch(ev.type) {
            case 'dragright':
            case 'dragleft':
              // stick to the finger
              var pageOffset = (P.currentPage-1)*P.pageWidth;
              var dragOffset = -ev.gesture.deltaX;

              // slow down at the first and last pane
              if(
                (P.currentPage == 1 && ev.gesture.direction == "right") ||
                (P.currentPage == P.pageCount && ev.gesture.direction == "left")
              ) {
                dragOffset *= 0.4;
              }

              P.$carouselLists.scrollLeft(pageOffset + dragOffset);
              break;

            case 'swipeleft':
              P.next();
              ev.gesture.stopDetect();
              break;

            case 'swiperight':
              P.previous();
              ev.gesture.stopDetect();
              break;

            case 'release':
              // more then 50% moved, navigate
              if(Math.abs(ev.gesture.deltaX) > P.pageWidth/2) {
                if(ev.gesture.direction == 'right') {
                  P.previous();
                } else {
                  P.next();
                }
              } else {
                P.gotoPage(P.currentPage);
              }
              break;
            }
        });
      });
    }

  });

  // Return the jquery object
  // This way you don't need to require both jquery and the plugin
  return $;

});
