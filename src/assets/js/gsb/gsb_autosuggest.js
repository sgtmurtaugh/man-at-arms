/*!
 * GSB-Plugin zur Darstellung von Suchvorschlaegen
 *
 * Author: gsb
 */

;(function($) {
    if(!$.gsb) {
        $.gsb = {};
    };


    $.gsb.AutoSuggestBoxCounter = 1;
    $.gsb.AutoSuggest = function(el, actionUrl, options) {
        var base = this;
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        // BoxCounter
        base.boxNumber = $.gsb.AutoSuggestBoxCounter++;
        // Such-Textfeld
        base.$input = base.$el.find('input[type=text]:first');
        base.$submit = base.$el.find('input[type=submit]:first');
        if(base.$submit.length == 0){
            base.$submit = base.$el.find('input[type=image]:first');
        }
        // Add a reverse reference to the DOM object
        base.$el.data("gsb.AutoSuggest", base);
        // Aktuelle Anfrage
        base.reqQuery = false;
        // Anfragen Cachen
        base.queries = [];
        // Aktuelle Position
        base.enterPos = -1;
        // Debug-Mode
        base.debug = false;
        /**
         * Intialisierung
         */
        base.init = function() {
            base.actionUrl = actionUrl;

            // AutoSuggest-Box vorbereiten und positionieren
            var positions = base.$input.position();
            base.$box = $('<p id="searchAutoSuggestBox'+base.boxNumber+'" class="searchAutoSuggestBox"></p>');
            base.$box.css({
                'width': (base.$input.outerWidth()-2)+'px', // 2px Border
                'top': (positions.top+base.$input.outerHeight())+'px',
                'left': positions.left+'px'
            });
            base.$box.hide();
            $(window).resize(function() {
                positions = base.$input.position();
                base.$box.css({
                    'top': (positions.top+base.$input.outerHeight())+'px',
                    'left': positions.left+'px'
                });
            });

            // Browser-Auto-Vervollständigung deaktivieren
            base.$input.attr('autocomplete', 'off');

            // Tastaturbefehle abfangen
            // Nicht mit jQuery, da alte Version dies noch nicht kann
            base.$input.get(0).onkeydown = function (e) {
                e = e || window.event;
                if (e) {
                    var code = (e.keyCode != undefined && null != e.keyCode ? e.keyCode : e.which)
                    if (code == 13) return base.keydownEnter(); // Enter
                    else if (code == 38) return base.keydownUp(); // UpArrow
                    else if (code == 40) return base.keydownDown(); // DownArrow
                }
            }

            // Bei Eingabe von mehr als zwei Zeichen Liste abrufen
            // Nicht mit jQuery, da alte Version dies noch nicht kann
            base.$input.get(0).onkeyup = function (e) {
                var go = false;
                e = e || window.event;
                if (e) {
                    var code = (e.keyCode != undefined && null != e.keyCode ? e.keyCode : e.which)
                    if (code != 13 && code != 38 && code != 40) {
                        go = true;
                    }
                } else {
                    go = true;
                }

                if (go) {
                    if (base.$input.val().length >= 2) {
                        base.query(base.$input.val());
                    } else {
                        base.showSuggestionBox(false);
                    }
                }
            }

            //base.$input.parents('p:first').css('position', 'relative');
            base.$input.after(base.$box);

            base.$box = base.$el.find('#searchAutoSuggestBox'+base.boxNumber);

            // Beim Defokussieren AutoSuggestbox schließen
            base.$input.bind('blur', function () {
                base.showSuggestionBox(false);
            });

        }
        /**
         * Anfrage stellen
         */
        base.query = function (value) {
            base.reqQuery = value;
            if (typeof base.queries[base.reqQuery] == "undefined") {
                if (base.debug && typeof console != "undefined" && console && console.log) console.log('AutoSuggest-AJAX-Anfrage für "'+base.reqQuery+'"');
                $.ajax({
                    url: base.actionUrl,
                    dataType: 'json',
                    data: {'userQuery': value},
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (base.debug && typeof console != "undefined" && console && console.log) console.log('AJAX Fehler beim Abruf der JSON-Resource '+
                            base.actionUrl+': '+textStatus+' :: '+errorThrown);
                    },
                    success: function (data) {
                        base.queries[value] = data.suggestions;
                        if (base.reqQuery == value) {
                            if (base.debug && typeof console != "undefined" && console && console.log) console.log('AJAX-Antwort für "'+base.reqQuery+'" wird nun verarbeitet...');
                            if (base.debug && typeof console != "undefined" && console && console.log) console.log(data);
                            base.showSuggestions(data.suggestions);
                        } else {
                            if (base.debug && typeof console != "undefined" && console && console.log) console.log('AJAX-Antwort für "'+base.reqQuery+'" ist nicht mehr relevant...');
                        }
                    }
                });
            } else {
                base.showSuggestions(base.queries[base.reqQuery]);
            }
        }
        /**
         * Vorschläge anzeigen
         */
        base.showSuggestions = function (suggestions) {
            base.$box.empty();
            var count = 0;

            //suggestions = ['45883 Gelsenkirchen', '45897 Gelsenkirchen'];

            for (var s in suggestions) {
                    var $link = $('<p></p>');
                    $link.html(suggestions[s].name);
                    $link.click(function (e) {
                        //e.preventDefault();
                        base.$input.val($(this).text());
                        //base.$submit.click();
                        base.$input.trigger('custom', ['Custom', 'Event']);
                    });
                    $link.appendTo(base.$box);
                    count++;
            }
            if (count > 0) base.showSuggestionBox(true);
            else base.showSuggestionBox(false);
        }
        /**
         * Suggestionbox ein/ausblenden
         */
        base.showSuggestionBox = function (show) {

            base.enterPos = -1;
            if (show) {
                base.$box.fadeIn('fast');
            } else {
                base.$box.fadeOut('fast');
            }
        }
        /**
         * KeyDown: Runter
         */
        base.keydownDown = function () {

            if (base.debug && typeof console != "undefined" && console && console.log) console.log('KEYDOWN down');

            if (base.enterPos < 0 && base.$box.find('a').length > 0) {
                base.$box.find('a').removeClass('active');
                base.enterPos = 0;
                $(base.$box.find('a')[base.enterPos]).addClass('active');
            } else if (base.enterPos < base.$box.find('a').length-1) {
                base.$box.find('a').removeClass('active');
                base.enterPos++;
                $(base.$box.find('a')[base.enterPos]).addClass('active');
            }
        }
        /**
         * KeyDown: Hoch
         */
        base.keydownUp = function () {

            if (base.debug && typeof console != "undefined" && console && console.log) console.log('KEYDOWN up');

            if (base.enterPos < 0 && base.$box.find('a').length > 0) {
                base.$box.find('a').removeClass('active');
                base.enterPos = base.$box.find('a').length-1;
                $(base.$box.find('a')[base.enterPos]).addClass('active');
            } else if (base.enterPos > 0) {
                base.$box.find('a').removeClass('active');
                base.enterPos--;
                $(base.$box.find('a')[base.enterPos]).addClass('active');
            }
        }

        /**
         * KeyDown: Enter
         */
        base.keydownEnter = function () {

            if (base.debug && typeof console != "undefined" && console && console.log) console.log('KEYDOWN enter');
            if (base.enterPos >= 0 && base.$box.find('a').length > base.enterPos) {
                base.$box.find('a')[base.enterPos].click();
                return false;
            }
        }
        // Run initializer
        base.init();
    };

    $.fn.gsb_AutoSuggest = function(actionUrl, options) {
        return this.each(function() {
            new $.gsb.AutoSuggest(this, actionUrl, options);
        });
    };
})(jQuery);