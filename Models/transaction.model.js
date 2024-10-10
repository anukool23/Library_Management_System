const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    book : { 
         type:mongoose.Schema.Types.ObjectId,
        ref:'book'
    },
    member : { 
         type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    borrowDate : { 
        type : Date, 
        default:Date.now
    },
    dueDate : { 
        type : Date, 
        required : true
    },
    returnDate:{
        type:String,
    },
    status:{
        enum:["Borrowed","Returned"],
        default:"Borrowed"
    }


})

module.exports = mongoose.model('transaction',transactionSchema)

