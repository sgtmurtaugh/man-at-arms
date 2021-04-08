/*!
 * GSB-Wrapper-Plugin fuer Heise-2-Klickloesung
 *
 * s. auch http://www.heise.de/extras/socialshareprivacy/
 *
 * Author: rkrusenb
 */

(function($){
    if(!$ .gsb){
        $ .gsb = {};
    }
    $ .gsb.twoclickshare = function(el, userOptions){
        var state = {},
            options,
            wrapper,
            toggleElement,
            wrapperOuter;
        function init(){
            options = state.options = $ .extend(true, {}, $ .gsb.twoclickshare.defaultOptions, userOptions);
            //wrapperOuter = $('<' + options.wrapperTag + ' />').attr('id', options.wrapperId);
            //wrapper = state.wrapper = $('<div/>').addClass(options.wrapperInnerClass);
            //wrapperOuter.append(wrapper);

            wrapper = $('<' + options.wrapperTag + ' />').attr('id', options.wrapperId);
            wrapperInner = state.wrapper = $('<div/>').addClass(options.wrapperInnerClass);
            wrapper.append(wrapperInner);

            if(options.insert == 'prepend'){
                $(el).prepend(wrapper);
            } else if(options.insert == 'append'){
                $(el).append(wrapper);
            } else if(options.insert == 'before'){
                $(el).before(wrapper);
            } else if(options.insert == 'after'){
                $(el).after(wrapper);
            }

            wrapperInner.socialSharePrivacy(options.socialSharePrivacyOptions)
            .prepend('<h3>' + options.labelHeader + '</h3>')
            .find('.switch, .settings').attr('tabindex', 0).keydown(function(ev){
                if(ev.which == 13) {
                    $(this).trigger('click');
                }
            });
            if(options.toggleElement) {
                toggleElement = $(options.toggleElement, el);
                wrapper.find('li:first').before($('<li class="email"><a>' + options.labelFormLink + '</a></li>').find('a').attr('href', toggleElement.attr('href')).end());
                wrapper.data('gsb.twoclickshare', {oldHeight: wrapper.height()}).css({top: 0, display: 'none'}).attr('aria-hidden', 'true');
                toggleElement.attr('aria-haspopup', true).attr('aria-owns', options.wrapperId).attr('title', options.toggleTitleClosed).click(function(ev){
                    var oldHeight = wrapper.data('gsb.twoclickshare').oldHeight;
                    ev.preventDefault();
                    ev.stopPropagation();
                    if(wrapper.is('[aria-hidden=true]')) {
                        /* CSS sorgt dafür, dass es "hoch" slidet */
                        wrapper.attr('aria-hidden', 'false').css({height: 0, display: 'block'}).animate({top: -oldHeight-2, height: oldHeight}, 'slow').promise().done(function(){$(this).css('height', '').css({top: -$(this).height()-2})});
                        wrapper.find('.close').focus();
                        toggleElement.attr("title",options.toggleTitleOpened);
                    } else {
                        /* CSS sorgt dafür, dass es "runter" slidet */
                        wrapper.attr('aria-hidden', 'true').data('gsb.twoclickshare', {oldHeight: wrapper.height()}).animate({top: 0, height: 0}, 'slow').promise().done(function(){$(this).css({display: 'none'})});
                        toggleElement.attr("title",options.toggleTitleClosed);
                    }
                });
            }
            wrapperInner.prepend($('<button class="close" tabindex="0">' + options.labelCloseButton + '</button>').click(function(){
                toggleElement.trigger('click');
                toggleElement.focus();
            }));
        }

        init();
    };
    $ .gsb.twoclickshare.defaultOptions = {
        insert: 'after', //where the wrapper is inserted, in relation to el,
        wrapperId: 'share', //ID of the wrapper element,
        wrapperTag: 'div', //HTML tag of the wrapper element
        toggleElement: '',
        toggleTitleClosed: typeof SHOW_MORE != "undefined" ? SHOW_MORE : 'Mehr anzeigen',
        toggleTitleOpened: typeof SHOW_LESS != "undefined" ? SHOW_LESS : 'Schließen',
        wrapperInnerClass: 'wrapper-share',
        labelHeader: typeof TWOCLICKSHARE_TITLE != "undefined" ? TWOCLICKSHARE_TITLE : 'In sozialen Medien teilen',
        labelFormLink: typeof TWOCLICKSHARE_FORMLINKTEXT != "undefined" ? TWOCLICKSHARE_FORMLINKTEXT : 'E-Mail',
        labelCloseButton: typeof CLOSE != "undefined" ? CLOSE : 'Schließen',
        socialSharePrivacyOptions: { //see jquery.socialshareprivacy.js for all possible options
            css_path: '',
            services: {
                facebook: {
                    dummy_img: typeof(image_url_share_facebook_inactive) != "undefined" ? image_url_share_facebook_inactive : ''
                },
                twitter: {
                    dummy_img: typeof(image_url_share_twitter_inactive) != "undefined" ? image_url_share_twitter_inactive : ''
                },
                gplus: {
                    dummy_img: typeof(image_url_share_gplus_inactive) != "undefined" ? image_url_share_gplus_inactive : ''
                }
            }
        }
    };

    $ .fn.gsb_twoclickshare = function(options){
        return $ (this).map(function(){
            return $ .gsb.twoclickshare(this, options);
        });
    };
}(jQuery));