import { useState, useEffect } from "react"
import socket from "../socket"
import FriendList from '../components/FriendList'
import Chat from "../components/Chat"
import SideBar from "../components/SideBar"

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from 'react-bootstrap/Col';
import Offcanvas from 'react-bootstrap/Offcanvas'

import axiosInstance from "../axios"
import { useNavigate } from "react-router-dom"
import FriendMenu from "../components/FriendMenu"


export default function Home({ loggedUser, setLoggedUser }) {
    const [users, setUsers] = useState([])
    const [otherUser, setOtherUser] = useState()
    const [friendSelected, setFriendSelected] = useState()//contiene il socket, che a sua volta contiene l'utente in friendSelected.user
    const navigate = useNavigate()
    const [friendMenu, setFriendMenu] = useState()
    const [logged, setLogged] = useState(false)

    useEffect(() => {
        const session = localStorage.getItem('sessionID')
        console.log(session)
        if (!session) {
            navigate('/')
            return
        }
        const getUser=async()=>{
            const data= await axiosInstance({
                method: 'get',
                url: 'http://localhost:3000/api/users/usersession',
                headers: {
                    setCookie: { "session_token": session }
                }
            })
            console.log(data)
            setLoggedUser(data.data)
            setLogged(true)
            socket.auth = { sessionID: session }}
        getUser()
    }, [])

    useEffect(() => {
        console.log(socket)
        socket.on('users', (users) => {//Evento emesso dal server, che comunica tutti gli utenti collegati in un dato momento
            users.forEach(user => {
                user.self = user.userID === socket.userID
                user.connected = true
            })
            setUsers(users)
        })

        socket.on('user connected', (connectedUser) => {
            let found = false//Evento emesso dal server quando un utente si connnette
            setUsers(users.map(user => {
                if (user.userID === connectedUser.userID) {
                    found = true
                    user.self = false
                    user.connected = true
                }
                return user
            }))
            if (!found) {
                connectedUser.self = false
                connectedUser.connected = true
                setUsers([...users, connectedUser])
            }
        })

        socket.on('user disconnected', disconnectedUser => {
            setUsers(users.map(user => {
                if (user.userID === disconnectedUser)
                    user.connected = false
                return user
            }))
        })
        console.log(loggedUser)
        socket.connect()
    }, [loggedUser])

    useEffect(() => {
        setOtherUser(friendSelected)
    }, [friendSelected])

    const handleLogout = () => {//
        axiosInstance({
            method: 'post',
            url: 'http://localhost:3000/api/users/logout'
        }).then(data => {
            socket.disconnect()
            localStorage.setItem('sessionID', '')
            localStorage.clear()
            navigate('/')
        })
    }

    const addFriend = (friend) => {//Contiene lo Username dell'utente da cercare
        axiosInstance({
            method: 'get',
            url: 'http://localhost:3000/api/users/username/' + friend,
        }).then(data => {//Contiene l'utente da aggiungere
            axiosInstance({
                method: 'post',
                url: 'http://localhost:3000/api/users/addFriend',
                data: {
                    sender: loggedUser._id,
                    receiver: data.data._id
                }
            }).then(
                console.log('richiesta inviata con successo')//Implementare quindi un messaggio di conferma all'utente, e la gestione su socket della cosa(socket.to().emit('friend request'))
            ).catch(err => {
                console.log(err)//c'è tutta una logica da implementare in questo caso, data la quantità di errori lanciati da questo endpoint
            })
        }).catch(err => {
            if (err.response.status === 404) {
                console.log('utente non trovato')//Implementare quindi un avviso all'utente
            }
        })
    }

    return (
        logged ? <>
            <Container fluid>
                <Row>
                    <Col xs='1'>
                        <SideBar handleLogout={handleLogout} addFriend={addFriend} setFriendMenu={setFriendMenu} />
                    </Col>
                    <Col>
                        <FriendList users={users} setFriendSelected={setFriendSelected} />
                    </Col>
                    <Col xs='9'>
                        {otherUser ? <Chat user={loggedUser} otherUser={otherUser} /> : 'Seleziona un utente per iniziare a chattare'}
                    </Col>
                </Row>
            </Container>
            <Offcanvas show={friendMenu} onHide={() => { setFriendMenu(false) }} unmountOnExit>
                <FriendMenu requests={loggedUser.requests} />
            </Offcanvas>
        </> : ''
    )
}