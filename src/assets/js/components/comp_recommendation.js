/* Start comp_recommendation */
/*!
 * @name comp_recommendation
 * @author @boelenbe
 * comp_recommendation
 * */
;(function($) {
    if (!$.kn) {
        $.kn = {};
    };
    $.kn.comp_recommendation = function(el, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        // Add a reverse reference to the DOM object
        base.$el.data("kn.comp_recommendation", base);
        base.init = function() {
            base.options = $.extend({}, $.kn.comp_recommendation.defaultOptions, options);

            //Definitionen der benötigten Elemente
            var printButton = $(('<li><a class="linkStylePrint" href="#" title="'+base.options.label+'">'+base.options.label+'</a></li>'));
            base.$el.append(printButton);

            printButton.on("click", function(e){
                window.print();
                return false;
            });

        },
        // Run initializer
        base.init();
    };

    $.kn.comp_recommendation.defaultOptions = {
        label: typeof (PRINTLINK) == 'undefined' ? 'Seite drucken' : PRINTLINK,
    };

    //Search Reset
    $.fn.kn_comp_recommendation = function(options) {
        return this.each(function() {(new $.kn.comp_recommendation(this, options));
        });
    };

})(jQuery);
/* Ende modul_comp_recommendation */

$(".recommendation-list").kn_comp_recommendation();

