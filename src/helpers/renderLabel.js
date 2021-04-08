let renderTag = require('./renderTag');
let htmlAttrs = require('./htmlAttrs');

/**
 * renderLabel
 * @param label
 * @param options
 * <p>.
 */
module.exports = function(label, options) {
    let METHOD = "renderLabel(label, options)";
    let validAttrs = [];

    if ( null !== options ) {
        let jsonKey = 'components.form.label';
        let allowedAttrs = htmlAttrs(jsonKey, label);

        if ( allowedAttrs === null
                || allowedAttrs.length < 1 ) {

            console.log('Es konnten zu dem JSON Key "' + jsonKey + '" keine Eintraege mittels htmlAttr ermittelt werden.');
        }
        else {
            for ( let attrKey of allowedAttrs ) {
                if ( label.hasOwnProperty(attrKey) ) {
                    let attrValue = label[attrKey];

                    if ( attrValue !== null
                        && attrValue.toString().trim().length > 0 ) {

                        validAttrs[attrKey] = attrValue;
                    }
                    else {
                        // Sonderlocke fuer for-id mapping
                        switch (attrKey) {
                            case 'for':
                                attrValue = label['id'];

                                if ( attrValue !== null
                                    && attrValue.toString().trim().length > 0 ) {

                                    validAttrs['for'] = attrValue;
                                }
                                break;
                        }
                    }
                }
            }
        }
    }
    return renderTag('label', validAttrs, label, options);
};
