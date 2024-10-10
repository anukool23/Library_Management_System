const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name : { 
        type : String, 
        required : true
    },
    biography : { 
        type : String, 
    },
    nationality : { 
        type : String, 
    },
    dateOfBirth : { 
        type : Date, 
    },
    books:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'book'
    }]


})

module.exports = mongoose.model('author',authorSchema)

