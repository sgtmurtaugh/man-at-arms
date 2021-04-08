/**
 * @module gsb_toggle
 * @version 1.5.3
 * @see {@link http://semver.org|Semantic Versioning}
 * @author pespeloe
 *
 * @desc Dieses Modul erstellt in der Default-Konfiguration eine Accordion in small und ein Tab-Modul in large
 * Über die einzelnen Optionen kann auch nur ein Tab oder nur ein Accordion erstellt werden.  Mit der Klasse "active-control"
 * kann festgelegt werden, welcher Tab/Accordion bei der Initialisierung geöffnet sein soll.<br>
 * Wenn der Inhalt der Tabs nachgeladen werden soll, muss im Template ein data-href Attribut vorhanden sein. Gleiches Vorgehen
 * wie bei dem Modul gsb_Sldeshow.<br><br>
 * Fest definiert sind die Klassen<br>
 *   "tabs-container" -> Klasse für den Wrapper des einzelnen Tabs<br>
 *   "heading" ->  Element was für die Steuerung als Accordion dient<br>
 *   "tabs-list" -> Wrapper der Steuerelemente als Tab<br>
 *   "active-control" -> Aktuell ausgewählter Tab/Accordion<br>
 *   "inactive-control" -> inaktiver Tab/Accordion<br>
 *   "gsb-toggle" -> Klasse des "Gesamt-Wrappers"
 *
 * @requires  {@link external:jQuery}
 * @requires  gsb_responsiveListener
 *
 * @example
 * HTML: Velocity
 * <div class="tabaccordion">
 *  <ul class="tabs-list">
 *    <li class="active-control">
 *     <a href="#">Inhalt (Tab Control)</a>
 *    </li>
 *    <li>
 *     <a href="#">Inhalt 2 (Tab Control)</a>
 *    </li>
 *  </ul>
 *  <div class="tabs-container">
 *    <h2 class="heading active-control">Inhalt (Accordion Control)</h2>
 *    <div>
 *     Inhalt
 *    </div>
 *    <h2 class="heading">Inhalt 2 (Accordion Control)</h2>
 *    <div>
 *     Inhalt 2
 *    </div>
 *  </div>
 * </div>
 *
 * @example
 * JS: init
 * $('.tabaccordion').gsb_toggle({options});
 *
 * */
