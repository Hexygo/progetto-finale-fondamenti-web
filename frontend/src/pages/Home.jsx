import { useState, useEffect } from "react"
import socket from "../socket"
import FriendList from '../components/FriendList'
import Chat from "../components/Chat"

export default function Home({loggedUser}){
    const [users, setUsers]=useState([])
    const [otherUser, setOtherUser]=useState()
    const [friendSelected, setFriendSelected]=useState()//contiene il socket, che a sua volta contiene l'utente in friendSelected.user

    useEffect(()=>{
        setOtherUser(friendSelected)
    }, [friendSelected])

    socket.on('users',(users)=>{//Evento emesso dal server, che comunica tutti gli utenti collegati in un dato momento
        users.forEach(user=>{
            user.self=user.user._id===loggedUser._id
            user.connected=true
        })
        setUsers(users)
    })

    socket.on('user connected',(user)=>{//Evento emesso dal server quando un utente si connnette
        user.self=false
        user.connected=true
        setUsers([...users, user])
    })

    socket.on('user disconnected', disconnectedUser=>{
        setUsers(users.map(user=>{
            if(user.userID===disconnectedUser.userID)
                user.connected=false
            return user
        }))
    })

    return (<>
        <aside>
            <FriendList users={users} setFriendSelected={setFriendSelected}/>
        </aside>
        <main>
            {otherUser?<Chat user={loggedUser} otherUser={otherUser}/>:'Seleziona un utente per iniziare a chattare'}
        </main></>
        )
    }