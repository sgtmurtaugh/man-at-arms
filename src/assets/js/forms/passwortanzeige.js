/*!
 * @name passwortanzeige
 * @author @dkoslows
 * Schaltet beim Passwortfeld zwischen "Passwort anzeigen" und "Passwort verbergen"
 * */
;(function($){
    if (!$.hjb) {
        $.hjb = {};
    }

    $.hjb.passwortanzeige = function(el, options){
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("hjb.passwortanzeige", base);

        base.init = function(){
            base.options = $.extend({}, $.hjb.passwortanzeige.defaultOptions, options);

            base.fieldObj = $(base.el).find('input');
            base.iconObj = $(base.el).find('.pwiconbox').find('a');

            if (base.fieldObj != null && base.iconObj != null){
                base.iconObj.on(base.options.onEvent, function(){

                    if ($(base.fieldObj).attr('type') === 'password'){
                        $(base.fieldObj).attr('type', 'text');
                    } else {
                        $(base.fieldObj).attr('type', 'password');
                    }

                });
            }

        };

        base.init();
    };

    $.hjb.passwortanzeige.defaultOptions = {
        onEvent: "click"
    };

    $.fn.hjb_passwortanzeige = function(options){
        return this.each(function() {(new $.hjb.passwortanzeige(this, options));
        });
    }

})(jQuery);

$('.module_password').hjb_passwortanzeige();