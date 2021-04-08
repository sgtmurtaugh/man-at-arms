let typechecks = require('../../gulp/functions/type-checks');

/**
 * <p>TODO Beschreibung
 * renderPageLink
 * @param page - page pfad
 * @param options - page context
 */
module.exports = function(page = '#', options = {}) {
    let link ='#';

    if ( typechecks.isNotEmpty(page) && page !== '#') {
        let linkTokens = [];
        let iPosition = page.toString().indexOf( '.html' )

        // sind options vorhanden, dann koennen Properties wie noscript und root beruecksichtigt werden
        if ( typechecks.isNotEmpty(options) ) {

            // ggf root anfuegen
            if ( typechecks.isNotEmpty( options.root )
                    && !page.toString().startsWith( options.root ) ) {

                linkTokens.push( options.root );
            }

            // File (ggf mit Pfad) OHNE Extension anfuegen
            if ( iPosition > -1 ) {
                linkTokens.push( page.slice(0, iPosition) );
            }
            else {
                linkTokens.push( page );
            }

            // ggf. '_noscript' suffix anfuegen
            if (typechecks.isTrue( options.noscript )) {
                linkTokens.push( '_noscript' );
            }
        }
        else {
            linkTokens.push( page );
        }

        // File Extension anfuegen
        if ( iPosition < 0 ) {
            linkTokens.push( '.html' );
        }

        link = linkTokens.join('');
    }
    return link;
};
