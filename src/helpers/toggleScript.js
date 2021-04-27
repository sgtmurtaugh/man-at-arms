import typechecks from "@sgtmurtaugh/typechecks";

/**
 * <p>TODO Beschreibung
 * toggleScript
 * @param page - page pfad
 * @param options - page context
 */
module.exports = function(page = '#', options = {}) {
    let link ='#';

    if ( typechecks.isNotEmpty(page) ) {

        // sind options vorhanden, dann koennen Properties wie noscript und root beruecksichtigt werden
        if ( page.toString().endsWith('_noscript') ) {
            link = page.replace("_noscript", ".html");
        }
        else {
            link = page + "_noscript.html";
        }
    }
    return link;
};
