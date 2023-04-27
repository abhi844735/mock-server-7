const express = require("express");
const mongoose = require("mongoose");
const { connection } = require("./config/db");
const  cors=require("cors");
const { userRouter } = require("./routes/user.route");
require("dotenv").config();
const app = express();
app.use(cors({origin:"*"}))
app.use(express.json())
app.use("/user",userRouter)
app.get("/",(req,res)=>{
 res.send("home page")
})

app.listen(process.env.PORT,async()=>{
    try {
        await connection;
        console.log("connected to db");
        
    } catch (error) {
        console.log({message:error.message});
    }
    console.log("server has started")
})