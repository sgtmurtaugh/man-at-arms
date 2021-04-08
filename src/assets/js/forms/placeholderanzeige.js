/*!
 * @name placeholderanzeige
 * @author @JenniferWolter
 *  Schaltet bei click der Eingabefelder zwischen "Placeholder anzeigen" und "Placeholder verbergen"
 * */

;(function($){
    if (!$.hjb) {
        $.hjb = {};
    }

    $.hjb.placeholderanzeige = function(el, options){
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("hjb.placeholderanzeige", base);



        base.init = function(){
            base.options = $.extend({}, $.hjb.placeholderanzeige.defaultOptions, options);

            let placeholder = $(base.el).attr("placeholder");

            let hiddenDiv = base.getHiddenDiv(base.el);
            console.log(hiddenDiv);

            $(base.el).focusin(function(){
                $(base.el).attr("placeholder", "");
                console.log(hiddenDiv);
                $(hiddenDiv).show();

            });

            $(base.el).focusout(function(){
                $(base.el).attr("placeholder", placeholder);
                $(hiddenDiv).hide();
            });

        };

        base.getHiddenDiv = function(element){
            let hiddenDiv = null;

            if (element !== null && typeof element !== 'undefined'){
                let placeholder = $(element).attr("placeholder").toString().toLowerCase();
                let parentElement = $(element).parent();
                let parentElementName = parentElement.get(0).nodeName;
                let timeoutCounter = 0;

                while (parentElementName !== 'FORM'){

                    if (timeoutCounter > 100){
                        break;
                    }

                    timeoutCounter++;
                    parentElement = parentElement.parent();
                    parentElementName = parentElement.get(0).nodeName;
                }

                if (parentElementName === 'FORM'){
                    hiddenDiv =  $(parentElement).find('[data-name="' + placeholder + '"]');
                }

            }

            return hiddenDiv;
        };


        base.init();
    };


    $.hjb.placeholderanzeige.defaultOptions = {
        onEvent: "click"
    };

    $.fn.hjb_placeholderanzeige = function(options){
        return this.each(function() {(new $.hjb.placeholderanzeige(this, options));
        });
    }

})(jQuery);

$('.formelement').hjb_placeholderanzeige();