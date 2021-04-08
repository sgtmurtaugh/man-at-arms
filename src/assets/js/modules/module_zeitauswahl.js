/*!
 * @name module_zeitauswahl
 * @author @dkoslows
 * Steuerung des Zeitauswahlmoduls um n beliebig Zeiten je Tag (TimeBox) zuzuordnen
 * */
;(function($) {
    if (!$.hjb) {
        $.hjb = {};
    };

    $.hjb.doPrepareTimeChoice = function(el, options) {
        let base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("hjb.doPrepareTimeChoice", base);
        base.timeList = [];

        base.init = function() {
            base.options = $.extend({}, $.hjb.doPrepareTimeChoice.defaultOptions, options);

            base.$el.find('.timebox-list-apply').on('click', function(){
                let timeFrom = base.$el.find('[name="time-from"]').val();
                let timeTill = base.$el.find('[name="time-till"]').val();

                if (base.checkupTimeContent(timeFrom, timeTill)){
                    let timeString = timeFrom + ' - ' + timeTill;
                    if (!base.timeList.includes(timeString)) {
                        base.timeList.push(timeString);
                        base.createTimeElement(timeString);
                        base.setupTimes();
                    }
                }
            });

            base.$el.find('input[name*="time-"]').on('change', function(){
                $(this).parent().removeClass('has-error');
                $(this).parent().find('label').removeClass('is-invalid-label');
                $(this).removeClass('is-invalid-input');
                $(this).parent().find('.text-invalid').html('');
            });
        }

        base.checkupTimeContent = function(_timeFrom, _timeTill){
            let isNotEmpty = true;

            if (_timeFrom === null || typeof _timeFrom === 'undefined' || _timeFrom === ''){
                base.$el.find('[name="time-from"]').parent().addClass('has-error');
                base.$el.find('[name="time-from"]').parent().find('label').addClass('is-invalid-label');
                base.$el.find('[name="time-from"]').addClass('is-invalid-input');
                base.$el.find('[name="time-from"]').parent().find('.text-invalid').html('Bitte Eingabe prüfen!');
                isNotEmpty = false;
            }

            if (_timeTill === null || typeof _timeTill === 'undefined' || _timeTill === ''){
                base.$el.find('[name="time-till"]').parent().addClass('has-error');
                base.$el.find('[name="time-till"]').parent().find('label').addClass('is-invalid-label');
                base.$el.find('[name="time-till"]').addClass('is-invalid-input');
                base.$el.find('[name="time-till"]').parent().find('.text-invalid').html('Bitte Eingabe prüfen!');
                isNotEmpty = false;
            }

            return isNotEmpty;
        }

        base.setupTimes = function(){
            let textarea = $(base.el).find('.timebox-list-values').find('textarea');

            textarea.val('');
            base.timeList.forEach(function(entry){
                textarea.val(textarea.val() + entry + '\n');
            });
        }

        base.createTimeElement = function(_timeString){
            let element = $(`<p class="time-element font-h6-style">
                <span class="time-element-time">` + _timeString + `</span>
                <a class="time-element-delete">✖</a>
            </p>`);

            base.$el.find('.timebox-list-elements').append(element);

            element.find('.time-element-delete').on('click', function(){
                let timeString = $(this).parent().find('.time-element-time').html();
                base.timeList.splice(base.timeList.indexOf(timeString), 1);
                $(this).parent().remove();

                base.setupTimes();
            });
        }

        base.init();
    };

    $.hjb.doPrepareTimeChoice.defaultOptions = {

    };

    $.fn.hjb_doPrepareTimeChoice = function(options) {
        return this.each(function() {(new $.hjb.doPrepareTimeChoice(this, options)); });
    };

})(jQuery);

$('.module_zeitauswahl').find('.timebox').hjb_doPrepareTimeChoice();
