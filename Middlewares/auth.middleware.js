var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserModel = require('../Models/user.model');
require('dotenv').config()

const authMiddleware = async (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).send("Access denied. No token provided!")
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY,{ algorithms: [process.env.JWT_ALGO] });
        req.user = await UserModel.findById(decoded._id);
        next()
    } catch (err) {
        res.status(400).send("Invalid token")
    }
}



module.exports =  authMiddleware
   
