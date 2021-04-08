/*!
 * @name module_carousel
 * @author @dkoslows
 * */
;(function($){
    if (!$.hjb) {
        $.hjb = {};
    }

    $.hjb.initializeCarousel = function(el, options){
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("hjb.initializeCarousel", base);

        base.init = function(){
            base.options = $.extend({}, $.hjb.initializeCarousel.defaultOptions, options);

            base.sliderElement = $(base.el).find('.carousel_itemContainer');
            if (base.sliderElement !== null && typeof base.sliderElement !== 'undefined'){
                $(base.sliderElement).slick({
                    arrows: false,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    centerMode: true,
                    focusOnSelect: true,
                    infinite: true,
                    draggable: false,
                    adaptiveHeight: true,
                    variableWidth: true,
                    responsive: [
                        {
                            breakpoint: 640,
                            settings: {
                                slidesToShow: 1,
                                arrows: true,
                                fade: true,
                                waitForAnimate: false,
                                variableWidth: false
                            }
                        }
                    ]
                });

                base.equalizeHeight();
            }
        };

        base.equalizeHeight = function(){

            let carouselItems = $(base.el).find('.slick-slide');



        };

        base.init();
    };

    $.hjb.initializeCarousel.defaultOptions = {

    };

    $.fn.hjb_initializeCarousel = function(options){
        return this.each(function() {(new $.hjb.initializeCarousel(this, options));
        });
    }

})(jQuery);