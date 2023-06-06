import { Router } from "express"

const router=Router()
const usersRouter=require('./usersRouter')

//Endpoint root dell'API
router.get('/', (req, res)=>{
    res.status(200).send("Root for the Chat API")
})

//Endpoint dell'API "users"
router.use('/users', usersRouter)

module.exports=router
