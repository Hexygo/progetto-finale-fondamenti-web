"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const messageController = require('../controllers/messageController');
router.get('/', (req, res) => res.status(200).send("Root for the Messages API"));
router.post('/send', messageController.sendMessage);
module.exports = router;
//# sourceMappingURL=messageRouter.js.map