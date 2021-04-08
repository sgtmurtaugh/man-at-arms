/*!
 * GSB-Plugin zum autom. Leeren von Text-Input-Feldern
 *
 * Das Addon fügt einen Link "Seite drucken" in eine vorhandene Liste ein
 * Aufruf: $("#element").gsb_init_printlink();
 * #element muss dabei ein <ul> sein, damit das html valide bleibt.
 *
 * Author: sbaecker
 *
 * @requires jQuery >= 1.11.1, gsb_responsiveListener
 *
 */
;
(function ($) {
    if (!$.gsb) {
        $.gsb = {};
    }
    ;
    $.gsb.printlink = function (el, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        var printInited = false;
        // Access to $ and DOM versions of element
        base.$el = $(el);
        base.el = el;
        // Add a reverse reference to the DOM object
        base.$el.data("gsb.printlink", base);
        base.init = function () {
            base.options = $.extend({}, $.gsb.printlink.defaultOptions, options);
            //Initialization Code
            base.$el.gsb_responsiveListener(base);
        };
        base._printlink = function () {
            if (!base.$el.length) {
                return;
            }
            if ($('#' + base.options.printlink_id).length == 0) {
                pattern = $('<li id="' + base.options.printlink_id + '"><a href="#" title="' + base.options.tooltip + '">' + base.options.page_text + '</a></li>');
                base.$el.prepend(pattern);
            }
            base.$el.parent().find('#' + base.options.printlink_id + ' a').on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.print();
            });
        };
        base._uninit = function () {
            if (base.$el.find('#' + base.options.printlink_id)) {
                base.$el.find('#' + base.options.printlink_id).off().remove();
            }
        };
        // Run initializer
        base.init();

    };
    $.gsb.printlink.defaultOptions = {
        tooltip: typeof (PRINT_TOOLTIP) == 'undefined' ? 'Drucken (öffnet Dialog)' : PRINT_TOOLTIP,
        page_text: typeof (PRINT_PAGE_TEXT) == 'undefined' ? 'drucken' : PRINT_PAGE_TEXT,
        printlink_id: 'navFunctionsPrint',
        respondToEvents: true,
        onRefresh: function () {
            this._printlink();
        },
        responsive: [
            {
                breakpoint: 1024,
                onRefresh: function () {
                    this._uninit();
                }
            }
        ]
    };
    $.fn.gsb_printlink = function (options) {
        return this.each(function () {
            (new $.gsb.printlink(this, options));
        });
    };
})(jQuery);