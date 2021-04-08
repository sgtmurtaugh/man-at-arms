/*!
 * @name component_popupWindow
 * @author @dkoslows
 * Oeffnet ein Popup und laedt den Inhalt aus der URL des dazugehoerigen Links ins Popup.
 * */
;(function($){
    if (!$.hjb) {
        $.hjb = {};
    }

    $.hjb.doPopupPreparations = function(el, options) {
        let base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("hjb.doPopupPreparations", base);

        base.init = function() {
            base.options = $.extend({}, $.hjb.doPopupPreparations.defaultOptions, options);

            let compObj = $('body').find('.component_popupWindow')[0];

            if (compObj === null || typeof compObj === 'undefined') {
                compObj = base.createHTMLIfNotExists();
            }

            let wrapperObj = $(compObj).find('.component-container-wrapper');
            if (wrapperObj !== null && typeof wrapperObj !== 'undefined') {

                base.$el.addClass('popupActivation');

                base.$el.click(function (event) {
                    event.preventDefault();
                    $('body').css('overflow-y', 'hidden');
                    $(compObj).addClass('popupWindow_opened');
                    base.blurAllOther(compObj);
                    base.loadIntoPopup(base.$el.attr('href'), $(compObj).find('.popupWindow_content'));
                });

                $(compObj).find('.popupWindow_close').find('a').click(function () {
                    $('body').css('overflow-y', 'auto');
                    $(compObj).removeClass('popupWindow_opened');
                    base.unblurAllOther();
                });

                $(window).resize(function () {
                    base.checkupBorderCollision(wrapperObj);
                });

            }

        };

        base.createHTMLIfNotExists = function(){
            let popupHTML = $(`
                <div class="component component_popupWindow">
                    <div class="component-container">
                        <div class="component-container-wrapper">
                            <div class="popupWindow_header">
                                <div class="popupWindow_close">
                                    <a>X</a>
                                </div>
                            </div>
                            <div class="popupWindow_content">

                            </div>
                        </div>
                    </div>
                </div>
            </div>`);
            $('body').append(popupHTML);

            return popupHTML;
        };

        base.checkupBorderCollision = function(_wrapperObj) {
            if (_wrapperObj !== null && typeof _wrapperObj !== 'undefined') {
                let windowHeight = parseInt($(window).innerHeight());
                let popupHeight = parseInt(_wrapperObj.css('height'));
                let margin = 15;

                if (typeof windowHeight !== 'undefined' && typeof popupHeight !== 'undefined') {
                    if (popupHeight + (margin * 2) <= windowHeight) {
                        //Passend
                        _wrapperObj.removeClass('popupWindow_unfixed');
                    } else {
                        //Nicht passend
                        _wrapperObj.addClass('popupWindow_unfixed');
                    }
                }

            }
        };

        base.blurAllOther = function(_compObj){
            $('#header').css('filter', 'blur(3px)');
            $('#main').css('filter', 'blur(3px)');
            $('#footer').css('filter', 'blur(3px)');
        };

        base.unblurAllOther = function(){
            $('#header').css('filter', 'none');
            $('#main').css('filter', 'none');
            $('#footer').css('filter', 'none');
        };

        base.loadIntoPopup = function(_href, _contentContainer){
            if (_href !== null && typeof _href !== 'undefined'){
                if (_contentContainer !== null && typeof _contentContainer !== 'undefined'){
                    $.get(_href, function(data) {
                        _contentContainer.html($(data).filter('#main').html());

                        $(window).trigger('resize');
                        $(document).foundation();
                    });
                }
            }
        };

        base.init();
    };

    $.hjb.doPopupPreparations.defaultOptions = {

    };

    $.fn.hjb_doPopupPreparations = function(options){
        return this.each(function() {(new $.hjb.doPopupPreparations(this, options));
        });
    }
})(jQuery);

$('a.hasPopup').hjb_doPopupPreparations();