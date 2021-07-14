const jwt=require("jsonwebtoken");
const Register=require("../models/register");

const auth=async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        const userVer=await jwt.verify(token,"mynameischitranshnigamra1611003010932");
        console.log(userVer);

        const user=await Register.findOne({_id:userVer._id});
        console.log(user);
        req.token=token;
        req.user=user;
        next();
    } catch (error) {
        res.status(400).send(error);
    }
}
module.exports=auth;