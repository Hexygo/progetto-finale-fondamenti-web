import React, { useState } from 'react'

import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import socket from '../socket'

export default function Friend({ user, setFriendSelected, connected, friendSelected }) {
    const [unreadMessages, setUnreadMessages]=useState(0)

    const handleClick = () => {
        setFriendSelected(user)
        setUnreadMessages(0)
    }
    
    socket.on('message', ({message, from})=>{
        if(friendSelected){
            if(message.sender._id===user._id && friendSelected._id !== message.sender._id )
                setUnreadMessages(unreadMessages+1)
        }else{
            if(message.sender._id===user._id)
                setUnreadMessages(unreadMessages+1)
        }
        
    })

    //Aggiungere pulsante per rimuovere amico
    //Aggiungere badge di notifica, con numero di messaggi non letti da parte dell'utente

    return (
        <ListGroup.Item variant='dark' action href={user._id} as='li' eventKey={user._id} onClick={handleClick}>
            <Row className='d-flex justify-content-between'>
                <Col>
                    <h5>
                        {user.username}
                    </h5>
                    <blockquote>
                        {connected ?
                            <><FontAwesomeIcon className="text-success" icon={faCircle} /> online</> :
                            <><FontAwesomeIcon className="text-secondary" icon={faCircle} /> offline</>}
                    </blockquote>
                </Col>
                <Col className='d-flex justify-content-end align-items-center'>
                    {unreadMessages!==0?
                        <Badge pill>
                            {unreadMessages}
                        </Badge>:
                        ''
                    }
                </Col>
            </Row>
        </ListGroup.Item>
    )
}