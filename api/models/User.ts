import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username: String
})

module.exports=mongoose.model('User', userSchema)