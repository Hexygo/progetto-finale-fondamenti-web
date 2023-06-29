import React, { useState } from 'react'

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'

import { faCircle, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'

export default function Friend({ user, setFriendSelected, connected, friendSelected, removeFriend }) {
    const [showButton, setShowButton]=useState(false)
    const [color, setColor]=useState('#343a40')
    const [showModal, setShowModal]=useState(false)

    const handleClick = () => {
        setFriendSelected(user)
    }

    //Aggiungere pulsante per rimuovere amico
    //Aggiungere badge di notifica, con numero di messaggi non letti da parte dell'utente

    return (
        <>
        <ListGroup.Item variant='dark' action href={user._id} as='li' eventKey={user._id} onClick={handleClick} onMouseEnter={()=>{setShowButton(true); setColor('#343a40')}} onMouseLeave={()=>{setShowButton(false);setColor('#1a1d20')}}>
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
                <Col className='d-flex justify-content-end align-items-center pe-4 text-secondary'>
                    {showButton ?                     
                        <Button variant='dark' className='text-danger border-0' style={{backgroundColor:(friendSelected && friendSelected._id===user._id)?'#dee2e6':color}} onClick={()=>setShowModal(true)}>
                            <FontAwesomeIcon icon={faTrashCan} size='2x'/>
                        </Button>:
                        ''
                    }
                </Col>
            </Row>
        </ListGroup.Item>
        <Modal show={showModal} onHide={()=>setShowModal(false)}>
            <Modal.Body>
                <Container fluid>
                <Row className='d-flex p-4'>
                    <div>Sicuro di voler rimuovere <b>{user.username}</b> dalla lista amici?</div>
                </Row>
                <Row className='d-flex flex-nowrap justify-content-center'>
                        <Button variant='danger' style={{width:'fit-content'}} className='mx-3' onClick={()=>{removeFriend(user._id); setFriendSelected(undefined)}}>
                            Conferma
                        </Button>
                        <Button variant='secondary' style={{width:'fit-content'}} className='mx-3' onClick={()=>setShowModal(false)}>
                            Annulla
                        </Button>
                </Row>
                </Container>
            </Modal.Body>
        </Modal>
        </>
    )
}
