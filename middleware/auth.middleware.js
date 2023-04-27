let jwt =require("jsonwebtoken");
require("dotenv").config()
let auth=(req,res,next)=>{
    try {
        let token=req.headers.authorization;
        if(token){
            let decoded=jwt.verify(token,process.env.key);
            if(decoded){
                let userId = decoded.userID;
              
                req.body.userID = userId;
                next();

            }else{
                res.send({ message: "not authorised" })
            }

        }else{
            res.send({message:"please do login first"})
        }
    } catch (error) {
        
    }
}
module.exports={auth}