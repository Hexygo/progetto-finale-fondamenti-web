import { faHeartCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useState} from "react";

import Toast from 'react-bootstrap/Toast'

export default function FriendNotification({user}){
    const [show, setShow]=useState(true)
    
    return(
        <Toast autohide delay={4000} onClose={()=>setShow(false)} show={show}>
            <Toast.Header>
                <FontAwesomeIcon icon={faHeartCircleExclamation} className="pe-2"/><b className="me-auto">{user.username}</b>
            </Toast.Header>
            <Toast.Body>
                <b>{user.username}</b> ti ha mandato una richiesta di amicizia!
            </Toast.Body>
        </Toast>
    )
}