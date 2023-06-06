import { Router } from "express"

const router=Router()
const usersController=require('../controllers/usersController')

router.get('/all',usersController.getAllUsers)

router.get('/username/:username', usersController.getUserByUsername)

module.exports=router