/*!
 * GSB-Wrapper-Plugin fuer magnific popup
 *
 * s. auch http://dimsemenov.com/plugins/magnific-popup/
 *
 * Weitere Abhaengigkeit besteht zu hammer.js und jquery.hammer.js fuer's Swipen
 *
 * Author: rkrusenb
 */

//will be prettified eventually
(function($) {
    if (!$.gsb) {
        $.gsb = {};
    };
    $.gsb.lightbox = function(el, userOptions) {
        var lightbox = this,
            $el = lightbox.$el = $(el),
            options,
            disabled;
        function openerClickHandler(ev){
            if(!disabled){
                ev && typeof ev.preventDefault == "function" && ev.preventDefault();
                $el.data('magnificPopup').index = $(this).data('gsb.lightboxopener').index;
            }
            $el.magnificPopup('open');
        }
        function checkArrowState(mfp){
            if(!options.cycle && mfp.arrowLeft && mfp.arrowRight) {
                if(mfp.index == 0){
                    mfp.arrowLeft.find('img').attr('src', options.imagePrevInactive);
                } else {
                    mfp.arrowLeft.find('img').attr('src', options.imagePrev);
                }
                if(mfp.index == mfp.items.length - 1){
                    mfp.arrowRight.find('img').attr('src', options.imageNextInactive);
                } else {
                    mfp.arrowRight.find('img').attr('src', options.imageNext);
                }
            }
        }
        function makeGallery(){
            options.reallyMagnificOptions.callbacks.open = function(){
                var mfp = this;
                mfp.wrap.find('.mfp-close').appendTo(mfp.contentContainer);
                if(options.imagePrev) {
                    $('.mfp-arrow-left').append('<img alt="' + options.reallyMagnificOptions.gallery.tPrev + '" src="' + options.imagePrev + '">');
                }
                if(options.imageNext) {
                    $('.mfp-arrow-right').append('<img alt="' + options.reallyMagnificOptions.gallery.tNext + '" src="' + options.imageNext + '">');
                }
                mfp.prev = function(){
                    if(options.cycle || mfp.index != 0){
                        $.magnificPopup.proto.prev.call(this);
                    }
                }
                mfp.next = function(){
                    if(options.cycle || mfp.index != mfp.items.length - 1){
                        $.magnificPopup.proto.next.call(this);
                    }
                }

                checkArrowState(this);
                if(typeof mfp.contentContainer.hammer == "function" && !mfp.wrap.data('gsb.swipe')) {
                    mfp.contentContainer.hammer({
                        drag_block_horizontal: true,
                        stop_browser_behavior:{ touchAction: 'auto' },
                        swipe_velocity: 0.3
                    }).on('swiperight', function(){mfp.prev()}).on('swipeleft', function(){mfp.next()})
                    .data('gsb.swipe', {});
                }
            }; //end callbacks.open
            options.reallyMagnificOptions.callbacks.change = function(){
                checkArrowState(this);
            }; //end callbacks.change
            $.extend(options.reallyMagnificOptions, {
                items: $.map($(this).find(options.element), function(item){
                    return {
                        src: $(item).clone()
                        .find('.loupe').remove().end()
                        .removeClass('slick-slide').attr('style', null),
                        type: 'inline'
                    };
                })
            }, (userOptions || {}).magnificOptions);
            $el.magnificPopup(options.reallyMagnificOptions).unbind('click');
        } //end makeGallery
        lightbox.el = el;
        // Add a reverse reference to the DOM object
        lightbox.$el.data("gsb.lightbox", lightbox);
        lightbox.init = function() {
            var url, closeText, defer;
            options = lightbox.options = $.extend({}, $.gsb.lightbox.defaultOptions, userOptions);

            //init code here
            options.reallyMagnificOptions = $.gsb.lightbox.defaultOptions.magnificOptions;
            closeText = options.magnificOptions.tClose;
            $.extend(options.reallyMagnificOptions, {
                disableOn: function(){
                    return !disabled;
                },
                closeMarkup: '<button class="mfp-close">%title%</button>',
            });

            if(options.lightboxType == 'single') {
                url = $el.data('lightbox-href');
                if(url){
                    options.reallyMagnificOptions.type = 'ajax';
                    options.reallyMagnificOptions.ajax.settings.url = url;
                } else if($el.parents(options.element).length) {
                    options.reallyMagnificOptions.type = 'image';
                }
                $.extend(options.reallyMagnificOptions, (userOptions || {}).magnificOptions);
                $el.magnificPopup(options.reallyMagnificOptions);
            } else if(options.lightboxType == 'multiple') {
                url = $el.data('lightbox-href');
                if(url) {
                    $('<div />').load(url, makeGallery);
                } else {
                    $el.on('init.slideshow.gsb', makeGallery);
                }
                $el.on('init.slideshow.gsb', function(){
                    $el.find('.loupe').each(function(idx){
                        var opener = $(this),
                            openerData = opener.data('gsb.lightboxopener') || {};
                        openerData.index = idx;
                        opener.data('gsb.lightboxopener', openerData);
                        opener.click(openerClickHandler).keydown(function(e){
                            if(e.which == 23) {
                                $(this).click();
                            }
                        });
                    });
                });
                $.extend(true, options.reallyMagnificOptions, {
                    gallery: {
                        enabled: true
                    }
                });
                $.extend(options.reallyMagnificOptions, (userOptions || {}).magnificOptions);
            }

            //call addA11y here somewhere
        };
        lightbox.closeLightbox = function(){
            $el.magnificPopup('close');
        };
        lightbox.disable = function(){
            disabled = true;
        };
        lightbox.enable = function(){
            disabled = false;
        };

        lightbox.addA11y = function(){
            //add a11y enhancements
        };
        // Run initializer
        lightbox.init();
    };
    $.gsb.lightbox.defaultOptions = {
        lightboxType: 'single', //this is NOT the same as e.g. magnificOptions.type,
        cycle: false,
        element: '.picture',
        imagePrev: '', //MUST be specified if lightboxType = 'multiple'
        imageNext: '', //MUST be specified if lightboxType = 'multiple'
        magnificOptions: {
            //general label options
            tClose: typeof CLOSE == 'undefined' ? 'Schließen (Esc)' : CLOSE,
            gallery: {
                //gallery label options
                tPrev: typeof PREV == 'undefined' ? 'Vorheriges (linke Pfeiltaste)' : PREV, // Alt text on left arrow
                tNext: typeof NEXT == 'undefined' ? 'Nächstes (rechte Pfeiltaste)' : NEXT, // Alt text on right arrow
                tCounter: typeof LIGHTBOX_X_OF_Y == 'undefined' ? '%curr% von %total%' : LIGHTBOX_X_OF_Y // Markup for "1 of 7" counter
            },
            //main options
            type: 'ajax',
            closeOnContentClick: false,
            closeBtnInside: false,
            image: {
                verticalFit: true,
                titleSrc: function(){
                    return $(this.currItem && this.currItem.el).find('img').attr('alt')
                }
            },
            ajax: {
                settings: {}
            },
            callbacks: {
                afterChange: function(){
                    $(this.content).find('video, audio').each(function(_, el){
                        var data = $(el).data("gsb.Multimedia");
                        if(!data) {
                            data = $(el).gsb_Multimedia().data("gsb.Multimedia");
                        }
                        if(!data.workaround && typeof data.triggerRefresh == "function") {
                            data.workaround = true;
                            data.triggerRefresh(); //no idea why this fixes it, but nothing else will
                        }
                    });
                },
                buildControls: function(){
                    // re-appends controls inside the main container
                    if(this.contentContainer && this.arrowLeft && this.arrowRight) {
                        this.contentContainer.append(this.arrowLeft.add(this.arrowRight));
                    }
                },
                open: function(){
                    if(this.wrap && this.wrap.find) {
                        this.wrap.find('.mfp-close').appendTo(this.contentContainer);
                    }
                }
            }
        }
    };
    $.fn.gsb_lightbox = function(options) {
        return this.each(function() {(new $.gsb.lightbox(this, options));
        });
    };
})(jQuery);