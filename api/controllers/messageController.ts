const Message=require('../models/Message')
const friendFound={}

module.exports={
    //Invia un messaggio da un utente ad un altro
    sendMessage:(req,res)=>{
        //Controlla che i due utenti siano amici
        User.findById(req.body.sender).exec().then((user)=>{
            try{
                user.friends.forEach((friend)=>{
                    if(friend==req.body.receiver)
                        throw friendFound                
                })
                res.send(404).send("Destinatario non trovato")
            } catch(friendFound){
                //INVIA IL MESSAGGIO(LO REGISTRA SUL DB)
                res.status(200).send("Messaggio inviato")//Una volta implementato, ritorna il messaggio in frontend, in modo da poterlo renderizzare real time lato client
            }
        })
    }
}