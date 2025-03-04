import { Router } from 'express'

const router=Router()
const usersController=require('../controllers/usersController')

//Endpoint "login" dell'API "users", accetta richieste POST
router.post('/login', usersController.login)

//Endpoint "register" dell'API "users", accetta richieste POST
//Usare PUT?
router.post('/register', usersController.register)

router.post('/logout', usersController.logout)

router.use(usersController.cookiesMiddleware)

router.get('/', (req, res)=>res.status(200).send('Root endpoint for the Users API.'))

//Endpoint "all" dell'API "users"
router.get('/all',usersController.getAllUsers)

//Endpoint "username" dell'API "users"
router.get('/username/:username', usersController.getUserByUsername)

//Endpoint "addFriend" dell'API "users", accetta richieste POST
router.post('/addFriend', usersController.addFriend)

//Endpoint "removeFriend" dell'API "users", accetta richieste POST
router.post('/removeFriend', usersController.removeFriend)

//Endpoint "accept" dell'API "users", accetta richieste POST
router.post('/accept', usersController.acceptRequest)

//Endpoint "refuse" dell'API "users", accetta richieste POST
router.post('/refuse', usersController.refuseRequest)

router.get('/usersession', usersController.getUserFromSession)

module.exports=router