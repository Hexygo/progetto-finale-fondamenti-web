import mongoose from 'mongoose';

const sessionSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    expires:Date
})

module.exports=mongoose.model('Session', sessionSchema)