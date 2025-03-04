import { io } from 'socket.io-client'

const socket=io('/', {autoConnect:false})

socket.onAny((event, ...args)=>{//Ad ogni evento, logga evento e args
    console.log(event, args)
    console.log(socket)
})

socket.on("connect_error", (err) => {//Ad errore di connessione logga l'errore
    if (err.message === "invalid username") {
      console.log('Invalid Username')
    }
});

socket.on('session', ({sessionID, userID})=>{
  const cookieToken=document.cookie
    .split("; ")
    .find((row) => row.startsWith("session_token="))
    ?.split("=")[1]
  socket.auth={sessionID:cookieToken}
  localStorage.setItem('sessionID', cookieToken)//Archivia in locale la sessione
  socket.userID=userID
})

export default socket