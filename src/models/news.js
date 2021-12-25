const mongoose = require('mongoose')
const multer  = require('multer')

const newsScehma = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Reporter'
    },
    avatar:{
        type:Buffer,
    }
}, {
    timestamps: true
})

const News = mongoose.model('News', newsScehma)
module.exports = News