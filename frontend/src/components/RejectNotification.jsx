import { faHeartCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useState} from "react";

import Toast from 'react-bootstrap/Toast'

export default function RejectNotification({user}){
    const [show, setShow]=useState(true)
    
    return(
        <Toast autohide delay={4000} onClose={()=>setShow(false)} show={show}>
            <Toast.Header>
                <FontAwesomeIcon icon={faHeartCircleXmark} className="pe-2 text-danger"/>{user.username}
            </Toast.Header>
            <Toast.Body>
                <b>{user.username}</b> ha rifiutato la tua richiesta d'amicizia.
            </Toast.Body>
        </Toast>
    )
}