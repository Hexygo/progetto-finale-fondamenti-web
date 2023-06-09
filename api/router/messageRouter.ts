import {Router} from 'express'

const router=Router()
const messageController=require('../controllers/messageController')

router.get('/', (req, res)=>res.status(200).send("Root for the Messages API"))

router.post('/send', messageController.sendMessage)

router.post('/conversation', messageController.getConversation)

module.exports=router