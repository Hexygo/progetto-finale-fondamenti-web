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
import ChatPlaceholder from "../components/ChatPlaceholder"


export default function Home({ loggedUser, setLoggedUser }) {
    const [users, setUsers] = useState([])
    const [otherUser, setOtherUser] = useState()
    const [friendSelected, setFriendSelected] = useState()//contiene il socket, che a sua volta contiene l'utente in friendSelected.user
    const navigate = useNavigate()
    const [friendMenu, setFriendMenu] = useState()
    const [logged, setLogged] = useState(false)
    const [requests, setRequests] =useState([])
    const [friends, setFriends]=useState([])

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
            setRequests(data.data.requests)
            setFriends(data.data.friends)
            setLogged(true)
            socket.auth = { sessionID: session }}
        getUser()
    }, [])

    useEffect(() => {
        socket.on('users', (users) => {//Evento emesso dal server, che comunica tutti gli utenti collegati in un dato momento
            users.forEach(user => {
                user.self = user.userID === socket.userID
                user.connected = true
            })
            setUsers(users)
        })

        socket.on('user connected', (connectedUser) => {//Evento emesso dal server quando un utente si connnette
            let found = false
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

        socket.on('friend request', request=>{
            setRequests([...requests, request.sender])
        })

        socket.on('friend request accepted',(request)=>{
            setRequests(requests.filter(r=>r._id!==request.user._id))
            setFriends([...friends, request])
        })

        socket.on('friend request rejected',(request)=>{
            setRequests(requests.filter(r=>r._id!==request.user._id))
        })
        
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

    return (
        logged ? <>
            <Container fluid className="vh-100">
                <Row className="h-100">
                    <Col xs='1' className="p-0" style={{width:'60px'}}>
                        <SideBar handleLogout={handleLogout} friendMenu={friendMenu} setFriendMenu={setFriendMenu} />
                    </Col>
                    <Col>
                        <FriendList users={users} setFriendSelected={setFriendSelected} />
                    </Col>
                    <Col xs='9'>
                        {otherUser ? <Chat user={loggedUser} otherUser={otherUser} /> : <ChatPlaceholder/>}
                    </Col>
                </Row>
            </Container>
            <Offcanvas className="ps-5 rounded-4" show={friendMenu} onHide={() => { setFriendMenu(false) }} unmountOnExit data-bs-theme="dark">
                <FriendMenu requests={requests} friendMenu={friendMenu} currentUser={loggedUser} setFriends={setFriends} setRequests={setRequests} friends={friends}/>
            </Offcanvas>
        </> : ''
    )
}