;
(function ($) {
    if (!$.gsb) {
        $.gsb = {};
    }
    ;

    $.gsb.toggle = function (el, options) {
        // Access to $ and DOM versions of element
        var base = this;
        base.$el = $(el);
        base.el = el;
        this.base = base;
        // Add a reverse reference to the DOM object
        base.$el.data("gsb.toggle", base);

        base.init = function () {
            this.base.options = $.extend({}, $.gsb.toggle.defaultOptions, options);
            var _ = this.base;

            if(_.options.accordion && _.options.richTextAccordion){
                _.addRichtextContainer();
            } else{
                if( base.$el.data('href') ){
                    $.get(base.$el.data('href'),function (data) {
                        base.$el.html(data);
                        base.$el.gsb_responsiveListener( _ );
                    });
                }else {
                    base.$el.gsb_responsiveListener( _ );
                }
            }
        };
        // Run initializer
        base.init();
    };

    /**
     * @typedef defaultOptions
     * @type {object}
     * @property {object}   options                                   - Default Options des Scripts
     * @property {boolean}  [options.tab=true]                        - Aktiviert / Deaktiviert die Tab-Funktion
     * @property {string}   [options.tabControls='.tabs-list > li a'] - Steuerungselemente fuer die Tab-Darstellung
     * @property {boolean}  [options.accordion=true]                  - Aktiviert / Deaktiviert die Accordion-Funktion
     * @property {boolean}  [options.richTextAccordion=false]         - Aktiviert / Deaktiviert die Richtext-Accordion-Funktion -> nur wenn Option accordion true ist. ACHTUNG: Es ist nur ein Richtext-Accordion pro Seite möglich!
     * @property {boolean}  [options.accordionCloseOther=true]        - Immer nur ein Accordion geöffnet lassen
     * @property {boolean}  [options.accordionPanelHeight=false]      - Berechnet die Höhe des aufzuklappenden Elements (das aufzuklappenden Element darf nicht per CSS auf display non gesetzt sein)
     * @property {jQuery}  [options.accordionElementToOpen=null]      - Öffnet ein Element welches nicht in der eigentlich vorgegebenen Struktur ist
     * @property {boolean}  [options.autoplay=false]                  - Autoplay für Tab aktivieren
     * @property {string}   [options.playButtonImagePaused=null]      - Icon welches im stop Zustand angezeigt werden soll (nur wenn autoplay true)
     * @property {string}   [options.playButtonImagePlaying=null]     - Icon welches im play Zustand angezeigt werden soll (nur wenn autoplay true)
     * @property {string}   [options.playButtonAltTextPaused=null]    - Alttext welcher im stop Zustand angezeigt werden soll (nur wenn autoplay true)
     * @property {string}   [options.playButtonAltTextPlaying=null]   - Alttext welcher im play Zustand angezeigt werden soll (nur wenn autoplay true)
     * @property {string}  [options.accordionHeadingTitleClosed=null] - Title welcher angezeigt werden soll, wenn ein AccordionElement geschlossen ist
     * @property {string}  [options.accordionHeadingTitleOpened=null] - Title welcher angezeigt werden soll, wenn ein AccordionElement geöffnet ist
     * @property {int}      [options.autoSpeed=5000]                  - Nach welcher Zeit soll der Tab gewechselt werden? (nur wenn autoplay true)
     * @property {boolean}  [options.playOnLoad=false]                - Direkt nach laden der Seite autoplay starten (nur wenn autoplay true)
     * @property {boolean}  [options.pauseOnHover=true]               - Wenn hover ueber Bild oder Tab autoplay stoppen (nur wenn autoplay true)
     * @property {boolean}  [options.changeOnHover=false]             - Wenn hover ueber Bild oder Tab autoplay stoppen (nur wenn autoplay true)
     * @property {boolean}  [options.allOpen=false]                   - Alle Accordion-Elemente direkt geöffnet
     * @property {boolean}  [options.animateTab=false]                - Animation für den wechsel der Tabs
     */
    $.gsb.toggle.defaultOptions = {
        tab: true,
        tabControls: "> .tabs-list > li a",
        elements: '> .tabs-container > div',
        accordion: true,
        richTextAccordion: false,
        accordionCloseOther: true,
        accordionPanelHeight: false,
        accordionElementToOpen: null,
        accordionElementsStopPropagation: '',
        autoplay: false,
        playButtonImagePaused: null,
        playButtonImagePlaying: null,
        playButtonAltTextPaused: typeof (PLAY) == 'undefined' ? 'Animation starten' : PLAY,
        playButtonAltTextPlaying: typeof (PAUSE) == 'undefined' ? 'Animation stoppen' : PAUSE,
        accordionHeadingTitleClosed: null,
        accordionHeadingTitleOpened: null,
        autoSpeed: '5000',
        playOnLoad: false,
        pauseOnHover: true,
        changeOnHover: false,
        allOpen: false,
        animateTab: false,
        respondToEvents: true,
        onRefresh: function () {
            this.initialize();
            this.refreshTab();
        },
        responsive: [
            {
                breakpoint: 600,
                onRefresh: function () {
                    this.initialize();
                    this.autoplayStop();
                    this.$el.off("mouseenter mouseleave");
                    this.refreshAccordion();
                },
                autoplay: false
            }
        ]
    };

    /**
     * @method initialize
     * @desc Initialisierung des Scripts
     */
    $.gsb.toggle.prototype.initialize = function () {
        var _ = this.base;

        if(!_.$el.hasClass('gsb-toggle')){
            _.$el.addClass('gsb-toggle');
            _.addClasses();
            _.addClickfunction();
        }

        if (_.options.autoplay) {
            _.autoplay();
        }
    };

    /**
     * @method addClasses
     * @desc Zugehörigkeit der Überschriften festlegen
     */
    $.gsb.toggle.prototype.addClasses = function () {
        var _ = this.base;

        if (_.options.tab === true) {

            //Angabe welcher Tab aktiv gesetzt werden soll
            var activeTabIndex = $.inArray(_.$el.find(_.options.tabControls + '.active-control').get(0),_.$el.find(_.options.tabControls))
            if(activeTabIndex == -1){
                activeTabIndex = 0;
            }

            _.$el.find(_.options.tabControls).each(function (index) {
                if(!$(this).is('a') || $(this).find('>a').length ==0){
                    $(this).prop("tabindex",0);
                }

                $(this).addClass('switch-panel' + index);
                if (index === activeTabIndex) {
                    $(this).addClass("active-control")
                } else {
                    $(this).addClass("inactive-control")
                }
            });

            _.$el.find(_.options.elements).each(function (index) {
                $(this).addClass('switch-panel' + index);
                if (index === activeTabIndex) {
                    $(this).addClass("panel-opened");
                } else {
                    $(this).addClass("panel-closed");
                }
            });

        }

        if (_.options.accordion === true) {
            // Accorion hat bei start geöffnete Elemente
            var hasOpendElements = false;
            if (_.$el.find("> .tabs-container > .active-control").length > 0) {
                hasOpendElements = true;
            }
            _.$el.find("> .tabs-container > .heading").each(function () {

                if(!$(this).is('button') || !$(this).is('a')){
                    if(_.options.accordionPanelHeight){
                        var height = 0;
                        $(this).next().find(">").each(function(){
                            height += $(this).outerHeight(true);
                        });
                        $(this).next().height(height);
                    }
                    $(this).prop("tabindex",0);
                    if(_.options.allOpen && !_.options.tab){
                        $(this).next().show();
                        $(this).addClass('active-control');
                    } else if (hasOpendElements) {
                        if (!$(this).hasClass("active-control")) {
                            $(this).addClass("inactive-control");
                            $(this).next().hide();
                        } else {
                            $(this).next().show();
                        }
                    } else {
                        $(this).addClass("inactive-control");
                        $(this).next().hide();
                    }
                }

                _.changeAccordionHeadingTitle($(this));

            });
        }
    };

    /**
     * @method addClickfunction
     * @desc Click Events hinzufügen
     */
    $.gsb.toggle.prototype.addClickfunction = function () {
        var _ = this.base;

        // Accordion
        if (_.options.accordion === true) {
            _.$el.on('click keydown', "> .tabs-container > .heading", function (e) {
                if(e.type ==='click' || e.which == 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    _.clickedElem = $(this);
                    _.changeStateAccordion();
                }
            }).find(_.options.accordionElementsStopPropagation).on('click keydown', function(e){
                e.stopPropagation();
            });
        }
        if (_.options.tab === true) {

            // Autoplay muss deaktiviert sein, da die Events focusin und focusout im Firefox derzeit nocht nicht implementiert
            // sind bzw. noch bugs enthalten
            if(_.options.changeOnHover && !_.options.autoplay){
                _.$el.on('mouseenter focus touchend', _.options.tabControls , function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _.clickedElem = $(this);
                    _.changeStateTab();
                });

                // Seitenwechsel für click unterdrücken
                _.$el.on('click', _.options.tabControls , function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });

            } else{
                _.$el.on('click keydown', _.options.tabControls , function (e) {
                    if(e.type ==='click' || e.which == 13) {
                        e.preventDefault();
                        e.stopPropagation();
                        _.clickedElem = $(this);
                        _.changeStateTab();
                    }
                });
            }
        }
    };

    /**
     * @method changeStateAccordion
     * @param {Object} elem - Geklicktes Element
     * @desc Passt den title des headingElements je Status an (geöffnet/geschlossen)
     */
    $.gsb.toggle.prototype.changeAccordionHeadingTitle = function(elem){
        var _ = this.base;

        if(elem.hasClass('active-control') && _.options.accordionHeadingTitleOpened){
            elem.attr('title', _.options.accordionHeadingTitleOpened);
        } else if(!elem.hasClass('active-control') && _.options.accordionHeadingTitleClosed){
            elem.attr('title', _.options.accordionHeadingTitleClosed);
        }
    };

    /**
     * @method changeStateAccordion
     * @desc Open-/Close-States Accordion
     */
    $.gsb.toggle.prototype.changeStateAccordion = function () {
        var _ = this.base;

        var contentElement;
        if(_.options.accordionElementToOpen){
            contentElement = $(_.options.accordionElementToOpen);
        } else{
            contentElement = _.clickedElem.next();
        }

        if (_.clickedElem.hasClass('inactive-control')) {
            if (_.options.accordionCloseOther && !_.options.accordionElementToOpen) {
                _.animationAccordion(_.clickedElem.parent().find('> .active-control').next(), "close");
                _.$el.find('.tabs-container > .active-control').removeClass('active-control').addClass('inactive-control');
            }

            _.clickedElem.attr('aria-expanded','true');
            _.clickedElem.attr('aria-selected','true');
            _.clickedElem.removeClass('inactive-control').addClass('active-control');
            _.animationAccordion(contentElement, "open");
            contentElement.attr('aria-hidden', 'false');
        } else {
            _.clickedElem.attr('aria-expanded','false');
            _.clickedElem.attr('aria-selected','false');
            _.clickedElem.removeClass('active-control').addClass('inactive-control');
            _.animationAccordion(contentElement, "close");
            contentElement.attr('aria-hidden', 'true');
        }

        _.changeAccordionHeadingTitle(_.clickedElem);

    };

    /**
     * @method changeStateTab
     * @desc Open-/Close-States Tab
     */
    $.gsb.toggle.prototype.changeStateTab = function () {
        var _ = this.base;

        if (_.clickedElem.hasClass('inactive-control')) {
            var panelToClose = _.$el.find('.panel-opened');

            // "Alles auf 0 zurücksetzen"
            _.$el.find('[aria-hidden=false]').attr('aria-hidden','true');
            _.$el.find('[aria-selected=true]').attr('aria-selected','false');

            var ariaControl = _.clickedElem.attr('aria-controls');
            _.$el.find('#'+ariaControl).attr('aria-hidden','false');
            _.clickedElem.attr('aria-selected','true');
            panelToClose.removeClass('panel-opened').addClass('panel-closed');
            _.$el.find('> .tabs-container >.active-control, > .tabs-list .active-control ').removeClass('active-control').addClass('inactive-control');
            _.clickedElem.removeClass('inactive-control');
            var panelToOpen = _.$el.find('> .tabs-container > .' + _.getSwitchPanelClass(_.clickedElem));
            panelToOpen.removeClass('panel-closed').addClass('panel-opened');
            _.clickedElem.addClass('active-control');
            _.animationTab(panelToClose, panelToOpen);
        }
    }

    /**
     * @method animationAccordion
     * @desc Animation für OpenClose des Accordions
     *
     * @param elem {Object} Element welches animiert werden soll
     * @param type Art der Animation - {string} open / close
     */
    $.gsb.toggle.prototype.animationAccordion = function (elem, type) {
        var _ = this.base;

        if (type === 'open') {
            elem.slideDown(400, function(){
                if(_.options.accordionElementToOpen){
                    _.addA11y(elem);
                }
            });
        } else {
            elem.slideUp();
        }
    }

    /**
     * @method animationTab
     * @desc Animation für OpenClose des Tabs
     *
     * @param panelToClose {Object} Element welches animiert werden soll (ausblenden)
     * @param panelToOpen {Object} Element welches animiert werden soll (einblenden)
     */
    $.gsb.toggle.prototype.animationTab = function (panelToClose, panelToOpen) {
        var _ = this.base;

        if(_.options.animateTab){
            panelToClose.fadeOut("slow", function(){
                panelToOpen.fadeIn("slow");
            });
        } else {
            panelToClose.hide();
            panelToOpen.show();
        }
    }

    /**
     * @method autoplay
     * @desc Autoplay
     */
    $.gsb.toggle.prototype.autoplay = function () {
        var _ = this.base;

        if (_.$el.find('> button').length === 0) {
            var button = document.createElement('button');
            button.className = 'paused';
            var image = document.createElement('img');
            image.src = _.options.playButtonImagePlaying;
            image.alt = _.options.playButtonAltTextPlaying;
            playbutton = _.$el.append($(button).append(image));
        }
        _.playbutton = _.$el.find('button.paused');
        _.playbutton.on('click autoplayStart', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (_.playbutton.hasClass('paused')) {
                $(this).removeClass('paused').addClass('played');
                _.autoplayStart();
                _.changeStatePlayPause(_.options.playButtonImagePlaying, _.options.playButtonAltTextPlaying);
                _.isPaused = false;
                if (e.type != "autoplayStart") {
                    //Damit nach Starten des Autoplays nicht nochmal autoplayStart von mouseleave aufgerufen wir
                    _.isClicked = true;
                }
            } else {
                $(this).addClass('paused').removeClass('played');
                _.autoplayStop();
                _.changeStatePlayPause(_.options.playButtonImagePaused, _.options.playButtonAltTextPaused);
                _.isPaused = true;
            }
        });

        // Stop bei Hover
        if (_.options.pauseOnHover) {
            _.$el.on("mouseenter mouseleave", function (e) {
                if (!_.isPaused) {
                    if (e.type == 'mouseenter') {
                        _.autoplayStop();
                    } else {
                        if (_.playbutton.hasClass('played') && !_.isClicked) {
                            _.autoplayStart();
                        }
                        _.isClicked = false;
                    }
                }
            });
        }

        //play bei start
        if (_.options.playOnLoad) {
            _.playbutton.trigger("autoplayStart");
        }
    }

    /**
     * @method autoplayStart
     * @desc Autoplay start
     */
    $.gsb.toggle.prototype.autoplayStart = function () {
        var _ = this.base;

        _.rotation = setInterval(function () {
            var lastTab = _.getSwitchPanelClass(_.$el.find('.tabs-list > li').last());
            //Wenn letzter Tab, wieder beim ersten anfangen
            if (_.$el.find('.tabs-list .active-control').hasClass(lastTab[0])) {
                _.$el.find('.tabs-list > li').first().click();
            } else {
                _.$el.find('.tabs-list .active-control').next().click();
            }
        }, _.options.autoSpeed);
    }

    /**
     * @method autoplayStop
     * @desc Autoplay stop
     */
    $.gsb.toggle.prototype.autoplayStop = function () {
        var _ = this.base;

        clearInterval(_.rotation);
    }

    /**
     * @method refreshTab
     * @desc Refresh Tab
     */
    $.gsb.toggle.prototype.refreshTab = function () {
        var _ = this.base;

        if(_.options.tab){
            _.$el.find('.tabs-container').removeAttr('multiselectable');
            _.$el.find('.tabs-container').removeAttr('role');
            _.$el.find('.heading').each(function(){
                $(this).removeAttr('aria-expanded');
            });

            // Autoplay muss deaktiviert sein, da die Events focusin und focusout im Firefox derzeit nocht nicht implementiert
            // sind bzw. noch bugs enthalten
            if(_.options.changeOnHover && !_.options.autoplay){
                _.$el.on('mouseenter focus', _.options.tabControls , function (e) {
                    _.clickedElem = $(this);
                    _.changeStateTab();
                });
            }

            _.$el.find('.panel-closed').hide();
            _.$el.find('.panel-opened').show();
        }
    }

    /**
     * @method refreshAccordion
     * @desc  Refresh Accordion
     */
    $.gsb.toggle.prototype.refreshAccordion = function () {
        var _ = this.base;

        if(_.options.accordion){
            _.$el.find('.tabs-container').attr('role', 'tablist');
            if(!_.options.accordionCloseOther){
                _.$el.find('.tabs-container').attr('multiselectable', 'true');
            }
            _.$el.find('.heading').each(function(){
                $(this).attr('aria-expanded','false');
                $(this).hasClass('inactive-control')? $(this).next().hide():"";
            });
        }
    }

    /**
     * @method changeStatePlayPause
     * @param {string} imgsrc - Imagesource-Link
     * @param {string} alt - Alt-Text des Images
     * @desc Bild tauschen für Play/Pausebutton
     */
    $.gsb.toggle.prototype.changeStatePlayPause = function (imgsrc, imgalt) {
        var _ = this.base;

        var image = _.playbutton.find('img');
        image.prop("alt", imgalt).prop("src", imgsrc);
    }

    /**
     * @method getSwitchPanelClass
     * @param {Object} elem - geklicktes Element (durchgereicht von changeState oder autoplayStart)
     * @desc Liefert die switch-panel Klasse des geklickten Elements
     */
    $.gsb.toggle.prototype.getSwitchPanelClass = function (elem) {
        var panelClass = $.grep(elem.prop('class').split(" "), function (value) {
            return value.indexOf('switch-panel') > -1;
        });
        return panelClass;
    }

    /**
     * @method uninitAccordion
     * @desc Destroy Accordion
     */
    $.gsb.toggle.prototype.uninitAccordion = function () {
        var _ = this.base;

        if(_.$el.hasClass('gsb-toggle')){
            _.$el.off();
            _.$el.removeClass('gsb-toggle');
            _.$el.find('> .tabs-container > .heading').removeClass('active-control inactive-control').removeAttr("tabindex").next()
            .removeAttr("style");
        }
    }

    /**
     * @method addA11y
     * @desc  setzt den focus auf das erste fokussierbare Element
     * @param elem {jQuery} Element welches nach fokussierbaren Elementen durchsucht wird. Ist mindestens ein Element vorhanden,
     * wird der Fokus gesetzt
     * @param tabPanel {jQuery} Element auf welches gesprungen werden soll, wenn im TabContainer keiner fokussierbaren Element vorhanden sind
     */
    $.gsb.toggle.prototype.addA11y = function (elem, tabPanel) {
        var _ = this.base;

        elem = elem || _.$el;
        var focusElements = elem.find('input,textarea,select,a,button').not(':hidden');
        if(focusElements.length){
            focusElements[0].focus();
            focusElements.last().keydown(function(e) {

            });
        }
    };

    /**
     * @method addRichtextContainer
     * @desc Sucht im z.B. Content nach Elementen mit den Klasse startaccordion, endaccordion und accordionheadline und
     * baut die für gsb_toggle benötigte Struktur um diese Elemente
     *
     * Wenn alle benötigten Elemente eingebaut wurden, ruft sich das Script auf '.richtext-accordion' mit der Option
     * richTextAccordion nochmal selbst auf
     */
    $.gsb.toggle.prototype.addRichtextContainer = function () {
        var _ = this.base;

        _.$el.find('.startaccordion').each(function(){
            $(this).nextUntil('.endaccordion').addBack().add($(this).find('~.endaccordion').first()).wrapAll('<div class="tabs-container"/>');
            var wrapper = $(this).parent();

            wrapper.find('.startaccordion, .accordionheadline').addClass('heading');
            wrapper.find('.heading').each(function(){
                $(this).nextUntil('.heading').wrapAll('<div/>');
            });
            wrapper.find('.heading').last().nextUntil('.accordionend').add(wrapper.find('.accordionend')).wrapAll('<div/>');
            wrapper.wrap('<div class="richtext-accordion"/>');
        });

        _.$el.removeData('gsb.toggle');
        _.$el.find('.richtext-accordion').gsb_toggle($.extend({}, _.options, {richTextAccordion:false}));
    };

    $.fn.gsb_toggle = function (options) {
        return this.each(function () {
            (new $.gsb.toggle(this, options));
        });
    };
})(jQuery);