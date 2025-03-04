const Message=require('../models/Message')
const User1=require('../models/User')
const friendFound={}

module.exports={
    //Invia un messaggio da un utente ad un altro
    sendMessage:(req,res)=>{
        //Controlla che i due utenti siano amici
        User1.findById(req.body.sender).exec().then((user)=>{
            try{
                user.friends.forEach((friend)=>{
                    if(friend==req.body.receiver)
                        throw friendFound                
                })
                res.status(404).send("Destinatario non trovato")
            } catch(friendFound){
                Message.create({
                    sender:req.body.sender,
                    receiver:req.body.receiver,
                    content:req.body.content,
                    time:Date.now()
                }).then(async (message)=>{
                    message=await message.populate({path:'sender', select:'username'})
                    message=await message.populate({path:"receiver", select:"username"})
                    res.status(200).send(message)
                })
        }})
    },

    //Ritorna la conversazione tra due utenti
    getConversation:(req, res)=>{
        Message.find({$or:[{sender:req.body.user, receiver:req.body.otherUser},{sender:req.body.otherUser, receiver:req.body.user}]}).populate({path:"sender", select:"username"}).populate({path:"receiver", select:"username"})
            .exec().then(data=>res.status(200).send(data)) 
    },

    //Elimina un messaggio
    deleteMessage:(req, res)=>{
        Message.findByIdAndDelete(req.query.id).exec().then((data)=>res.status(200).send(data))
    }
    
}