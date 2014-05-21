define([
    'jquery.boiler',
    'underscore',
    'jquery.carousel.templates',
    'jquery.fold',
    'jquery.respond'
  ], function($, _, T){

  $.boiler('carousel', {

    defaults: {
      scrollEventDelay: 0,
      container: false,
      indexList: 0,
      pagination: false,
      paginationClass: 'pagination--bullets',
      loop: false,
      templates: {}
    },

    events: {
      'click [data-goto]': 'handleClick'
    },

    init: function(){
      var P = this;

      //Extend the templates
      P.T = $.extend(T, plugin.settings.templates);

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

      // Render
      P.render();

      // Update on resize
      $.respond.bind('resize', function(e, scrn){
        P.render();
        P.gotoPage(P.currentPage);
      });

      // Touch Support
      if(CP.Support.touch) {
        P.initTouch();
      }

    },

    render: function(){
      var P = this;

      //Update Cache
      P.pageWidth = P.$carouselList.width();
      P.itemWidth = P.$carouselList.children('li:first-child').width();
      P.itemsPerPage = Math.round(P.pageWidth/P.itemWidth);

      P.itemCount = P.$carouselList.children('li').length;
      P.pageCount = Math.ceil( P.itemCount / P.itemsPerPage );

      // Template the pagination
      if(P.settings.pagination){
        P.paginate();
      }
    },

    paginate: function(){
      var P = this;

      //Template
      P.pagination = P.T.nav({
        // This bugs out ie8... super weird
        // Issue with using "class"
        // http://www.ecma-international.org/ecma-262/5.1/#sec-7.6.1.1
        'class': P['settings']['paginationClass'],
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

    handleClick: function(e, target){
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

    next: function(){
      var P = this;
      P.gotoPage(P.currentPage + 1);
    },

    previous: function(){
      var P = this;
      P.gotoPage(P.currentPage - 1);
    },

    _gotoItem: function(item, animate){
      if(animate===undefined) animate = true;

      var P = this;
      if(item > P.itemCount) return;

      //Calculate the x offset in pixels
      var $item = P.$carouselList.children('li:nth-child('+item+')');
      var xOffset = $item.offset().left - P.$carouselList.offset().left + P.carouselList.scrollLeft;

      //Whether there are more items to scroll to
      var isMoreItems = $.rightoffold(P.$carouselList.find('li').last(),{container:P.$carouselList, threshold:-P.itemWidth-20});

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

    initTouch: function(){
      var P = this;

      require(['cp.touch'], function(){

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
              if((P.currentPage == 1 && ev.gesture.direction == "right") ||
                (P.currentPage == P.pageCount && ev.gesture.direction == "left")) {
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
