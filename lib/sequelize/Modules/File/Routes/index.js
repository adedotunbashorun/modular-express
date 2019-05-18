'use strict'

const express = require('express')
const router = express.Router()
const FileController = require('../Controllers/FileController')

router.get('/', (request, response, next) => {
    response.send("Welcome to Express Modular.")
})

module.exports = router