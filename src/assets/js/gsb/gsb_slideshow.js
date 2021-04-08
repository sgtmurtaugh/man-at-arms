/*!
 * GSB-Wrapper-Plugin fuer slick.js.
 *
 * s. auch http://kenwheeler.github.io/slick/
 *
 * Optionen:
 * nextButtonImage: Das Hintergrundbild fuer den aktiven weiter-Link der Navigation(default: null)
 * nextButtonInactiveImage: Das Hintergrundbild fuer den inaktiven weiter-Link der Navigation(default: null)
 * nextTitle: Das title-Attribut fuer den aktiven weiter-Link der Navigation
 * (default: SLIDER_NEXT bzw. 'Nächste Seite')
 * nextTitleInactive: Das title-Attribut fuer den inaktiven weiter-Link der Navigation
 * (default: SLIDER_NEXT_INACTIVE bzw. 'Keine nächste Seite')
 * prevButtonImage: Das Hintergrundbild fuer den aktiven zurueck-Link der Navigation(default: null)
 * prevButtonInactiveImage: Das Hintergrundbild fuer den aktiven zurueck-Link der Navigation(default: null)
 * prevTitle: Das title-Attribut fuer den aktiven zurueck-Link der Navigation
 * (default: SLIDER_BACK bzw. 'Vorherige Seite')
 * prevTitleInactive: Das title-Attribut fuer den aktiven zurueck-Link der Navigation
 * (default: SLIDER_BACK_INACTIVE bzw. 'Keine vorherige Seite')
 * playButtonImagePlaying: Das Hintergrundbild fuer den Playbutton im abspielenden Zustand(default: null)
 * playButtonImagePaused: Das Hintergrundbild fuer den Playbutton im pausierten Zustand(default: null)
 * playButtonAltTextPlaying: Das alt-Attribut fuer den Playbutton im abspielenden Zustand
 * (default: SLIDER_PLAY bzw. 'Animation starten')
 * playButtonAltTextPaused: Das alt-Attribut fuer den Playbutton im pausierten Zustand
 * (default: SLIDER_PAUSE bzw. 'Animation stoppen')
 * slickOptions: native Optionen fuer das Slick Plugin(default: null, siehe Doku oben)
 * slickOptions.gsb.playButton: Soll ein Playbutton angelegt werden(default: true), an dieser Stelle
 * hinterlegt, um responsiven Reinitialisierungmechanismus von Slick zu nutzen
 *
 * Author: anuebel
 */

/*global jQuery, console, SLIDER_NEXT, SLIDER_NEXT_INACTIVE, SLIDER_BACK, SLIDER_BACK_INACTIVE */

