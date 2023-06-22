import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas"

export default function FriendRequests({requests}){
    return (//Conterrà il menu con le richieste di amicizia in attesa, e la barra per inviare ricerche di amicizia
        <>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa sed ea beatae, voluptatem vero quam sapiente! Omnis mollitia doloribus illum, nostrum, nemo voluptas eum voluptatibus possimus ipsam, magni molestiae ab!
            </Offcanvas.Body>
        </>
    )
}