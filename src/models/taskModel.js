const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },


    image: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },


    description: {
        type: String,
        required: true,
        trim: true
    },


    password: {
        type: String,
        required: true,
        trim: true
    },


    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true }
)

module.exports = mongoose.model("Searching_Yard", taskSchema) 