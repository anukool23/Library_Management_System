const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title : { 
        type : String, 
        required : true
    },
    isbn : { 
        type : String, 
        required : true, 
        unique : true,
    },
    summary : { 
        type : String, 
    },
    publicationDate : { 
        type : Date, 
    },
    genres:[{
        type:String,
    }],
    copiesAvailable:{
        type:Number,
        default:1
    },
    author:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'author'
    }],
    borrowedBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }]


})

module.exports = mongoose.model('book',bookSchema)

