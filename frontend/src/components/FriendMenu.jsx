import React, { useEffect, useState } from "react";
import FriendRequest from './FriendRequest'

import Offcanvas from "react-bootstrap/Offcanvas"
import SearchBar from "./SearchBar";
import ListGroup from 'react-bootstrap/ListGroup'
import Accordion from 'react-bootstrap/Accordion'
import axiosInstance from "../axios";
import socket from "../socket";
import Modal from 'react-bootstrap/Modal';

export default function FriendMenu({ requests, friendMenu, currentUser, setRequests, setFriends, friends, setInvalidSession }) {
    const [search, setSearch] = useState('')
    const [selfRequest, setSelfRequest]=useState(false)
    const [requestSent, setRequestSent]=useState(false)
    const [userNotFound, setUserNotFound]=useState(false)
    const [modal1, setModal1] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)

    useEffect(()=>{
        setTimeout(()=>{
            setRequestSent(false)
        }, 3000)
    }, [requestSent])

    useEffect(()=>{
        setTimeout(()=>{
            setUserNotFound(false)
        }, 3000)
    }, [userNotFound])

    useEffect(()=>{
        setTimeout(()=>{
            setSelfRequest(false)
        }, 3000)
    }, [selfRequest])

    const submitHandler=(receiver)=>{
        axiosInstance({
            method:'get',
            url:'/api/users/username/'+receiver
        }).then((data)=>{
            if(currentUser._id===data.data._id){
                setSelfRequest(true)
                return
            }
            if(friends.map(e=>e._id).includes(data.data._id)){//Richiesta d'amicizia da annullare, poiché i due utenti sono già amici
                setModal1(true)
                return
            }
            if(requests.map(e=>e._id).includes(data.data._id)){//Richiesta d'amicizia pending trovata
                setModal3(true)
                return
            }
            const rec=data.data._id
            axiosInstance({
                method:'post',
                url:'/api/users/addFriend',
                data:{
                    sender:currentUser._id,
                    receiver:rec
                }
            }).then(data=>{
                socket.emit('friend request', {
                    sender:{_id:currentUser._id, username:currentUser.username},
                    receiver:rec
                })
                setRequestSent(true)
            }).catch((err)=>{
                switch (err.response.status) {
                    case 401://Sessione scaduta
                        setInvalidSession(true)
                        break;

                    case 403://Richiesta di amicizia già inviata
                        setModal2(true)
                        break;
                
                    default:
                        console.error('errore interno al server')
                        break;
                }
            })
        }).catch((err)=>{
            switch (err.response.status) {
                case 401://Sessione Scaduta
                    setInvalidSession(true)
                    break;

                case 404:
                    setUserNotFound(true)
                    break;
            
                default:
                    console.error('errore interno al server')
                    break;
            }
        })
    }

    const acceptCallback=(request)=>{
        setRequests(requests.filter(r=>r._id!==request._id))
        setFriends([...friends, request])
    }

    const rejectCallback=(request)=>{
        setRequests(requests.filter(r=>r._id!==request._id))
    }

    return (//Conterrà il menu con le richieste di amicizia in attesa, e la barra per inviare ricerche di amicizia
        <>
            <Offcanvas.Header className="justify-content-end sticky-top" closeButton/>{/*Valutare se fare il close button a mano per poterlo far sparire quando viene cliccato*/}

            <Offcanvas.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item className="text-center">
                        <div className="h3" style={{fontFamily:'Roboto Condensed, sans-serif'}}>Aggiungi un Amico</div>
                        <SearchBar key=""search={search} setSearch={setSearch} submitHandler={submitHandler}/>
                        {requestSent ? <label className="form-text text-success">Richiesta inviata con successo.</label>:''}
                        {userNotFound ? <label className="form-text text-danger">L'utente non esiste.</label>:''}
                        {selfRequest ? <label className="form-text text-danger">Non puoi mandare una richiesta di amicizia a te stesso.</label>:''}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Accordion data-bs-theme="dark" flush >
                            <Accordion.Item >
                                <Accordion.Header style={{fontFamily:'Roboto Condensed, sans-serif'}}>Richieste Di Amicizia</Accordion.Header>
                                <Accordion.Body>
                                    <ListGroup variant='flush' as='ul' data-bs-theme="dark">
                                        {requests.map(request => <FriendRequest key={request._id} request={request} currentUser={currentUser} acceptCallback={acceptCallback} rejectCallback={rejectCallback} />)}
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </ListGroup.Item>
                </ListGroup>
            </Offcanvas.Body>

            <Modal centered show={modal1} onHide={()=>{setModal1(false)}}> 
                <Modal.Header >
                    <Modal.Title>L'utente è già tuo amico</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Stai cercando di inviare una richiesta di amicizia ad un utente già nella tua lista amici!
                </Modal.Body>
            </Modal>
                
            <Modal centered show={modal2} onHide={()=>{setModal2(false)}}> 
                <Modal.Header >
                    <Modal.Title>Richiesta già inviata</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Hai già inviato una richiesta di amicizia all'utente, bisogna attendere che la richiesta venga accettata o rifiutata!
                </Modal.Body>
            </Modal>

            <Modal centered show={modal3} onHide={()=>{setModal3(false)}}> 
                <Modal.Header >
                    <Modal.Title>Richiesta d'amicizia in attesa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Questo utente ti ha già inviato una richiesta d'amicizia, accettala dal menu sottostante.
                </Modal.Body>
            </Modal>
        </>
    )
}