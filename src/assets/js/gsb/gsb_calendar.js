/*!
 * GSB-Plugin zur Animation und zum Nachladen von Kalender
 *
 * Author: pespeloer
 */
;
(function ($) {
    if (!$.gsb) {
        $.gsb = {};
    }
    ;

    $.gsb.calendar = function (el, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("gsb.calendar", base);

        base.init = function () {
            base.options = $.extend({}, $.gsb.calendar.defaultOptions, options);
            options = base.options;

            //Klick auf einzelnen Termin
            base.$el.on("click touchstart", "td > a", function (e) {
                e.preventDefault();
                e.stopPropagation();
                // --- Termine des Tages anzeigen
                //Schlie�en
                if($(this).parent().hasClass(options.detailsOpenedClass)){
                    $(this).parent().removeClass(options.detailsOpenedClass).addClass(options.detailsClosedClass);
                } else{
                    // Alle ge�ffneten Details schlie�en
                    base.$el.find('.'+options.detailsOpenedClass).removeClass(options.detailsOpenedClass);
                    $(this).parent().removeClass(options.detailsClosedClass).addClass(options.detailsOpenedClass);
                }
            });

            //Klick auf Zur�ckbutton
            base.$el.on("click touchstart", options.prevButton  , function (e) {
                e.preventDefault();
                e.stopPropagation();
                base.loadCalendar($(this).data('href'));
            });

            //Klick auf Vorbutton
            base.$el.on("click touchstart",options.nextButton , function (e) {
                e.preventDefault();
                e.stopPropagation();
                base.loadCalendar($(this).data('href'));
            });
        };

        // --- N�chsten Monat laden
        //1. Fadeout
        //2. Container leeren und wieder bef�llen
        //3. Fadein
        //4. Focus auf das erste zu fokussierende Element setzen

        base.loadCalendar = function (href) {
            if(typeof  options.beforeInit === 'function'){
                base.options.beforeInit.call($(this), base.$el);
            }

            base.$el.fadeTo( options.duration , 0, function() {
                base.$el.load(href, function () {
                    base.$el.fadeTo( options.duration , 1, function() {
                        base.addA11y();
                        if(typeof  options.afterInit === 'function'){
                            base.options.afterInit.call($(this), base.$el);
                        }
                    });
                });
            });
        };

        //Focus setzen
        base.addA11y = function (elem) {
            elem = elem || base.$el;
            var focusElements = elem.find('input,textarea,select,a,button').not(':hidden');
            focusElements[0].focus();
        };

        // Run initializer
        base.init();
    };

    $.gsb.calendar.defaultOptions = {
        nextButton: '.next > a',
        prevButton: '.prev > a',
        fadeDuration: 400,
        detailsOpenedClass:'opened',
        detailsClosedClass:'closed',
        beforeInit: undefined, //Vor Monatswechsel
        afterInit: undefined   //Nach Monatswechsel
    };

    //gsb Calendar
    $.fn.gsb_calendar = function (options) {
        return this.each(function () {
            (new $.gsb.calendar(this, options));
        });
    };
})(jQuery);