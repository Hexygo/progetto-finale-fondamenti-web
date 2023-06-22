import { useState, useEffect } from "react"
import socket from "../socket"
import FriendList from '../components/FriendList'
import Chat from "../components/Chat"

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from 'react-bootstrap/Col';

export default function Home({loggedUser}){
    const [users, setUsers]=useState([])
    const [otherUser, setOtherUser]=useState()
    const [friendSelected, setFriendSelected]=useState()//contiene il socket, che a sua volta contiene l'utente in friendSelected.user

    useEffect(()=>{
        setOtherUser(friendSelected)
    }, [friendSelected])

    socket.on('users',(users)=>{//Evento emesso dal server, che comunica tutti gli utenti collegati in un dato momento
        users.forEach(user=>{
            user.self=user.userID===loggedUser._id
            user.connected=true
        })
        setUsers(users)
    })

    socket.on('user connected',(connectedUser)=>{
        let found=false//Evento emesso dal server quando un utente si connnette
        setUsers(users.map(user=>{
            if(user.userID===connectedUser.userID){
                found=true
                user.self=false
                user.connected=true
            }
            return user
        }))
        if(!found){
            setUsers([...users, connectedUser])
        }
    })

    socket.on('user disconnected', disconnectedUser=>{
        setUsers(users.map(user=>{
            if(user.userID===disconnectedUser)
                user.connected=false
            return user
        }))
    })

    return (
        <Container className=''>
            <Row>
                <Col>
                    <FriendList users={users} setFriendSelected={setFriendSelected} />
                </Col>
                <Col>
                    {otherUser ? <Chat user={loggedUser} otherUser={otherUser} /> : 'Seleziona un utente per iniziare a chattare'}
                </Col>
            </Row>
        </Container>
    )
}