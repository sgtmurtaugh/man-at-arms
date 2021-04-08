/**
 * array
 * @param values
 * @param options
 * <p>.
 */
module.exports = function ( values, options ) {
    let METHOD = "contains(values, options)";

    if ( arguments.length < 2 ) {
        throw METHOD + " [ERROR] Es wurden kein String-Array uebergeben.";
    }
    else {
        try {
            return eval(values);
        }
        catch ( ex ) {
            console.log( ex );
            throw ex;
        }
    }
};
