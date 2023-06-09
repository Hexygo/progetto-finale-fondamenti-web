import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender:mongoose.Types.ObjectId,
    receiver:mongoose.Types.ObjectId,
    content:String,
    time:Date
})

module.exports = mongoose.model('Message', messageSchema)