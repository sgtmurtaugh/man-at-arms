import typechecks from "@sgtmurtaugh/typechecks";

/**
 * virtualSize
 * @param vsize
 * @param defaultVsize
 * @param options
 * <p>TODO
 */
module.exports = function(vsize, defaultVsize, options) {
    let METHOD = "virtualSize(vsize, defaultVsize, options)";

    let hx = 0;

    // 1. vsize / defaultVsize check
    if (typechecks.isNumeric(vsize)) {
        hx = parseFloat(vsize);
    }
    else if (typechecks.isNumeric(defaultVsize)) {
        hx = parseFloat(defaultVsize);
    }

    // 2. Ungueltige Werte werden durch 0 ersetzt, damit diese ignoriert werden
    if ((hx < 0)
            || (hx > 6)) {
        hx = 0;
    }

    // return options.fn(this);
    return hx;
};
