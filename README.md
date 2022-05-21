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
        return Joi.object({
            a: Joi.number(),
            b: Joi.string()
        })
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
TODO

## Future TODO
- Better error handling + modification capabilities
- Better configurabilty for Joi in request and response
