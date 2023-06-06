import { Router } from "express"

const router=Router()
const usersRouter=require('./usersRouter')

router.get('/', (req, res)=>{
    res.status(200).send("Root for the Chat API")
})

router.use('/users', usersRouter)

module.exports=router
