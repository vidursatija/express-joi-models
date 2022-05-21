# express-joi-model
[![npm version](https://badge.fury.io/js/express-joi-model.svg)](https://www.npmjs.com/package/express-joi-model)
[![npm downloads](https://img.shields.io/npm/dm/express-joi-model.svg?style=flat)](https://www.npmjs.com/package/express-joi-model)

A middleware for validating express inputs using Joi schemas using classes. Features include:

* Classes for validating input and output
* Replaces the incoming `req.body`, `req.query`, etc and with the validated result object with specified class
* Retains the original `req.body` inside a new property named `req.original-body`.

## Install

You need to install `joi` with this module since it relies on it in
`peerDependencies`.

```
npm i express-joi-model joi --save
```

## Example
A JavaScript example can be found in the `example/` folder of this repository.

## Usage (JavaScript)

```js
const express = require('express')
const { BaseModel, putValidationMiddleware } = require('express-joi-model')
const Joi = require('joi')

const app = express()

class RequestModel extends BaseModel {
    static get __schema() {
        return {
            a: Joi.number(),
            b: Joi.string()
        }
    }
}

app.use(express.json())

app.post('/', putValidationMiddleware({ body: RequestModel }), function (req, res) {
    console.log(req.body)
    return res.json({ res: true })
})

app.listen(8080)
```

## API
The library exports 3 variables - `ValidationError`, `BaseModel`, `putValidationMiddleware`.
1. `ValidationError` - the error thrown when validation of the object fails
2. `BaseModel` - the base class to inherit from when making your own model.
3. `putValidationMiddleware` - the function to generate the middleware using a config.

### ValidationError
```js
class ValidationError extends Error
```
It contains the error string

### BaseModel
```js
class BaseModel extends Object
```
The BaseModel class is to be used to create your own models. The class must have a *static* `__schema` property that must be overriden and must return an `Object` contains the appropriate keys and apt `Joi` values.
Eg:
```js
class RequestModel extends BaseModel {
    static get __schema() {
        return {
            res: Joi.boolean(),
        }
    }
}
const resObj = RequestModel({res: true}) // VALID
const resObj2 = RequestModel({res: "123"}) // INVALID: throws ValidationError
```
This ensures that the object passed to `RequestModel` class will follow the schema.


### putValidationMiddleware
```js
function putValidationMiddleware(cfg): function baseModelValidation(req, res, next)
```
Config can only have 4 keys that define what part of request has to be validated. The values have to be **classes** inherited from *BaseModel*:
1. `body` -> validates `req.body` and stores the validated object in `req.body` and the original body in `req.original_body`
2. `query` -> validates `req.query` and stores the validated object in `req.query` and the original body in `req.query`
3. `params` -> validates `req.params` and stores the validated object in `req.params` and the original body in `req.original_params`
4. `response` -> validates the response post return. The response has to be a json object. Returns 500 if response schema doesn't validate.
The input validations return 400 if the input isn't valid.

Eg:
```js
app.post('/correct', putValidationMiddleware({ body: RequestModel, response: ResponseModel }), function (req, res) {
    console.log(req.body)
    return res.json({ res: true })
})
```

## Future TODO
- Better error handling + modification capabilities
- Better configurabilty for Joi in request and response
