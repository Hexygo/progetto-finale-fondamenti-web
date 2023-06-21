import mongoose from "mongoose";

const express=require('express');
const cors=require('cors')
const password=require('./api/env').password

const apiRouter=require('./api/router/apiRouter')

const app=express();
const port=3000;
const FRONTEND=['http://localhost:3001']
const Session=require('./api/models/Session')

//Connessione al DB
mongoose.connect(`mongodb+srv://admin:${password}@cluster0.fpbbv1a.mongodb.net/provafinale`)
const db=mongoose.connection

db.once('open', ()=>{
    console.log('Successfully connected to', db.name)
})

//TODO:Assicurarsi di non far esplodere tutto mandando richieste vuote, provare con try...catch?

app.use(cors({origin:'http://localhost:3001', credentials:true}))

app.use('/', express.static('frontend/build'))

//Endpoint per il frontend
app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/frontend/build/index.html')
});

//Endpoint del backend
app.use('/api', apiRouter)

//Messa in ascolto della API sulla porta ${port}
const io=require('socket.io')(app.listen(port, ()=>console.log('App is listening on port', port)), {
    cors:{origin:FRONTEND}
})

//Middleware Autenticazione Socket
io.use(async (socket, next)=>{
    const userID=socket.handshake.auth.userID//ID UTENTE DEL DB
    if (!userID){
        return next(new Error("Missing UserID"))
    }
    const session=await Session.findOne({user_id:userID}).populate({path:'user_id', select:'-password'})
    socket.sessionID=session._id.toString()
    socket.user=session.user_id
    return next()
})

io.on("connection", (socket) => {
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        user: socket.user,
      });
    }
    socket.emit("users", users);
    socket.broadcast.emit('user connected', {
        userID:socket.id,
        user:socket.user
    })
  });
