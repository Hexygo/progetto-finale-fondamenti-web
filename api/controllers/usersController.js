const User = require('../models/User');
module.exports = {
    //Restituisce come risposta in formato JSON tutti gli utenti
    getAllUsers: (req, res) => {
        User.find({}).populate({ path: "requests", select: "username" }).populate({ path: "friends", select: "username" }).exec().then((data) => {
            res.send(data);
        });
    },
    //Restituisce come risposta in formato JSON il singolo utente che ha un determinato username, specificato nel url della richiesta
    getUserByUsername: (req, res) => {
        User.findOne({ username: req.params.username }).populate({ path: "requests", select: "username" }).populate({ path: "friends", select: "username" }).exec().then((data) => {
            if (data)
                return res.status(200).send(data);
            return res.status(404).send("NOT FOUND"); //L'utente non esiste
        });
    },
    //Aggiunge un utente al database, se questo non esiste
    addUser: (req, res) => {
        User.findOne({ username: req.body.username }).exec().then((data) => {
            if (data) {
                //Caso in cui l'utente esiste nel database, ritorna una risposta con codice d'errore 403 FORBIDDEN
                res.status(403).send("FORBIDDEN");
            }
            else {
                //Caso in cui l'utente esiste, lo aggiunge al database, e ritorna una risposta con l'utente appena registrato nel DB
                User.create({ username: req.body.username, password: req.body.password, friends: [], requests: [] }).then((user) => res.status(201).send(user));
            }
        });
    },
    //Invia la richiesta di amicizia ad un altro utente
    addFriend: (req, res) => {
        //Errore da lanciare in caso la richiesta sia stata già inviata
        const AlreadySentError = {};
        const PendingRequest = {};
        //Cerco l'utente sul DB
        User.findById(req.body.receiver).exec().then((receiver) => {
            if (receiver) {
                //Controllo che la richiesta non sia stata già inviata
                //Controllo che non ci sia già una richiesta di amicizia in attesa
                User.findById(req.body.sender).exec().then((sender) => {
                    try {
                        sender.requests.forEach(el => {
                            if (el == req.body.receiver)
                                throw (PendingRequest);
                        });
                        receiver.requests.forEach((r) => {
                            if (r == req.body.sender)
                                throw (AlreadySentError); //Richiesta già inviata ---> Invio l'errore                        
                        });
                        //Procedo a inviare la richiesta
                        receiver.requests.push(req.body.sender);
                        receiver.save(); //Salvo la modifica su DB
                        res.status(200).send("Richiesta inviata con successo");
                    }
                    catch (err) {
                        if (err === PendingRequest) {
                            //Rimuove la richiesta accettata
                            sender.requests = sender.requests.filter(r => r != req.body.receiver);
                            //Aggiunge l'amico nella friendlist
                            sender.friends.push(receiver._id);
                            receiver.friends.push(sender._id);
                            receiver.save();
                            sender.save();
                            res.status(200).send("ACCEPTED");
                        }
                        if (err === AlreadySentError)
                            res.status(403).send("Richiesta di amicizia già inviata"); //L'errore è interno al sistema
                    }
                });
            }
            else {
                //Se l'utente non esiste, ritorna l'errore 404 NOT FOUND
                res.status(404).send("NOT FOUND");
            }
        });
    },
    //Accetta la richiesta di amicizia
    acceptRequest: (req, res) => {
        const RichiestaAccettata = {};
        //Cerca l'utente che deve accettare le richieste
        User.findById(req.body.user).exec().then((user) => {
            //Optional TODO: Controllare che il sender esista
            //Controlla che la richiesta sia stata inviata
            try {
                user.requests.forEach(el => {
                    if (el == req.body.sender) {
                        //Rimuove la richiesta accettata
                        user.requests = user.requests.filter(r => r != req.body.sender);
                        //Aggiunge l'amico nella friendlist
                        user.friends.push(req.body.sender);
                        user.save();
                        User.findById(req.body.sender).exec().then((user) => {
                            //Aggiunge l'utente alla lista amici del mittente della richiesta
                            user.friends.push(req.body.user);
                            user.save();
                        });
                        throw RichiestaAccettata;
                    }
                });
                res.status(400).send("BAD_REQUEST"); //Richiesta di amicizia non trovata
            }
            catch (RichiestaAccettata) {
                res.status(200).send("OK"); //Operazioen completata con successo
            }
        });
    },
    //Rifiuta la richiesta di amicizia
    refuseRequest: (req, res) => {
        User.findById(req.body.user).exec().then((user) => {
            user.requests = user.requests.filter(r => r != req.body.sender);
            user.save();
        });
        res.status(200).send("Richiesta rifiutata");
    },
    //Logga un utente, se le sue credenziali sono corrette
    //Problema: la password è in plain text, (crittografia?)
    login: (req, res) => {
        User.findOne({ username: req.body.username }).populate({ path: "requests", select: "username" }).populate({ path: "friends", select: "username" }).exec().then((user) => {
            if (!user) {
                return res.status(404).send("NOT_FOUND"); //L'utente non esiste sul DB
            }
            if (user.password == req.body.password) //Controllo la password
                //Utente loggato
                return res.status(200).send(user); //Per maggiore sicurezza, immagino vada mandato un cookie
            return res.status(403).send("UNAUTHORIZED"); //Password errata     
        });
    }
};
//# sourceMappingURL=usersController.js.map