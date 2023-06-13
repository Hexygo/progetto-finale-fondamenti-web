import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender:{type:mongoose.Types.ObjectId, ref:"User"},
    receiver:{type:mongoose.Types.ObjectId, ref:"User"},
    content:String,
    time:Date
})

module.exports = mongoose.model('Message', messageSchema)