import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username: {type:String,unique:true},
    password: String,
    friends: [{type:mongoose.Types.ObjectId, ref:"User"}],
    requests: [{type:mongoose.Types.ObjectId, ref:"User"}]
})

module.exports=mongoose.model('User', userSchema)