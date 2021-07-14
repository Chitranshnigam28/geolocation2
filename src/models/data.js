const mongoose=require("mongoose");

const dataSchema=new mongoose.Schema({
    latitude:{
        type:Number,
        required:true,
    },
    longitude:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true,
    }

})
const DataSchema=new mongoose.model("DataSchema",dataSchema);
mongoose.exports=DataSchema;