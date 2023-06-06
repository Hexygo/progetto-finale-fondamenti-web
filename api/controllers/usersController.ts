const User=require('../models/User')

module.exports={
    //Restituisce come risposta in formato JSON tutti gli utenti
    getAllUsers:(req, res)=>{
        User.find({}).exec().then((data)=>{
            res.send(data)
        })
        
    },

    //Restituisce come risposta in formato JSON il singolo utente che ha un determinato username, specificato nel url della richiesta
    getUserByUsername:(req, res)=>{
        User.find({username:req.params.username}).exec().then((data)=>{
            res.send(data)
        })
    },

    //Aggiunge un utente al database, se questo non esiste
    //TODO:Aggiungere la password
    addUser:(req, res)=>{
        User.findOne({username:req.body.username}).exec().then((data)=>{
            if(data){
                //Caso in cui l'utente esiste nel database, ritorna una risposta con codice d'errore 403 FORBIDDEN
                res.status(403).send("FORBIDDEN")
            }else {
                //Caso in cui l'utente esiste, lo aggiunge al database, e ritorna una risposta con l'utente appena registrato nel DB
                User.create({username:req.body.username}).then((user)=>res.status(201).send(user))
            }})
    }
}



