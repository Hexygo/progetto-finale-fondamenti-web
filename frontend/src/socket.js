import { io } from 'socket.io-client'

const socket=io('http://localhost:3000', {autoConnect:false})

socket.onAny((event, ...args)=>{//Ad ogni evento, logga evento e args
    console.log(event, args)
})

socket.on("connect_error", (err) => {//Ad errore di connessione logga l'errore
    if (err.message === "invalid username") {
      console.log('Invalid Username')
    }
});

export default socket