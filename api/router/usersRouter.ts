import { Router } from "express"

const router=Router()
const usersController=require('../controllers/usersController')

//Endpoint "all" dell'API "users"
router.get('/all',usersController.getAllUsers)

//Endpoint "username" dell'API "users"
router.get('/username/:username', usersController.getUserByUsername)

module.exports=router