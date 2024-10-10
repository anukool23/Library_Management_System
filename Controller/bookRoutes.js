const express  = require('express');
const mongoose = require("mongoose");
const bookRoutes = express.Router();
const BookModel = require("../Models/book.model");
const connectToDb = require("../Config/db");
const authMiddleware = require('../Middlewares/auth.middleware');
const { updateOne } = require('../Models/author.model');

//1. APi to create new book  (Only Admin can access this route)
bookRoutes.post("/",authMiddleware ,async (req,res)=>{
    const payload = req.body
    try {
        const newBook = new BookModel(payload);
        const savedBook = await newBook.save();
        console.log(`Book saved to DB ${savedBook}`);
        res.status(201).json({message:"Book added successfully",data:savedBook});
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});
// 2. Retrive all books
bookRoutes.get("/",authMiddleware,async (req,res)=>{
  try{
    const books = await BookModel.find();
    res.status(200).json(books);
  }
  catch(err){
    res.status(500).json({ error: err.message });
  }
});


//3. Retrive book with the ID
bookRoutes.get("/:id",authMiddleware,async (req,res)=>{
  try{
    const books = await BookModel.find({"_id":req.params.id});
    res.status(200).json(books);
  }
  catch(err){
    res.status(500).json({ error: err.message });
  }
});

//4. Update book detail (Only Admin can access this route)
bookRoutes.put("/:id",authMiddleware,async (req,res)=>{
  const {...payload} =req.body;
  try{
    const books = await BookModel.updateOne({"_id":req.params.id},payload);
    res.status(201).json({message:"Book updated successfully",data:books});
  }
  catch(err){
    res.status(500).json({ error: err.message });
  }
});

//5. Delete book detail (Only Admin can access this route)
bookRoutes.delete("/:id",authMiddleware,async (req,res)=>{
  try{
    const books = await BookModel.deleteOne({"_id":req.params.id});
    res.status(201).json({message:"Book Deleted successfully",data:books});
  }
  catch(err){
    res.status(500).json({ error: err.message });
  }
});

module.exports = bookRoutes