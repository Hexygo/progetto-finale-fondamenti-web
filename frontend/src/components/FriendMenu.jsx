import React, { useState } from "react";
import FriendRequest from './FriendRequest'

import Offcanvas from "react-bootstrap/Offcanvas"
import SearchBar from "./SearchBar";
import ListGroup from 'react-bootstrap/ListGroup'
import Accordion from 'react-bootstrap/Accordion'
import axiosInstance from "../axios";
import socket from "../socket";

export default function FriendMenu({ requests, friendMenu, currentUser }) {
    const [search, setSearch] = useState('')

    const submitHandler=(receiver)=>{
        axiosInstance({
            method:'get',
            url:'http://localhost:3000/api/users/username/'+receiver
        }).then((data)=>{
            if(currentUser.friends.map(e=>e._id).includes(data.data._id)){//Richiesta d'amicizia da annullare, poiché i due utenti sono già amici
                console.log('siete già amici')
                return
            }
            if(currentUser.requests.map(e=>e._id).includes(data.data._id)){//Richiesta d'amicizia pending trovata
                console.log("hai già una richiesta d'amicizia in attesa")
                return
            }
            const rec=data.data._id
            axiosInstance({
                method:'post',
                url:'http://localhost:3000/api/users/addFriend',
                data:{
                    sender:currentUser._id,
                    receiver:rec
                }
            }).then(data=>{
                socket.emit('friend request', {
                    sender:{_id:currentUser._id, username:currentUser.username},
                    receiver:rec
                })
            }).catch((err)=>{
                switch (err.response.status) {
                    case 403://Richiesta di amicizia già inviata
                        console.error('richiesta già inviata')//Mandare un messaggio di errore all'utente
                        break;
                
                    default:
                        console.error('errore interno al server')
                        break;
                }
            })
        }).catch((err)=>{
            switch (err.response.status) {
                case 404:
                    console.error('utente inesistente')
                    break;
            
                default:
                    break;
            }
        })
    }

    return (//Conterrà il menu con le richieste di amicizia in attesa, e la barra per inviare ricerche di amicizia
        <>
            <Offcanvas.Header className="justify-content-end sticky-top" closeButton closeVariant={friendMenu?'':"white"}/>{/*Valutare se fare il close button a mano per poterlo far sparire quando viene cliccato*/}

            <Offcanvas.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item className="text-center">
                        <div className="h3" >Aggiungi un Amico</div>
                        <SearchBar search={search} setSearch={setSearch} submitHandler={submitHandler}/>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Accordion data-bs-theme="dark" flush >
                            <Accordion.Item >
                                <Accordion.Header>Richieste Di Amicizia</Accordion.Header>
                                <Accordion.Body>
                                    <ListGroup variant='flush' as='ul' data-bs-theme="dark">
                                        {requests.map(request => <FriendRequest key={request._id} request={request} currentUser={currentUser}/>)}
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </ListGroup.Item>
                </ListGroup>
            </Offcanvas.Body>
        </>
    )
}