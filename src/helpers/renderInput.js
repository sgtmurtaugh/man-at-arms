let renderTag = require('./renderTag');
let renderLabel = require('./renderLabel');
let htmlAttrs = require('./htmlAttrs');

/**
 * input
 * @param input
 * @param options
 * <p>.
 */
module.exports = function(input, options) {
    let METHOD = "renderInput(input, options)";
    let validAttrs = [];

    let labelTag = '';
    if ( null !== options ) {
        let type = 'text';

        if ( input.hasOwnProperty('type') ) {
            type = input['type'];
        }

        let jsonKey = 'components.form.input.'+type;
        let allowedAttrs = htmlAttrs(jsonKey, input);

        if ( allowedAttrs === null
                || allowedAttrs.length < 1 ) {

            console.log('Es konnten zu dem JSON Key "' + jsonKey + '" keine Eintraege mittels htmlAttr ermittelt werden.');
        }
        else {
            for ( let attrKey of allowedAttrs ) {
                if ( input.hasOwnProperty(attrKey) ) {
                    let attrValue = input[attrKey];

                    if ( attrValue !== null
                            && attrValue.toString().trim().length > 0 ) {

                        validAttrs[attrKey] = attrValue;
                    }
                }
            }
        }

        if ( input.hasOwnProperty('label') ) {
            let label = input;

            if ( label['label'] !== null
                    && label['label'].trim().length > 0 ) {

                labelTag = renderLabel(label, options);
            }
        }
    }

    return labelTag + renderTag('input', validAttrs, input, options);
};
