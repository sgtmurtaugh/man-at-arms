import typechecks from "typechecks/app";

/**
 * tag
 * @param tagname
 * @param tagattrs
 * @param context
 * @param options
 * <p>.
 */
module.exports = function(tagname, tagattrs, context, options) {
    let METHOD = "renderTag(tagattrs, options)";

    if ( arguments.length < 4 ) throw METHOD + " [ERROR] Es wurden kein String-Array uebergeben.";

    let tag = '<' + tagname;

    for ( let attrKey in tagattrs ) {
        if ( tagattrs.hasOwnProperty(attrKey) ) {
            tag += ' ' + attrKey + '="' +  tagattrs[attrKey] + '"';
        }
    }

    tag += '>';

    let tagBody = null;

    if ( options.hasOwnProperty( 'partial-block' ) ) {
        tagBody = options['partial-block']();
    }
    else {
        // ggf im Root Context suchen
        if ( options.hasOwnProperty('data') ) {
            if ( options['data'].hasOwnProperty('partial-block') ) {
                tagBody = options['data']['partial-block'];

                if ( typechecks.isFunction( tagBody ) ) {
                    tagBody = tagBody();
                }
                else {
                    tagBody = null;
                }
            }
        }
    }

    if ( tagBody !== null
            && tagBody.trim().length > 0 ) {

        tag += tagBody;
        tag += '</' + tagname + '>';
    }

    return tag;
};
