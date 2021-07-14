const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");


const registerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    rpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }],
    latitude:{
        type:Number,
        
    },
    longitude:{
        type:Number,
        
    },
    address:{
        type:String,
        
    }
})
registerSchema.methods.generateAuthToken=async function(){
    try{
        const token=await jwt.sign({_id:this._id.toString()},"mynameischitranshnigamra1611003010932");
        console.log(token);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(e){
        res.send(e);
    }
}
registerSchema.pre("save",async function(next){
    if(this.isModified("password")){
      //  console.log(`Password before hashing is ${this.password}`);
    this.password=await bcrypt.hash(this.password,10);
    //console.log(`Password after hashing is ${this.password}`);
    this.rpassword=await bcrypt.hash(this.password,10);
    }
    
    next();
})
const RegisterSchema=new mongoose.model("RegisterSchema",registerSchema);

module.exports=RegisterSchema;