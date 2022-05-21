# express-joi-model
[![npm version](https://badge.fury.io/js/express-joi-model.svg)](https://www.npmjs.com/package/express-joi-model)
[![npm downloads](https://img.shields.io/npm/dm/express-joi-model.svg?style=flat)](https://www.npmjs.com/package/express-joi-model)

A middleware for validating express inputs using Joi schemas using classes. Features include:

* Classes for validating input and output
* Replaces the incoming `req.body`, `req.query`, etc and with the validated result object with specified class
* Retains the original `req.body` inside a new property named `req.original-body`.
