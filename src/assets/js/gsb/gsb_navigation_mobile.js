/**
 * @module navigation_mobile --- Mandantenanpassung
 * @version 2.1.1
 * @see {@link http://semver.org|Semantic Versioning}
 * @author pespeloe
 *
 * @desc Dieses Modul fügt
 * 1. Wenn konfiguerte, eine "togglebar" mit den Menübutton zum Öffnen des MMenu hinzu (base.$el.prepend)
 * 2. Die Grundkonfiguration des MMenu hinzu - nur Angabe der Optionen templateNavBar und menuHtml = MMenu aus SL OHNE autosuggest
 * 3. WAI-ARIA Support hinzu
 * 4. Tastaturbedienbarkeit des MMenu, bei geöffnetem Menu hinzu
 * 5. Den Responsive Listener hinzu
 *
 * @requires  {@link external:jQuery}
 * @requires  gsb_responsiveListener
 * @requires  gsb_ariaSupport
 *
 *
 * @example
 * JS: init (Einfachster Aufruf)
 * $('#wrapperDivisions').gsb_navigation_mobile({
 *   menuHtml: json_url_...
 * });
 * */
;
(function ($) {
    if (!$.gsb) {
        $.gsb = {};
    }
    ;

    $.gsb.navigation_mobile = function (el, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("gsb.navigation_mobile", base);

        base.init = function () {
            base.options = $.extend({}, $.gsb.navigation_mobile.defaultOptions, options);
            $('body').gsb_responsiveListener(base);
        };

        /**
         * @method initMenu
         * @desc Initialisierung des Menüs
         */
        $.gsb.navigation_mobile.prototype.initMenu = function () {

            if (typeof  base.options.beforeInit === 'function') {
                base.options.beforeInit.call($(this), base);
            }

            base.createMenuContainer();

            if (base.options.menuHtml != null) {
                $.ajax({
                    url: base.options.menuHtml,
                    dataType: 'html',
                    success: function (data) {
                        base.menu = $('#menu');
                        base.menu.html(data);
                        base.registerMMenu(base);
                        var activeNode = base.menu.find('#mm-'+ $('body').data('nn') + '> a:last');
                        $('<strong>'+activeNode.text()+'</strong>').addClass(activeNode.prop('class')).insertAfter(activeNode);
                        activeNode.remove();

                        //Schließen Button hinzufuegen - nicht über mmenu navbar, da sonst die Tabreihenfolge nicht mehr stimmt
                        base.menu.find('.mm-navbar').prepend('<div class="mobile-head"/>');
                        var mobileHead = base.menu.find('.mobile-head');

                        mobileHead.prepend('<h1>'+ NAV_MOBILE_MENU +'</h1>')
                        mobileHead.find('h1').append(//'close' button
                            $('<button class="close-button" id="mmenuH">').append('<img src="' + image_url_close_w + '" alt="' +CLOSE+ '" /><span class="aural">' + base.options.lessText + '</span>')
                        );

                        if (typeof  base.options.afterInit === 'function') {
                            base.options.afterInit.call($(this), base);
                        }
                    }
                });
            }
        }

        /**
         * @method createMenuContainer
         * @desc MMenücontainer erstellen, falls nicht vorhanden
         */
        $.gsb.navigation_mobile.prototype.createMenuContainer = function () {
            if (!$('#menu').length) {
                $('body').prepend('<div id="menu"/>');
            }
        };

        /**
         * @method uninit
         * @desc Destroy Menu
         */
        $.gsb.navigation_mobile.prototype.uninit = function () {
            if(base.menu){
                if(base.api){
                    base.api.close();
                }
                base.menu.remove();
            }
        };

        /**
         * @method registerMMenu
         * @desc Initialisierung des MMenu - zusätzlich noch hinzufügen der Funktionen (optional) Wai-Aria, navbar, configuration
         * openSubMenu, navSearchButton,  closeButton im MMEnu und autosuggest
         */

        $.gsb.navigation_mobile.prototype.registerMMenu = function (base) {

            //Navbar options hinzufuegen
            if (base.options.navbar != null) {
                base.options.mmenuOptions.navbars = base.options.navbar;
            }

            //Initialisierung MMenu
            if (base.options.configuration != null) {
                base.menu.mmenu(base.options.mmenuOptions, base.options.configuration);
            } else {
                base.menu.mmenu(base.options.mmenuOptions);
            }

            // Aural fuer navbar hinzufuegen
            if (base.options.navbar != null) {
                $('<span class="aural">' + base.options.lessText + '</span>').insertBefore(base.menu.find(base.options.closeButtonSelector));
            }

            //open submenu
            if (base.options.openSubMenu) {
                base.menu.find('#mm-' + $('body').data('nn')).parentsUntil(".mm-menu > ul").filter("li").addClass('mm-opened');
            }

            //------------ WAI-ARIA -------------------------------------------------
            // Alle Control und Contentpanel selektieren
            base.controlPanel = base.menu.find('.mm-vertical > .mm-next');
            base.contentPanel = base.menu.find('li > .mm-panel.mm-vertical > ul');

            //Title hinzufuegen
            base.controlPanel.attr('title',base.options.moreText);

            // Initial alles auf "closed" setzen
            base.aria = base.$el.gsb_ariaSupport(base);

            //Falls unterpunkte geöffnet sind, Aria-controls anpassen
            base.menu.find('ul > .mm-vertical.mm-opened .mm-next').each(function () {
                base.aria.updateAria(this, true, true);
            });

            // Workaround für WAI-ARIA, mmenu hat eigenes event für submenu open
            base.menu.find('.mm-next').on('click', function () {
                if ($(this).parent().hasClass('mm-opened')) {
                    //Schliessen
                    base.aria.updateAria(this, false, true);
                    $(this).attr('title',base.options.moreText);
                } else {
                    //oeffnen
                    base.aria.updateAria(this, true, true);
                    $(this).attr('title',base.options.lessText);
                }
            });
            //------------ WAI-ARIA Ende --------------------------------------------

            //Button der NavBar
            base.api = base.menu.data("mmenu");
            base.$el.on('click', base.options.navOpenButton, function (e) {
                e.stopImmediatePropagation();
                e.preventDefault();
                if (base.menu.hasClass('mm-opened')) {
                    base.api.close();
                } else {
                    base.api.open();
                    $(window).off('keydown.mm-offCanvas');
                    base.addA11y(base.menu);
                }
            });

            if (base.options.navSearchButton) {
                base.$el.on('click', base.options.navSearchButton, function (e) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    base.api.open();
                    $(window).off('keydown.mm-offCanvas');
                    base.menu.find('input:text').focus();
                });
            }

            if (base.options.closeButtonSelector) {
                base.menu.on('click', base.options.closeButtonSelector, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    base.api.close();
                    base.$el.find(base.options.navOpenButton).focus();
                });
            }

            // Searchimage Icon
            if (base.options.searchImage) {
                base.menu.find(".mm-search")
                .append('<input type="image" class="image" src="' + base.options.searchImage + '" alt="'+base.options.searchAltText+'" title="'+base.options.searchAltText+'"/>');
                base.menu.find('.mm-search input[type="text"]').attr('title', base.options.searchfieldTitle);

                base.menu.find(".mm-search").on("keydown", 'input:text', function (event) {
                    if (event.keyCode == 13 && $(this).val() != "") {
                        if (!menu.data('gsb.AutoSuggest') || menu.data('gsb.AutoSuggest').enterPos < 0) {
                            $('#search').find('form input:text').val($(this).val());
                            $('#menu').find('input:image').trigger('click');
                        }
                    }
                });

                base.menu.find(".mm-search").on('keydown click', 'input:image', function () {
                    var textInput = $(this).siblings('input:text');
                    if ((event.keyCode == 13 || event.type == 'click') && textInput.val() != "") {
                        $('#search').find('form input:text').val(textInput.val());
                        $('#search').find('form input:image').trigger('click');
                        base.api.close();
                    }
                });
            }

            //Autosuggest initialisieren
            if (base.options.autosuggestURL) {
                base.api.bind('opened', function mobileautosuggest() {
                    $(this).unbind('opened', mobileautosuggest);
                    base.menu.gsb_AutoSuggest(base.options.autosuggestURL);
                });
            }
        };

        /**
         * @method addA11y
         * @desc MMenu tastaturbedienbar machen bzw. Fokus auf erste fokussierbares Element setzen
         */

        $.gsb.navigation_mobile.prototype.addA11y = function (elem) {
            elem = elem || base.$el;
            var focusElements = elem.find('button,a,input,textarea,select');
            focusElements[0].focus();
            focusElements.last().keydown(function (e) {
                if (e.keyCode === 9) {
                    e.preventDefault();
                    focusElements[0].focus();
                } else if (e.keyCode === 13) {
                    return true;
                }
            });
        };

        // Run initializer
        base.init();
    };

    /**
     * @typedef defaultOptions
     * @type {object}
     * @property {object}   options                                   - Default Options des Scripts
     * @property {String}   [options.templateNavBar]                  - Pfad zum Template für die Navigationsbar
     * @property {String}   [options.menuHtml]                        - Pfad zum HTML des Mobilen Menüs
     * @property {String}   [options.lessText]                        - Auraltext des Schließenbuttons MMenu
     * @property {String]   [options.navOpenButton]                   - Selektor Menübutton in der Navigationsbar
     * @property {String]   [options.navSearchButton]                 - Selektor Suche Button in der Navigationsbar
     * @property {String]   [options.navAuralText]                    - Auraltext der Navigationsbar
     * @property {String]   [options.navAuralId]                      - ID des Auraltextes der Navigationsbar
     * @property {String]   [options.autosuggestURL]                  - Pfad zur Suchergebnisliste
     * @property {String]   [options.searchImage]                     - Pfad zum Suchbutton Bild - Input-Feld im MMenu
     * @property {String]   [options.closeButtonSelector]             - Selektor Schließenbutton im MMenu
     * @property {Object]   [options.configuration]                   - MMenu Configuration - bsp offCanvas Wrapper usw
     * @property {Array]    [options.navbar]                          - Inhalte der Navbar innerhalb des MMenu (Searchfield, Menübereich usw.) - Angabe als Array
     * @property {boolean]  [options.openSubMenu]                     - Submenu öffnen auf Unterseiten
     * @property {String]   [options.ariaType]                        - Angabe des Ariatypen (Konfiguration innerhalb des Arialisteners, welche angesprochen werden soll)
     * @property {function] [options.beforeInit]                      - Funktionen die vor dem eigentlichen Script ausgeführt werden sollen
     * @property {function] [options.afterInit]                       - Funktionen die nach dem eigentlichen Script ausgeführt werden sollen
     * @property {Object]   [options.mmenuOptions]                    - Optionen des MMenu - Angaben zur Navbar allerdings wie oben beschrieben angeben
     * @property {boolean]  [options.respondToEvents]                 - Responsive Listener "Default" ausführen wenn keine Breakpoint Angabe zutrifft
     * @property {function] [options.onRefresh]                       - Responsive  "Default"
     * @property {Array]    [options.responsive]                      - Angaben zu den verschiedenen Breakpoints - hier können auch Funktionen des Scripts ausgeführt werden,
     *                                                                 da base übergeben wird
     */

    $.gsb.navigation_mobile.defaultOptions = {
        templateNavBar: 'modules/navigation_mobile/templateNavBar.html',
        menuHtml: 'modules/navigation_mobile/navigation_mobile.html',
        lessText: typeof (SHOW_LESS) == 'undefined' ? 'Ausblenden' : SHOW_LESS,
        moreText: typeof (SHOW_MORE) == 'undefined' ? 'Ausblenden' : SHOW_MORE,
        navOpenButton: '#navMobileMenu a',
        navSearchButton: '#navMobileSearch a',
        navAuralText: typeof MOBILE_AURAL == 'undefined' ? 'Mobiles Menü' : MOBILE_AURAL,
        navAuralId: '#mobilemenuH',
        autosuggestURL: null,
        searchImage: image_url_loupe_b,
        searchfieldTitle:typeof SEARCH_TITLE == 'undefined' ? 'Suche Eingabe  ' : SEARCH_TITLE,
        searchAltText: typeof SEARCH_ALTTEXT == 'undefined' ? 'Suchen' : SEARCH_ALTTEXT,
        closeButtonSelector: 'button.close-button',
        configuration: null,
        navbar: [
            {
                content: ["searchfield"]
            }
        ],
        openSubMenu: true,
        ariaType: 'mobilemenu',
        beforeInit: null,
        afterInit: null,
        mmenuOptions: {
            slidingSubmenus: false,
            extensions: ["iconbar"],
            searchfield: {
                add: true,
                search: false,
                placeholder: typeof (NAV_MOBILE_SEARCH) == 'undefined' ? 'Suchen' : NAV_MOBILE_SEARCH
            }
        },
        respondToEvents: true,
        onRefresh: function () {
            this.uninit();
        },
        responsive: [
            {
                breakpoint: 1024,
                onRefresh: function () {
                    this.uninit();
                    this.initMenu();
                }
            }
        ]
    };

    $.fn.gsb_navigation_mobile = function (options) {
        return this.each(function () {
            (new $.gsb.navigation_mobile(this, options));
        });
    };
})(jQuery);