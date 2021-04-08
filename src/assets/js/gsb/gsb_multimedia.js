/*!
 * GSB-Wrapper-Plugin fuer mediaelement.js.
 *
 * s. auch http://mediaelementjs.com
 *
 * Optionen:
 * center: Soll das Multimedia-Element zentriert werden(false(default), true)(nur fuer Videos)
 * responsive: Objekt mit Angaben zu den Groessen in den verschiedenen Aufloesungen
 * mediaelementplayerOptions: native Optionen fuer das mediaelement.js Plugin(null(default), siehe Doku oben)
 *
 * @author anuebel
 *
 * @requires jQuery >= 1.11.1, gsb_responsiveListener, MediaElementPlayer
 *
 * @global jQuery, console
 *
 */

//noinspection JSHint
;
(function ($, window) {
    'use strict';
    if (!$.gsb) {
        $.gsb = {};
    }

    $.gsb.Multimedia = function (el, options) {
        var base = this;

        base.$el = $(el);
        base.$elWrapper = base.$el.closest('.mejs-wrapper');
        base.el = el;
        base.$el.data("gsb.Multimedia", base);

        base.reloadHref = base.$el.data('reload-href');

        base.init(options);
    };

    /**
     * Zentriert das zugrunde liegende Multimedia-Element.
     */
    $.gsb.Multimedia.prototype.centerVideoIfRequired = function () {
        var base = this,
            mediaelementplayerOptions = base.options.mediaelementplayerOptions,
            videoWidth = mediaelementplayerOptions && mediaelementplayerOptions.videoWidth || base.$el.attr('width');
        if (base.options.center && videoWidth) {
            var centerContainer,
                parent = base.$el.parent();
            if (!parent.is('.mejs-centered')) {
                centerContainer = $('<div class="mejs-centered" style="margin: 0 auto;"></div>');
                centerContainer.css('width', videoWidth + 'px');
                base.$el.wrap(centerContainer);
            } else {
                centerContainer = parent;
                centerContainer.css('width', videoWidth + 'px');
            }
        }
    };

    /**
     * Stellt die serverseitig bereitgestellte HTML-Struktur des Multimedia-Elements wieder her.
     */
    $.gsb.Multimedia.prototype.reinitializeVideoElement = function () {
        var base = this;
        $.get(base.reloadHref, function (data) {
            var $newVideoElementContainer = $(data);
            base.$elWrapper.replaceWith($newVideoElementContainer);
            var newVideoElement = $newVideoElementContainer.find('video').get(0);
            base.onVideoElementReinitialized(newVideoElement);
        });
    };

    /**
     * Loest die Aktualisierung des Multimedia-Elements aus.
     */
    $.gsb.Multimedia.prototype.triggerRefresh = function () {
        var base = this;
        if (base.$el.is('video') && base.reloadHref) {
            base.reinitializeVideoElement();
        }
    };

    /**
     * Aktualisiert die Einstellungen des Multimedia-Elements
     */
    $.gsb.Multimedia.prototype.onVideoElementReinitialized = function (newVideoElement) {
        var base = this;
        base.$el = $(newVideoElement);
        base.$elWrapper = base.$el.closest('.mejs-wrapper');
        base.el = newVideoElement;
        base.$el.data("gsb.Multimedia", base);
        base.initializeMediaElement();
    };

    /**
     * Fuehrt die Initialisierung des Mediaelement.js Plugins durch. Dieser Vorgang wird sowohl beim initialen Laden
     * der Seite als auch fuer responsive Aenderungen ausgeloest.
     */
    $.gsb.Multimedia.prototype.initializeMediaElement = function () {
        var base = this,
            mediaelementplayerOptions = $.extend({},
                $.gsb.Multimedia.defaultMediaelementplayerOptions,
                base.options.settings.mediaelementplayerOptions,
                base.mediaelementplayerOptionsFromDataAttribute());
        if (mediaelementplayerOptions.hasOwnProperty('videoWidth')) {
            base.$el.attr('width', mediaelementplayerOptions.videoWidth);
        }
        if (mediaelementplayerOptions.hasOwnProperty('videoHeight')) {
            base.$el.attr('height', mediaelementplayerOptions.videoHeight);
        }
        base.centerVideoIfRequired();
        base.$el.mediaelementplayer(mediaelementplayerOptions);
    };

    /**
     * Parst zusaetzliche Optionen fuer das Mediaelement.js Plugin aus dem options data-Attribut.
     * Die Logik dieser Funktion ist von Foundation uebernommen.
     */
    $.gsb.Multimedia.prototype.mediaelementplayerOptionsFromDataAttribute = function () {
        var base = this,
            optionsFromDataAttributeAsString = base.$el.data('options');
        var opts = {}, ii, p,
            opts_arr = (optionsFromDataAttributeAsString || ':').split(';');
        ii = opts_arr.length;

        function isNumber(o) {
            return !isNaN(o - 0) && o !== null && o !== "" && o !== false && o !== true;
        }

        function trim(str) {
            if (typeof str === 'string') {
                return $.trim(str);
            }
            return str;
        }

        while (ii--) {
            p = opts_arr[ii].split(':');
            p = [p[0], p.slice(1).join(':')];

            if (/true/i.test(p[1])) {
                p[1] = true;
            }
            if (/false/i.test(p[1])) {
                p[1] = false;
            }
            if (isNumber(p[1])) {
                if (p[1].indexOf('.') === -1) {
                    p[1] = parseInt(p[1], 10);
                } else {
                    p[1] = parseFloat(p[1]);
                }
            }

            if (p.length === 2 && p[0].length > 0) {
                opts[trim(p[0])] = trim(p[1]);
            }
        }
        return opts;
    };
    /**
     * Fuehrt die Initialisierung des GSB-Wrapper-Plugins durch.
     * @param options die Optionen fuer das Multimedia-Element
     */
    $.gsb.Multimedia.prototype.init = function (options) {
        var base = this;
        base.options = $.extend({}, $.gsb.Multimedia.defaultOptions, options);
        base.$el.gsb_responsiveListener(base.$el.data("gsb.Multimedia"));
        base.initializeMediaElement();
    };

    /**
     * Die Standard-Optionen fuer das Plugin
     */
    $.gsb.Multimedia.defaultOptions = {
        onRefresh: function () {
            this.triggerRefresh()
        },
        responsive: [
            {
                breakpoint: 600,
                onRefresh: function () {
                    this.triggerRefresh()
                },
                settings: {
                    mediaelementplayerOptions: {
                        videoWidth: 440,
                        videoHeight: 248
                    }
                }
            },
            {
                breakpoint: 440,
                onRefresh: function () {
                    this.triggerRefresh()
                },
                settings: {
                    mediaelementplayerOptions: {
                        videoWidth: 280,
                        videoHeight: 158
                    }
                }
            }
        ],
        center: false,
        respondToEvents: true,
        settings:{
            mediaelementplayerOptions: {
            }
        }
    };

    /**
     * Die Standard-Optionen fuer das aufgerufene Mediaelement.js Plugin
     */
    $.gsb.Multimedia.defaultMediaelementplayerOptions = {
        flashName: '/static/mediaElementPlayer/flashmediaelement.swf',
        showPosterWhenEnded: true
    };

    $.fn.gsb_Multimedia = function (options) {
        return this.each(function () {
            return new $.gsb.Multimedia(this, options);
        });
    };

}(jQuery, window));