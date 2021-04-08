/*!
 * GSB-Plugin zum autom. Leeren von Text-Input-Feldern
 *
 * Author: sbaecker
 */
(function($){
    jQuery.fn.attachToField = function (id, defaultValue){
        var field = $('#'+id);
        var input_text = field.attr('value');
        return jQuery(field).bind('focus',function(){
            if( input_text == defaultValue ) {
                field.attr('value','');
            }
        }).bind('blur',function(){
            if(field.attr('value')==''){
                field.attr('value',input_text);
            }
            input_text = field.attr('value');
        });
    };
})(jQuery);