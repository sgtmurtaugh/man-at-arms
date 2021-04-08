/**
 * contains
 * @param value
 * @param array
 * @param options
 * <p>Sucht das uebergebene Value Objekt in dem Array.
 */
module.exports = function( value, array, options ){
    let METHOD = "contains(value, array, options)";

    if ( arguments.length < 3 ) {
        throw METHOD + " [ERROR] Es muessen ein Value Objekt und ein Array uebergeben werden.";
    }
    else {
        array = ( array instanceof Array ) ? array : [array];
        return (array.indexOf(value) > -1) ? options.fn( this ) : options.inverse( this );
    }
};
