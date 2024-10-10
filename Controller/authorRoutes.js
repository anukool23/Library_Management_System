const express  = require('express');
const mongoose = require("mongoose");
const authorRoutes = express.Router();
const AuthorModel = require("../Models/author.model");
const connectToDb = require("../Config/db");
const authMiddleware = require('../Middlewares/auth.middleware');
const checkAccess = require('../Middlewares/checkAccess.middleware');
const rolesAvailable = require('../Constraints/roles');
const checkCurrentUser = require('../Middlewares/checkCurrentUser.middleware');


//API to create new Author (Only Admin can access this route)
authorRoutes.post("/",authMiddleware,checkAccess(rolesAvailable.admin), async (req,res)=>{
    const payload = req.body
    try {
        const newAuthor = new AuthorModel(payload);
        const savedAuthor = await newAuthor.save();
        console.log(`Author saved to DB ${savedAuthor}`);
        res.status(201).json(savedAuthor);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
})

//API to get authors details using any of data from query param
authorRoutes.get("/:id",authMiddleware, async (req,res)=>{
  try {
      const author = await AuthorModel.find({_id:req.params.id});
      if(author){
        res.status(200).json({message:"Author found",data:author});
      }else{
        res.status(404).json({message:"Author not found"});
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
})

//API to get authors details
authorRoutes.get("/",authMiddleware , async (req,res)=>{
  try {
      const author = await AuthorModel.find();
      if(author){
        res.status(200).json({message:"Authors found",data:author});
      }else{
        res.status(404).json({message:"No author available"});
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
})

//3/. API to update authors details (Only Admin can access this route)
authorRoutes.put("/:id", authMiddleware,checkAccess(rolesAvailable.admin), async (req, res) => {
  const { ...payload } = req.body;
  try {
    const author = await AuthorModel.updateOne({ _id: req.params.id }, payload);
    
    if (author.matchedCount == 1 && author.modifiedCount == 1) {
      return res.status(200).json({ message: "Author detail updated successfully", data: author });
    }
    
    if (author.matchedCount == 1 && author.modifiedCount == 0) {
      return res.status(200).json({ message: "Nothing to update in this Author", data: author });
    }
    
    return res.status(404).json({ message: "No author available" });
    
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//4. API to delete author details (Only Admin can access this route)
authorRoutes.delete("/:id",authMiddleware,checkAccess(rolesAvailable.admin), async (req,res)=>{
  try {
    const author = await AuthorModel.deleteOne({_id:req.params.id});
    if(author.deletedCount ==1){
      res.status(200).json({"message":"Author deleted successfully",deleted:author});
    }
    else{
      res.status(404).json({message:"Author not found"});
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
})

module.exports = authorRoutes