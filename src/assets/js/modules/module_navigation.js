/*!
 * @name moduleNavigation / moduleBereichsnavigation
 * @author @ckraus
 * Klappt Texte ein und aus
 * */
;(function($) {
    if (!$.kn) {
        $.kn = {};
    };

    $.kn.moduleNavigation = function(el, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        // Add a reverse reference to the DOM object
        base.$el.data("kn.moduleNavigation", base);
        base.init = function() {
            base.options = $.extend({}, $.kn.moduleNavigation.defaultOptions, options);

            if ( null != base.$el ) {
                var listNavigation = base.$el.find(".list-navigation");

                if (null != listNavigation) {
                    var childs = listNavigation.children();

                    if (null != childs
                        && childs.length >= base.options.max_visible_items) {

                        childs.each(function (index) {
                            if ( (index+1) >= base.options.max_visible_items ) {
                                $(childs.get(index)).toggle();
                            }
                        });

                        var xWeitere = childs.length - base.options.max_visible_items + 1;

                        $("<li class='small-12 medium-12 large-4 columns end'>"
                            + "<a class='' href='#' title='Zeige X weitere an'>"
                            + xWeitere + " weitere anzeigen"
                            + "</a>"
                            + "</li>")
                            .click(function (e) {
                                e.stopPropagation();
                                e.preventDefault();

                                $(this).hide();
                                $(this).parent().children().each(function (index, element) {
                                    if ( (index+1) >= base.options.max_visible_items ) {
                                        if ( $(element) !== $(this) ) {
                                            doToggle(
                                                element,
                                                index,
                                                base.options.max_visible_items
                                            );
                                        }
                                    }
                                });
                                $(this).remove();
                            })
                            .appendTo( listNavigation );
                    }
                }
            }
        },
        // Run initializer
        base.init();
    };

    $.kn.moduleNavigation.defaultOptions = {
        max_visible_items: 8
    };


    $.fn.kn_moduleNavigation = function(options) {
            return this.each(function() {(new $.kn.moduleNavigation(this, options));
        });
    };

})(jQuery);
