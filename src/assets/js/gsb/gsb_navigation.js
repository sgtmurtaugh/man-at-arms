/*!
 * @name Navigation
 * @author @pespeloe
 * Licensed under the MIT license
 *
 * @requires jQuery >= 1.11.1, gsb_responsiveListener
 * */
;
(function ($) {
    if (!$.gsb) {
        $.gsb = {};
    }
    ;

    $.gsb.navigation = function (el, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("gsb.navigation", base);

        base.init = function () {
            //base.myFunctionParam = myFunctionParam;
            base.options = $.extend({}, $.gsb.navigation.defaultOptions, options);
            base.delegateTo = "#" + base.$el.attr("id") + base.options.hoverItem;
            base.$el.gsb_responsiveListener(base);
        };
        //desktop navigation
        base._largeNavigation = function () {
            $(base.delegateTo).attr("tabindex", "0").focus(function (e) {
                $(this).trigger("mouseenter").find("a").last().blur(function () {
                    $(this).parent().parentsUntil("li").trigger("mouseleave");
                });
            });
            $(base.delegateTo).on("mouseenter mouseleave", function (e) {
                e.stopImmediatePropagation();
                var $box = $(this).find(base.options.displayItem).stop(),
                    $root = $(this);
                if (e.type === "mouseenter") {
                    if (!$(base.delegateTo).find(e.relatedTarget).length) {
                        $box.addClass("on").stop().slideDown({
                            duration: base.options.animSpeed
                        }).css({display: 'none', opacity: 1}).fadeIn({
                            duration: base.options.animSpeed,
                            queue: false
                        });
                    } else {
                        $box.addClass("on").css({ opacity: 1 }).show();
                    }
                    $root.addClass("hovered");
                } else {
                    if (!$(base.delegateTo).find(e.relatedTarget).length) {
                        $box.removeClass("on").slideUp({
                            duration: base.options.animSpeed
                        }).fadeOut({
                            duration: base.options.animSpeed,
                            queue: false
                        });
                    } else {
                        $box.removeClass("on").hide();
                    }
                    $root.removeClass("hovered");
                }
            });

            // Fix for iPad
            base.$el.find(base.options.navTouchElement).on("touchstart", function (e) {
                var $box = $(this).find(base.options.displayItem).stop(),
                    $root = $(this).children("div");
                if ($(this).parent().parent().hasClass("hovered")) {
                    e.preventDefault();
                }
            });
        },
            // Run initializer
            base.init();
    };

    $.gsb.navigation.defaultOptions = {
        navTouchElement: "h3 > a",
        displayItem: ".menu-box",
        hoverItem: "> ul > li",
        animSpeed: 500,
        respondToEvents: true,
        onRefresh: function () {
            this._largeNavigation();
        },
        responsive: [
            {
                breakpoint: 1024,
                onRefresh: function () {
                    //nothing to do for medium/small
                }
            }
        ]
    };

    //Search Reset
    $.fn.gsb_navigation = function (options) {
        return this.each(function () {
            (new $.gsb.navigation(this, options));
        });
    };
})(jQuery);