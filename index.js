"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const FRONTEND = ['http://localhost:3001'];
const Session = require('./api/models/Session');
//Connessione al DB
mongoose_1.default.connect(`mongodb+srv://admin:${password}@cluster0.fpbbv1a.mongodb.net/provafinale`);
const db = mongoose_1.default.connection;
db.once('open', () => {
    console.log('Successfully connected to', db.name);
});
//TODO:Assicurarsi di non far esplodere tutto mandando richieste vuote, provare con try...catch?
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use('/', express.static('frontend/build'));
//Endpoint per il frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/build/index.html');
});
//Endpoint del backend
app.use('/api', apiRouter);
//Messa in ascolto della API sulla porta ${port}
const io = require('socket.io')(app.listen(port, () => console.log('App is listening on port', port)), {
    cors: { origin: FRONTEND }
});
//Middleware Autenticazione Socket
io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = socket.handshake.auth.userID; //ID UTENTE DEL DB
    if (!userID) {
        return next(new Error("Missing UserID"));
    }
    const session = yield Session.findOne({ user_id: userID }).populate({ path: 'user_id', select: '-password' });
    socket.sessionID = session._id.toString();
    socket.user = session.user_id;
    return next();
}));
io.on("connection", (socket) => {
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            userID: id,
            user: socket.user,
        });
    }
    socket.on('message', ({ message, to }) => {
        socket.to(to).emit('message', {
            message,
            from: socket.id
        });
    });
    socket.emit("users", users);
    socket.broadcast.emit('user connected', {
        userID: socket.id,
        user: socket.user
    });
});
//# sourceMappingURL=index.js.map