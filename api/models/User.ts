import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username: {type:String,unique:true},
    password: String,
    friends: [mongoose.Types.ObjectId],
    requests: [mongoose.Types.ObjectId]
})

module.exports=mongoose.model('User', userSchema)