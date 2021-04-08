/**
 * @fileOverview Banner-Box - Dieses Modul ermöglicht die Darstellung einer Information in Form eines Popup-Banner,
 * welches sich animiert ein- und ausgeblendet. Dieser Banner stellt eine Überschrift, einen Linktext sowie ein Bild,
 * die aus einem Textbaustein (TextFragment) ausgelesen werden, dar. Beim erstmaligen Aufrufen der Seite mit
 * konfiguriertem Banner wird dieser animiert im unteren Bildschirmbereich eingeblendet.
 * @author boelenbe
 * @version 1.0.0
 */
;
(function ($) {
    if (!$.gsb) {
        $.gsb = {};
    };

    /**
     * Initialisiert die Banner-Box
     * @param {DOM} el DOM-Banner-Element
     * @param {options} options JSON-Objekt zum überschreiben der Default-Options
     */

    $.gsb.banner = function (el, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        // Access to $ and DOM versions of element
        base.$el = $(el);
        base.el = el;
        // Add a reverse reference to the DOM object
        base.$el.data("gsb.banner", base);

        base.init = function () {
            base.options = $.extend({}, $.gsb.banner.defaultOptions, options);
            base.$el.gsb_responsiveListener(base);
        };

        base.show = function () {
            if(base.options.animation) {
                if(base.options.position == 'top') { base.$el.animate({top: 0}, base.options.animationSpeed); } else { base.$el.animate({bottom: 0}, base.options.animationSpeed); }
            } else {
                base.$el.css(base.options.position, 0);
            }
        }
        $.gsb.banner.prototype.createBanner = function() {
            var bannerHeight = base.$el.outerHeight() + base.options.topOffset;

            // hide banner
            base.$el.css(base.options.position, -bannerHeight);

            // if no cookie
            if (!$.cookie(base.options.cookieName)) {
                // display banner with or without animation
                base.show();
                // set cookie with expiredate
                $.cookie(base.options.cookieName, "visible", {expires: base.options.cookieLifeTimeInDaysVisible, path: "/"});
            } else {
                // if banner disabled (cookie = "visible")
                if ($.cookie(base.options.cookieName) === "visible") {
                    // display banner with or without animation
                    base.show();
                } else {
                    // hide banner
                    base.$el.css("display", "none");
                }
            }

            // create close button
            base.$el.find(base.options.buttonClass).click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                // hide banner
                if(base.options.animation) {
                    if(base.options.position == 'top') {
                        base.$el.animate({top: -bannerHeight}, base.options.animationSpeed, function(){
                            base.$el.css("display", "none");
                        });
                    } else {
                        base.$el.animate({bottom: -bannerHeight}, base.options.animationSpeed, function(){
                            base.$el.css("display", "none");
                        });
                    }
                } else {
                    base.$el.css("display", "none");
                }
                // set cookie with expiredate
                $.cookie(base.options.cookieName, "closed", {expires: base.options.cookieLifeTimeInDaysClosed, path: "/"});
            });
        }

        // Run initializer
        base.init();
    };

    $.gsb.banner.defaultOptions = {
        animation: typeof(animation) == 'undefined' ? false : animation,
        animationSpeed: 1800,
        position: typeof(position) == 'undefined' ? 'bottom' : position,
        topOffset: 20,
        buttonClass: '.close',
        cookieName: 'gsbbanner',
        cookieLifeTimeInDaysVisible: 5,
        cookieLifeTimeInDaysClosed: 5,
        respondToEvents: true,
        onRefresh: function () {
            this.createBanner();
        }
    };

    /**
     * Initialisiert den Aufruf der die Banner-Box
     * @param {options} options JSON-Objekt zum überschreiben der Default-Options
     */

    $.fn.gsb_banner = function (options) {
        return this.each(function () {
            (new $.gsb.banner(this, options));
        });
    };
})(jQuery);