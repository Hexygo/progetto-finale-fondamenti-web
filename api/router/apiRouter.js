"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const usersRouter = require('./usersRouter');
router.get('/', (req, res) => {
    res.status(200).send("Root for the Chat API");
});
router.use('/users', usersRouter);
module.exports = router;
//# sourceMappingURL=apiRouter.js.map