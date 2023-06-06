"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const usersRouter = require('./usersRouter');
//Endpoint root dell'API
router.get('/', (req, res) => {
    res.status(200).send("Root for the Chat API");
});
//Endpoint dell'API "users"
router.use('/users', usersRouter);
module.exports = router;
//# sourceMappingURL=apiRouter.js.map