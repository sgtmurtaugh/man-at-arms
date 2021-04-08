/**
 * ifNonEquals
 * @param param1
 * @param param2
 * @param options
 * <p>Vergleicht die beiden &uuml;bergebenen Objekte und wertet den Inhalt des Block nur aus, wenn das Ergebnis
 * <code>false</code> ist.
 */
module.exports = function(param1, param2, options) {
    let METHOD = "ifNonEquals(param1, param2, options)";

    if ( arguments.length < 3 ) {
        if ( arguments.length < 2 ) {
            throw METHOD + " [ERROR] Es wurden keine Vergleichs-Objekte angegeben.";
        }
        else {
            throw METHOD + " [ERROR] Es wurde nur ein Vergleichs-Objekte angegeben.";
        }
    }
    else {
        if (param1 !== param2) return options.fn(this);
        return options.inverse(this);
    }
};