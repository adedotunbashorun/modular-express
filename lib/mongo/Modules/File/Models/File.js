'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FileSchema = new Schema({
    
}, { timestamps: true })


module.exports = mongoose.model('File', FileSchema)