const express=require("express");
const app=express();
const path=require("path");
const hbs=require("hbs");
const port=process.env.PORT || 3000;
const cookieParser=require("cookie-parser");
const auth=require("../src/middleware/auth");
const { urlencoded } = require("express");
const jwt=require("jsonwebtoken");
const Register=require("../src/models/register");
const Geodata=require("../src/models/data");
require("../src/db/conn");
const bcrypt=require("bcryptjs");
const static_path=path.join(__dirname,"../public");
const views_path=path.join(__dirname,"/templates/views");
const partials_path=path.join(__dirname,"/templates/partials");



console.log(path.join(__dirname,"/templates/views"));
app.use(express.static(static_path));
app.set('views',views_path);
app.set("view engine","hbs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
hbs.registerPartials(partials_path);

/*app.get("/index",(req,res)=>{
    res.render("index");
})*/
app.get("/signup",(req,res)=>{
    res.render("signup");
}) 
app.get("/index",auth,async(req,res)=>{
    console.log("data received for get method index"+req.user);
    console.log(req.cookies.jwt);
    const userEmail=await Register.findOne({email:req.user.email});
    console.log("user email from index get "+userEmail);
    res.send(`<h1>Latitude: ${userEmail.latitude} Longitude : ${userEmail.longitude} Address:${userEmail.address}</h1>`);
    
   // res.render("index")
})
app.post("/index",auth,async (req,res)=>{
    try{
        console.log("data received for post method index"+req.user);
        
        const longitude=req.body.longitude;
        const latitude=req.body.latitude;
        const address=req.body.address;
        console.log(`latitude ${latitude} longitude ${longitude} address ${address}`);
        const result=await Data.updateOne({_id},{$set:{longitude:req.body.longitude}});
        console.log(result);
        //const saveddata=await data.save();
        /*const geo=new Geodata({
            longitude:req.body.longitude,
            latitude:req.body.latitude,
            address:req.body.address,
        });
        console.log(geo);
        const data=await geo.save();
        console.log(data);*/
        const gdata=await data.save();
        res.status(201).send(gdata);
    }catch(e){
        res.status(400).send(e)
    }
})

app.post("/signup",async (req,res)=>{
    try{
        const name=req.body.name;
        const password=req.body.password;
        const rpassword=req.body.rpassword;
        const longitude=req.body.longitude;
        const latitude=req.body.latitude;
        const address=req.body.address;
        console.log(password);
        console.log(rpassword);
        if(password===rpassword){
            const registerEmp=new Register({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                rpassword:req.body.rpassword,
                longitude:req.body.longitude,
                latitude:req.body.latitude,
                address:req.body.address,
            })
            const token=await registerEmp.generateAuthToken();
            console.log("Token is "+token);

            res.cookie("jwt",token,{
                expires:new Date(Date.now()+30000),
                httpOnly:true,

            })
            console.log(cookie);
            const data=await registerEmp.save();
            res.status(201).send("You have successfully registered");
        }else{
            res.send("Passwords don't match");
        }
        res.send(password);

    }catch(e){
        res.status(400).send(e);
    }
})
/*api.get("/data",async (req,res)=>{
    const geoData=await Register.find();
})*/
app.get("/login",(req,res)=>{
    res.render("login")
})
app.post("/login",async (req,res)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;

    const userEmail=await Register.findOne({email:email});
       // console.log(`email ${email} password ${password} userEmail ${userEmail}`);
    const isMatch=bcrypt.compare(password,userEmail.password);
       // console.log(`Entered password is ${password} and actual hashpassword is ${userEmail.password}`);

      const token=await userEmail.generateAuthToken();
       console.log("Token is "+token);

       res.cookie("jwt",token,{
        expires:new Date(Date.now()+60000),
        httpOnly:true,

    })
    console.log(isMatch);

    if(isMatch){
       // res.render("index");
       res.send("Logged In Successfully");
    }else{
        res.send("Invalid Credentials");
    }
   /* if(password===userEmail.password){
        res.render("index");
    }else{
        res.send("Invalid Credentials");
    }*/
    // res.send(userEmail.password);
    // console.log(userEmail.password);
    }catch(e){
        res.status(400).send(e)
    }
    
})
app.get("/logout",auth,async(req,res)=>{
   /*console.log(req.user);*/
    req.user.tokens=req.user.tokens.filter((ce)=>{
        return ce.token!==req.token;
    })
    res.clearCookie("jwt");
    console.log("Logged Out Successfully");

    await req.user.save();
    res.render("login");
})
app.listen(port ,()=>{
    console.log(`Connected to port ${port}`);
})