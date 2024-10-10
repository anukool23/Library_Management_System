const mongoose = require('mongoose');
const express = require("express");
const userRoutes = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require("../Models/user.model");
const authMiddleware = require('../Middlewares/auth.middleware');
const checkCurrentUser = require('../Middlewares/checkCurrentUser.middleware');
const checkAccess = require('../Middlewares/checkAccess.middleware');
const rolesAvailable = require('../Constants/roles');
var salt = bcrypt.genSaltSync(Number(process.env.SALT_BCRYPT));

//1. To retrive all users (Admin level access)
userRoutes.get("/",authMiddleware,checkAccess(rolesAvailable.admin), async (req, res) => {
  try {
      const users = await UserModel.find();
      res.status(200).json(users);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

//2. To retrive one user detail (Only admin and user it self can access )
userRoutes.get("/:id",authMiddleware,checkCurrentUser, async (req, res) => {
  try {
      const user = await UserModel.find({_id:req.params.id});
      if(user.length>0){
        res.status(200).json({"message":"User found",data:user});
      }
      else{
        res.status(404).json({message:"User not found"});
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

//3. To update existing user (Only admin and user it self can access )
userRoutes.put("/:id", authMiddleware, checkCurrentUser, async (req, res) => {
  console.log(req.body);
  
  if(req.body.username){
    return res.status(406).json({message: "You can't update your username"});
  }
  if(req.body.password){
    req.body.password =await bcrypt.hash(req.body.password, salt);
  }

  const payload = req.body;
  
  try {
    const user = await UserModel.updateOne({_id: req.params.id}, payload);
    
    if(user.matchedCount === 0) {
      res.status(404).json({message: "User not found"});
    } else {
      const userData = await UserModel.find({_id: req.params.id});
      res.status(200).json({message: "User updated successfully", update: user, data: userData});
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//4. To delete existing user (Only admin can use this API)
userRoutes.delete("/:id",authMiddleware,checkAccess(rolesAvailable.admin),async (req,res)=>{
  try {
    const user = await UserModel.deleteOne({_id:req.params.id});
    if(user.deletedCount ==1){
      const userData = await UserModel.find({_id:req.params.id});
      res.status(200).json({"message":"User deleted successfully",deleted:user});
    }
    else{
      res.status(404).json({message:"User not found"});
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
})

//5. To make user as admin (Only admin can access this API)
userRoutes.put("/makeAdmin/:id",authMiddleware,checkAccess(rolesAvailable.admin),async (req,res)=>{
  try {
    const user = await UserModel.updateOne({_id:req.params.id},{$set:{role:"admin"}});
    if(user.matchedCount == 0){
      res.status(404).json({message:"User not found"});
    }
    else{
      const userData = await UserModel.find({_id:req.params.id});
      res.status(200).json({"message":"User updated successfully",update:user,data:userData});
    }

  }
catch(err){
  res.status(500).json({ error: err.message });
}
})


module.exports=userRoutes