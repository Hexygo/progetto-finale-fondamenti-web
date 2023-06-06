"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const usersController = require('../controllers/usersController');
router.get('/all', usersController.getAllUsers);
router.get('/username/:username', usersController.getUserByUsername);
module.exports = router;
//# sourceMappingURL=usersRouter.js.map