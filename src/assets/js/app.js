"use strict";

// Initialize jQuery
$().init();

// Initialize foundation
$(document).foundation();

/**
 * doToggle
 * @param element
 * @param index
 * @param offset - default 0
 */
function doToggle( element, index, offset = 0 ) {
    if ( null != element ) {
        setTimeout(function() {
            $(element).addClass("scaleUpAnimation")
                .toggle();
        }, (index - offset) * 150);
    }
}