const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : { 
        type : String, 
        required : true
    },
    email : { 
        type : String, 
        required : true, 
        unique : true,
         match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+/,
            "Please fill a valid email address"
        ]
    },
    password : { 
        type : String, 
        required : true
    },
    username : { 
        type : String, 
        required : true,
        unique : true
    },
    role:{
        type:String,
        enum:["admin","member"],
        default:"member"
    },
    borrowedBooks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'book'
    }],

})

module.exports = mongoose.model('user',userSchema)

