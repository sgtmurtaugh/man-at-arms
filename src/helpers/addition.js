import typechecks from "typechecks/app";

/**
 * addition
 * @param args
 * <p>Addiert alle &uuml;bergebenen Wert. Werde keine Werte oder keine numerischen Werte &uuml;bergeben, dann werden
 * diese als 0 verwertet.
 */
module.exports = function(...args) {
    let METHOD = "addition(...args)";

    let addtionResult = 0;
    addtionResult = [...args].reduce((a, b) => {
        if (!typechecks.isNumeric(a)) {
            a = 0;
        }
        if (!typechecks.isNumeric(b)) {
            b = 0;
        }
        return a + b;
    }, 0);

    return addtionResult;
};
