"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const usersController = require('../controllers/usersController');
//Endpoint "all" dell'API "users"
router.get('/all', usersController.getAllUsers);
//Endpoint "username" dell'API "users"
router.get('/username/:username', usersController.getUserByUsername);
//Endpoint "register" dell'API "users", accetta richieste POST
router.post('/register', usersController.addUser);
//Endpoint "addFriend" dell'API "users", accetta richieste POST
router.post('/addFriend', usersController.addFriend);
//Endpoint "accept" dell'API "users", accetta richieste POST
router.post('/accept', usersController.acceptRequest);
module.exports = router;
//# sourceMappingURL=usersRouter.js.map