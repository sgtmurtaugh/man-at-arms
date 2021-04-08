import typechecks from "typechecks/app";

/**
 * subtraction
 * @param args
 * <p>Subtrahiert alle &uuml;bergebenen Wert. Werde keine Werte oder keine numerischen Werte &uuml;bergeben, dann werden
 * diese als 0 verwertet.
 */
module.exports = function(...args) {
    let METHOD = "subtraction(...args)";

    let subtractionResult = 0;
    subtractionResult = [...args].reduce((a, b) => {
        if (!typechecks.isNumeric(a)) {
                        a = 0;
        }
        if (!typechecks.isNumeric(b)) {
            b = 0;
        }
        return a - b;
    });

    return subtractionResult;
};
