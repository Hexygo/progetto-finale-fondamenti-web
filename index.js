"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express = require('express');
const password = require('./api/env').password;
const app = express();
const port = 3000;
mongoose_1.default.connect(`mongodb+srv://admin:${password}@cluster0.fpbbv1a.mongodb.net/provafinale`);
const db = mongoose_1.default.connection;
db.once('open', () => {
    console.log('Successfully connected to', db.name);
});
const apiRouter = require('./api/router/apiRouter');
app.use('/', express.static('frontend/build'));
//Endpoint per il frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/build/index.html');
});
app.use('/api', apiRouter);
app.listen(port, () => console.log('App is listening on port', port));
//# sourceMappingURL=index.js.map