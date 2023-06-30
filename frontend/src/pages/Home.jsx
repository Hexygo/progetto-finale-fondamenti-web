/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react"
import socket from "../socket"
import FriendList from '../components/FriendList'
import Chat from "../components/Chat"
import SideBar from "../components/SideBar"

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from 'react-bootstrap/Col';
import Offcanvas from 'react-bootstrap/Offcanvas'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import axiosInstance from "../axios"
import { useNavigate } from "react-router-dom"
import FriendMenu from "../components/FriendMenu"
import FriendNotification from "../components/FriendNotification"
import AcceptNotification from "../components/AcceptNotification"
import RejectNotification from "../components/RejectNotification"
import MessageNotification from "../components/MessageNotification"


export default function Home({ loggedUser, setLoggedUser }) {
    const [users, setUsers] = useState([])
    const [otherUser, setOtherUser] = useState()
    const [friendSelected, setFriendSelected] = useState()
    const navigate = useNavigate()
    const [friendMenu, setFriendMenu] = useState()
    const [logged, setLogged] = useState(false)
    const [requests, setRequests] =useState([])
    const [friends, setFriends]=useState([])

    const [friendRequestQueue, setFriendRequestQueue]=useState([])
    const [friendAcceptQueue, setFriendAcceptQueue]=useState([])
    const [friendRejectQueue, setFriendRejectQueue]=useState([])
    const [messageQueue, setMessageQueue]=useState([])

    const [invalidSession, setInvalidSession]=useState(false)
    const [clonedSession, setClonedSession]=useState(false)
    const [errorOnRemoved, setErrorOnRemoved]=useState(false)

    useEffect(() => {
        const session = localStorage.getItem('sessionID')
        if (!session) {
            navigate('/')
            return
        }
        const getUser=async()=>{
            try {
                const data= await axiosInstance({
                    method: 'get',
                    url: '/api/users/usersession',
                    headers: {
                        setCookie: { "session_token": session }
                    }
                })
                setLoggedUser(data.data)
                setRequests(data.data.requests)
                setFriends(data.data.friends)
                setLogged(true)
                socket.auth = { sessionID: session }
            } catch (error) {
                switch (error.response.status) {
                    case 401://Errore di Sessione Non Valida
                        setInvalidSession(true)
                        break;
                    case 409://Errore di Sessione Clonata
                        setClonedSession(true)
                        break;                
                    default:
                        console.error('errore interno al server:', error)
                        break;
                }
    
            }
        }
        getUser()
    }, [])

    useEffect(() => {
        const events=['users', 'user connected', 'user disconnected', 'friend request', 'friend request accepted', 'friend request rejected', 'friend removed']
        events.forEach(el=>{
            socket.removeAllListeners(el)
        })
        console.log('sto rimuovendo i listeners', socket._callbacks)
        socket.once('users', (serverUsers) => {//Evento emesso dal server, che comunica tutti gli utenti collegati al momento del login
            serverUsers.forEach(user => {
                user.self = user.user._id === socket.userID
                user.connected = true
            })
            setUsers([...users, ...serverUsers])
        })

        socket.once('user connected', (connectedUser) => {//Evento emesso dal server quando un utente si connnette
            let found = false
            setUsers(users.map(user => {
                if (user.user._id === connectedUser.user._id) {
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

        socket.once('user disconnected', disconnectedUser => {
            setUsers(users.map(user => {
                if (user.user._id === disconnectedUser){
                    console.log('ho trovato l utente')
                    user.connected = false
                }
                return user
            }))
        })

        socket.once('friend request', request=>{//Evento che viene attivato quando si riceve una richiesta di amicizia
            setRequests([...requests, request.sender])
            let temp=friendRequestQueue
            temp.push(request.sender)
            setFriendRequestQueue([...temp])
            setTimeout(()=>{
                let temp=friendRequestQueue
                temp.shift()
                setFriendRequestQueue([...temp])
            }, 5000)
        })

        socket.once('friend request accepted',(request)=>{
            setRequests(requests.filter(r=>r._id!==request.user._id))
            setFriends([...friends, {_id:request.user._id, username:request.user.username }])
            let temp=friendAcceptQueue
            temp.push(request.user)
            setFriendAcceptQueue([...temp])
            setTimeout(()=>{
                let temp=friendAcceptQueue
                temp.shift()
                setFriendAcceptQueue([...temp])
            }, 5000)
        })

        socket.once('friend request rejected',(request)=>{
            setRequests(requests.filter(r=>r._id!==request.user._id))
            let temp=friendRejectQueue
            temp.push(request.user)
            setFriendRejectQueue([...temp])
            setTimeout(()=>{
                let temp=friendRejectQueue
                temp.shift()
                setFriendRejectQueue([...temp])
            }, 5000)
        })

        socket.once('friend removed', (friend)=>{
            setFriends(friends.filter(f=>f._id!==friend.from))
        })
        console.log(socket._callbacks)
        
        socket.connect()
    }, [friends, loggedUser, requests, users])

    useEffect(() => {
        setOtherUser(friendSelected)
    }, [friendSelected])

    const handleLogout = () => {
        axiosInstance({
            method: 'post',
            url: '/api/users/logout'
        }).then(data => {
            socket.disconnect()
            localStorage.setItem('sessionID', '')
            localStorage.clear()
            navigate('/')
        })
    }

    const removeFriend=(friend)=>{
        axiosInstance({
            method:'post',
            url:'/api/users/removeFriend',
            data:{
                user:loggedUser._id,
                friend
            }
        }).then(()=>{
            socket.emit('friend removed', {
                loggedUser, 
                friend
            })
            setFriends(friends.filter(f=>f._id!==friend))
        }).catch((err)=>{
            switch (err) {
                case 404:
                    setErrorOnRemoved(true)
                    break;
            
                default:
                    console.error('errore di sistema')
                    break;
            }
        })
    }

    return (
        <>{logged ? 
        <>
            <Container fluid className="vh-100">
                <Row className="h-100">
                    <Col xs='1' className="p-0" style={{width:'60px'}}>
                        <SideBar handleLogout={handleLogout} friendMenu={friendMenu} setFriendMenu={setFriendMenu} />
                    </Col>
                    <Col>
                        <FriendList friends={friends} onlineUsers={users} friendSelected={friendSelected} setFriendSelected={setFriendSelected} removeFriend={removeFriend}/>
                    </Col>
                    <Col xs='9'>
                        <Chat user={loggedUser} otherUser={otherUser} messageQueue={messageQueue} setMessageQueue={setMessageQueue} setInvalidSession={setInvalidSession}/>
                    </Col>
                </Row>
            </Container>
            <Offcanvas className="ps-5 rounded-4" show={friendMenu} onHide={() => { setFriendMenu(false) }} unmountOnExit data-bs-theme="dark">
                <FriendMenu requests={requests} friendMenu={friendMenu} currentUser={loggedUser} setFriends={setFriends} setRequests={setRequests} friends={friends} setInvalidSession={setInvalidSession}/>
            </Offcanvas>
            <ToastContainer id="notification-box" position="bottom-end" className="p-3">
                {friendRequestQueue.map(el=><FriendNotification user={el}/>)}
                {friendAcceptQueue.map(el=><AcceptNotification user={el}/>)}
                {friendRejectQueue.map(el=><RejectNotification user={el}/>)}
                {messageQueue.map(el=><MessageNotification message={el}/>)}
            </ToastContainer>
        </> : ''}
            <Modal show={invalidSession} onHide={()=>{
                setInvalidSession(false)
                localStorage.setItem('sessionID','')
                navigate('/')
                }}>
                <Modal.Header>
                    Sessione Scaduta
                </Modal.Header>
                <Modal.Body>
                    Per favore rieffettuare il
                    <Button variant="link" type="button" 
                        onClick={()=>{
                                setInvalidSession(false)
                                localStorage.setItem('sessionID','')
                                navigate("/")
                            }}>
                            login
                    </Button>
                </Modal.Body>
            </Modal>
            <Modal show={clonedSession} onHide={()=>{
                setClonedSession(false)
                window.location.reload(false);
                }}>
                <Modal.Header>
                    Sessione già attiva
                </Modal.Header>
                <Modal.Body>
                    L'applicazione è aperta in un'altra finestra, per favore chiudi quella finestra.
                    <br/>
                        Non sei tu? 
                        <Button variant="link" type="button" 
                        onClick={()=>{
                                setClonedSession(false)
                                localStorage.setItem('sessionID','')
                                navigate("/")
                            }}>
                            Clicca qui!
                        </Button>
                </Modal.Body>
            </Modal>
            <Modal show={errorOnRemoved} onHide={()=>{setErrorOnRemoved(false)}}>
                <Modal.Header>
                    Non siete più amici
                </Modal.Header>
                <Modal.Body>
                    Tu e questo utente non siete più amici.
                </Modal.Body>
            </Modal>
        </>
    )
}