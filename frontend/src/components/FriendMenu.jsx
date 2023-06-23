import React, { useState } from "react";
import FriendRequest from './FriendRequest'

import Offcanvas from "react-bootstrap/Offcanvas"
import SearchBar from "./SearchBar";
import ListGroup from 'react-bootstrap/ListGroup'
import Accordion from 'react-bootstrap/Accordion'

export default function FriendMenu({ requests }) {
    const [search, setSearch] = useState('')

    return (//Conterrà il menu con le richieste di amicizia in attesa, e la barra per inviare ricerche di amicizia
        <>
            <Offcanvas.Header className="justify-content-end" closeButton />

            <Offcanvas.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item className="text-center">
                        <div className="h3" >Aggiungi un Amico</div>
                        <SearchBar search={search} setSearch={setSearch} />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Accordion flush >
                            <Accordion.Item >
                                <Accordion.Header>Richieste Di Amicizia</Accordion.Header>
                                <Accordion.Body>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae maiores sed nam pariatur totam earum delectus fuga alias blanditiis ea perferendis natus architecto, quasi nostrum est laboriosam. Explicabo, odit itaque.
                                    <ListGroup as='ul'>
                                        {requests.map(request => <FriendRequest request={request} />)}
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