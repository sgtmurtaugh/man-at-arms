/*!
 * GSB-Wrapper-Plugin fuer Foundation Tooltip-Plugin. Arbeitet als Polyfill, um von Foundation benoetigte
 * data-Attribute und Klassen hinzuzufuegen.
 *
 * s. auch http://foundation.zurb.com/docs/components/tooltips.html
 *
 * Optionen:
 * tooltipPosition: Die Position des Tooltips(top,bottom(default),left,right)
 * tooltipCorners: Layoutmodus des Tooltip(''(default), 'radius', 'round')
 * tooltipFoundationOptions: native Optionen fuer das Foundation Plugin(undefined(default), siehe Doku oben)
 *
 * Abhängigkeiten:
 *
 * - modernizr(wegen Foundation)
 * - foundation
 * - foundation-tooltip
 *
 * Author: anuebel
 */

;(function ($) {
    'use strict';
    if (!$.gsb) {
        $.gsb = {};
    }

    $.gsb.tooltip = function (el, options) {
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("gsb.tooltip", base);

        base.init = function () {
            base.options = $.extend({}, $.gsb.tooltip.defaultOptions, options);
            base.$el
            .addClass('has-tip tip-' + base.options.tooltipPosition + ' ' + base.options.tooltipCorners)
            .attr('data-tooltip', '')
            .attr('aria-haspopup', 'true');
            // native Optionen des Foundation Plugins durchreichen
            if (base.options.tooltipFoundationOptions) {
                var serializedFoundationOptions = JSON.stringify(base.options.tooltipFoundationOptions);
                base.$el.attr('data-options', serializedFoundationOptions);
            }
        };
        base.init();
    };

    $.gsb.tooltip.defaultOptions = {
        tooltipPosition : 'bottom',
        tooltipCorners: '',
        tooltipFoundationOptions: undefined
    };

    $.fn.gsb_tooltip = function (options) {
        return this.each(function () {
            (new $.gsb.tooltip(this, options));
        });
    };

})(jQuery);