"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express = require('express');
const cors = require('cors');
const password = require('./api/env').password;
const apiRouter = require('./api/router/apiRouter');
const app = express();
const port = 3000;
//Connessione al DB
mongoose_1.default.connect(`mongodb+srv://admin:${password}@cluster0.fpbbv1a.mongodb.net/provafinale`);
const db = mongoose_1.default.connection;
db.once('open', () => {
    console.log('Successfully connected to', db.name);
});
//TODO:Assicurarsi di non far esplodere tutto mandando richieste vuote, provare con try...catch?
app.use(cors());
app.use('/', express.static('frontend/build'));
//Endpoint per il frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/build/index.html');
});
//Endpoint del backend
app.use('/api', apiRouter);
//Messa in ascolto della API sulla porta ${port}
app.listen(port, () => console.log('App is listening on port', port));
//# sourceMappingURL=index.js.map