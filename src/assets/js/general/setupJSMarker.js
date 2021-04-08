/*!
 * @name _modul_contactMessage
 * @author @dkoslows
 * Falls JavaScript aktiv ist, entfernt dieses Script die Klasse "NoJS" aus dem Body
 * */
;(function($){
    if (!$.hjb) {
        $.hjb = {};
    }

    $.hjb.setupJSMarker = function(el, options){
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("hjb.turnOnContactMessage", base);

        base.init = function(){
            base.options = $.extend({}, $.hjb.setupJSMarker.defaultOptions, options);
            $(base.el).removeClass('noJS');
        },

        base.init();
    };

    $.hjb.setupJSMarker.defaultOptions = {

    };

    $.fn.hjb_setupJSMarker = function(options){
        return this.each(function() {(new $.hjb.setupJSMarker(this, options));
        });
    }

})(jQuery);
$('body').hjb_setupJSMarker();



