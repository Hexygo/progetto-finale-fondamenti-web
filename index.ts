const express=require('express');

const app=express();
const port=3000;

app.use('/', express.static('frontend/build'))

app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/frontend/build/index.html')
});

app.listen(port, ()=>console.log('App is listening on port', port))