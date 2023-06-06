import express, { Router } from "express"

const router=Router()
const usersController=require('../controllers/usersController')

//Endpoint "all" dell'API "users"
router.get('/all',usersController.getAllUsers)

//Endpoint "username" dell'API "users"
router.get('/username/:username', usersController.getUserByUsername)

//Endpoint "register" dell'API "users", accetta richieste POST
router.post('/register', usersController.addUser)

module.exports=router