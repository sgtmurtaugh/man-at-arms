var jsonValue = require('./jsonValue');

/**
 * htmlAttrs
 * @param jsonKey
 * @param options
 * <p>
 */
module.exports = function(jsonKey, options) {
    let METHOD = "htmlAttrs( jsonKey, options)";

    if ( arguments.length < 2 ) {
        throw METHOD + " [ERROR] Es muss ein JSON Key uebergeben werden.";
    }

    let JSONObject = null;

    // Zuerst ueber das 'data' Element nach dem 'html_attributes' Objekt suchen. Wenn dies nicht gefunden werden kann,
    // dann versuchen, das Objekt direkt in den 'options' zu finden.
    if ( options.hasOwnProperty('data') ) {
        if ( options['data'].hasOwnProperty('root') ) {
            if ( options['data']['root'].hasOwnProperty('html_attributes') ) {
                JSONObject = options['data']['root']['html_attributes'];
            }
        }
    }

    if ( JSONObject === null ) {
        if ( options.hasOwnProperty('html_attributes') ) {
            JSONObject = options['html_attributes'];
        }
    }

    return jsonValue(JSONObject, jsonKey, options);
};
