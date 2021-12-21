const mongoose = require('mongoose')

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
}, {
    timestamps: true
})

const News = mongoose.model('News', newsScehma)
module.exports = News