import express, { Router } from "express"
import cookieParser from 'cookie-parser'

const router=Router()
const usersRouter=require('./usersRouter')
const messageRouter=require('./messageRouter')

const EmptyReqError={}

router.use(cookieParser())

router.use(express.json())

//Respinge le richieste con argomenti nulli, con STATUS_CODE:400-BAD_REQUEST
router.use((req, res, next)=>{
    try {
        if(req.method==='POST'){
            Object.keys(req.body).forEach(el=>{
                if(req.body[el]==='')
                    throw EmptyReqError
            })    
        }
        if(req.method==='GET'){
            Object.keys(req.params).forEach(el=>{
                if(req.params[el]==='')
                    throw EmptyReqError
            })
        }
        if(req.method==='DELETE'){
            Object.keys(req.query).forEach(el=>{
                if(req.params[el]==='')
                    throw EmptyReqError
            })
        }
        next()
    } catch (EmptyReqError) {
        return res.status(400).send('BAD REQUEST')
    }
})

//Sanifica le richieste per evitare crash (whitespace)
router.use((req,res,next)=>{
    for(let i in req.body){
        req.body[i]=req.body[i].trim()
    }
    next()
})

//Endpoint root dell'API
router.get('/', (req, res)=>{
    res.status(200).send("Root for the Chat API")
})

//Endpoint dell'API "users"
router.use('/users', usersRouter)

//Endpoint dell'API "messages"
router.use('/messages', messageRouter)

module.exports=router
