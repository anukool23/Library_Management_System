const mongoose = require('mongoose')
const UserModel = require("../Models/user.model");

//function to check if the user already exisit or not with email
const checkUsername = async (req,res,next)=>{
  const username = req.body.username
    try {
      const user = await UserModel.findOne({ username: username });
      if (user) {
        console.log("Username exists in the database");
        res.status(404).json({message:"User with this Username already exisit, Either login or create account with new Username"
          , status:0
        })
      } else {
        console.log("Username does not exist");
        next()
      }
    } catch (err) {
      console.error("Error while checking Username:", err);
      res.status(500).json({message:"Something went wrong, Please try againa fter sometime",
        error:err})
    }
  }

  module.exports = checkUsername