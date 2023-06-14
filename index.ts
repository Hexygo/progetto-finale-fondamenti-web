import mongoose from "mongoose";

const express=require('express');
const cors=require('cors')
const password=require('./api/env').password

const apiRouter=require('./api/router/apiRouter')

const app=express();
const port=3000;

//Connessione al DB
mongoose.connect(`mongodb+srv://admin:${password}@cluster0.fpbbv1a.mongodb.net/provafinale`)
const db=mongoose.connection

db.once('open', ()=>{
    console.log('Successfully connected to', db.name)
})

//TODO:Assicurarsi di non far esplodere tutto mandando richieste vuote, provare con try...catch?

app.use(cors())

app.use('/', express.static('frontend/build'))

//Endpoint per il frontend
app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/frontend/build/index.html')
});

//Endpoint del backend
app.use('/api', apiRouter)

//Messa in ascolto della API sulla porta ${port}
app.listen(port, ()=>console.log('App is listening on port', port))
