/*!
 * @name component_header
 * @author @dkoslows
 * Sorgt dafuer, dass im gesamten Header nur ein Untermenue von n Menues offen sind und schliesstt alle anderen.
 * */
;(function($){
    if (!$.hjb) {
        $.hjb = {};
    }

    $.hjb.controlHeaderMenues = function(el, options) {
        let base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("hjb.controlHeaderMenues", base);

        base.init = function() {
            base.options = $.extend({}, $.hjb.controlHeaderMenues.defaultOptions, options);

            let checkboxMenues = base.$el.find('input[type=checkbox]');
            if (checkboxMenues !== null && checkboxMenues !== 'undefined' && checkboxMenues.length > 1){

                $(checkboxMenues).each(function(){
                   $(this).change(function(){
                        let checkbox = $(this);

                        if (checkbox.prop('checked')){
                            base.$el.find('input[type=checkbox]').not('#' + checkbox.attr('id')).prop('checked', false);
                        }
                   });
                });

            }
        };

        base.init();
    };

    $.hjb.controlHeaderMenues.defaultOptions = {

    };

    $.fn.hjb_controlHeaderMenues = function(options){
        return this.each(function() {(new $.hjb.controlHeaderMenues(this, options));
        });
    }
})(jQuery);

$('.component_header').hjb_controlHeaderMenues();