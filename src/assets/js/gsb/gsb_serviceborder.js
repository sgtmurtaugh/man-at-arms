/*!
 * GSB-Plugin fuer Serviceleiste unter der Buehne
 *
 * Dabei wird die folgende HTML-Struktur erwartet
 *
 * <div id="service-border">
 *   <div id="tab">
 *     <ul class="tab">
 *       <li class="t-entry-1">
 *         <a class="navServiceNewsletter" href="...">Newsletter</a>
 *       </li>
 *       ...
 *     </ul>
 *   </div>
 *   <div id="section-1" class="container">
 *     ...
 *   </div>
 *   ...
 * </div>
 *
 * Aufruf:
 *  $("#navContent").gsb_Serviceborder();
 *
 * Author: sbaecker
 *
 * @requires jQuery >= 1.11.1, gsb_responsiveListener
 *
 */

;
(function ($) {
    if (!$.gsb) {
        $.gsb = {};
    }
    ;
    $.gsb.Serviceborder = function (el, options) {
        var base = this, closeclick;
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        // Add a reverse reference to the DOM object
        base.$el.data("gsb.Serviceborder", base);
        /**
         * Initialisierung
         */
        base.init = function () {
            base.options = $.extend({}, $.gsb.Serviceborder.defaultOptions, options);
            base.$el.gsb_responsiveListener(base);
        }
        base._configuration = function () {
            closeclick = false;

            if (!base.$el.length)
                return;
            // Tab-Navigation einrichten
            if (base.$el.find(base.options.navnodes + ' span.aural').length == 0) {
                base.$el.find(base.options.navnodes).append('<span class="aural"> ' + base.options.show_more_text + '</span>');
            }
            base.$el.find(base.options.navnodes).each(function () {
                $(this).on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    base.showTab($(this));
                    return false;
                });
            });
            // Nummer des aktiven Tabs und des Tabs, der als nächstes angezeigt werden soll
            base.tabActive = false;
            base.tabToShow = false;
        };
        /**
         * Einen Tab anzeigen
         */
        base.showTab = function (obj, close) {
            // Objekt übergeben?
            if (typeof obj != 'undefined' && obj) {
                // Tab-Nummer aus Klassenname des li über Link parsen
                var regExpMatch = obj.parent('li:first').attr('class').match(/^.*\w+-(\w+)-(\d+)( .*)?$/);
                base.tabToShow = regExpMatch[2];
            } else {
                // Tabs schließen
                closeclick = true;
                base.tabToShow = false;
            }
            //Klick auf das Icon eines bereits geöffneten tabs
            if (base.tabActive == base.tabToShow) {
                var tabActiveId = base.options.container + base.tabActive;
                var $tabActive = base.$el.find(tabActiveId);
                $tabActive.stop(true, true).fadeOut({ duration: base.options.fadeDuration, easing: 'linear', queue: false }).slideUp({ duration: base.options.slideDuration, easing: 'linear' });
                base.tabActive = false;
                // Tab-Überschriften deaktivieren
                base.$el.find(' ul > li .aural').text(" " + base.options.show_more_text);
                base.$el.find(' ul > li').removeClass('active');
            } else {
                // Wenn Tab nicht bereits angezeigt wird
                if (base.tabToShow != base.tabActive && false !== base.tabToShow) {
                    // Tab-Elemente abrufen
                    var tabToShowId = base.options.container + base.tabToShow;
                    var $tabToShow = base.$el.find(tabToShowId);
                    if (!$tabToShow.length) {
                        alert('Tab ' + tabToShowId + ' nicht vorhanden...');
                        return;
                    }
                    // Wenn nicht vorhanden, Schließen-Button hinzufügen
                    if (!$tabToShow.find('.containerinner .close').length) {
                        var $closeButton;
                        if (base.options.close_button_markup_mode === 'image') {
                            $closeButton = $('<p><button tabindex="0" class="close" title="' + base.options.close + '" ><img src="' + image_url_close + '" alt="' + base.options.close + '" /></button></p>');
                        } else {
                            $closeButton = $('<p><button tabindex="0" class="close">' + base.options.close + '</button></p>');
                        }
                        $closeButton.appendTo(tabToShowId + ' > .containerinner:first').on('click', function () {
                            base.showTab();
                            return false;
                        });
                    }
                    base.$el.find('> div .close').unbind('click').on('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        // Tab schließen
                        var tabActiveId = base.options.container + base.tabActive;
                        var $tabActive = base.$el.find(tabActiveId);
                        $tabToShow.stop(true, true).fadeOut({ duration: base.options.fadeDuration, easing: 'linear', queue: false }).slideUp({ duration: base.options.slideDuration, easing: 'linear' });
                        obj.focus();
                        base.tabActive = false;
                        // Tab-Überschriften deaktivieren
                        base.$el.find(' ul > li span.aural').text(' ' + base.options.show_more_text);
                        base.$el.find('ul > li').removeClass('active');
                    });
                    // Ist gerade ein Tab geöffnet? => Ausblenden
                    if (false !== base.tabActive) {
                        var tabActiveId = base.options.container + base.tabActive;
                        var $tabActive = base.$el.find(tabActiveId);
                        $tabActive.slideUp();
                    } else {
                        $tabToShow.stop(true, true).fadeIn({ duration: base.options.fadeDuration, easing: 'linear', queue: false }).css('display', 'none').slideDown({ duration: base.options.slideDuration, easing: 'linear' });
                    }

                    // Neuen Tab einblenden
                    $tabToShow.slideDown();
                    base.tabActive = base.tabToShow;
                    // Entsprechende Tab-Überschrift aktivieren
                    base.$el.find(' ul > li span.aural').text(' ' + base.options.show_more_text);
                    base.$el.find(' ul > li').removeClass('active');
                    obj.parent(':first').addClass('active');
                    base.$el.find(' ul > li.active .aural').text(' ' + base.options.show_less_text);
                } else if (false === base.tabToShow && false !== base.tabActive) {
                    // Tab schließen
                    var tabActiveId = base.options.container + base.tabActive;
                    var $tabActive = base.$el.find(tabActiveId);
                    if (closeclick = true) {
                        $tabActive.slideUp('fast');
                        closeclick = false;
                    } else {
                        $tabActive.hide();
                    }
                    base.tabActive = false;
                    // Tab-Überschriften deaktivieren
                    base.$el.find(' ul > li span.aural').text(' ' + base.options.show_more_text);
                    base.$el.find(' ul > li').removeClass('active');
                }
            }
        };//Ende showTab
        base._uninit = function () {
            //Deaktivieren der Tab-Schließen Links
            var closeLink = base.$el.find('a.close');
            if (closeLink.length > 0) {
                if (closeLink.closest('p').length > 0) {
                    closeLink.closest('p').off();
                } else {
                    closeLink.off();
                }
            }
            if (base.$el.find('div .close').length > 0) {
                base.$el.find('div .close').off();
            }
            //Deaktivieren der Tabs
            if (base.$el.find(base.options.navnodes).length > 0) {
                base.$el.find(base.options.navnodes).off();
            }
            //Falls noch Tabs geöffnet waren -> schließen
            base.$el.find('.container').hide();
            base.$el.find(' ul > li span.aural').text(' ' + base.options.show_more_text);
            base.$el.find('>ul>li').removeClass('active');
        };
        // Init
        base.init();
    };
    $.gsb.Serviceborder.defaultOptions = {
        close: typeof(CLOSE) == 'undefined' ? 'Schließen' : CLOSE,
        close_button_markup_mode: 'image',
        navnodes: ' > ul > li > a',
        container: '#section-',
        show_more_text: typeof(SHOW_MORE) == 'undefined' ? 'Mehr anzeigen' : SHOW_MORE,
        show_less_text: typeof(SHOW_LESS) == 'undefined' ? 'Weniger anzeigen' : SHOW_LESS,
        slideDuration: 400, //MUST be integer; 200 = fast, 400 = default, 600 = slow
        fadeDuration: 600,
        respondToEvents: true,
        onRefresh: function () {
            this._configuration();
        },
        responsive: [
            {
                breakpoint: 600,
                onRefresh: function () {
                    this._uninit();
                }
            }
        ]
    };
    $.fn.gsb_Serviceborder = function (options) {
        return this.each(function () {
            (new $.gsb.Serviceborder(this, options));
        });
    };
})(jQuery);