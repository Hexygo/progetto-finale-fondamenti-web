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
    const sessionID = socket.handshake.auth.sessionID
    if(sessionID){
        const session=await Session.findById(sessionID).populate({path:'user_id', select:'-password'})
        if(session){
            socket.sessionID=session._id.toString()
            socket.userID=session.user_id._id.toString()
            socket.user=session.user_id
            return next()
        }
    }
    const userID=socket.handshake.auth.userID//ID UTENTE DEL DB
    if (!userID){
        return next(new Error("Missing UserID"))
    }
    const session=await Session.findOne({user_id:userID}).populate({path:'user_id', select:'-password'})//La sessione non ha bisogno di essere creata, perché viene creata al login
    socket.sessionID=session._id.toString()
    socket.userID=userID.toString()
    socket.user=session.user_id
    return next()
})

io.on("connection", (socket) => {
    socket.join(socket.userID)
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: socket.userID,
        user: socket.user,
      });
    }

    socket.on('message',({message, to})=>{//imposta una reazione all'emissione di un messaggio(il cui mittente è il socket)
        socket.to(to).to(socket.userID).emit('message',{
            message,
            from:socket.userID,
            to
        })
    })

    socket.on('friend request', ({sender, receiver})=>{
        socket.to(receiver).to(socket.userID).emit('friend request',{
            from:socket.userID,
            sender,
            to:receiver
        })
    })

    socket.on('friend request accepted', ({user, to})=>{
        socket.to(to).to(socket.userID).emit('friend request accepted',{
            from:socket.userID,
            user,
            to
        })
    })

    socket.on('friend request rejected', ({user, to})=>{
        socket.to(to).to(socket.userID).emit('friend request rejected',{
            from:socket.userID,
            user,
            to
        })
    })

    socket.on('friend removed', ({user, friend})=>{
        socket.to(friend).to(socket.userID).emit('friend removed', {
            from:socket.userID,
            to:friend
        })
    })

    socket.on('disconnect', async()=>{//reazione alla disconnessione di un utente, avvisa tutti gli utenti che [socket] si è disconnesso
        const matchingSockets= await io.in(socket.userID).allSockets()
        const isDisconnected=matchingSockets.size===0
        if(isDisconnected){
            socket.broadcast.emit("user disconnected", socket.userID);
            await Session.findOneAndUpdate({user_id:socket.userID}, {connected:false})
        }
    })
    
    socket.emit('session', {//Creazione di una sessione
        sessionID:socket.sessionID,
        userID:socket.userID
    })

    socket.emit("users", users);
    
    socket.broadcast.emit('user connected', {//Avvisa tutti gli utenti che [socket] si è connesso
        userID:socket.userID,
        user:socket.user
    })
  });

io.on('user disconnected',(socket)=>{
    console.log(socket)
})

