/**
 * ifLowerThanEquals
 * @param param1
 * @param param2
 * @param options
 * <p>TODO
 */
module.exports = function(param1, param2, options) {
    let METHOD = "ifLowerThanEquals(param1, param2, options)";

    if ( arguments.length < 3 ) {
        if ( arguments.length < 2 ) {
            throw METHOD + " [ERROR] Es wurden keine Vergleichs-Objekte angegeben.";
        }
        else {
            throw METHOD + " [ERROR] Es wurde nur ein Vergleichs-Objekte angegeben.";
        }
    }
    else {
        if ( isNaN(param1) || isNaN(param2) ) {
            if ( isNaN(param1) && isNaN(param2) ) {
                throw METHOD + " [ERROR] Beide Parameter sind keine Zahlen.";
            }
            else if ( isNaN(param1) ) {
                throw METHOD + " [ERROR] Der erste Parameter ist keine Zahl.";
            }
            else if ( isNaN(param2) ) {
                throw METHOD + " [ERROR] Der zweite Parameter ist keine Zahl.";
            }
        }

        if (param1 <= param2) return options.fn(this);
        return options.inverse(this);
    }
};