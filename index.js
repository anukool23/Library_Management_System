const express = (require('express'));
const authorRoutes = require('./Controller/authorRoutes');
const bookRoutes = require('./Controller/bookRoutes');
const userRoutes = require('./Controller/userRoutes');
const authRoutes = require('./Controller/authRoutes');
const app = express();
app.use(express.json());
require('dotenv').config();
const connectToDb = require("./Config/db");
const port = process.env.PORT || 3000;

app.use('/api/auth',authRoutes)
app.use('/api/authors',authorRoutes)
app.use('/api/books',bookRoutes)
app.use('/api/users',userRoutes)


app.get('/',(req,res)=>{
    res.status(200).json({message:"Connected"})
})

 app.all('*',(req,res)=>{
    res.status(404).send("This API is not valid, please check your API")
})





app.listen(port,async () => {
    await connectToDb();
    console.log(`Server started on port ${port}`);
})