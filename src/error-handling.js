/*!
 * express-joi-model
 * MIT Licensed
 */

"use strict";

function buildErrorString(err) {
  let ret = "";
  const details = err.details;

  for (let i = 0; i < details.length; i++) {
    ret += ` ${details[i].message}.`;
  }

  return ret;
}

class ValidationError extends Error {
  constructor(modelName, joiError) {
    const errorStr = buildErrorString(joiError);
    super(`${modelName}: ${errorStr}`);
    this.name = this.constructor.name
    this.errorStr = errorStr
  }
}

module.exports = ValidationError;
