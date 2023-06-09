import express, { Router } from "express"

const router=Router()
const usersRouter=require('./usersRouter')
const messageRouter=require('./messageRouter')

router.use(express.json())

//Endpoint root dell'API
router.get('/', (req, res)=>{
    res.status(200).send("Root for the Chat API")
})

//Endpoint dell'API "users"
router.use('/users', usersRouter)

//Endpoint dell'API "messages"
router.use('/messages', messageRouter)

module.exports=router
