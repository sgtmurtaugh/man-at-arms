/*!
 * GSB-Plugin zum Erstellung von Menue-Leiste fuer mobile Navigation
 *
 * Author: sbaecker
 *
 * @requires jQuery >= 1.11.1, gsb_responsiveListener
 */

;
(function ($) {
    if (!$.gsb) {
        $.gsb = {};
    }
    ;
    $.gsb.togglebar = function (el, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        // Access to $ and DOM versions of element
        base.$el = $(el);
        base.el = el;
        // Add a reverse reference to the DOM object
        base.$el.data("gsb.togglebar", base);

        base.init = function () {
            base.options = $.extend({}, $.gsb.togglebar.defaultOptions, options);
            base.$el.gsb_responsiveListener(base);
        }
        base.generate = function () {
            //Initialization Code
            if ($('#navServiceGS').length > 0 && $('#navServiceLS').length > 0) {

                var gs_link = $('#navServiceGS');
                gs_link.find('a').attr("title", $('#navServiceGS a').text() );
                var gs = '<li class="navServiceGS">' + gs_link.html() + '</li>';

                var ls_link = $('#navServiceLS');
                ls_link.find('a').attr("title", $('#navServiceLS a').text() );
                var ls = '<li class="navServiceLS">' + ls_link.html() + '</li>';

            } else {

                var gs = "";
                var ls = "";
            }
            if ($('#togglenav').length == 0) {
                base.$el.prepend('<div id="togglenav">' +
                    '<ul class="left">' +
                    '<li id="navMobileMenu">' +
                    '<a href="#">Menü</a>' +
                    '</li>' +
                    '<li id="navMobileSearch">' +
                    '<a href="#">Suche</a>' +
                    '</li>' +
                    '</ul>' +
                    '<ul class="right">' + gs + ls + '</ul></div>');
            }
        };

        //Funktion falls das Skript zur Laufzeit deaktiviert werden muss
        base._uninit = function () {
            $('#togglenav').remove();
        };

        // Run initializer
        base.init();
    };
    $.gsb.togglebar.defaultOptions = {
        respondToEvents: true,
        onRefresh: function () {
            this._uninit();
        },
        responsive: [
            {
                breakpoint: 1024,
                onRefresh: function () {
                    this.generate();
                }
            }
        ]
    };
    $.fn.gsb_togglebar = function (options) {
        return this.each(function () {
            (new $.gsb.togglebar(this, options));
        });
    };
})(jQuery);