;
(function ($) {
    'use strict';
    if (!$.gsb) {
        $.gsb = {};
    }

    $.gsb.Slideshow = function (el, options) {
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("gsb.Slideshow", base);

        //noinspection JSUnusedGlobalSymbols
        base.defaultSlickOptions = {
            slide: '.slide',
            fade: true,
            infinite: false,
            draggable: false,
            adaptiveHeight: false,
            onBeforeChange: function (slick) {
                //ohne diese Anweisung kann die Höhenberechnung fehlschlagen
                //die "falschen" Elemente werden in updateTabindex wieder verborgen
                slick.$slides.find('video, object').show();
            },
            onAfterChange: function (slick) {
                base.updateNavigation(slick);
                base.updateTabindex(slick);
            },
            onInit: function (slick) {
                var slideshowPluginInstance = slick.$slider.data('gsb.Slideshow');
                var onSlickInit = slideshowPluginInstance.options.onSlickInit;
                if (typeof onSlickInit == 'function') {
                    onSlickInit.call(slick, slick);
                }
                base.updateNavigation(slick);
                base.initMultimedia();
                base.updateTabindex(slick);
                base.$el.trigger('init.slideshow.gsb');
            },
            // gsb Namespace zur Nutzung des responsiven Reinitialisierungsmechanismus
            gsb: {
                playButton: true
            }
        };
        base.initMultimedia = function initMultimedia() {
            if (typeof $.fn.gsb_Multimedia == "function") {
                base.$el.find('video, audio').gsb_Multimedia();
            }
        };
        base.updateTabindex = function updateTabindex(slick) {
            //Barrierefreiheit/Tabbing workaround
            var focusableItems = 'a, [tabindex], textarea, input, select, button, video, object',
                buggedItems = 'video, object';
            slick.$slides.not('.slick-active').find(focusableItems).attr('tabindex', -1).end().find(buggedItems).hide();
            slick.$slides.filter('.slick-active').find(focusableItems).attr('tabindex', 0).end().find(buggedItems).show();
        };

        base.updateNavigationArrow = function ($arrow, activeImage, inactiveImage, activeArrowButtonTitle, inactiveArrowButtonTitle) {
            if ($arrow) {
                var $arrowButton = $arrow.is('button') ? $arrow : $arrow.find('button'),
                    $arrowImage = $arrow.find('img');
                if ($arrow.hasClass('slick-disabled')) {
                    $arrowButton.attr('disabled', '');
                    $arrowButton.attr('title', inactiveArrowButtonTitle);
                    $arrowImage.attr('src', inactiveImage);
                    $arrowImage.attr('alt', '');
                } else {
                    $arrowButton.removeAttr('disabled');
                    $arrowButton.attr('title', activeArrowButtonTitle);
                    $arrowImage.attr('src', activeImage);
                    $arrowImage.attr('alt', activeArrowButtonTitle);
                }
            }
        };

        /**
         * Fuehrt Manipulationen an der HTML-Struktur der Navigation durch. Dazu gehoeren u.a. die Aktualisierung der
         * Bilder und die Nachruestung von Elementen, die fuer die Barrierefreiheit relevant sind.
         * @param slick das Slick-Objekt, das Informationen ueber den Zustand des Karussells enthaelt.
         */
        base.updateNavigation = function (slick) {
            base.updateNavigationArrow(slick.$prevArrow,
                base.options.prevButtonImage,
                base.options.prevButtonInactiveImage,
                base.options.prevTitle,
                base.options.prevTitleInactive);
            base.updateNavigationArrow(slick.$nextArrow,
                base.options.nextButtonImage,
                base.options.nextButtonInactiveImage,
                base.options.nextTitle,
                base.options.nextTitleInactive);
        };

        /**
         * Einige der fuer das alte Slideshow-Plugin definierten Optionen werden auf die korrespondierenden
         * Slick-Optionen gemapt. Beispiel: pagination->dots
         *
         * Wird eine Legacy-Option in options gefunden, so wird sie dort geloescht und unter dem gemappten Namen in den
         * slickOptions registriert.
         *
         * @param slickOptions die Optionen, die an Slick uebergeben werden
         * @param options die Optionen, die an dieses Plugin uebergeben wurden
         */
        base.handleLegacyOptions = function (slickOptions, options) {
            $.each($.gsb.Slideshow.slickOptionsForLegacyOptions, function (legacyOption, mappedSlickOption) {
                if (options.hasOwnProperty(legacyOption)) {
                    var savedValue = options[legacyOption];
                    delete options[legacyOption];
                    slickOptions[mappedSlickOption] = savedValue;
                }
            });
        };

        /**
         * Initialisiert die Navigationspfeile. Diese duerfen erst nach einem etwaigen Austausch des HTML ermittelt werden,
         * da sie ggf. mit ersetzt werden. In diesem Fall wuerden ansonsten die nachgeladene Pfeile nicht
         * initialisiert.
         * @param slickOptions die Optionen, die an Slick uebergeben werden
         */
        base.handleNavigationArrows = function (slickOptions) {
            var navigationArrowOptions = {
                nextArrow: base.$el.find('.next'),
                prevArrow: base.$el.find('.prev')
            };
            return $.extend({}, navigationArrowOptions, slickOptions);
        };

        /**
         * Initialisiert den Playbutton, der zum Starten und Stoppen des Autoplay-Modus benutzt wird.
         *
         * Aufgrund des responsiven Reinitialisierungsmechanismus von Slick wird die Eigenschaft createPlayButton ueber
         * ein gsb-Objekt in den Slick-Options zur Verfuegung gestellt.
         * @param slickOptions die Optionen, die an Slick uebergeben werden
         */
        base.handlePlayButton = function (slickOptions) {
            (function (existingOnInit) {
                slickOptions.onInit = function (slick) {
                    // das zuvor konfigurierte onInit-Callback aufrufen
                    existingOnInit.call(slick, slick);
                    var initializedSlickOptions = slick.options;

                    function shouldCreatePlayButton() {
                        var playButtonImagesAreConfigured = base.options.playButtonImagePlaying !== null && base.options.playButtonImagePaused !== null,
                            createPlayButton = initializedSlickOptions.gsb.playButton;
                        return  createPlayButton && playButtonImagesAreConfigured;
                    }
                    function preventPlay() {
                        slick.paused = true;
                        slick.autoPlayClear();
                    }

                    var $existingPlayButton = base.$el.parent().find('.navigation button.playbutton'),
                        playButtonExists = $existingPlayButton.length;
                    if (shouldCreatePlayButton() && !playButtonExists) {
                        var slideshowStartsPlaying = initializedSlickOptions.autoplay,
                            initialClassForPlayButton = slideshowStartsPlaying && 'playbutton-playing' || 'playbutton-paused',
                            initialTitleAttrForPlayButton = slideshowStartsPlaying &&
                                base.options.playButtonAltTextPlaying ||
                                base.options.playButtonAltTextPaused,
                            initialSrcAttrForPlayButtonImage = slideshowStartsPlaying &&
                                base.options.playButtonImagePlaying ||
                                base.options.playButtonImagePaused,
                            initialAltAttrForPlayButtonImage = slideshowStartsPlaying &&
                                base.options.playButtonAltTextPlaying ||
                                base.options.playButtonAltTextPaused,
                            $playButton = $('<button' +
                                ' class="playbutton ' + initialClassForPlayButton + '"' +
                                ' title="' + initialTitleAttrForPlayButton + '">' +
                                '<img' +
                                ' src="' + initialSrcAttrForPlayButtonImage + '"' +
                                ' alt="' + initialAltAttrForPlayButtonImage + '">' +
                                '</button>'),
                            playButtonImage = $playButton.find('img');
                        base.$el.parent().find('.navigation').append($playButton);
                        $playButton.click(function () {
                            if ($playButton.is('.playbutton-playing')) {
                                $playButton
                                .removeClass()
                                .addClass('playbutton-paused')
                                .attr('title', base.options.playButtonAltTextPaused);
                                playButtonImage
                                .attr('src', base.options.playButtonImagePaused)
                                .attr('alt', base.options.playButtonAltTextPaused);
                                base.$el.slickPause();
                                slick.$list.on('mouseleave.slick', preventPlay);
                            } else {
                                $playButton
                                .removeClass()
                                .addClass('playbutton-playing')
                                .attr('title', base.options.playButtonAltTextPlaying);
                                playButtonImage
                                .attr('src', base.options.playButtonImagePlaying)
                                .attr('alt', base.options.playButtonAltTextPlaying);
                                base.$el.slickPlay();
                                slick.$list.off('mouseleave.slick', preventPlay);
                            }
                        });
                    } else if (!shouldCreatePlayButton() && playButtonExists) {
                        $existingPlayButton.remove();
                    }
                };
            }(slickOptions.onInit));
            return slickOptions;
        };
        base.init = function () {
            base.options = $.extend({}, $.gsb.Slideshow.defaultOptions, options);

            var allElementsUrl = base.$el.data('href'),
                initSlick = function () {
                    var rawSlickOptions = base.options.slickOptions;
                    delete rawSlickOptions.onInit;
                    var slickOptions = $.extend({}, base.defaultSlickOptions, rawSlickOptions);
                    base.handleLegacyOptions(slickOptions, base.options);
                    slickOptions = base.handleNavigationArrows(slickOptions);
                    slickOptions = base.handlePlayButton(slickOptions);
                    base.$el.slick(slickOptions);
                },
                onReceiveAllElements = function (data) {
                    base.$el.html(data);
                    initSlick();
                };

            if (allElementsUrl) {
                $.get(allElementsUrl, onReceiveAllElements);
            } else {
                initSlick();
            }
        };

        base.init();
    };

    /**
     * Die Standard-Optionen fuer das Plugin
     */
    $.gsb.Slideshow.defaultOptions = {
        nextButtonImage: null,
        nextButtonInactiveImage: null,
        nextTitle: typeof (NEXT) == 'undefined' ? 'Nächste Seite' : NEXT,
        nextTitleInactive: typeof (NEXT_INACTIVE) == 'undefined' ? 'Keine nächste Seite' : NEXT_INACTIVE,
        prevButtonImage: null,
        prevButtonInactiveImage: null,
        prevTitle: typeof (BACK) == 'undefined' ? 'Vorherige Seite' : BACK,
        prevTitleInactive: typeof (BACK_INACTIVE) == 'undefined' ? 'Keine vorherige Seite' : BACK_INACTIVE,
        playButtonImagePaused: null,
        playButtonImagePlaying: null,
        playButtonAltTextPaused: typeof (PLAY) == 'undefined' ? 'Animation starten' : PLAY,
        playButtonAltTextPlaying: typeof (PAUSE) == 'undefined' ? 'Animation stoppen' : PAUSE,
        paginationTitle: typeof(PAGE) == 'undefined' ? 'Seite' : PAGE,
        slickOptions: null
    };

    /**
     * Das Mapping von alten Optionen fuer das gsb_slideshow.js Plugin auf Slick-Optionen
     * @see #handleLegacyOptions
     */
    $.gsb.Slideshow.slickOptionsForLegacyOptions = {
        containerElement: 'slide',
        elementsToSlide: 'slidesToShow',
        autoplay: 'autoplay',
        autoSpeed: 'autoplaySpeed',
        pagination: 'dots',
        pauseOnHover: 'pauseOnHover'
    };

    $.fn.gsb_Slideshow = function (options) {
        return this.each(function () {
            return new $.gsb.Slideshow(this, options);
        });
    };

}(jQuery));