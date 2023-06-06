const User = require('../models/User');
module.exports = {
    //Restituisce come risposta in formato JSON tutti gli utenti
    getAllUsers: (req, res) => {
        User.find({}).exec().then((data) => {
            res.setHeader("Content-Type", "application/json");
            res.json(data);
        });
    },
    //Restituisce come risposta in formato JSON il singolo utente che ha un determinato username, specificato nel url della richiesta
    getUserByUsername: (req, res) => {
        User.find({ username: req.params.username }).exec().then((data) => {
            res.setHeader("Content-Type", "application/json");
            res.json(data);
        });
    }
};
//# sourceMappingURL=usersController.js.map