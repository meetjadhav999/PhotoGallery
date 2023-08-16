const mongoose = require('mongoose')
const validator = require('validator')


const mediaSchema = new mongoose.Schema({
    image:{
        required:true,
        type:Buffer,

    },
    description:{
        type:String,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    }
},{
    timestamps:true
})

const Media = mongoose.model('Media',mediaSchema)

module.exports = Media