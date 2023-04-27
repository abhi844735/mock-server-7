const express=require("express");
const bcrypt=require("bcrypt");
const mongoose=require("mongoose");
const app = express();
const {Usermodel}=require("../models/user.model");
let jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth.middleware");
const userRouter=express.Router();
app.use(express.json());
userRouter.post("/register",async(req,res)=>{
    let {name,bio,phone,email,password}=req.body;
    try {
        bcrypt.hash(password, 7, async(err, secure_password)=> {
            // Store hash in your password DB.
            if(err){
                res.send({err:err})
            }else{
                let user=await new Usermodel({name,bio,phone,email,password:secure_password});
                await user.save();
                res.send({message:`${name} has successfully registered`});
            }

        });
    } catch (error) {
        res.send({message:error.message})
    }

});
userRouter.post("/login",async(req,res)=>{
    
    try {
        let {email,password}=req.body;
        // console.log(email)
        let data = await Usermodel.find({email});
        // console.log(data)
        if(data.length>0){
            let dec_password=data[0].password;
            let userID=data[0]._id
            bcrypt.compare(password, dec_password, (err, result) =>{
                // result == true
                if(err){
                    res.send({message:err})
                }else{
                    if(result){
                        let token=jwt.sign({userID},process.env.key);
                        res.status(201).send({message:"Logged in",token,userdata:data});
                    }else{
                        res.send({message:"Wrong Credentials"})
                    }
                }
            });
        }else{
            res.send({message:"Please do registration first"})
        }
        

        
    } catch (error) {
        res.send({error:error.message})
    }
})
userRouter.get('/getProfile',auth,async(req,res)=>{
    try {
        let userid=req.body.userID;
        let data =await Usermodel.findById(userid);
        res.status(200).send({data})
    } catch (error) {
        
    }
})
userRouter.patch("/update/:id",async(req,res)=>{
    try {
        let id = req.params.id;
        let data = await Usermodel.findOne({_id:id});
       
      
            await Usermodel.findByIdAndUpdate({_id:id},req.body);
            let data_2 = await Usermodel.findById(id);
            res.send({message:"profile updated",data_2});
       
       
        
    } catch (error) {
        console.log({error:error.message})
    }
})

module.exports={userRouter}