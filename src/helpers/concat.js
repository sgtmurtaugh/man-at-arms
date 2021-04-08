var typechecks = require('../../gulp/functions/type-checks');

/**
 * concat
 * @param args
 * <p>TODO
 */
module.exports = function(...args) {
    let METHOD = "concat(args)";
    const delimiter = ' ';

    if (typechecks.isEmpty(args)) {
        return undefined;
    }
    else if (typechecks.isEmpty(args[0])) {
        return args.slice(1,-1).join(delimiter);
    }
    else {
        return args.slice(0, -1).join(delimiter);
    }
};