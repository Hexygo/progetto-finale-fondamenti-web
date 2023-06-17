"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const router = (0, express_1.Router)();
const usersRouter = require('./usersRouter');
const messageRouter = require('./messageRouter');
const EmptyReqError = {};
router.use(express_1.default.json());
//Respinge le richieste con argomenti nulli, con STATUS_CODE:400-BAD_REQUEST
router.use((req, res, next) => {
    try {
        if (req.method === 'POST') {
            Object.keys(req.body).forEach(el => {
                if (req.body[el] === '')
                    throw EmptyReqError;
            });
        }
        if (req.method === 'GET') {
            Object.keys(req.params).forEach(el => {
                if (req.params[el] === '')
                    throw EmptyReqError;
            });
        }
        if (req.method === 'DELETE') {
            Object.keys(req.query).forEach(el => {
                if (req.params[el] === '')
                    throw EmptyReqError;
            });
        }
        next();
    }
    catch (EmptyReqError) {
        return res.status(400).send('BAD REQUEST');
    }
});
//Sanifica le richieste per evitare crash (whitespace)
router.use((req, res, next) => {
    for (let i in req.body) {
        req.body[i] = req.body[i].trim();
    }
    next();
});
//Endpoint root dell'API
router.get('/', (req, res) => {
    res.status(200).send("Root for the Chat API");
});
//Endpoint dell'API "users"
router.use('/users', usersRouter);
//Endpoint dell'API "messages"
router.use('/messages', messageRouter);
module.exports = router;
//# sourceMappingURL=apiRouter.js.map