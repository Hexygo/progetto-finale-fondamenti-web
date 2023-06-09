const User = require('../models/User');
module.exports = {
    //Restituisce come risposta in formato JSON tutti gli utenti
    getAllUsers: (req, res) => {
        User.find({}).exec().then((data) => {
            res.send(data);
        });
    },
    //Restituisce come risposta in formato JSON il singolo utente che ha un determinato username, specificato nel url della richiesta
    getUserByUsername: (req, res) => {
        User.find({ username: req.params.username }).exec().then((data) => {
            res.send(data);
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
        //Cerco l'utente sul DB
        User.findOne({ username: req.body.receiver }).exec().then((receiver) => {
            if (receiver) {
                //L'utente esiste quindi invio la richiesta di amicizia
                //Controllo che la richiesta non sia stata già inviata
                try {
                    receiver.requests.forEach((r) => {
                        if (r == req.body.sender)
                            throw (AlreadySentError); //Richiesta già inviata ---> Invio l'errore                        
                    });
                    //Procedo a inviare la richiesta
                    receiver.requests.push(req.body.sender);
                    receiver.save(); //Salvo la modifica su DB
                    res.status(200).send("Richiesta inserita con successo");
                }
                catch (err) {
                    if (err !== AlreadySentError)
                        throw (err); //L'errore è interno al sistema
                    res.status(403).send("Richiesta di amicizia già inviata");
                }
            }
            else {
                //Se l'utente non esiste, ritorna l'errore 404 NOT FOUND
                res.status(404).send("NOT FOUND");
            }
        });
    },
    //Accetto la richiesta di amicizia
    acceptRequest: (req, res) => {
        //Cerco l'utente che deve accettare le richieste
        User.findById(req.body.user).exec().then((user) => {
            //Optional TODO: Controllare che il sender esista
            //Rimuovo la richiesta accettata
            user.requests = user.requests.filter(r => r != req.body.sender);
            //Aggiungo l'amico nella friendlist
            user.friends.push(req.body.sender);
            user.save();
        });
        User.findById(req.body.sender).exec().then((user) => {
            //Aggiungo l'utente alla lista amici del mittente della richiesta
            user.friends.push(req.body.user);
            user.save();
        });
    }
};
//# sourceMappingURL=usersController.js.map