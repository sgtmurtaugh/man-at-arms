/**
 * debug
 * @param optionalValue
 * @param options
 * <p>TODO
 */
module.exports = function(optionalValue, options) {
    let METHOD = "debug(optionalValue, options)";

    console.log("Current Context");
    console.log("====================");
    console.log(this);

    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
    }
};