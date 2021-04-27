import typechecks from "@sgtmurtaugh/typechecks";

/**
 * i18n dummy (!)
 * @param key
 * @param params
 * <p>TODO
 */
module.exports = function(key, params) {
    let i18n = "";

    if ( typechecks.isNotEmpty(key) ) {
        i18n = key;

        if ( typechecks.isNotEmpty(params) ) {
            if ( !typechecks.isObject(params) && !typechecks.isFunction(params) ) {
                if ( typechecks.isArray(params) ) {
                    params.forEach(function(param, index, params) {
                        i18n += ` ${ param }`;
                    });
                }
                else {
                    i18n += ` ${ params }`;
                }
            }
        }
    }

    return i18n;
};
