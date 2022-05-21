/*!
 * express-pydantic
 * MIT Licensed
 */

'use strict';

function buildErrorString(err) {
    let ret = ''
    const details = err.details

    for (let i = 0; i < details.length; i++) {
        ret += ` ${details[i].message}.`
    }

    return ret
}

class ValidationError extends Error {
    constructor(joiError) {
        const errorStr = buildErrorString(joiError)
        super(errorStr)
    }
}

module.exports = ValidationError