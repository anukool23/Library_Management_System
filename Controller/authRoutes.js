const express  = require('express');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const authRoutes = express.Router();
const UserModel = require("../Models/user.model");
const jwt = require('jsonwebtoken')
const connectToDb = require("../Config/db");
var salt = bcrypt.genSaltSync(Number(process.env.SALT_BCRYPT));
// const checkNewUserEmail = require('../Middlewares/checkEmail.middleware');
// const checkUsername = require('../Middlewares/checkUsername.middleware');
const checkNewUserCredentials = require('../Middlewares/checkNewUserCredentials.middleware');
const authMiddleware = require('../Middlewares/auth.middleware');


//1. API to create new user, The user will be created as Member, In case if the user need to be Admin only an Admin can make him admin
authRoutes.post("/register",checkNewUserCredentials, async (req, res) => {
    const payload = req.body
    payload.role = "member"
    payload.password =await bcrypt.hash(payload.password, salt);
  try {
    const newUser = new UserModel(payload);
    const savedUser = await newUser.save();
    console.log(`User saved to DB ${savedUser}`);

     // Remove the password from the savedUser object
     const userWithoutPassword = savedUser.toObject();
     delete userWithoutPassword.password;

    res.status(201).json({"message":"User created successfully",data:userWithoutPassword});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//2. API to login for the user
authRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, Please register first", status: 0 });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
      return res
        .status(400)
        .json({ message: "Password is wrong", status: 0 });
    }
    const token = jwt.sign({ _id: user._id, email: user.email,username:user.username, role:user.role }, process.env.SECRET_KEY,
       { expiresIn: process.env.TOKEN_EXPIRY_IN, algorithm: process.env.JWT_ALGO})
    res.json({ message: "Logged in successfully!",token })
    
  } catch (err) {
    console.log("error")
    res.status(500).json({message:err});
  }
});

//API to verify user token for the testing purpose only
authRoutes.get('/verify-token',authMiddleware, async (req,res)=>{
  const token = req.headers.authorization;
  // console.log(token)
  res.status(200).json({token:token,data:req.user})
})

module.exports = authRoutes
