const express = require('express')
const { BaseModel, putValidationMiddleware } = require('../index.js')
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

class ResponseModel extends BaseModel {
    static get __schema() {
        return Joi.object({
            res: Joi.boolean()
        })
    }
}

app.use(express.json())


app.post('/correct', putValidationMiddleware({ body: RequestModel, response: ResponseModel }), function (req, res) {
    console.log(req.body)
    return res.json({ res: true })
})

app.post('/wrong', putValidationMiddleware({ body: RequestModel, response: ResponseModel }), function (req, res) {
    console.log(req.body)
    return res.json({ res: 1 })
})

app.listen(8080)
