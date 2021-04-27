import typechecks from "@sgtmurtaugh/typechecks";

/**
 * headlineSize
 * @param offset
 * @param options
 * <p>TODO
 */
module.exports = function(offset, options) {
    let METHOD = "headlineSize(offset, options)";

    let hx = 1;

    // Offset calc
    if (typechecks.isNumeric(offset)) {
        hx += parseFloat(offset);
    }

    // Ungueltige Werte werden durch 0 ersetzt, damit sie als P-Tag gerendert werden
    if ((hx < 0)
            || (hx > 6)) {
        hx = 0;
    }
    return hx;
};
