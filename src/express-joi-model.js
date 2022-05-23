/*!
 * express-joi-model
 * MIT Licensed
 */

"use strict";

const Joi = require("joi");
const ValidationError = require("./error-handling.js");

class BaseModel extends Object {
  static get __schema() {
    return {};
  }

  static get __defaultValidationClass() {
    return ValidationError;
  }

  constructor(obj) {
    super({});
    if (obj.constructor === this.constructor) {
      for (const [keyK, valueV] of Object.entries(obj)) {
        this[keyK] = valueV;
      }
      return;
    }
    const thisSchema = Joi.object(this.constructor.__schema);
    const { error, value } = thisSchema.validate(obj, {
      presence: "required",
      stripUnknown: true,
    });
    if (error !== undefined) {
      throw new this.constructor.__defaultValidationClass(error);
    }
    for (const [keyK, valueV] of Object.entries(value)) {
      this[keyK] = valueV;
    }
  }
}

function isInheritedFromBaseModel(targetClass) {
  if (targetClass instanceof Function) {
    let baseClass = targetClass;

    while (baseClass) {
      const newBaseClass = Object.getPrototypeOf(baseClass);

      if (newBaseClass && newBaseClass !== Object && newBaseClass.name) {
        baseClass = newBaseClass;
      } else {
        break;
      }
    }

    return baseClass.name === BaseModel.name;
  }
  return false;
}

const ALLOWED_CFG_KEYS = ["body", "params", "query", "response"];

/*
Usage:
cfg = {
    body: BodyBaseModel (extends BaseModel)
    response: ResponseBaseModel (extends BaseModel)
}
*/

function putValidationMiddleware(cfg) {
  const keyToModelMap = new Map();
  let responseModel = null;
  Object.keys(cfg).forEach((keyType) => {
    if (!ALLOWED_CFG_KEYS.includes(keyType)) {
      throw Error(`Invalid key '${keyType}'`);
    }
    if (!isInheritedFromBaseModel(cfg[keyType])) {
      throw Error("Validation Model must be inherited from BaseModel");
    }
    if (keyType !== "response") {
      keyToModelMap.set(keyType, cfg[keyType]);
    } else {
      responseModel = cfg[keyType];
    }
  });

  return function baseModelValidation(req, res, next) {
    // DO ALL VALIDATION AND ADD RESPONSE VALIDATION IF PRESENT
    for (let [key, value] of keyToModelMap.entries()) {
      try {
        const validatedModelObj = new value(req[key]);
        req[`original_${key}`] = req[key];
        req[key] = validatedModelObj;
      } catch (error) {
        if (error instanceof ValidationError) {
          return res.status(400).end(error.message);
        } else {
          return res.status(500).end(error.message);
        }
      }
    }

    if (responseModel !== null) {
      const resJson = res.json.bind(res);
      res.json = function validateJson(json) {
        if (res.statusCode !== 200) {
          return resJson(json);
        }
        try {
          const responseModelObj = new responseModel(json);
          return resJson(responseModelObj);
        } catch (error) {
          return res.status(500).end(error.message);
        }
      };
    }

    next();
  };
}

module.exports = { ValidationError, BaseModel, putValidationMiddleware };
