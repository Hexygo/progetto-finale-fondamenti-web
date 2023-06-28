const User = require('../models/User')
const Session = require('../models/Session')

module.exports = {
    //Restituisce come risposta in formato JSON tutti gli utenti
    getAllUsers: (req, res) => {
        User.find({}).select('-password').exec().then((data) => {
            res.send(data)
        })

    },

    //Restituisce come risposta in formato JSON il singolo utente che ha un determinato username, specificato nel url della richiesta
    getUserByUsername: (req, res) => {
        User.findOne({ username: req.params.username }).select('-password').exec().then((data) => {
            if (data)
                return res.status(200).send(data)
            return res.status(404).send("NOT FOUND")//L'utente non esiste
        })
    },

    //Aggiunge un utente al database, se questo non esiste
    register: (req, res) => {
        User.findOne({ username: req.body.username }).exec().then((data) => {
            if (data) {
                //Caso in cui l'utente esiste nel database, ritorna una risposta con codice d'errore 403 FORBIDDEN
                return res.status(403).send("FORBIDDEN")
            } else {
                //Caso in cui l'utente esiste, lo aggiunge al database, e ritorna una risposta con l'utente appena registrato nel DB
                User.create({ username: req.body.username, password: req.body.password, friends: [], requests: [] }).then((user) => {
                    Session.create({ user_id: user._id, expires: Date.now() + 12 * 60 * 60 * 1000 }).then(cookie => {
                        res.cookie('session_token', cookie._id.toString(), { expires: cookie.expires })
                        const { ['password']: password, ...rest } = user._doc
                        return res.status(200).send(rest)
                    })
                })
            }
        })
    },

    //Invia la richiesta di amicizia ad un altro utente
    addFriend: (req, res) => {//TODO:vietare la richiesta ad un utente che è già amico
        //Errore da lanciare in caso la richiesta sia stata già inviata
        const AlreadySentError = {}
        const PendingRequest = {}
        const AlreadyFriendError={}
        //Cerco l'utente sul DB
        User.findById(req.body.receiver).exec().then((receiver) => {
            if (receiver) {
                //Controllo che la richiesta non sia stata già inviata
                //Controllo che non ci sia già una richiesta di amicizia in attesa
                User.findById(req.body.sender).exec().then((sender) => {
                    try {
                        sender.friends.forEach(el=>{
                            if(el._id == receiver._id)
                                throw (AlreadyFriendError)
                        })
                        sender.requests.forEach(el => {
                            if (el == req.body.receiver)
                                throw (PendingRequest)
                        })
                        receiver.requests.forEach((r) => {
                            if (r == req.body.sender)
                                throw (AlreadySentError) //Richiesta già inviata ---> Invio l'errore                        
                        })
                        //Procedo a inviare la richiesta
                        receiver.requests.push(req.body.sender)
                        receiver.save() //Salvo la modifica su DB
                        res.status(200).send("Richiesta inviata con successo")
                    } catch (err) {
                        if (err === PendingRequest){
                            //Rimuove la richiesta accettata
                            sender.requests = sender.requests.filter(r => r != req.body.receiver)
                            //Aggiunge l'amico nella friendlist
                            sender.friends.push(receiver._id)
                            receiver.friends.push(sender._id)
                            receiver.save()
                            sender.save()
                            res.status(200).send("ACCEPTED")
                        }
                        if(err===AlreadyFriendError){
                            res.status(409).send('Già amico')
                        }
                        if (err === AlreadySentError)
                            res.status(403).send("Richiesta di amicizia già inviata")
                    }
                })
            } else {
                //Se l'utente non esiste, ritorna l'errore 404 NOT FOUND
                res.status(404).send("NOT FOUND")
            }
        })
    },

    //Rimuove un utente dalla lista amici dell'utente che effettua la richiesta
    //PARAMETRI: user(id utente che emette la richiesta), friend(id amico da rimuovere)
    removeFriend: (req, res)=>{
        User.findById(req.body.user).exec().then(async (user)=>{
            //Controllo che l'amico da rimuovere sia nella lista amici
            const FriendFound={}
            try {
                user.friends.forEach(el=>{
                    if(el.toString() === req.body.friend)
                        throw FriendFound
                })
                res.status(404).end()
            } catch (error) {
                if(error===FriendFound){
                    
                    const friend=await User.findById(req.body.friend).exec()
                    user.friends=user.friends.filter(f=>f.toString() !== friend._id.toString())
                    friend.friends=friend.friends.filter(f=>f.toString() !== user._id.toString())
                    user.save()
                    friend.save()
                    res.status(200).end()
                }                
            }
        })
    },

    //Accetta la richiesta di amicizia
    acceptRequest: async (req, res) => {
        //Cerca l'utente che deve accettare le richieste
        User.findById(req.body.user).exec().then((user) => {
            //Optional TODO: Controllare che il sender esista
            //Rimuove la richiesta accettata
            user.requests = user.requests.filter(r => r != req.body.sender)
            //Aggiunge l'amico nella friendlist
            user.friends.push(req.body.sender)
            user.save()
        })
        const user=await User.findById(req.body.sender).select('-password').exec()
        user.friends.push(req.body.user)
        user.save()
        return res.status(200).send(user)
    },

    //Rifiuta la richiesta di amicizia
    refuseRequest: async (req, res) => {
        const user = await User.findById(req.body.user).select('-password').exec()
        user.requests = user.requests.filter(r => r != req.body.sender)
        user.save()
        return res.status(200).send(user)
    },

    //Logga un utente, se le sue credenziali sono corrette
    //Problema: la password è in plain text, (crittografia?)
    login: (req, res) => {
        User.findOne({ username: req.body.username }).populate({ path: "requests", select: "username" }).populate({ path: "friends", select: "username" }).exec().then((user) => {
            if (!user) {
                return res.status(404).send("NOT_FOUND")//L'utente non esiste sul DB
            }
            if (user.password == req.body.password) {//Controllo la password
                //Utente loggato
                Session.findOne({ user_id: user._id }).then(session => {
                    if (session) {
                        res.cookie('session_token', session._id.toString(), { expires: session.expires })
                        const { ['password']: password, ...rest } = user._doc
                        return res.status(200).send(rest)
                    } else {
                        Session.create({ user_id: user._id, expires: Date.now() + 12 * 60 * 60 * 1000 }).then(cookie => {
                            res.cookie('session_token', cookie._id.toString(), { expires: cookie.expires })
                            const { ['password']: password, ...rest } = user._doc
                            return res.status(200).send(rest)//Per maggiore sicurezza, immagino vada mandato un cookie
                        })
                    }
                })
            } else
                return res.status(403).send("UNAUTHORIZED")//Password errata     
        })
    },

    //Effettua il logout
    logout: (req, res) => {
        Session.findByIdAndDelete(req.cookies['session_token']).exec().then(data => {
            res.cookie('session_token', 'invalid', { expires: new Date })
            return res.status(200).end()
        })
    },

    cookiesMiddleware: (req, res, next) => {//Middleware per la verifica dei cookie
        if (!req.cookies){//La richiesta non ha cookie, automaticamente respinta
            console.log('niente cookie')
            return res.status(401).end()}
        Session.findById(req.cookies['session_token']).exec().then(session => {
            if (session)//cookie valido
                next()
            else
                return res.status(401).end()//cookie non valido
        })
    }, 

    getUserFromSession: async (req, res)=>{
        const session=await Session.findById(req.cookies['session_token']).populate({path:'user_id', select:'-password', populate:[{path:'requests', select:'username'},{path:'friends', select:'username'}]})
        res.status(200).send(session.user_id)
    }
}